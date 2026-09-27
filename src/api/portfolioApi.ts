import {
  portfolioCategories,
  portfolioProjects,
} from "../data/portfolioData";

import type {
  PortfolioCategory,
  PortfolioProject,
} from "../types/portfolio";

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  return Promise.resolve(portfolioProjects);
}

export async function getPortfolioCategories(): Promise<
  PortfolioCategory[]
> {
  return Promise.resolve(portfolioCategories);
}