# -*- coding: utf-8 -*-
"""
app.py  --  Raegis Visual Interface (Streamlit)
Run with: streamlit run app.py
"""

import sys
import os

# Force UTF-8 encoding in the Streamlit worker subprocess (Windows fix)
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
os.environ['PYTHONUTF8'] = '1'

import requests
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

@st.cache_data(ttl=10)
def get_ollama_models(url="http://localhost:11434"):
    try:
        resp = requests.get(f"{url}/api/tags", timeout=3)
        if resp.status_code == 200:
            models = [m["name"] for m in resp.json().get("models", [])]
            return sorted(models)
    except:
        pass
    return ["llama3.2:latest"]  # Fallback


# Heavy imports are done lazily (inside run handler) to avoid
# crashing the Streamlit worker during initial render on Windows.
# They are cached in session_state after first load.


# -------------------------------------------------------
# PAGE CONFIG
# -------------------------------------------------------

st.set_page_config(
    page_title="Raegis - LLM Diagnostics",
    page_icon="flask",
    layout="wide",
    initial_sidebar_state="expanded",
)

# O CSS customizado dinâmico foi movido para depois do sidebar


# -------------------------------------------------------
# SESSION STATE
# -------------------------------------------------------

for k, v in {
    "df_results":    None,
    "df_analysis":   None,
    "df_anomalies":  None,
    "live_records":   [],
    "df_inspector":   None,
    "snapshot_path":  None,
    "delta_report":   None,
}.items():
    if k not in st.session_state:
        st.session_state[k] = v


# -------------------------------------------------------
# SIDEBAR
# -------------------------------------------------------

with st.sidebar:
    st.markdown("## Raegis Config")
    st.markdown("---")

    available_models = get_ollama_models()
    # Se o modelo "llama3.2:latest" estiver na lista, seleciona ele por padrão
    default_idx = available_models.index("llama3.2:latest") if "llama3.2:latest" in available_models else 0

    model = st.selectbox(
        "Ollama Model",
        options=available_models,
        index=default_idx,
        help="Models automatically detected in your local Ollama instance.",
    )

    prompt = st.text_area(
        "Stress Prompt",
        value="Explain machine learning in 2 paragraphs, including a practical example.",
        height=140,
    )

    st.markdown("**Temperature Range**")
    temp_min, temp_max = st.slider(
        "Temperatures", min_value=0.0, max_value=2.0,
        value=(0.0, 1.5), step=0.1,
        label_visibility="collapsed",
    )

    samples = st.slider("Samples per temperature", min_value=1, max_value=10, value=3)

    usar_autoencoder = st.toggle("Autoencoder (anomaly detector)", value=True)
    if usar_autoencoder:
        try:
            import tensorflow  # noqa: F401
        except ImportError:
            st.warning("TensorFlow is not installed. Autoencoder will be disabled.")
            usar_autoencoder = False

    temp_treino_max = None
    guardian_epochs = 50
    if usar_autoencoder:
        temp_treino_max = st.slider(
            "Autoencoder Training Threshold",
            min_value=0.0, max_value=1.0, value=0.4, step=0.1,
        )
        guardian_epochs = st.slider(
            "Training Epochs",
            min_value=10, max_value=200, value=60, step=10,
            help="More epochs increase detection sensitivity, but data collection takes longer."
        )

    st.markdown("---")
    temperatures = [
        round(temp_min + i * 0.1, 1)
        for i in range(int(round((temp_max - temp_min) / 0.1)) + 1)
    ]
    total_calls = len(temperatures) * samples
    st.caption(f"{len(temperatures)} temperatures x {samples} samples = {total_calls} calls")
    st.caption(f"Range: {temperatures[0]:.1f} -> {temperatures[-1]:.1f}")

    run_btn = st.button("Run Diagnostics", use_container_width=True)

    st.markdown("---")
    st.markdown("**Visuals & Customization**")
    theme_color = st.color_picker("Accent Color", "#7c3aed")

    # Injeta o CSS customizado dinamicamente
    css = """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=JetBrains+Mono&display=swap');

    html, body, [class*="css"] { font-family: 'Inter', sans-serif; }
    .stApp { background: #0d0f1a; }

    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #12152b 0%, #0d0f1a 100%);
        border-right: 1px solid #1e2240;
    }

    [data-testid="stMetric"] {
        background: #161929;
        border: 1px solid #1e2240;
        border-radius: 12px;
        padding: 16px 20px;
    }
    [data-testid="stMetricValue"] { font-size: 2rem !important; font-weight: 700; color: THEME_COLOR !important; }

    .hero-title {
        font-size: 2.8rem;
        font-weight: 700;
        background: linear-gradient(135deg, THEME_COLOR, #3b82f6, #06b6d4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .hero-sub { color: #6b7280; font-size: 1rem; margin-top: 4px; }

    [data-testid="stTabs"] button { color: #9ca3af !important; }
    [data-testid="stTabs"] button[aria-selected="true"] {
        color: #e5e7eb !important;
        border-bottom: 2px solid THEME_COLOR !important;
    }

    hr { border-color: #1e2240; }

    .stButton > button {
        background: linear-gradient(135deg, THEME_COLOR, #3b82f6) !important;
        color: white !important;
        border: none !important;
        border-radius: 10px !important;
        font-weight: 600 !important;
        padding: 10px 30px !important;
        width: 100% !important;
        font-size: 1rem !important;
    }
    .stButton > button:hover { opacity: 0.85; }

    [data-testid="stProgress"] > div > div {
        background: linear-gradient(90deg, THEME_COLOR, #3b82f6);
    }

    .risk-critical { color: #ff6b6b; font-weight: 600; }
    .risk-high    { color: #ffaa55; font-weight: 600; }
    .risk-moderate{ color: #ffe066; font-weight: 600; }
    .risk-low     { color: #5cde8a; font-weight: 600; }
    </style>
    """
    st.markdown(css.replace("THEME_COLOR", theme_color), unsafe_allow_html=True)


