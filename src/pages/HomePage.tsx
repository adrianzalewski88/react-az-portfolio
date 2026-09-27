import { useMemo, useState } from "react";
import { motion } from "motion/react";

import CategoryFilter from "../components/CategoryFilter";
import PortfolioGrid from "../components/PortfolioGrid";

import {
  portfolioCategories,
  portfolioProjects,
} from "../data/portfolioData";

export default function HomePage() {
  const [activeCategory, setActiveCategory] =
    useState("all");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") {
      return portfolioProjects;
    }

    const category = portfolioCategories.find(
      (item) => item.slug === activeCategory
    );

    if (!category) {
      return portfolioProjects;
    }

    return portfolioProjects.filter(
      (project) =>
        project.category.toLowerCase() ===
        category.name.toLowerCase()
    );
  }, [activeCategory]);

  return (
    <main>
      <section className="hero">
        <motion.div
          className="hero__content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="hero__eyebrow">
            AZ Portfolio
          </p>

          <h1>
            Building things
            <br />
            for the web.
          </h1>

          <p className="hero__description">
            A collection of web development projects
            spanning PHP, Drupal, React, WordPress,
            APIs, and modern full-stack development.
          </p>
        </motion.div>
      </section>

      <section className="portfolio-browser">
        <div className="portfolio-browser__header">
          <div>
            <p className="section-eyebrow">
              Portfolio
            </p>

            <h2>Selected Projects</h2>
          </div>

          <p className="project-count">
            {filteredProjects.length} Projects
          </p>
        </div>

        <CategoryFilter
          categories={portfolioCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <PortfolioGrid
          projects={filteredProjects}
        />
      </section>
    </main>
  );
}