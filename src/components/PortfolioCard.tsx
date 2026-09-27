import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { PortfolioProject } from "../types/portfolio";

interface PortfolioCardProps {
  project: PortfolioProject;
}

export default function PortfolioCard({
  project,
}: PortfolioCardProps) {
  return (
    <motion.article
      className="portfolio-card"
      layout
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      whileHover={{
        y: -10,
        scale: 1.015,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
      }}
    >
      <Link
        to={`/projects/${project.slug}`}
        className="portfolio-card__link"
      >
        <div className="portfolio-card__image">
          <img
            src={project.featuredImage}
            alt={project.title}
          />

          <motion.div
            className="portfolio-card__overlay"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.div
              whileHover={{ rotate: 45 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowUpRight size={30} />
            </motion.div>
          </motion.div>
        </div>

        <div className="portfolio-card__content">
          <span className="portfolio-card__category">
            {project.category}
          </span>

          <h2>{project.title}</h2>

          <p>{project.shortDescription}</p>

          <span className="portfolio-card__cta">
            View Project
            <ArrowUpRight size={18} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}