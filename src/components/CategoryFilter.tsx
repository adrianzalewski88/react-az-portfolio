import { motion } from "motion/react";
import { Layers3 } from "lucide-react";

import type { PortfolioCategory } from "../types/portfolio";

interface CategoryFilterProps {
  categories: PortfolioCategory[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  counts?: Record<string, number>;
  totalCount?: number;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  counts = {},
  totalCount = 0,
}: CategoryFilterProps) {
  const items = [
    {
      id: "all",
      name: "All Projects",
      count: totalCount,
    },
    ...categories.map((category) => ({
      id: category.slug,
      name: category.name,
      count: counts[category.slug] ?? 0,
    })),
  ];

  return (
    <nav
      className="category-filter"
      aria-label="Portfolio categories"
    >
      <div className="category-filter__label">
        <Layers3 size={16} />
        <span>Explore by discipline</span>
      </div>

      <div className="category-filter__items">
        {items.map((item) => {
          const active = activeCategory === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`category-filter__button ${
                active ? "is-active" : ""
              }`}
              onClick={() => onCategoryChange(item.id)}
              aria-pressed={active}
            >
              {active && (
                <motion.span
                  className="category-filter__active-background"
                  layoutId="category-active-background"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}

              <span className="category-filter__button-content">
                <span>{item.name}</span>

                <span className="category-filter__count">
                  {item.count}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}