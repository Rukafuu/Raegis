import { motion } from 'motion/react';
import { Tooltip } from './Tooltip';
import { Zap, Command, Layers, Search, ShieldCheck } from 'lucide-react';

interface CoreFeaturesProps {
  t: any;
}

export const CoreFeatures = ({ t }: CoreFeaturesProps) => {
  const icons = [Search, Command, Zap, Layers, ShieldCheck];

  return (
    <section className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5 relative bg-radial-at-t from-cyan-neon/5 via-transparent to-transparent">
      <div className="text-center mb-24">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black text-white mb-12 tracking-tight selection:bg-cyan-neon/30"
        >
          {t.coreFeatures.title}
        </motion.h2>
        <div className="w-24 h-1.5 bg-cyan-neon mx-auto rounded-full shadow-[0_0_15px_rgba(0,243,255,0.4)]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {t.coreFeatures.items.map((feature: any, idx: number) => {
          const Icon = icons[idx] || Zap;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.02, 
                backgroundColor: "rgba(15, 23, 42, 0.7)",
                borderColor: "rgba(0, 243, 255, 0.4)"
              }}
              className="group cursor-default"
            >
              <Tooltip content={feature.tooltip} position={idx % 2 === 0 ? "top" : "bottom"} align="center">
                <div className="p-10 bg-slate-900/40 border border-white/5 rounded-[2rem] backdrop-blur-md h-full flex flex-col gap-6 relative overflow-hidden transition-all duration-300">
                  {/* Glass Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-neon/5 blur-[50px] group-hover:bg-cyan-neon/10 transition-colors" />

                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-cyan-neon/15 shadow-inner transition-all duration-300">
                      <Icon className="w-8 h-8 text-cyan-neon neon-text-glow" />
                    </div>
                    <h4 className="text-2xl font-black text-white tracking-tight group-hover:text-cyan-neon transition-colors leading-[1.2]">
                      {feature.title}
                    </h4>
                  </div>
                  
                  <p className="text-lg text-slate-400 font-medium leading-[1.6]">
                    {feature.desc}
                  </p>

                  <div className="mt-auto pt-6 flex items-center gap-2">
                    <div className="w-full h-px bg-white/5 group-hover:bg-cyan-neon/20 transition-colors" />
                    <span className="text-[10px] font-mono text-slate-600 uppercase group-hover:text-cyan-neon/60 transition-colors tracking-[0.2em] px-2">Ready</span>
                  </div>
                </div>
              </Tooltip>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
