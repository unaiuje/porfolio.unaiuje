import AnimatedSection from "./AnimatedSection";
import { useProjects } from "@/hooks/usePortfolioData";
import { Github } from "lucide-react";

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
              <div className="h-full rounded-lg bg-card text-card-foreground flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out">
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
                <div className="flex flex-col px-2 pt-1">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold tracking-tight text-base">{p.title}</h3>
                      {p.repo_url && (
                        <a
                          href={p.repo_url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${p.title} code`}
                          className="shrink-0 mt-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    {p.period && <time className="font-sans text-xs">{p.period}</time>}
                    {p.description && (
                      <p className="text-pretty font-sans text-xs text-muted-foreground">{p.description}</p>
                    )}
                  </div>
                </div>
                {p.tags?.length > 0 && (
                  <div className="mt-auto flex flex-col px-2 pb-2">
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-md border border-transparent bg-secondary text-secondary-foreground font-semibold px-1.5 py-0 text-[10px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
