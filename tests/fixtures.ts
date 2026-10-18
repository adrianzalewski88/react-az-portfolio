import type {
  PortfolioCategory,
  PortfolioProject,
} from "../src/types/portfolio";

export const testCategories: PortfolioCategory[] = [
  { id: 1, name: "React", slug: "react" },
  { id: 2, name: "Drupal", slug: "drupal" },
  { id: 3, name: "Other", slug: "other" },
];

export const testProjects: PortfolioProject[] = [
  {
    id: 1,
    slug: "az-portfolio",
    title: "AZ Portfolio",
    shortDescription: "A modern React portfolio.",
    body: "A full-stack portfolio built with React and Laravel.",
    featuredImage: "/images/az-portfolio.jpg",
    category: "React",
  },
  {
    id: 2,
    slug: "react-analytics",
    title: "React Analytics",
    shortDescription: "A React dashboard for analytics.",
    body: "A dashboard project.",
    featuredImage: "/images/react-analytics.jpg",
    category: "React",
  },
  {
    id: 3,
    slug: "cms-platform",
    title: "CMS Platform",
    shortDescription: "A Drupal content management project.",
    body: "A CMS project.",
    featuredImage: "/images/cms-platform.jpg",
    category: "Drupal",
  },
  {
    id: 4,
    slug: "api-integration",
    title: "API Integration",
    shortDescription: "A project connecting external services.",
    body: "An API integration project.",
    featuredImage: "/images/api-integration.jpg",
    category: "Other",
  },
];