# -------------------------------------------------------
# HEADER
# -------------------------------------------------------

st.markdown('<p class="hero-title">Raegis</p>', unsafe_allow_html=True)
st.markdown(
    '<p class="hero-sub">The stethoscope for your local LLMs &mdash; '
    'behavioral diagnostics, entropy, and hallucination detection</p>',
    unsafe_allow_html=True,
)

with st.expander("📖 Quick Start: How to use Raegis", expanded=False):
    st.markdown("""
    **Raegis** stress-tests your model by executing the same prompt across a temperature ramp (from "absolute zero creativity" to "utter chaos"). It mathematically maps where the LLM starts to lose control.

    **📍 Feature Overview:**
    * **Dashboard (Rupture Curve):** Watch where Confidence (Purple) intersects with Uncertainty (Blue). That's your model's Rupture Threshold on this specific task.
    * **Anomalies (Autoencoder Guardian):** Trains an on-the-fly Neural Network exclusively on low-temp ("sane") responses, then catches statistical anomalies as the heat rises.
    * **RAG Anchor (Tab 3):** Built for RAG systems. Paste a grounding document, and it measures semantic fidelity (Cosine Similarity) over the baseline text.
    * **Snapshots (Before/After Fine-tune):** Save a baseline today. When you train a LoRA tomorrow, compare *Snapshots* to see if the model overfitted and caused *Personality Drift*.
    """)

st.markdown("---")

# -------------------------------------------------------
# COLETA
# -------------------------------------------------------

