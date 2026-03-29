import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CopyButtonProps {
  text: string;
}

export const CopyButton = ({ text }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent tooltip from interfering if inside one
        handleCopy();
      }}
      className="absolute top-3 right-3 p-2 bg-slate-900/60 hover:bg-slate-800 border border-white/10 rounded-lg transition-all active:scale-90 group/copy z-20 backdrop-blur-sm"
      title="Copy to clipboard"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div 
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-0.5">Copied</span>
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <Copy className="w-3.5 h-3.5 text-slate-400 group-hover/copy:text-cyan-neon transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
