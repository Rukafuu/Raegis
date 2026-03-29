import { motion } from 'motion/react';
import { Github, Terminal } from 'lucide-react';
import { TerminalSimulation } from './TerminalSimulation';
import { Tooltip } from './Tooltip';

interface HeroProps {
  t: any;
  activeCore: 'python' | 'js';
}

export const Hero = ({ t, activeCore }: HeroProps) => {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8 backdrop-blur-md animate-float ${activeCore === 'python' ? 'bg-cyan-neon/10 border-cyan-neon/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
          <span className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-lg ${activeCore === 'python' ? 'bg-cyan-neon shadow-cyan-neon/50' : 'bg-emerald-500 shadow-emerald-500/50'}`} />
          <span className={`text-[11px] font-mono font-black tracking-[0.2em] uppercase ${activeCore === 'python' ? 'text-cyan-neon' : 'text-emerald-500'}`}>
            {activeCore === 'python' ? 'v1.1.2 // python_core_active' : 'v1.1.0 // js_ts_native_active'}
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[1.05] selection:bg-cyan-neon selection:text-slate-950">
          {t.hero.title.split(':').map((part: string, i: number) => (
            <span key={i} className={i === 1 ? (activeCore === 'python' ? "text-cyan-neon block md:inline neon-text-glow" : "text-emerald-500 block md:inline emerald-text-glow") : ""}>
              {part}{i === 0 ? ':' : ''} 
            </span>
          ))}
        </h1>
        
        <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-400 mb-16 font-medium leading-relaxed">
          {t.hero.subtitle}
        </p>

        <TerminalSimulation />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-20">
          <Tooltip content="https://github.com/Rukafuu/Raegis" position="top">
            <motion.a 
              href="https://github.com/Rukafuu/Raegis"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: activeCore === 'python' ? "0 0 30px rgba(0,243,255,0.3)" : "0 0 30px rgba(16,185,129,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className={`w-full sm:w-auto px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-colors text-lg text-slate-950 ${activeCore === 'python' ? 'bg-cyan-neon' : 'bg-emerald-500'}`}
            >
              <Github className="w-6 h-6" />
              <span className="uppercase tracking-tighter">{t.hero.ctaRepo}</span>
            </motion.a>
          </Tooltip>
          
          <motion.a 
            href="#installation"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black flex items-center justify-center gap-3 transition-all text-lg backdrop-blur-sm"
          >
            <Terminal className="w-6 h-6 text-slate-400" />
            <span className="uppercase tracking-tighter">{t.hero.ctaDocs}</span>
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
};