if run_btn:
    # Apenas importamos a lib oficial agora!
    from raegis import Auditor

    st.session_state["live_records"]   = []
    st.session_state["df_results"]     = None
    st.session_state["df_analysis"]    = None
    st.session_state["df_anomalies"]   = None
    st.session_state["snapshot_path"]  = None
    st.session_state["delta_report"]   = None
    st.session_state["df_anchor"]      = None

    st.markdown("### Collecting samples...")
    progress_bar = st.progress(0.0)
    status_text  = st.empty()
    live_table   = st.empty()

    def on_sample(record, current, total):
        progress_bar.progress(current / total)
        status_text.markdown(
            f"Temperature **{record['temperature']:.1f}** - "
            f"sample {record['sample_id']} | `{current}/{total}`"
        )
        st.session_state["live_records"].append(record)
        live_df = pd.DataFrame(st.session_state["live_records"])
        live_table.dataframe(
            live_df[["temperature", "sample_id", "response"]],
            use_container_width=True,
            height=200,
        )

    try:
        # 1 unica chamada coordena coleta + entropia + anomalia
        auditor = Auditor(model=model)
        report = auditor.audit(
            prompt=prompt,
            depth=samples,
            temp_range=(temp_min, temp_max),
            use_guardian=usar_autoencoder,
            guardian_train_max_temp=temp_treino_max if temp_treino_max else 0.4,
            guardian_epochs=guardian_epochs,
            on_sample=on_sample,
        )

        progress_bar.progress(1.0)
        status_text.success(f"{len(report.df_results)} responses collected!")
        live_table.empty()

        st.session_state["df_results"]   = report.df_results
        st.session_state["df_analysis"]  = report.df_analysis
        st.session_state["df_anomalies"] = report.df_anomalies

    except Exception as e:
        st.error(f"Error during diagnostics: {e}")
        st.info("Ensure Ollama is running: `ollama serve`")


# -------------------------------------------------------
# RESULTS
# -------------------------------------------------------

df_analysis    = st.session_state.get("df_analysis")
df_results     = st.session_state.get("df_results")
df_anomalies   = st.session_state.get("df_anomalies")

if df_analysis is None:
    st.markdown("""
    <div style="text-align:center; padding:80px 0; color:#4b5563;">
        <div style="font-size:3rem; margin-bottom:16px;">[ Raegis ]</div>
        <p style="font-size:1.2rem;">
          Configure your experiment in the sidebar and click <strong>Run Diagnostics</strong>
        </p>
        <p style="color:#374151; font-size:.9rem;">
          Raegis will execute the prompt across the temperature range
          and evaluate your model's behavioral anatomy.
        </p>
    </div>
    """, unsafe_allow_html=True)
    st.stop()


# Top metrics
best  = df_analysis.loc[df_analysis["confidence_score"].idxmax()]
worst = df_analysis.loc[df_analysis["confidence_score"].idxmin()]
sane  = df_analysis[df_analysis["hallucination_risk"].isin(["Low", "Moderate"])]
break_temp    = sane["temperature"].max() if not sane.empty else "N/A"
anomaly_count = int(df_anomalies["is_anomaly"].sum()) if df_anomalies is not None else "N/A"

col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric("Best Temperature",    f"{best['temperature']:.1f}",
              f"Confidence: {best['confidence_score']:.3f}")
with col2:
    st.metric("Worst Temperature",      f"{worst['temperature']:.1f}",
              f"Confidence: {worst['confidence_score']:.3f}")
with col3:
    st.metric("Rupture Point",      str(break_temp),
              "risk increases above this value")
with col4:
    st.metric("Anomalies Detected",  str(anomaly_count),
              f"out of {len(df_results)} responses" if df_results is not None else "")

st.markdown("---")

tab1, tab2, tab_rag, tab_insp, tab_snap, tab_raw = st.tabs([
    "Dashboard", "Anomalies", "RAG Anchor", "Inspector", "Snapshots", "Raw Data"
])

