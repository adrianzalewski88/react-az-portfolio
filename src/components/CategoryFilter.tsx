import { motion } from "motion/react";

import type { PortfolioCategory } from "../types/portfolio";

interface CategoryFilterProps {
  categories: PortfolioCategory[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <nav className="category-filter" aria-label="Portfolio categories">
      <button
        type="button"
        className={activeCategory === "all" ? "is-active" : ""}
        onClick={() => onCategoryChange("all")}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={
            activeCategory === category.slug ? "is-active" : ""
          }
          onClick={() => onCategoryChange(category.slug)}
        >
          {category.name}

          {activeCategory === category.slug && (
            <motion.span
              className="category-filter__indicator"
              layoutId="category-indicator"
            />
          )}
        </button>
      ))}
    </nav>
  );
}