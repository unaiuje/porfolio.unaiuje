import { Home, Github, Mail, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

const DockNav = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 px-3 py-2 rounded-full border border-border bg-background/80 backdrop-blur-md shadow-lg">
        <button
          onClick={scrollToTop}
          className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
          aria-label="Home"
        >
          <Home size={16} />
        </button>
        <a
          href="https://github.com/unaiuje"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
          aria-label="GitHub"
        >
          <Github size={16} />
        </a>
        <a
          href="mailto:unai.uje.18@gmail.com"
          className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
          aria-label="Email"
        >
          <Mail size={16} />
        </a>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </nav>
  );
};

export default DockNav;