# -- TAB 1: Dashboard --
with tab1:
    col_l, col_r = st.columns(2)

    with col_l:
        st.markdown("##### Confidence Score by Temperature")
        fig_conf = go.Figure()
        fig_conf.add_trace(go.Scatter(
            x=df_analysis["temperature"], y=df_analysis["confidence_score"],
            mode="lines+markers",
            line=dict(color="#7c3aed", width=3),
            marker=dict(size=8, color="#a78bfa"),
            name="Confidence",
        ))
        fig_conf.add_trace(go.Scatter(
            x=df_analysis["temperature"], y=df_analysis["uncertainty_score"],
            mode="lines+markers",
            line=dict(color="#06b6d4", width=2, dash="dot"),
            marker=dict(size=6, color="#67e8f9"),
            name="Uncertainty",
        ))
        fig_conf.add_hrect(
            y0=0, y1=0.6, fillcolor="red", opacity=0.06, line_width=0,
            annotation_text="Risk Zone",
        )
        fig_conf.add_hline(y=0.6, line_dash="dash", line_color="#ef4444", opacity=0.6)
        fig_conf.update_layout(
            plot_bgcolor="#0d0f1a", paper_bgcolor="#0d0f1a",
            font=dict(color="#9ca3af"),
            xaxis=dict(title="Temperature", gridcolor="#1e2240"),
            yaxis=dict(title="Score",       gridcolor="#1e2240"),
            legend=dict(bgcolor="#161929", bordercolor="#1e2240", borderwidth=1),
            height=340,
        )
        st.plotly_chart(fig_conf, use_container_width=True)

    with col_r:
        st.markdown("##### Shannon Entropy (Vocabulary Diversity)")
        max_ent = df_analysis["entropy_bits"].max()
        if max_ent > 0:
            colors = [
                f"rgba({int(255*(1-v/max_ent))}, {int(100 + 155*(v/max_ent))}, 80, 0.85)"
                for v in df_analysis["entropy_bits"]
            ]
        else:
            colors = ["#7c3aed"] * len(df_analysis)

        fig_ent = go.Figure(go.Bar(
            x=df_analysis["temperature"], y=df_analysis["entropy_bits"],
            marker_color=colors,
        ))
        fig_ent.update_layout(
            plot_bgcolor="#0d0f1a", paper_bgcolor="#0d0f1a",
            font=dict(color="#9ca3af"),
            xaxis=dict(title="Temperature", gridcolor="#1e2240"),
            yaxis=dict(title="Entropy (bits)", gridcolor="#1e2240"),
            height=340,
        )
        st.plotly_chart(fig_ent, use_container_width=True)

    st.markdown("##### Diagnostics Table by Temperature")
    st.dataframe(
        df_analysis[[
            "temperature", "consistency_score", "uncertainty_score",
            "entropy_bits", "confidence_score", "hallucination_risk"
        ]].rename(columns={
            "temperature"        : "Temp",
            "consistency_score"  : "Consistency",
            "uncertainty_score"  : "Uncertainty",
            "entropy_bits"       : "Entropy (bits)",
            "confidence_score"   : "Confidence",
            "hallucination_risk" : "Risk",
        }),
        use_container_width=True,
    )


