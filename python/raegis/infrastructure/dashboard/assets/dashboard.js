/**
 * Raegis Drift Dashboard Logic
 * Fetches metrics and renders high-end Plotly charts with SHAP explanations.
 */

let globalData = [];

async function initDashboard() {
    try {
        const resp = await fetch('/metrics');
        globalData = await resp.json();
        
        renderTimeline(globalData);
        renderAlerts(globalData);
        renderHeatmap(globalData);
        updateStats(globalData);
        
        // Render SHAP for the last week by default
        renderSHAP(globalData.length - 1);
        
    } catch (e) {
        console.error("Failed to load metrics. Is the API running?", e);
    }
}

function updateStats(data) {
    const lastWeek = data[data.length - 1];
    document.getElementById('curr-f1').innerText = lastWeek.f1_score.toFixed(3);
    document.getElementById('curr-drift').innerText = (lastWeek.drift_share * 100).toFixed(0) + "%";
    document.getElementById('curr-alerts').innerText = data.filter(d => d.is_alert).length;
}

function renderTimeline(data) {
    const trace1 = {
        x: data.map(d => `Week ${d.week}`),
        y: data.map(d => d.f1_score),
        name: 'F1 Score',
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#00f2ff', width: 4 },
        marker: { size: 10, color: '#fff' }
    };

    const trace2 = {
        x: data.map(d => `Week ${d.week}`),
        y: data.map(d => d.drift_share),
        name: 'Drift Share',
        type: 'bar',
        opacity: 0.3,
        marker: { color: '#ff3e3e' }
    };

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#e0e0e0', family: 'Inter' },
        margin: { t: 20, r: 20, l: 40, b: 40 },
        height: 350,
        legend: { orientation: 'h', x: 0, y: 1.1 },
        xaxis: { gridcolor: 'rgba(255,255,255,0.05)' },
        yaxis: { gridcolor: 'rgba(255,255,255,0.05)', range: [0, 1.1] }
    };

    const config = { displayModeBar: false };
    const chart = Plotly.newPlot('timeline-chart', [trace1, trace2], layout, config);
    
    // Add click event to update SHAP
    document.getElementById('timeline-chart').on('plotly_click', function(data){
        const weekIdx = data.points[0].pointIndex;
        renderSHAP(weekIdx);
    });
}

function renderSHAP(weekIdx) {
    const weekData = globalData[weekIdx];
    const features = Object.keys(weekData.importance);
    const baselineValues = features.map(f => weekData.baseline_importance[f]);
    const currentValues = features.map(f => weekData.importance[f]);

    const traceBase = {
        y: features,
        x: baselineValues,
        name: 'Baseline (Training)',
        type: 'bar',
        orientation: 'h',
        marker: { color: 'rgba(0, 242, 255, 0.4)' }
    };

    const traceCurr = {
        y: features,
        x: currentValues,
        name: `Current (Week ${weekData.week})`,
        type: 'bar',
        orientation: 'h',
        marker: { color: '#00f2ff' }
    };

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#e0e0e0', family: 'Inter' },
        margin: { t: 10, r: 20, l: 60, b: 40 },
        barmode: 'group',
        legend: { orientation: 'h', x: 0, y: 1.1 },
        xaxis: { gridcolor: 'rgba(255,255,255,0.05)', title: 'Mean Abs SHAP (Influence)' },
        yaxis: { gridcolor: 'transparent' }
    };

    Plotly.newPlot('shap-chart', [traceBase, traceCurr], layout, { displayModeBar: false });
    document.getElementById('shap-info').innerText = `Comparing internal feature attribution between Baseline and Week ${weekData.week}.`;
}

function renderAlerts(data) {
    const list = document.getElementById('alert-list');
    const alerts = data.filter(d => d.is_alert);
    
    list.innerHTML = alerts.map(d => `
        <div class="alert-item animate-fade">
            <div class="alert-badge" style="background: ${d.week >= 8 ? '#ff3e3e' : '#ffa500'}"></div>
            <div class="alert-content">
                <h4>WEEK ${d.week} - ${d.week >= 8 ? 'CRITICAL' : 'WARNING'}</h4>
                <p>Status: ${d.f1_score < 0.7 ? 'Accuracy Drop' : 'Data Drift'}</p>
            </div>
        </div>
    `).join('');
}

function renderHeatmap(data) {
    const allFeatures = Array.from(new Set(data.flatMap(d => d.drifted_features)));
    const zData = allFeatures.map(feat => {
        return data.map(d => d.drifted_features.includes(feat) ? 1 : 0);
    });

    const heatmap = [{
        z: zData,
        x: data.map(d => `W${d.week}`),
        y: allFeatures,
        type: 'heatmap',
        colorscale: [
            [0, '#1a1d26'],
            [1, '#ff3e3e']
        ],
        showscale: false
    }];

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#e0e0e0', family: 'Inter' },
        margin: { t: 10, r: 10, l: 80, b: 40 },
        height: 350,
        xaxis: { side: 'bottom', gridcolor: 'transparent' },
        yaxis: { gridcolor: 'transparent' }
    };

    Plotly.newPlot('drift-heatmap', heatmap, layout, { displayModeBar: false });
}

document.addEventListener('DOMContentLoaded', initDashboard);
