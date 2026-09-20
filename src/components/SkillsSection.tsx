import AnimatedSection from "./AnimatedSection";
import { useSkills } from "@/hooks/usePortfolioData";

const SkillsSection = () => {
  const { data: skills, loading } = useSkills();

  if (loading || skills.length === 0) return null;

  return (
    <section id="skills" className="py-12">
      <div className="max-w-2xl mx-auto px-6">
        <AnimatedSection>
          <h2 className="text-2xl font-bold text-foreground mb-6">Skills</h2>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default SkillsSection;
