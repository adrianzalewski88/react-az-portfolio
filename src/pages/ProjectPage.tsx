import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

import { portfolioProjects } from "../data/portfolioData";

export default function ProjectPage() {
  const { slug } = useParams();

  const project = portfolioProjects.find(
    (item) => item.slug === slug
  );

  if (!project) {
    return (
      <main className="project-page">
        <h1>Project Not Found</h1>

        <Link to="/">
          <ArrowLeft size={18} />
          Back to Portfolio
        </Link>
      </main>
    );
  }

  return (
    <main className="project-page">
      <motion.div
        className="project-page__image"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={project.featuredImage}
          alt={project.title}
        />
      </motion.div>

      <motion.div
        className="project-page__content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.15,
        }}
      >
        <Link
          to="/"
          className="project-page__back"
        >
          <ArrowLeft size={18} />
          Back to Portfolio
        </Link>

        <div className="project-page__category-wrapper">
          <span className="project-page__category">
            {project.category}
          </span>
        </div>

        <h1>{project.title}</h1>

        <p className="project-page__description">
          {project.shortDescription}
        </p>

        <div className="project-page__body">
          <p>{project.body}</p>
        </div>
      </motion.div>
    </main>
  );
}