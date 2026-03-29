import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom';
  align?: 'center' | 'left' | 'right';
}

export const Tooltip = ({ children, content, position = 'top', align = 'center' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block w-full"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`absolute z-[100] px-4 py-2 bg-slate-800/80 backdrop-blur-xl border border-cyan-neon/30 rounded-lg shadow-[0_0_20px_rgba(0,243,255,0.1)] pointer-events-none min-w-[200px] text-center ${
              position === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'
            } ${
              align === 'center' ? 'left-1/2 -translate-x-1/2' : align === 'left' ? 'left-0' : 'right-0'
            }`}
          >
            <div className="text-xs font-semibold text-cyan-neon leading-tight tracking-wide">
              {content}
            </div>
            {/* Arrow */}
            <div className={`absolute border-8 border-transparent ${
              position === 'top' ? 'top-full -mt-px border-t-slate-800/80' : 'bottom-full -mb-px border-b-slate-800/80'
            } ${
              align === 'center' ? 'left-1/2 -translate-x-1/2' : align === 'left' ? 'left-4' : 'right-4'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