# -- TAB 2: Anomalies --
with tab2:
    if df_anomalies is None:
        st.info("Autoencoder not executed. Enable it in the sidebar and run again.")
    else:
        flagged = df_anomalies[df_anomalies["is_anomaly"]]
        normal  = df_anomalies[~df_anomalies["is_anomaly"]]

        c1, c2 = st.columns(2)
        c1.metric("Anomalous Responses", len(flagged),
                  f"{100*len(flagged)/len(df_anomalies):.1f}%")
        c2.metric("Normal Responses",  len(normal),
                  f"{100*len(normal)/len(df_anomalies):.1f}%")

        st.markdown("---")

        fig_mse = go.Figure()
        fig_mse.add_trace(go.Scatter(
            x=list(range(len(df_anomalies))),
            y=df_anomalies["anomaly_score"],
            mode="markers",
            marker=dict(
                size=9,
                color=df_anomalies["is_anomaly"].map(
                    {True: "#ef4444", False: "#22c55e"}
                ),
                symbol=df_anomalies["is_anomaly"].map(
                    {True: "x", False: "circle"}
                ),
            ),
        ))
        fig_mse.add_hline(
            y=df_anomalies["anomaly_score"].quantile(0.95),
            line_dash="dash", line_color="#f59e0b",
            annotation_text="Threshold (p95)",
        )
        fig_mse.update_layout(
            plot_bgcolor="#0d0f1a", paper_bgcolor="#0d0f1a",
            font=dict(color="#9ca3af"),
            xaxis=dict(title="Response Index", gridcolor="#1e2240"),
            yaxis=dict(title="Reconstruction Error (MSE)", gridcolor="#1e2240"),
            title="Anomaly Map - Red = Hallucination",
            height=360,
        )
        st.plotly_chart(fig_mse, use_container_width=True)

        if not flagged.empty:
            st.markdown("##### Flagged Responses")
            st.dataframe(
                flagged[["temperature", "sample_id", "anomaly_score", "response"]].rename(
                    columns={
                        "temperature"        : "Temp",
                        "sample_id"          : "Sample",
                        "anomaly_score"      : "Score",
                        "response"           : "Response",
                    }
                ),
                use_container_width=True,
            )


# -- TAB 3: RAG Anchor Test --
with tab_rag:
    st.markdown("##### Anchor Test (RAG Validation)")
    st.caption("Measures the model's semantic fidelity to the provided context. If fidelity drops too fast with temperature, the model prioritizes invention over facts.")

    col_rag_1, col_rag_2 = st.columns([3, 1])
    with col_rag_1:
        ctx_input = st.text_area(
            "Ground Truth Document (Context)",
            value="Photosynthesis occurs in the chloroplasts of plant cells.",
            height=100,
        )
    with col_rag_2:
        st.markdown("<br>", unsafe_allow_html=True)
        rag_btn = st.button("Run Anchor Test", key="run_rag")

    if rag_btn:
        from raegis import Auditor, RaegisAnchor
        with st.spinner("Testing model anchoring..."):
            auditor = Auditor(model=model)
            anchor = RaegisAnchor(auditor)
            try:
                res = anchor.test(prompt=prompt, context=ctx_input)
                st.session_state["df_anchor"] = res
            except Exception as e:
                st.error(f"Anchor Test Error: {e}")

    anchor_res = st.session_state.get("df_anchor")
    if anchor_res is not None:
        st.markdown("---")
        m1, m2 = st.columns(2)
        m1.metric("Global Fidelity Score", f"{anchor_res.anchor_score:.3f}")
        drift_txt = str(anchor_res.drift_temperature) if anchor_res.drift_temperature else "None (Anchored!)"
        m2.metric("Unanchoring Point (Temp)", drift_txt)

        st.caption(f"Backend used: `{anchor_res.backend}`")

        df_f = anchor_res.to_dataframe()
        fig_fid = go.Figure(go.Scatter(
            x=df_f["temperature"], y=df_f["fidelity"],
            mode="lines+markers", line=dict(color="#22c55e", width=3),
            marker=dict(size=8), name="RAG Fidelity"
        ))
        fig_fid.add_hline(y=0.7, line_dash="dash", line_color="#ef4444", annotation_text="Hallucination Threshold")
        fig_fid.update_layout(
            plot_bgcolor="#0d0f1a", paper_bgcolor="#0d0f1a", font=dict(color="#9ca3af"),
            xaxis=dict(title="Temperature", gridcolor="#1e2240"),
            yaxis=dict(title="Cosine Similarity with Context", gridcolor="#1e2240"),
            height=320,
        )
        st.plotly_chart(fig_fid, use_container_width=True)


