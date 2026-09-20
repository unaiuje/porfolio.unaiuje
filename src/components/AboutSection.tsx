import AnimatedSection from "./AnimatedSection";

const AboutSection = () => (
  <section id="about" className="py-12">
    <div className="max-w-2xl mx-auto px-6">
      <AnimatedSection>
        <h2 className="text-2xl font-bold text-foreground mb-4">About</h2>
        <p className="text-muted-foreground leading-relaxed">
          I'm Unai, a high school student passionate about Brazilian Jiu-Jitsu, kickboxing, AI, and creating new
          things with technology. I'm constantly learning new AI skills and exploring how software and websites can
          solve real problems for businesses. I enjoy building ideas that could grow into something big, while always
          working on myself and learning something new every day.
        </p>
      </AnimatedSection>
    </div>
  </section>
);

export default AboutSection;
