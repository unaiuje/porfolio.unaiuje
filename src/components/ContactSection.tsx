import AnimatedSection from "./AnimatedSection";
import { Mail, Github } from "lucide-react";

const ContactSection = () => (
  <section id="contact" className="py-12 pb-32">
    <div className="max-w-2xl mx-auto px-6">
      <AnimatedSection>
        <p className="text-muted-foreground text-sm mb-1">Contact</p>
        <h2 className="text-2xl font-bold text-foreground mb-4">Get in Touch</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Want to talk about AI, projects or an idea? Reach me by{" "}
          <a
            href="mailto:unai.uje.18@gmail.com"
            className="text-foreground underline hover:text-primary"
          >
            email
          </a>{" "}
          or find me on{" "}
          <a
            href="https://github.com/unaiuje"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline hover:text-primary"
          >
            GitHub
          </a>
          .
        </p>
        <div className="flex gap-4 mt-4">
          <a
            href="mailto:unai.uje.18@gmail.com"
            aria-label="Email"
            className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
          >
            <Mail size={16} />
          </a>
          <a
            href="https://github.com/unaiuje"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
          >
            <Github size={16} />
          </a>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default ContactSection;
