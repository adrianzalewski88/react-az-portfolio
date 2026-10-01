import { motion } from "motion/react";
import {
  ArrowUpRight,
  Code2,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { PortfolioProject } from "../types/portfolio";

interface PortfolioCardProps {
  project: PortfolioProject;
  index?: number;
  viewMode?: "grid" | "list";
}

export default function PortfolioCard({
  project,
  index = 0,
  viewMode = "grid",
}: PortfolioCardProps) {
  return (
    <motion.article
      layout
      layoutId={`project-${project.id}`}
      className={`portfolio-card portfolio-card--${viewMode}`}
      initial={{
        opacity: 0,
        y: 35,
        scale: 0.96,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        y: -20,
        scale: 0.94,
        filter: "blur(8px)",
      }}
      transition={{
        layout: {
          type: "spring",
          stiffness: 280,
          damping: 28,
        },
        opacity: {
          duration: 0.35,
          delay: Math.min(index * 0.045, 0.4),
        },
        y: {
          duration: 0.55,
          delay: Math.min(index * 0.045, 0.4),
          ease: [0.22, 1, 0.36, 1],
        },
        scale: {
          duration: 0.55,
          delay: Math.min(index * 0.045, 0.4),
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      whileHover={{
        y: -8,
      }}
    >
      <Link
        to={`/projects/${project.slug}`}
        className="portfolio-card__link"
      >
        <div className="portfolio-card__shine" />

        <div className="portfolio-card__image">
          <img
            src={
              project.featuredImage ||
              "/images/project-placeholder.jpg"
            }
            alt={project.title}
            loading={index < 3 ? "eager" : "lazy"}
            onError={(event) => {
              event.currentTarget.src =
                "/images/project-placeholder.jpg";
            }}
          />

          <div className="portfolio-card__image-grid" />

          <motion.div
            className="portfolio-card__image-orb"
            animate={{
              x: [0, 20, -10, 0],
              y: [0, -10, 12, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="portfolio-card__image-overlay">
            <motion.span
              whileHover={{
                rotate: 45,
                scale: 1.08,
              }}
              className="portfolio-card__open-icon"
            >
              <ArrowUpRight size={24} />
            </motion.span>
          </div>

          <span className="portfolio-card__category">
            {project.category}
          </span>
        </div>

        <div className="portfolio-card__content">
          <div className="portfolio-card__meta">
            <span>
              <Code2 size={14} />
              Project
            </span>

            <span>
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <h2>{project.title}</h2>

          <p>{project.shortDescription}</p>

          <div className="portfolio-card__footer">
            <span className="portfolio-card__cta">
              Explore project
              <ArrowUpRight size={17} />
            </span>

            <Sparkles
              className="portfolio-card__spark"
              size={17}
            />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}