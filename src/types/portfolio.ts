export interface PortfolioProject {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  body: string;
  featuredImage: string;
  category: string;
}

export interface PortfolioCategory {
  id: number;
  name: string;
  slug: string;
}