import { AnimatePresence } from "motion/react";

import type { PortfolioProject } from "../types/portfolio";
import PortfolioCard from "./PortfolioCard";

interface PortfolioGridProps {
  projects: PortfolioProject[];
}

export default function PortfolioGrid({
  projects,
}: PortfolioGridProps) {
  if (projects.length === 0) {
    return (
      <div className="portfolio-grid__empty">
        <h2>No projects found</h2>
        <p>There are no projects in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="portfolio-grid">
      <AnimatePresence mode="popLayout">
        {projects.map((project) => (
          <PortfolioCard
            key={project.id}
            project={project}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}