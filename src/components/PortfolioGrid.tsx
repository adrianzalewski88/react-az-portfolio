import { AnimatePresence, motion } from "motion/react";
import { SearchX } from "lucide-react";

import type { PortfolioProject } from "../types/portfolio";
import PortfolioCard from "./PortfolioCard";

interface PortfolioGridProps {
  projects: PortfolioProject[];
  viewMode?: "grid" | "list";
}

export default function PortfolioGrid({
  projects,
  viewMode = "grid",
}: PortfolioGridProps) {
  if (projects.length === 0) {
    return (
      <motion.div
        className="portfolio-grid__empty"
        initial={{
          opacity: 0,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
      >
        <div className="portfolio-grid__empty-icon">
          <SearchX size={30} />
        </div>

        <p className="section-eyebrow">
          No matching projects
        </p>

        <h2>The portfolio came up empty.</h2>

        <p>
          Try changing your search, category, or sort
          settings.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className={`portfolio-grid portfolio-grid--${viewMode}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {projects.map((project, index) => (
          <PortfolioCard
            key={project.id}
            project={project}
            index={index}
            viewMode={viewMode}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}