# -- TAB 4: Inspetor (Graybox / Whitebox) --
with tab_insp:
    st.markdown("##### Logit Inspector — True Token-level Entropy")
    st.caption(
        "Unlike blackbox audit(), the Inspector calculates entropy directly "
        "from the model's output logits (no need for multiple samples per temp)."
    )

    col_inp, col_btn = st.columns([4, 1])
    with col_inp:
        insp_prompt = st.text_input(
            "Prompt for inspection",
            value=prompt,
            key="insp_prompt",
        )
    with col_btn:
        st.markdown("<br>", unsafe_allow_html=True)
        insp_btn = st.button("Inspect", key="insp_btn")

    if insp_btn:
        from raegis.core.inspector import WhiteboxInspector
        insp = WhiteboxInspector(
            model_name = model,
            mode       = "graybox",
            ollama_url = "http://localhost:11434",
        )
        with st.spinner("Calculating logit entropy..."):
            try:
                temps_insp = [round(t * 0.1, 1) for t in range(0, 16)]
                df_insp = insp.token_entropy_curve(
                    prompt=insp_prompt,
                    temperatures=temps_insp,
                )
                st.session_state["df_inspector"] = df_insp
            except Exception as e:
                st.error(f"Inspector Error: {e}")

    df_insp = st.session_state.get("df_inspector")
    if df_insp is not None:
        valid = df_insp[df_insp["entropy_bits"].notna()]
        backend_used = valid["backend"].iloc[0] if not valid.empty else "?"

        st.caption(f"Backend: `{backend_used}`")

        if not valid.empty:
            col_il, col_ir = st.columns(2)

            with col_il:
                st.markdown("###### Token-level Entropy by Temperature")
                fig_insp = go.Figure()
                fig_insp.add_trace(go.Scatter(
                    x=valid["temperature"],
                    y=valid["entropy_bits"],
                    mode="lines+markers",
                    line=dict(color="#f59e0b", width=3),
                    marker=dict(size=8, color="#fbbf24"),
                    name="Token Entropy",
                ))
                fig_insp.update_layout(
                    plot_bgcolor="#0d0f1a", paper_bgcolor="#0d0f1a",
                    font=dict(color="#9ca3af"),
                    xaxis=dict(title="Temperature", gridcolor="#1e2240"),
                    yaxis=dict(title="Entropy (bits)", gridcolor="#1e2240"),
                    height=300,
                )
                st.plotly_chart(fig_insp, use_container_width=True)

            with col_ir:
                if "max_prob" in valid.columns and valid["max_prob"].notna().any():
                    st.markdown("###### Top Token Confidence by Temperature")
                    fig_prob = go.Figure(go.Scatter(
                        x=valid["temperature"],
                        y=valid["max_prob"],
                        mode="lines+markers",
                        line=dict(color="#10b981", width=3),
                        marker=dict(size=8, color="#34d399"),
                        name="P(top token)",
                    ))
                    fig_prob.update_layout(
                        plot_bgcolor="#0d0f1a", paper_bgcolor="#0d0f1a",
                        font=dict(color="#9ca3af"),
                        xaxis=dict(title="Temperature", gridcolor="#1e2240"),
                        yaxis=dict(title="Probability", gridcolor="#1e2240"),
                        height=300,
                    )
                    st.plotly_chart(fig_prob, use_container_width=True)
                else:
                    st.info(
                        "Probabilities not returned by the API.\n"
                        "Upgrade Ollama to enable full logprobs."
                    )

        st.dataframe(valid, use_container_width=True, height=250)


