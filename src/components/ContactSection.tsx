import AnimatedSection from "./AnimatedSection";
import { SocialIcon } from "@/lib/socialIcons";
import { useSocialLinks } from "@/hooks/usePortfolioData";

const ContactSection = () => {
  const { data: links } = useSocialLinks();
  const mailLink = links.find((l) => l.url.startsWith("mailto:"));

  return (
    <section id="contact" className="py-12 pb-32">
      <div className="max-w-2xl mx-auto px-6">
        <AnimatedSection>
          <p className="text-muted-foreground text-sm mb-1">Contact</p>
          <h2 className="text-2xl font-bold text-foreground mb-4">Get in Touch</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Want to talk about AI, projects or an idea?{" "}
            {mailLink ? (
              <>
                Reach me by{" "}
                <a href={mailLink.url} className="text-foreground underline hover:text-primary">
                  email
                </a>{" "}
                or find me on any of these.
              </>
            ) : (
              "Find me on any of these."
            )}
          </p>
          <div className="flex gap-4 mt-4">
            {links.map((link) => {
              const external = /^https?:\/\//.test(link.url);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={link.label}
                  title={link.label}
                  className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
                >
                  <SocialIcon name={link.kind} size={16} />
                </a>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ContactSection;
