import AnimatedSection from "./AnimatedSection";
import { useProjects } from "@/hooks/usePortfolioData";
import { Github, Globe } from "lucide-react";

const ProjectsSection = () => {
  const { data: projects, loading } = useProjects();

  if (loading || projects.length === 0) return null;

  return (
    <section id="projects" className="py-12">
      <div className="max-w-2xl mx-auto px-6">
        <AnimatedSection>
          <h2 className="text-2xl font-bold text-foreground mb-8">Projects</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
          {projects.map((p, i) => (
            <AnimatedSection key={p.id} delay={i * 0.05}>
              <div className="h-full rounded-lg bg-card text-card-foreground flex flex-col overflow-hidden border transition-all duration-300 ease-out hover:shadow-lg">
                {p.image_url && (
                  <a href={p.live_url || undefined} target="_blank" rel="noreferrer" className="block cursor-pointer">
                    <img
                      src={p.image_url}
                      alt={p.title}
                      loading="lazy"
                      className="h-40 w-full overflow-hidden object-cover object-top"
                    />
                  </a>
                )}
                <div className="flex flex-col px-4 pt-3 space-y-1">
                  <h3 className="font-semibold tracking-tight text-lg">{p.title}</h3>
                  {p.period && <time className="font-sans text-xs">{p.period}</time>}
                  {p.description && (
                    <p className="text-pretty font-sans text-sm text-muted-foreground">{p.description}</p>
                  )}
                </div>
                <div className="mt-auto flex flex-col px-4 pb-4 pt-3 gap-3">
                  {p.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-md border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {(p.live_url || p.repo_url) && (
                    <div className="flex flex-wrap gap-2">
                      {p.live_url && (
                        <a
                          href={p.live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          Website
                        </a>
                      )}
                      {p.repo_url && (
                        <a
                          href={p.repo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                        >
                          <Github className="w-3.5 h-3.5" />
                          Code
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
