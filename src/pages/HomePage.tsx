import { useEffect, useMemo, useState } from "react";
import {
  motion,
  type Variants,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowDown,
  BarChart3,
  BriefcaseBusiness,
  Code2,
  Database,
  ExternalLink,
  Globe2,
  Grid2X2,
  List,
  Mail,
  MapPin,
  Search,
  Server,
  Sparkles,
  Terminal,
  UserRound,
} from "lucide-react";

import CategoryFilter from "../components/CategoryFilter";
import PortfolioGrid from "../components/PortfolioGrid";

import {
  getPortfolioCategories,
  getPortfolioProjects,
} from "../api/portfolioApi";

import type {
  PortfolioCategory,
  PortfolioProject,
} from "../types/portfolio";

type SortOrder =
  | "featured"
  | "title-asc"
  | "title-desc"
  | "category-asc";

type ViewMode = "grid" | "list";

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export default function HomePage() {
  const [activeCategory, setActiveCategory] =
    useState("all");

  const [searchTerm, setSearchTerm] = useState("");

  const [sortOrder, setSortOrder] =
    useState<SortOrder>("featured");

  const [viewMode, setViewMode] =
    useState<ViewMode>("grid");

  const [projects, setProjects] = useState<
    PortfolioProject[]
  >([]);

  const [categories, setCategories] = useState<
    PortfolioCategory[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  const { scrollY } = useScroll();

  const rawHeroY = useTransform(
    scrollY,
    [0, 900],
    [0, 180]
  );

  const heroY = useSpring(rawHeroY, {
    stiffness: 80,
    damping: 25,
  });

  const heroOpacity = useTransform(
    scrollY,
    [0, 650],
    [1, 0.2]
  );

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          projectData,
          categoryData,
        ] = await Promise.all([
          getPortfolioProjects(),
          getPortfolioCategories(),
        ]);

        setProjects(projectData);
        setCategories(categoryData);
      } catch (loadError) {
        console.error(loadError);

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load portfolio data."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadPortfolio();
  }, []);

  const categoryCounts = useMemo(() => {
    return projects.reduce<Record<string, number>>(
      (result, project) => {
        const category = categories.find(
          (item) =>
            item.name.toLowerCase() ===
            project.category.toLowerCase()
        );

        if (category) {
          result[category.slug] =
            (result[category.slug] ?? 0) + 1;
        }

        return result;
      },
      {}
    );
  }, [categories, projects]);

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (activeCategory !== "all") {
      const category = categories.find(
        (item) => item.slug === activeCategory
      );

      if (category) {
        result = result.filter(
          (project) =>
            project.category.toLowerCase() ===
            category.name.toLowerCase()
        );
      }
    }

    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    if (normalizedSearch) {
      result = result.filter((project) =>
        [
          project.title,
          project.shortDescription,
          project.category,
        ].some((value) =>
          value.toLowerCase().includes(normalizedSearch)
        )
      );
    }

    switch (sortOrder) {
      case "title-asc":
        result.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;

      case "title-desc":
        result.sort((a, b) =>
          b.title.localeCompare(a.title)
        );
        break;

      case "category-asc":
        result.sort((a, b) =>
          a.category.localeCompare(b.category)
        );
        break;

      default:
        break;
    }

    return result;
  }, [
    activeCategory,
    categories,
    projects,
    searchTerm,
    sortOrder,
  ]);

  return (
    <main className="site-shell">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">
        <motion.div
          className="hero__background"
          style={{
            y: heroY,
          }}
        />

        <div className="hero__overlay" />

        <div className="hero__grid" />

        <motion.div
          className="hero__orb hero__orb--one"
          animate={{
            x: [0, 80, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="hero__orb hero__orb--two"
          animate={{
            x: [0, -70, 20, 0],
            y: [0, 35, -25, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="hero__content"
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            className="hero__status"
            variants={reveal}
          >
            <span className="status-dot" />
            <span>Full Stack PHP Developer</span>
            <span className="hero__status-line" />
            <span>React / Laravel / Symfony</span>
          </motion.div>

          <motion.p
            className="hero__eyebrow"
            variants={reveal}
          >
            Adrian Zalewski · AZ Portfolio
          </motion.p>

          <motion.h1 variants={reveal}>
            React
            <span> - </span>
            <strong>AZ Portfolio.</strong>
          </motion.h1>

          <motion.p
            className="hero__lead"
            variants={reveal}
          >
            A living showcase of modern full-stack web
            development — from PHP and APIs to React,
            TypeScript, authentication, deployment, and
            everything connecting the pieces.
          </motion.p>

          <motion.div
            className="hero__actions"
            variants={reveal}
          >
            <a
              href="#projects"
              className="button button--primary"
            >
              Explore projects
              <ArrowDown size={18} />
            </a>

            <a
              href="https://www.linkedin.com/in/adrian-zalewski-1988-fa/"
              target="_blank"
              rel="noreferrer"
              className="button button--glass"
            >
              LinkedIn
              <BriefcaseBusiness size={18} />
            </a>

            <a
              href="https://github.com/adrianzalewski88"
              target="_blank"
              rel="noreferrer"
              className="button button--glass"
            >
              GitHub
              <Code2 size={18} />
            </a>
          </motion.div>

          <motion.div
            className="hero__metrics"
            variants={reveal}
          >
            <div>
              <strong>50+</strong>
              <span>Web Projects</span>
            </div>

            <div>
              <strong>18+</strong>
              <span>Years Development</span>
            </div>

            <div>
              <strong>PHP</strong>
              <span>Full Stack Focus</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero__scroll"
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span>Scroll to explore</span>
          <ArrowDown size={16} />
        </motion.div>
      </section>

      {/* =================================================
          ABOUT
      ================================================= */}

      <section className="about-section section">
        <div className="section-container">
          <motion.div
            className="about-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            variants={stagger}
          >
            <motion.div
              className="about-photo"
              variants={reveal}
            >
              <div className="about-photo__glow" />

              <img
                src="/images/portfolio-owner-picture.jpg"
                alt="Adrian Zalewski"
              />

              <div className="about-photo__badge">
                <Sparkles size={16} />
                <span>Building for the web</span>
              </div>
            </motion.div>

            <motion.div
              className="about-content"
              variants={reveal}
            >
              <p className="section-eyebrow">
                About the developer
              </p>

              <h2>
                Hi, I'm Adrian.
                <br />
                <span>I build the systems behind the
                screen.</span>
              </h2>

              <p>
                I'm Adrian Zalewski, a Full Stack PHP
                Developer focused on building practical,
                scalable web applications and the systems
                that power them.
              </p>

              <p>
                My work spans PHP, Laravel, Symfony,
                Drupal, WordPress, React, TypeScript,
                APIs, authentication, databases,
                automation, and production deployment.
              </p>

              <div className="about-tech">
                <span>
                  <Server size={15} />
                  Backend
                </span>

                <span>
                  <Code2 size={15} />
                  Frontend
                </span>

                <span>
                  <Database size={15} />
                  APIs & Data
                </span>

                <span>
                  <Terminal size={15} />
                  DevOps
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =================================================
          API ARCHITECTURE
      ================================================= */}

      <section className="architecture-section">
        <div className="section-container">
          <motion.div
            className="architecture-card"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
          >
            <div className="architecture-card__visual">
              <motion.div
                className="architecture-node architecture-node--react"
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(31,105,255,0)",
                    "0 0 35px rgba(31,105,255,.35)",
                    "0 0 0 rgba(31,105,255,0)",
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
              >
                <Code2 />
                <span>React</span>
              </motion.div>

              <div className="architecture-line">
                <span />
                <span />
                <span />
              </div>

              <div className="architecture-api">
                <Database />
                <span>OAuth2 API</span>
              </div>

              <div className="architecture-line">
                <span />
                <span />
                <span />
              </div>

              <div className="architecture-node architecture-node--laravel">
                <Server />
                <span>Laravel</span>
              </div>
            </div>

            <div className="architecture-card__content">
              <p className="section-eyebrow">
                This portfolio is itself a project
              </p>

              <h2>
                The UI you're looking at is powered by
                an API.
              </h2>

              <p>
                This React application demonstrates
                consuming portfolio data from a separate
                Laravel application through an API
                architecture.
              </p>

              <a
                href="https://portfolio-source.adrian-zalewski.com/"
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Explore the Laravel source application
                <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =================================================
          PROJECTS
      ================================================= */}

      <section
        id="projects"
        className="portfolio-browser section"
      >
        <div className="section-container">
          <motion.div
            className="portfolio-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            variants={stagger}
          >
            <motion.div variants={reveal}>
              <p className="section-eyebrow">
                Portfolio explorer
              </p>

              <h2>
                Selected
                <span> projects.</span>
              </h2>

              <p className="portfolio-heading__description">
                Search, filter, sort, and explore the
                projects behind the portfolio.
              </p>
            </motion.div>

            <motion.div
              className="portfolio-stat-card"
              variants={reveal}
            >
              <BarChart3 size={20} />

              <div>
                <strong>{projects.length}</strong>
                <span>Total projects</span>
              </div>
            </motion.div>
          </motion.div>

          {!loading && !error && (
            <>
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                counts={categoryCounts}
                totalCount={projects.length}
              />

              <div className="portfolio-controls">
                <label className="portfolio-search">
                  <Search size={18} />

                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search projects..."
                    aria-label="Search projects"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </label>

                <div className="portfolio-controls__right">
                  <label className="portfolio-sort">
                    <span>Sort</span>

                    <select
                      value={sortOrder}
                      onChange={(event) =>
                        setSortOrder(
                          event.target.value as SortOrder
                        )
                      }
                    >
                      <option value="featured">
                        Featured
                      </option>

                      <option value="title-asc">
                        Title A → Z
                      </option>

                      <option value="title-desc">
                        Title Z → A
                      </option>

                      <option value="category-asc">
                        Category
                      </option>
                    </select>
                  </label>

                  <div
                    className="view-toggle"
                    aria-label="Project display mode"
                  >
                    <button
                      type="button"
                      className={
                        viewMode === "grid"
                          ? "is-active"
                          : ""
                      }
                      onClick={() =>
                        setViewMode("grid")
                      }
                      aria-label="Grid view"
                    >
                      <Grid2X2 size={17} />
                    </button>

                    <button
                      type="button"
                      className={
                        viewMode === "list"
                          ? "is-active"
                          : ""
                      }
                      onClick={() =>
                        setViewMode("list")
                      }
                      aria-label="List view"
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="portfolio-results-bar">
                <span>
                  Showing{" "}
                  <strong>
                    {filteredProjects.length}
                  </strong>{" "}
                  of {projects.length} projects
                </span>

                <span className="portfolio-results-bar__pulse">
                  <span />
                  Live catalog
                </span>
              </div>
            </>
          )}

          {loading && (
            <motion.div
              className="portfolio-loading"
              animate={{
                opacity: [0.45, 1, 0.45],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <Sparkles size={20} />
              Loading portfolio data...
            </motion.div>
          )}

          {error && (
            <div className="portfolio-status portfolio-status--error">
              <p>
                Unable to load portfolio data.
              </p>

              <span>{error}</span>
            </div>
          )}

          {!loading && !error && (
            <PortfolioGrid
              projects={filteredProjects}
              viewMode={viewMode}
            />
          )}
        </div>
      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="site-footer">
        <div className="site-footer__glow" />

        <div className="section-container">
          <div className="site-footer__top">
            <div>
              <p className="section-eyebrow">
                Let's connect
              </p>

              <h2>
                Have a project,
                <br />
                idea, or opportunity?
              </h2>
            </div>

            <a
              href="mailto:fictionarts@gmail.com"
              className="button button--primary"
            >
              Start a conversation
              <Mail size={17} />
            </a>
          </div>

          <div className="site-footer__links">
            <a href="mailto:fictionarts@gmail.com">
              <Mail size={17} />
              <span>
                <small>Email</small>
                fictionarts@gmail.com
              </span>
            </a>

            <a href="tel:+14013383998">
              <BriefcaseBusiness size={17} />
              <span>
                <small>Phone</small>
                (401) 338-3998
              </span>
            </a>

            <div>
              <MapPin size={17} />
              <span>
                <small>Location</small>
                Cumberland, RI, USA
              </span>
            </div>

            <a
              href="https://adrian-zalewski.com/"
              target="_blank"
              rel="noreferrer"
            >
              <Globe2 size={17} />
              <span>
                <small>Website</small>
                adrian-zalewski.com
              </span>
            </a>

            <a
              href="https://github.com/adrianzalewski88"
              target="_blank"
              rel="noreferrer"
            >
              <Code2 size={17} />
              <span>
                <small>GitHub</small>
                adrianzalewski88
              </span>
            </a>

            <a
              href="https://www.linkedin.com/in/adrian-zalewski-1988-fa/"
              target="_blank"
              rel="noreferrer"
            >
              <BriefcaseBusiness size={17} />
              <span>
                <small>LinkedIn</small>
                Adrian Zalewski
              </span>
            </a>
          </div>

          <div className="site-footer__bottom">
            <span>
              © {new Date().getFullYear()} Adrian
              Zalewski
            </span>

            <a
              href="https://portfolio-source.adrian-zalewski.com/login"
              target="_blank"
              rel="noreferrer"
            >
              <UserRound size={15} />
              Developer Authentication
            </a>

            <span>
              React · TypeScript · Laravel · OAuth2
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}