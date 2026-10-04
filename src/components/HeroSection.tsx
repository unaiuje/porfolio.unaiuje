const HeroSection = () => (
  <section id="hero" className="pt-24 pb-6">
    <div className="max-w-2xl mx-auto px-6">
      <div className="flex flex-col-reverse sm:flex-row items-start justify-between gap-8">
        <div className="flex-1">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            Hi, I'm Unai 👋
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            AI programmer. High school student passionate about AI, martial arts and creating new things with technology.
          </p>
        </div>
        <div className="shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary/10 border border-border flex items-center justify-center text-3xl font-bold text-primary select-none">
            U
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
