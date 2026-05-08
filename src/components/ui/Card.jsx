import { motion } from 'framer-motion';

export function Card({ children, className = '', hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}