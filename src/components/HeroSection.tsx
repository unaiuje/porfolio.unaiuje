import { motion } from "framer-motion";

const HeroSection = () => (
  <section id="hero" className="pt-24 pb-16">
    <div className="max-w-2xl mx-auto px-6">
      <div className="flex flex-col-reverse sm:flex-row items-start justify-between gap-8">
        <div className="flex-1">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4"
          >
            Hi, I'm Unai 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground text-lg leading-relaxed"
          >
            AI programmer. High school student passionate about AI, martial arts and creating new things with technology.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="shrink-0"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary/10 border border-border flex items-center justify-center text-3xl font-bold text-primary select-none">
            U
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
