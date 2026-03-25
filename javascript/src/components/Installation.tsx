import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Terminal as TerminalIcon, Box, Package, TerminalSquare, Code2, Cpu } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { Tooltip } from './Tooltip';

interface InstallationProps {
  t: any;
  activeCore: 'python' | 'js';
  setActiveCore: (core: 'python' | 'js') => void;
}

export const Installation = ({ t, activeCore, setActiveCore }: InstallationProps) => {
  const activeTab = activeCore;

  const pythonTiers = [
    { label: "Base (Lightweight)", cmd: "pip install raegis", desc: "Minimal dependencies" },
    { label: "+ Context Aware", cmd: "pip install raegis[semantic]", desc: "+ Sentence-Transformers" },
    { label: "+ Neural Guard", cmd: "pip install raegis[neural]", desc: "+ TensorFlow/Keras" },
    { label: "Full Suite", cmd: "pip install raegis[full]", desc: "All batteries included" }
  ];

  const jsTiers = [
    { label: "Native JS Core", cmd: "npm install @tensorflow/tfjs @google/genai", desc: "No Python required" },
    { label: "Server Node.js", cmd: "git checkout main && npm install", desc: "Full dual-core setup" }
  ];

  const pythonSnippets = [
    { title: t.apiUsage.sections[0].title, desc: t.apiUsage.sections[0].desc, tooltip: t.apiUsage.sections[0].tooltip, cmd: `from raegis import Auditor\nauditor = Auditor(model="ollama/llama3.2")\nreport = auditor.audit(prompt="...", depth=3)\nprint(report.rupture_point)`, lang: 'python' },
    { title: t.apiUsage.sections[1].title, desc: t.apiUsage.sections[1].desc, tooltip: t.apiUsage.sections[1].tooltip, cmd: `from raegis import Auditor, RaegisAnchor\nauditor = Auditor("llama3.2")\nanchor = RaegisAnchor(auditor)\nresult = anchor.test(prompt="...", context="...")\nprint(result.drift_temperature)`, lang: 'python' },
    { title: t.apiUsage.sections[3].title, desc: t.apiUsage.sections[3].desc, tooltip: t.apiUsage.sections[3].tooltip, cmd: `from raegis.core.inspector import WhiteboxInspector\ninsp = WhiteboxInspector(model_name="llama3.2", mode="graybox")\ndf = insp.token_entropy_curve(prompt="...", temperatures=[0.0, 1.5])`, lang: 'python' }
  ];

  const jsSnippets = [
    { title: t.jsUsage.sections[0].title, desc: t.jsUsage.sections[0].desc, tooltip: t.jsUsage.sections[0].tooltip, cmd: `import { Raegis } from './src/raegis/Raegis';\nconst raegis = new Raegis(API_KEY);\nconst audit = await raegis.fullAudit({\n  model: "gemini-1.5-flash",\n  prompt: "Audit me!",\n  temperatures: [0.0, 0.7, 1.5]\n});`, lang: 'typescript' },
    { title: t.jsUsage.sections[1].title, desc: t.jsUsage.sections[1].desc, tooltip: t.jsUsage.sections[1].tooltip, cmd: `import { Auditor } from './src/raegis/Auditor';\nconst auditor = new Auditor(MODEL_NAME);\nconst result = await auditor.neuralCheck(input_tensor);`, lang: 'typescript' },
    { title: t.jsUsage.sections[2].title, desc: t.jsUsage.sections[2].desc, tooltip: t.jsUsage.sections[2].tooltip, cmd: `// Run standalone Raegis REST Server\nnpx tsx src/raegis/RaegisServer.ts\n\n// API usage:\n// POST /audit { prompt: "..." }`, lang: 'bash' }
  ];

  const activeTiers = activeTab === 'python' ? pythonTiers : jsTiers;
  const activeSnippets = activeTab === 'python' ? pythonSnippets : jsSnippets;

  return (
    <section id="installation" className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5 relative selection:bg-cyan-neon/30">
      
      {/* Tab Switcher */}
      <div className="flex justify-center mb-24">
        <div className="p-1.5 bg-slate-900/80 border border-white/10 rounded-2xl backdrop-blur-xl flex gap-1 relative z-20">
          <button
            onClick={() => setActiveCore('python')}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-black transition-all ${activeTab === 'python' ? 'bg-cyan-neon text-slate-950 shadow-[0_0_30px_rgba(0,243,255,0.4)]' : 'text-slate-500 hover:text-white'}`}
          >
            <Github size={18} />
            PYTHON_CORE
          </button>
          <button
            onClick={() => setActiveCore('js')}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-black transition-all ${activeTab === 'js' ? 'bg-emerald-500 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'text-slate-500 hover:text-white'}`}
          >
            <Code2 size={18} />
            NATIVE_JS / TS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
        
        {/* Left Column: Installation */}
        <div>
          <motion.div
            key={activeTab + "title"}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase relative">
              {activeTab === 'python' ? t.installation.title : t.jsUsage.title}
              <div className={`absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-full ${activeTab === 'python' ? 'bg-cyan-neon' : 'bg-emerald-500'}`} />
            </h2>
            <p className="text-xl text-slate-400 mb-12 font-medium leading-[1.6]">
              {activeTab === 'python' ? t.installation.subtitle : t.jsUsage.sections[0].desc}
            </p>
          </motion.div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Main Action Card */}
                <div className={`group relative overflow-hidden bg-slate-900/40 border border-white/10 rounded-2xl p-6 transition-all backdrop-blur-md ${activeTab === 'python' ? 'hover:border-cyan-neon/30' : 'hover:border-emerald-500/30'}`}>
                  <div className="flex items-center gap-4 mb-4">
                     {activeTab === 'python' ? <Package className="w-5 h-5 text-cyan-neon" /> : <Code2 className="w-5 h-5 text-emerald-500" />}
                     <span className="text-sm font-mono font-bold text-slate-500 uppercase tracking-widest">{activeTab === 'python' ? t.installation.clone : "Get Packages"}</span>
                  </div>
                  <div className={`relative group/code flex items-center bg-slate-950/80 p-5 rounded-xl border border-white/5 font-mono text-[13px] overflow-x-auto shadow-inner ${activeTab === 'python' ? 'text-cyan-neon' : 'text-emerald-400'}`}>
                    {activeTab === 'python' ? <Github size={16} className="text-slate-700 mr-4 flex-shrink-0" /> : <TerminalIcon size={16} className="text-slate-700 mr-4 flex-shrink-0" />}
                    <span className="flex-1 whitespace-nowrap">{activeTab === 'python' ? "git clone https://github.com/Rukafuu/Raegis.git" : "npm install @tensorflow/tfjs @google/genai"}</span>
                    <CopyButton text={activeTab === 'python' ? "git clone https://github.com/Rukafuu/Raegis.git" : "npm install @tensorflow/tfjs @google/genai"} />
                  </div>
                </div>

                {/* Tiers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeTiers.map((tier, i) => (
                    <div key={i} className={`group relative bg-slate-900/40 border border-white/10 rounded-2xl p-6 transition-all backdrop-blur-md overflow-hidden ${activeTab === 'python' ? 'hover:border-cyan-neon/30' : 'hover:border-emerald-500/30'}`}>
                      <div className={`text-[11px] font-mono font-bold text-slate-600 uppercase mb-3 tracking-widest flex items-center gap-2 transition-colors ${activeTab === 'python' ? 'group-hover:text-cyan-neon' : 'group-hover:text-emerald-500'}`}>
                        <Box size={14} />
                        {tier.label}
                      </div>
                      <div className="relative group/code flex items-center bg-slate-950/80 p-4 rounded-xl border border-white/5 font-mono text-[12px] text-slate-300">
                        <span>{tier.cmd}</span>
                        <CopyButton text={tier.cmd} />
                      </div>
                      <div className="mt-3 text-[10px] text-slate-600 font-mono italic">{tier.desc}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Quickstart Terminal Card - Only for Python/Full */}
            {activeTab === 'python' && (
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
            )}
            
            {/* Server Quickstart for JS */}
            {activeTab === 'js' && (
              <div className="group relative overflow-hidden bg-slate-950 border border-emerald-500/20 rounded-[2rem] p-8 mt-12 shadow-2xl shadow-emerald-500/10 transition-all hover:scale-[1.01]">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Cpu className="w-40 h-40 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3 tracking-tighter">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  JS_AUDIT_SERVER
                </h3>
                <div className="space-y-6">
                  <div className="relative">
                    <div className="text-[10px] font-mono text-slate-600 mb-2 font-bold uppercase tracking-widest px-2"># TERMINAL_01 // RUN_SERVER</div>
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 font-mono text-emerald-400 hover:bg-slate-900 transition-colors">
                       npx tsx src/raegis/RaegisServer.ts
                       <CopyButton text="npx tsx src/raegis/RaegisServer.ts" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: API Usage */}
        <div className="lg:pt-24">
          <motion.h2 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            key={activeTab + "api"}
            className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase relative"
          >
            {activeTab === 'python' ? t.apiUsage.title : t.jsUsage.title}
          </motion.h2>
          
          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {activeSnippets.map((section: any, idx) => (
                <motion.div 
                  key={section.title + activeTab}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group p-1 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"
                >
                  <div className="p-8 bg-slate-900 border border-white/5 rounded-[1.75rem] backdrop-blur-xl relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-20 transition-opacity">
                      {activeTab === 'python' ? <TerminalIcon className="w-20 h-20 text-cyan-neon" /> : <Code2 className="w-20 h-20 text-emerald-500" />}
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
                          <span className="text-[9px] font-mono text-slate-600 uppercase ml-2">{section.lang}</span>
                        </div>
                        <div className="p-6 overflow-x-auto font-mono text-[12px] leading-relaxed text-slate-300">
                          <pre className="selection:bg-cyan-neon/40 selection:text-white">
                            {section.cmd.split('\n').map((line: string, i: number) => (
                              <div key={i}>
                                {line.split(/([=\s.:({})])/).map((part, pi) => {
                                  if (['from', 'import', 'const', 'let', 'await', 'return', 'class', 'new'].includes(part)) return <span key={pi} className="text-emerald-400">{part}</span>;
                                  if (part === '=' || part === ':' || part === '.') return <span key={pi} className={activeTab === 'python' ? 'text-cyan-neon' : 'text-emerald-400'}>{part}</span>;
                                  if (part.startsWith('"') || part.startsWith("'")) return <span key={pi} className="text-amber-200">{part}</span>;
                                  return <span key={pi}>{part}</span>;
                                })}
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
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Background Blobs */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-cyan-neon/5 blur-[120px] -translate-y-1/2 -z-10 rounded-full" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-red-alert/5 blur-[120px] -translate-y-1/2 -z-10 rounded-full" />
    </section>
  );
};
