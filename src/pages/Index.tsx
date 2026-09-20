import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import EducationSection from "@/components/EducationSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import DockNav from "@/components/DockNav";

const Index = () => (
  <div className="min-h-screen bg-background">
    <HeroSection />
    <AboutSection />
    <ProjectsSection />
    <EducationSection />
    <SkillsSection />
    <ContactSection />
    <DockNav />
  </div>
);

export default Index;
