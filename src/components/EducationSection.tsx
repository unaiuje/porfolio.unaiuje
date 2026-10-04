import AnimatedSection from "./AnimatedSection";
import { useEducation } from "@/hooks/usePortfolioData";

const EducationSection = () => {
  const { data: education, loading } = useEducation();

  if (loading || education.length === 0) return null;

  return (
    <section id="education" className="py-6">
      <div className="max-w-2xl mx-auto px-6">
        <AnimatedSection>
          <h2 className="text-2xl font-bold text-foreground mb-8">Education</h2>
        </AnimatedSection>

        <div className="space-y-1">
          {education.map((edu) => (
            <AnimatedSection key={edu.id}>
              <div className="flex items-center gap-4 py-4 -mx-3 px-3 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground shrink-0">
                  {edu.institution.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-sm">{edu.institution}</p>
                  <p className="text-muted-foreground text-sm">{edu.program}</p>
                  {edu.description && (
                    <p className="text-muted-foreground/70 text-xs mt-1">{edu.description}</p>
                  )}
                </div>
                <span className="text-muted-foreground text-xs font-medium whitespace-nowrap hidden sm:block">
                  {edu.period}
                </span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
