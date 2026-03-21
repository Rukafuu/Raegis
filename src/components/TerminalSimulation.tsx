import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Terminal as TerminalIcon } from 'lucide-react';

export const TerminalSimulation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-pause video when scrolling away
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && isPlaying && videoRef.current) {
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div id="demo" ref={containerRef} className="relative max-w-5xl mx-auto group perspective-1000">
      <div className="absolute -inset-2 bg-linear-to-r from-cyan-neon via-transparent to-red-alert rounded-2xl blur-xl opacity-10 group-hover:opacity-30 transition duration-1000" />
      
      <motion.div 
        initial={{ rotateX: 5, y: 30, opacity: 0 }}
        whileInView={{ rotateX: 0, y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm"
      >
        {/* Terminal Header */}
        <div className="h-12 bg-slate-800/40 border-b border-white/5 flex items-center px-6 gap-4">
          <div className="flex gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-red-alert/40 border-red-alert/20" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500/40 border-amber-500/20" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/40 border-emerald-500/20" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 px-4 py-1 rounded bg-slate-950/80 text-[11px] font-mono text-slate-400 border border-white/5">
              <TerminalIcon size={12} className="text-cyan-neon" />
              raegis_monitor <span className="text-slate-600">--target</span> <span className="text-emerald-400">ollama:llama3.2</span>
            </div>
          </div>
          <div className="px-2 text-slate-500 font-mono text-[10px]">VIDEO_FEED</div>
        </div>
        
        {/* Video Area */}
        <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden">
          <div className={`w-full h-full transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-40'}`}>
            <iframe
              className="w-full h-full border-0 rounded-b-xl"
              src={`https://www.youtube.com/embed/WKSKYOaTzcQ?autoplay=${isPlaying ? 1 : 0}&mute=0&controls=1&rel=0&modestbranding=1`}
              title="Raegis Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <AnimatePresence>
            {!isPlaying && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                onClick={handlePlay}
                whileHover={{ scale: 1.15, rotate: 5, boxShadow: "0 0 30px rgba(0,243,255,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="absolute z-10 w-24 h-24 bg-cyan-neon rounded-full flex items-center justify-center neon-glow group/play shadow-[0_0_20px_rgba(0,243,255,0.2)]"
              >
                <Play className="w-10 h-10 text-slate-950 fill-current ml-1.5 group-hover:scale-110 transition-transform" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Grid Pattern Overlay (Optional, for texture if video is dark) */}
          <div className="absolute inset-0 cyber-grid opacity-[0.03] pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
};
