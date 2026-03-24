import { motion } from 'motion/react';
import { Github, Terminal as TerminalIcon, Box, Package, TerminalSquare } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { Tooltip } from './Tooltip';

interface InstallationProps {
  t: any;
}

export const Installation = ({ t }: InstallationProps) => {
  const codeTiers = [
    { label: "Base (Lightweight)", cmd: "pip install raegis", desc: "Minimal dependencies" },
    { label: "+ Context Aware", cmd: "pip install raegis[semantic]", desc: "+ Sentence-Transformers" },
    { label: "+ Neural Guard", cmd: "pip install raegis[neural]", desc: "+ TensorFlow/Keras" },
    { label: "Full Suite", cmd: "pip install raegis[full]", desc: "All batteries included" }
  ];

  const apiSnippets = [
    { title: t.apiUsage.sections[0].title, desc: t.apiUsage.sections[0].desc, tooltip: t.apiUsage.sections[0].tooltip, cmd: `from raegis import Auditor\nauditor = Auditor(model="ollama/llama3.2")\nreport = auditor.audit(prompt="...", depth=3)\nprint(report.rupture_point)` },
    { title: t.apiUsage.sections[1].title, desc: t.apiUsage.sections[1].desc, tooltip: t.apiUsage.sections[1].tooltip, cmd: `from raegis import Auditor, RaegisAnchor\nauditor = Auditor("llama3.2")\nanchor = RaegisAnchor(auditor)\nresult = anchor.test(prompt="...", context="...")\nprint(result.drift_temperature)` },
    { title: t.apiUsage.sections[3].title, desc: t.apiUsage.sections[3].desc, tooltip: t.apiUsage.sections[3].tooltip, cmd: `from raegis.core.inspector import WhiteboxInspector\ninsp = WhiteboxInspector(model_name="llama3.2", mode="graybox")\ndf = insp.token_entropy_curve(prompt="...", temperatures=[0.0, 1.5])` }
  ];

  return (
    <section id="installation" className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5 relative selection:bg-cyan-neon/30">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
        
        {/* Left Column: Installation */}
        <div>
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase relative">
              {t.installation.title}
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-cyan-neon rounded-full" />
            </h2>
            <p className="text-xl text-slate-400 mb-12 font-medium leading-[1.6]">{t.installation.subtitle}</p>
          </motion.div>

          <div className="space-y-6">
            {/* Clone Repository */}
            <div className="group relative overflow-hidden bg-slate-900/40 border border-white/10 rounded-2xl p-6 hover:border-cyan-neon/30 transition-all backdrop-blur-md">
              <div className="flex items-center gap-4 mb-4">
                 <Package className="w-5 h-5 text-cyan-neon" />
                 <span className="text-sm font-mono font-bold text-slate-500 uppercase tracking-widest">{t.installation.clone}</span>
              </div>
              <div className="relative group/code flex items-center bg-slate-950/80 p-5 rounded-xl border border-white/5 font-mono text-[13px] text-cyan-neon overflow-x-auto shadow-inner">
                <Github size={16} className="text-slate-700 mr-4 flex-shrink-0" />
                <span className="flex-1 whitespace-nowrap">git clone https://github.com/Rukafuu/Raegis.git</span>
                <CopyButton text="git clone https://github.com/Rukafuu/Raegis.git" />
              </div>
            </div>

            {/* PIP Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {codeTiers.map((tier, i) => (
                <div key={i} className="group relative bg-slate-900/40 border border-white/10 rounded-2xl p-6 hover:border-cyan-neon/30 transition-all backdrop-blur-md overflow-hidden">
                  <div className="text-[11px] font-mono font-bold text-slate-600 uppercase mb-3 tracking-widest flex items-center gap-2 group-hover:text-cyan-neon transition-colors">
                    <Box size={14} />
                    {tier.label}
                  </div>
                  <div className="relative group/code flex items-center bg-slate-950/80 p-4 rounded-xl border border-white/5 font-mono text-[12px] text-slate-300">
                    <div className="flex flex-col gap-1">
                      <span className="text-cyan-neon"># Installation (Python)</span>
                      <span>pip install raegis</span>
                    </div>
                    <div className="flex flex-col gap-1 mt-4">
                      <span className="text-emerald-400"># Installation (JS / Node.js)</span>
                      <span>npm install @tensorflow/tfjs @google/genai</span>
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] text-slate-600 font-mono italic">{tier.desc}</div>
                </div>
              ))}
            </div>

            {/* Quickstart Terminal Card */}
            <div className="group relative overflow-hidden bg-slate-950 border border-cyan-neon/20 rounded-[2rem] p-8 mt-12 shadow-2xl shadow-cyan-neon/10 transition-all hover:scale-[1.01]">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <TerminalSquare className="w-40 h-40 text-cyan-neon" />
              </div>
              <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3 tracking-tighter">
                <div className="w-3 h-3 rounded-full bg-cyan-neon animate-pulse" />
                DASHBOARD_QUICKSTART
              </h3>
              <div className="space-y-6">
                <div className="relative">
                  <div className="text-[10px] font-mono text-slate-600 mb-2 font-bold uppercase tracking-widest px-2"># TERMINAL_01 // MONITOR</div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 font-mono text-cyan-neon hover:bg-slate-900 transition-colors">
                     ollama serve
                     <CopyButton text="ollama serve" />
                  </div>
                </div>
                <div className="relative">
                  <div className="text-[10px] font-mono text-slate-600 mb-2 font-bold uppercase tracking-widest px-2"># TERMINAL_02 // RAEGIS_UI</div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 font-mono text-cyan-neon hover:bg-slate-900 transition-colors">
                     python -m streamlit run app.py
                     <CopyButton text="python -m streamlit run app.py" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: API Usage */}
        <div className="lg:pt-24">
          <motion.h2 
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase relative"
          >
            {t.apiUsage.title}
          </motion.h2>
          
          <div className="space-y-8">
            {apiSnippets.map((section, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-1 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"
              >
                <div className="p-8 bg-slate-900 border border-white/5 rounded-[1.75rem] backdrop-blur-xl relative overflow-hidden h-full">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-20 transition-opacity">
                    <TerminalIcon className="w-20 h-20 text-cyan-neon" />
                  </div>
                  
                  <h4 className="text-xl font-black text-white mb-3 group-hover:text-cyan-neon transition-colors tracking-tight leading-tight">
                    {section.title}
                  </h4>
                  <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed max-w-sm">{section.desc}</p>
                  
                  <Tooltip content={section.tooltip} align="center" position="top">
                    <div className="relative bg-slate-950/90 rounded-2xl overflow-hidden border border-white/5 shadow-2xl group/code cursor-help">
                      <div className="h-8 bg-slate-950 border-b border-white/10 flex items-center px-4 gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-alert/40" />
                          <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                          <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                        </div>
                      </div>
                      <div className="p-6 overflow-x-auto font-mono text-[12px] leading-relaxed text-slate-300">
                        <pre className="selection:bg-cyan-neon/40 selection:text-white">
                          <code className="text-emerald-400">from</code> raegis <code className="text-emerald-400">import</code> Auditor<br/>
                          {section.cmd.split('\n').slice(1).map((line, i) => (
                            <div key={i}>
                              {line.split('=').map((part, pi) => (
                                <span key={pi}>
                                  {part}
                                  {pi === 0 && part.includes('(') ? '' : pi === 0 && <span className="text-cyan-neon">=</span>}
                                </span>
                              ))}
                            </div>
                          ))}
                        </pre>
                        <CopyButton text={section.cmd} />
                      </div>
                    </div>
                  </Tooltip>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Blobs */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-cyan-neon/5 blur-[120px] -translate-y-1/2 -z-10 rounded-full" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-red-alert/5 blur-[120px] -translate-y-1/2 -z-10 rounded-full" />
    </section>
  );
};
