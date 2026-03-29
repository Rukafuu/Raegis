import { motion } from 'motion/react';
import { Activity, Cpu, Database, CheckCircle2 } from 'lucide-react';

interface HowItWorksProps {
  t: any;
}

export const HowItWorks = ({ t }: HowItWorksProps) => {
  const icons = [Activity, Cpu, Database, CheckCircle2];

  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5 relative selection:bg-cyan-neon/20">
      {/* Dynamic Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-[0.05] pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 relative z-10">
        <div className="text-left max-w-2xl">
          <motion.h4 
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono font-black text-cyan-neon tracking-[0.4em] uppercase mb-6"
          >
            // System_Architecture
          </motion.h4>
          <motion.h3 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1]"
          >
            {t.howItWorks.title}
          </motion.h3>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-slate-500 text-sm font-mono max-w-xs leading-relaxed border-l-2 border-cyan-neon/30 pl-4"
        >
          {t.howItWorks.subtitle}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {t.howItWorks.steps.map((step: any, idx: number) => {
          const Icon = icons[idx];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
              className="group relative p-10 bg-slate-900/40 border border-white/10 rounded-[2.5rem] hover:border-cyan-neon/50 transition-all hover:bg-slate-900/80 backdrop-blur-sm overflow-hidden"
            >
              {/* Card Accent */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-neon/5 blur-3xl group-hover:bg-cyan-neon/10 transition-colors" />
              
              <div className="flex justify-between items-start mb-12">
                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-cyan-neon/20 group-hover:scale-110 transition-all duration-500">
                  <Icon className="w-8 h-8 text-cyan-neon neon-text-glow" />
                </div>
                <span className="text-sm font-mono font-black text-slate-700 group-hover:text-cyan-neon/40 transition-colors tracking-widest">
                  0{idx + 1}_LOG
                </span>
              </div>
              
              <div className="inline-block px-3 py-1 rounded-full bg-slate-950/80 border border-white/10 text-[10px] font-mono font-black text-slate-500 mb-6 tracking-[0.2em] uppercase group-hover:text-cyan-neon group-hover:border-cyan-neon/30 transition-all">
                {step.badge}
              </div>
              
              <h4 className="text-2xl font-black text-white mb-4 group-hover:text-cyan-neon transition-colors tracking-tighter">
                {step.title}
              </h4>
              
              <p className="text-base text-slate-400 leading-relaxed font-medium">
                {step.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