# -- TAB 5: Snapshots (Before/After) --
with tab_snap:
    st.markdown("##### Snapshots — Fine-tuning Before/After Comparator")
    st.caption(
        "Save the current state as a baseline. After fine-tuning, "
        "run it again and compare to measure Personality Drift."
    )

    col_s1, col_s2 = st.columns(2)

    with col_s1:
        st.markdown("**Save current snapshot**")
        snap_name = st.text_input("Snapshot name", value="baseline", key="snap_name")
        if st.button("Save Snapshot", key="save_snap"):
            if df_analysis is not None:
                from raegis.report import RaegisReport
                report = RaegisReport(
                    model         = model,
                    prompt        = prompt,
                    df_results    = df_results,
                    df_analysis   = df_analysis,
                    df_anomalies  = df_anomalies,
                )
                os.makedirs("experiments/snapshots", exist_ok=True)
                path = f"experiments/snapshots/{snap_name}.json"
                report.save(path)
                st.session_state["snapshot_path"] = path
                st.success(f"Snapshot saved: `{path}`")
            else:
                st.warning("Run a diagnostic first.")

    with col_s2:
        st.markdown("**Compare with previous snapshot**")
        snap_files = []
        snap_dir = "experiments/snapshots"
        if os.path.isdir(snap_dir):
            snap_files = [f for f in os.listdir(snap_dir) if f.endswith(".json")]

        if snap_files:
            selected_snap = st.selectbox("Saved Baseline", snap_files, key="snap_select")
            if st.button("Compare", key="compare_btn"):
                if df_analysis is not None:
                    from raegis.report     import RaegisReport
                    from raegis.comparator import Comparator
                    baseline_path = os.path.join(snap_dir, selected_snap)
                    after_report  = RaegisReport(
                        model         = model,
                        prompt        = prompt,
                        df_results    = df_results,
                        df_analysis   = df_analysis,
                        df_anomalies  = df_anomalies,
                    )
                    try:
                        delta = Comparator.compare(baseline_path, after_report)
                        st.session_state["delta_report"] = delta
                    except Exception as e:
                        st.error(f"Error comparing: {e}")
                else:
                    st.warning("Run a diagnostic first.")
        else:
            st.info("No snapshots saved yet. Save a baseline first.")

    delta = st.session_state.get("delta_report")
    if delta is not None:
        st.markdown("---")
        verdict_color = {
            "Melhorou":      "#22c55e",
            "Improved":      "#22c55e",
            "Neutro":        "#94a3b8",
            "Neutral":       "#94a3b8",
            "Overfitou":     "#f59e0b",
            "Overfitted":    "#f59e0b",
            "Destabilizou":  "#ef4444",
            "Destabilized":  "#ef4444",
        }.get(delta.verdict, "#9ca3af")

        st.markdown(
            f"<h3 style='color:{verdict_color}'>Verdict: {delta.verdict}</h3>",
            unsafe_allow_html=True,
        )

        mc1, mc2 = st.columns(2)
        mc1.metric("Personality Drift", f"{delta.personality_drift:.4f}",
                   "0=identical, 1=completely different")
        if delta.rupture_delta is not None:
            mc2.metric("Rupture Point Delta",
                       f"{delta.rupture_delta:+.1f}",
                       "positive = improved")

        if not delta.df_delta.empty:
            st.markdown("###### Delta by Temperature")
            fig_delta = go.Figure()
            fig_delta.add_trace(go.Bar(
                x=delta.df_delta["temperature"],
                y=delta.df_delta["delta_consistency"],
                name="Δ Consistency",
                marker_color="#7c3aed",
            ))
            fig_delta.add_trace(go.Bar(
                x=delta.df_delta["temperature"],
                y=delta.df_delta["delta_confidence"],
                name="Δ Confidence",
                marker_color="#06b6d4",
            ))
            fig_delta.add_hline(y=0, line_color="#374151")
            fig_delta.update_layout(
                plot_bgcolor="#0d0f1a", paper_bgcolor="#0d0f1a",
                font=dict(color="#9ca3af"),
                barmode="group",
                xaxis=dict(title="Temperature", gridcolor="#1e2240"),
                yaxis=dict(title="Delta",       gridcolor="#1e2240"),
                height=320,
            )
            st.plotly_chart(fig_delta, use_container_width=True)


# -- TAB 6: Raw Data --
with tab_raw:
    st.markdown("##### Collected Data")
    st.dataframe(df_results, use_container_width=True, height=400)
    csv = df_results.to_csv(index=False).encode("utf-8")
    st.download_button(
        label="Export CSV",
        data=csv,
        file_name="raegis_results.csv",
        mime="text/csv",
    )
