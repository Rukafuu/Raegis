import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Send, User, Mail, MessageSquare } from 'lucide-react';

interface ContactFormProps {
  t: any;
}

export const ContactForm = ({ t }: ContactFormProps) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://formspree.io/f/mzdjwwea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert('Failed to send message. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-32 relative z-10 selection:bg-cyan-neon/30">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-white"
        >
          {t.contact.title}
        </motion.h2>
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "80px" }}
          viewport={{ once: true }}
          className="h-1.5 bg-cyan-neon mx-auto rounded-full shadow-[0_0_15px_rgba(0,243,255,0.5)]" 
        />
      </div>

      <div className="relative group/card overflow-hidden bg-slate-900/40 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl transition-all hover:bg-slate-900/60 hover:border-cyan-neon/20">
        {/* Animated Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-neon/5 blur-[80px] group-hover:bg-cyan-neon/10 transition-colors duration-700" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-alert/5 blur-[80px] group-hover:bg-red-alert/10 transition-colors duration-700" />

        {submitted ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-8 border border-emerald-500/30">
              <Check className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t.contact.success}</h3>
            <p className="text-slate-400 text-sm">We'll get back to you shortly.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label htmlFor="name" className="text-sm font-bold text-slate-400 flex items-center gap-2 px-1">
                  <User size={14} className="text-cyan-neon" />
                  {t.contact.name}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-neon/50 focus:ring-1 focus:ring-cyan-neon/50 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label htmlFor="email" className="text-sm font-bold text-slate-400 flex items-center gap-2 px-1">
                  <Mail size={14} className="text-cyan-neon" />
                  {t.contact.email}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="hello@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-neon/50 focus:ring-1 focus:ring-cyan-neon/50 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label htmlFor="message" className="text-sm font-bold text-slate-400 flex items-center gap-2 px-1">
                <MessageSquare size={14} className="text-cyan-neon" />
                {t.contact.message}
              </label>
              <textarea
                id="message"
                required
                rows={5}
                placeholder="How can Raegis help you today?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-neon/50 focus:ring-1 focus:ring-cyan-neon/50 transition-all resize-none font-medium leading-relaxed"
              />
            </div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(0,243,255,0.2)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-cyan-neon hover:bg-cyan-400 text-slate-950 font-black py-5 rounded-2xl flex justify-center items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/btn"
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.div 
                    key="submitting"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-6 h-6 border-4 border-slate-950/30 border-t-slate-950 rounded-full"
                  />
                ) : (
                  <motion.div 
                    key="send"
                    className="flex items-center gap-3 uppercase tracking-tighter text-lg"
                  >
                    <span>{t.contact.submit}</span>
                    <Send size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>
        )}
      </div>
    </section>
  );
};
