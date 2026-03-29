import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Globe, 
  Github, 
  Linkedin,
  Activity,
  Cpu
} from 'lucide-react';

// Components
import { Tooltip } from './components/Tooltip';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { CoreFeatures } from './components/CoreFeatures';
import { Installation } from './components/Installation';
import { ContactForm } from './components/ContactForm';

// Data
import { translations, Language } from './i18n';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  // Auto-set language based on navigator
  useEffect(() => {
    const userLang = navigator.language.split('-')[0] as Language;
    if (translations[userLang]) {
      setLang(userLang);
    }
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-cyan-neon/30 bg-slate-950 overflow-x-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 cyber-grid opacity-[0.03]" />
        <div className="absolute inset-0 bg-radial-at-t from-cyan-neon/5 via-transparent to-transparent" />
        {/* Floating Orb */}
        <motion.div 
          animate={{ 
            x: [0, 100, -100, 0], 
            y: [0, -50, 50, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-neon/10 blur-[150px] rounded-full"
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur-2xl">
        <nav className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="transition-all group-hover:rotate-12 duration-500">
              <img src="/logo.png" className="w-10 h-10 object-contain" alt="Raegis Logo" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black tracking-tighter text-white leading-none">RAEGIS</span>
              <span className="text-[9px] font-mono font-black text-cyan-neon/40 tracking-[0.3em] uppercase">Audit_Protocol</span>
            </div>
          </motion.div>

          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              <a href="#how-it-works" className="text-xs font-black text-slate-500 hover:text-cyan-neon transition-all uppercase tracking-widest hover:scale-110 active:scale-95">
                {t.nav.howItWorks}
              </a>
              <a href="#demo" className="text-xs font-black text-slate-500 hover:text-cyan-neon transition-all uppercase tracking-widest hover:scale-110 active:scale-95">
                {t.nav.demo}
              </a>
              <a href="#contact" className="text-xs font-black text-slate-500 hover:text-cyan-neon transition-all uppercase tracking-widest hover:scale-110 active:scale-95">
                {t.nav.contact}
              </a>
            </div>
            
            <div className="h-6 w-px bg-white/10" />

            {/* Language Switcher */}
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
              <Globe className="w-4 h-4 text-slate-400" />
              {(['en', 'pt', 'es', 'ja'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-[10px] font-black uppercase transition-all px-1.5 py-0.5 rounded-md ${lang === l ? 'text-cyan-neon bg-cyan-neon/10 shadow-[0_0_10px_rgba(0,243,255,0.2)]' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-white/10 mx-2" />
            <a href="https://linkedin.com/in/rukafuu" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-cyan-neon transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="https://github.com/Rukafuu/Raegis" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-white transition-colors">
              <Github size={20} />
            </a>
          </div>
        </nav>
      </header>

      <main className="relative pt-44 z-10">
        
        <Hero t={t} />

        {/* Why Raegis Curve Section */}
        <section className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight uppercase">
                {t.whyRaegis.title}
              </h2>
              <p className="text-xl text-slate-400 mb-12 font-medium leading-[1.6]">
                {t.whyRaegis.subtitle}
              </p>
              <div className="space-y-8">
                {t.whyRaegis.items.map((item: any, idx: number) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-6 group"
                  >
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-6 h-6 rounded-full border-2 border-cyan-neon/30 flex items-center justify-center group-hover:border-cyan-neon transition-colors duration-500">
                        <div className="w-2 h-2 rounded-full bg-cyan-neon shadow-[0_0_10px_rgba(0,243,255,0.8)]" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white mb-2 tracking-tight group-hover:text-cyan-neon transition-colors">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-10 bg-cyan-neon/5 blur-[100px] rounded-full pointer-events-none" />
              <div className="relative glass-morphism p-10 rounded-[3rem] shadow-2xl overflow-hidden group">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-cyan-neon font-black uppercase tracking-[0.4em]">Reliability_Curve_v2</span>
                    <span className="text-[9px] font-mono text-slate-600 uppercase">Analysis // {new Date().toLocaleDateString()}</span>
                  </div>
                  <Activity className="w-5 h-5 text-cyan-neon animate-pulse" />
                </div>
                
                <div className="h-72 flex items-end gap-3 px-2">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${Math.max(15, 100 - i * 4 + Math.random() * 25)}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04, duration: 1, ease: "easeOut" }}
                      className={`flex-1 rounded-t-lg shadow-lg relative group/bar ${i > 15 ? 'bg-red-alert/50' : 'bg-cyan-neon/50'}`}
                    >
                      <div className={`absolute -top-1 px-1 rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity -translate-y-full text-[8px] font-mono font-bold ${i > 15 ? 'text-red-alert' : 'text-cyan-neon'}`}>
                        {Math.floor(Math.random() * 100)}%
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex justify-between mt-8 text-[10px] font-mono text-slate-600 uppercase tracking-widest border-t border-white/5 pt-6">
                  <span className="flex flex-col items-start">
                     <span className="text-white">Deterministic</span>
                     <span>Temp 0.0</span>
                  </span>
                  <span className="text-red-alert font-black flex flex-col items-center">
                     <span className="animate-pulse">● Rupture Point</span>
                     <span>Alpha = 0.84</span>
                  </span>
                  <span className="flex flex-col items-end">
                     <span className="text-white">Stochastic</span>
                     <span>Temp 1.5</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <HowItWorks t={t} />
        
        <CoreFeatures t={t} />

        {/* Technical Specs Banner */}
        <section className="border-y border-white/5 bg-slate-900/40 backdrop-blur-md overflow-hidden py-16">
          <div className="flex whitespace-nowrap gap-16 animate-marquee cursor-default">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-16 text-xs font-mono font-black text-slate-700 uppercase tracking-[0.6em]">
                <span className="text-white">Python 3.10+</span>
                <span className="text-cyan-neon/30">•</span>
                <span className="text-white">Keras 3.0</span>
                <span className="text-cyan-neon/30">•</span>
                <span className="text-white">Scikit-Learn</span>
                <span className="text-cyan-neon/30">•</span>
                <span className="text-white">Pandas</span>
                <span className="text-cyan-neon/30">•</span>
                <span className="text-white">Ollama API</span>
                <span className="text-cyan-neon/30">•</span>
                <span className="text-white">Privacy First</span>
                <span className="text-cyan-neon/30">•</span>
              </div>
            ))}
          </div>
        </section>

        <Installation t={t} />

        {/* Architecture Large Card */}
        <section className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="group relative bg-slate-900 border border-white/10 rounded-[3rem] p-12 md:p-20 overflow-hidden shadow-2xl"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-1000 rotate-12">
              <Cpu className="w-80 h-80 text-cyan-neon" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-12 tracking-tight uppercase">
                {t.architecture.title.split(' ').map((w: string, i: number) => (
                   <span key={i} className={i === 2 ? 'text-cyan-neon' : ''}>{w} </span>
                ))}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {t.architecture.items.map((item: string, idx: number) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-6 group/item"
                  >
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover/item:border-cyan-neon/40 transition-all duration-500">
                       <span className="font-mono text-cyan-neon/50 text-sm group-hover/item:text-cyan-neon">{idx + 1}</span>
                    </div>
                    <div className="flex flex-col gap-1 pt-1">
                       <span className="text-lg font-bold text-slate-300 group-hover/item:text-white transition-colors">{item.split('.py')[0]}.py</span>
                       <span className="text-sm font-medium text-slate-500">{item.split('.py')[1]}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <div id="contact">
          <ContactForm t={t} />
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 mt-20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" className="w-10 h-10 object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" alt="Raegis Logo" />
              <span className="text-2xl font-black text-white tracking-tighter">RAEGIS</span>
            </div>
            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
              🔬 Advanced Diagnostics: Open source medical-grade diagnostics for local language models. Secure, private, and deterministic.
            </p>
            <div className="flex gap-4">
              <Tooltip content="GitHub" position="top">
                <a 
                  href="https://github.com/Rukafuu/Raegis" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:bg-cyan-neon/10 hover:text-cyan-neon hover:border-cyan-neon/30 transition-all"
                >
                  <Github className="w-5 h-5" />
                </a>
              </Tooltip>
              <Tooltip content="LinkedIn" position="top">
                <a 
                  href="https://linkedin.com/in/rukafuu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:bg-cyan-neon/10 hover:text-cyan-neon hover:border-cyan-neon/30 transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </Tooltip>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-16 md:gap-32">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest underline decoration-cyan-neon/40 underline-offset-8">Resources</span>
              <a href="https://github.com/Rukafuu/Raegis" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">GitHub</a>
              <a href="https://github.com/Rukafuu/Raegis/issues" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Issues</a>
              <a href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Release Notes</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest underline decoration-cyan-neon/40 underline-offset-8">Legals</span>
              <a href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Apache 2.0</a>
              <a href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
          
          <div className="md:text-right flex flex-col items-end">
            <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-2">
              {t.footer.builtBy}
            </div>
            <div className="text-[10px] font-mono text-cyan-neon/40 uppercase tracking-[0.3em]">
              All rights reserved // {new Date().getFullYear()}
            </div>
          </div>
        </div>



        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex justify-center">
           <div className="text-[9px] font-mono text-slate-700 uppercase tracking-[0.5em] animate-pulse">
              System Status: Nominal // Raegis Protocol Active
           </div>
        </div>
      </footer>
    </div>
  );
}
