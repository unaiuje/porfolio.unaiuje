import AnimatedSection from "./AnimatedSection";
import { useProjects } from "@/hooks/usePortfolioData";
import { ExternalLink, Github } from "lucide-react";

const ProjectsSection = () => {
  const { data: projects, loading } = useProjects();

  if (loading || projects.length === 0) return null;

  return (
    <section id="projects" className="py-12">
      <div className="max-w-2xl mx-auto px-6">
        <AnimatedSection>
          <h2 className="text-2xl font-bold text-foreground mb-8">Projects</h2>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p, i) => (
            <AnimatedSection key={p.id} delay={i * 0.05}>
              <div className="h-full rounded-xl border border-border bg-card overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                {p.image_url && (
                  <img src={p.image_url} alt={p.title} className="w-full h-36 object-cover" loading="lazy" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground text-sm">{p.title}</h3>
                  {p.description && (
                    <p className="text-muted-foreground text-sm mt-1">{p.description}</p>
                  )}
                  {p.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[11px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3 mt-3">
                    {p.live_url && (
                      <a
                        href={p.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> Website
                      </a>
                    )}
                    {p.repo_url && (
                      <a
                        href={p.repo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="w-3 h-3" /> Code
                      </a>
                    )}
                  </div>
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
