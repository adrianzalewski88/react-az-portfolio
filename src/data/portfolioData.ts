import type {
  PortfolioCategory,
  PortfolioProject,
} from "../types/portfolio";

export const portfolioCategories: PortfolioCategory[] = [
  {
    id: 1,
    name: "PHP",
    slug: "php",
  },
  {
    id: 2,
    name: "React",
    slug: "react",
  },
  {
    id: 3,
    name: "Drupal",
    slug: "drupal",
  },
  {
    id: 4,
    name: "WordPress",
    slug: "wordpress",
  },
  {
    id: 5,
    name: "Other",
    slug: "other",
  },
];

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 1,
    slug: "my-urban-clothing",
    title: "My Urban Clothing",
    shortDescription:
      "An urban fashion discovery platform built with Drupal, PHP, APIs, and custom development.",
    body:
      "My Urban Clothing is a content-driven urban fashion discovery platform featuring brand deep dives, fashion styles, editorial content, and product discovery.",
    featuredImage: "https://adrian-zalewski.com/wp-content/uploads/2026/06/my-urban-clothing-featured-image.jpg",
    category: "Drupal",
  },
  {
    id: 2,
    slug: "az-portfolio",
    title: "AZ Portfolio",
    shortDescription:
      "A modern portfolio platform demonstrating React, TypeScript, Laravel, APIs, and CI/CD.",
    body:
      "AZ Portfolio is a full-stack portfolio ecosystem designed to demonstrate modern frontend and backend development techniques.",
    featuredImage: "https://adrian-zalewski.com/wp-content/uploads/2020/05/project-corp-distribution-network-featured.jpg",
    category: "React",
  },
  {
    id: 3,
    slug: "custom-php-platform",
    title: "Custom PHP Platform",
    shortDescription:
      "A custom PHP application demonstrating backend architecture, APIs, and database integration.",
    body:
      "This project demonstrates custom PHP application architecture with a focus on reusable backend functionality and API-driven development.",
    featuredImage: "https://adrian-zalewski.com/wp-content/uploads/2020/05/project-enterprise-solution-featured.jpg",
    category: "PHP",
  },
  {
    id: 4,
    slug: "wordpress-development",
    title: "WordPress Development",
    shortDescription:
      "Custom WordPress development including plugins, themes, integrations, and content management.",
    body:
      "A collection of WordPress development work demonstrating custom plugins, theme development, integrations, and content-driven websites.",
    featuredImage: "https://adrian-zalewski.com/wp-content/uploads/2020/05/project-lms-featured.jpg",
    category: "WordPress",
  },
  {
    id: 5,
    slug: "api-integration",
    title: "API Integration",
    shortDescription:
      "A demonstration of integrating external APIs into a modern web application.",
    body:
      "This project demonstrates consuming external APIs, transforming structured data, and presenting that information through a modern frontend.",
    featuredImage: "https://adrian-zalewski.com/wp-content/uploads/2020/05/project-affiliate-catalog.jpg",
    category: "Other",
  },
];