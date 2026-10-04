import { Home, Sun, Moon, Dices } from "lucide-react";
import { useState, useEffect } from "react";
import { Dock, DockIcon } from "@/components/Dock";
import { SocialIcon } from "@/lib/socialIcons";
import { useSocialLinks } from "@/hooks/usePortfolioData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

const DockNav = () => {
  const [dark, setDark] = useState(false);
  const [game, setGame] = useState(false);
  const { data: links } = useSocialLinks();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggleTheme = () => {
    if (game) {
      setGame(false);
      document.documentElement.classList.remove("game");
    }
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  const toggleGame = () => {
    const next = !game;
    setGame(next);
    document.documentElement.classList.toggle("game", next);
    if (next) {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const dockItemClass =
    "flex h-full w-full items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent";

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <Dock className="bg-background/80 shadow-lg backdrop-blur-md">
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={scrollToTop} className={dockItemClass} aria-label="Home">
                <Home className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Home</TooltipContent>
          </Tooltip>
        </DockIcon>

        {links.length > 0 && <Separator orientation="vertical" className="h-full w-px" />}

        {links.map((link) => {
          const external = /^https?:\/\//.test(link.url);
          return (
            <DockIcon key={link.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={link.url}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={dockItemClass}
                    aria-label={link.label}
                  >
                    <SocialIcon name={link.kind} className="size-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top">{link.label}</TooltipContent>
              </Tooltip>
            </DockIcon>
          );
        })}

        <Separator orientation="vertical" className="h-full w-px" />

        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={toggleTheme} className={dockItemClass} aria-label="Toggle theme">
                {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">{dark ? "Light mode" : "Dark mode"}</TooltipContent>
          </Tooltip>
        </DockIcon>

        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={toggleGame} className={dockItemClass} aria-label="Toggle game mode">
                <Dices className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">{game ? "Normal mode" : "Game mode"}</TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>
    </nav>
  );
};

export default DockNav;
