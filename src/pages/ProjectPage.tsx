import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Code2,
  Layers3,
  Sparkles,
} from "lucide-react";

import {
  getPortfolioProjects,
} from "../api/portfolioApi";

import type { PortfolioProject } from "../types/portfolio";

export default function ProjectPage() {
  const { slug } = useParams();

  const [projects, setProjects] = useState<
    PortfolioProject[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  const { scrollY } = useScroll();

  const imageY = useTransform(
    scrollY,
    [0, 900],
    [0, 100]
  );

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);

        const data = await getPortfolioProjects();

        setProjects(data);
      } catch (loadError) {
        console.error(loadError);

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProjects();
  }, []);

  const project = useMemo(
    () =>
      projects.find(
        (item) => item.slug === slug
      ),
    [projects, slug]
  );

  const relatedProjects = useMemo(() => {
    if (!project) {
      return [];
    }

    return projects
      .filter(
        (item) =>
          item.id !== project.id &&
          item.category.toLowerCase() ===
            project.category.toLowerCase()
      )
      .slice(0, 3);
  }, [project, projects]);

  if (loading) {
    return (
      <main className="project-page project-page--loading">
        <motion.div
          animate={{
            opacity: [0.35, 1, 0.35],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          <Sparkles size={22} />
          Loading project...
        </motion.div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="project-page project-page--not-found">
        <div className="project-page__empty">
          <p className="section-eyebrow">
            404 · Project unavailable
          </p>

          <h1>Project not found.</h1>

          <p>
            The project may have been removed or the URL
            may no longer exist.
          </p>

          <Link
            to="/"
            className="button button--primary"
          >
            <ArrowLeft size={17} />
            Back to portfolio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="project-page">
      {/* =================================================
          HERO IMAGE
      ================================================= */}

      <section className="project-hero">
        <motion.div
          className="project-hero__image"
          style={{
            y: imageY,
          }}
        >
          <img
            src={
              project.featuredImage ||
              "/images/project-placeholder.jpg"
            }
            alt={project.title}
            onError={(event) => {
              event.currentTarget.src =
                "/images/project-placeholder.jpg";
            }}
          />
        </motion.div>

        <div className="project-hero__overlay" />
        <div className="project-hero__grid" />

        <div className="project-hero__content">
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
              filter: "blur(8px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <Link
              to="/"
              className="project-page__back"
            >
              <ArrowLeft size={17} />
              Back to portfolio
            </Link>

            <div className="project-hero__category">
              <Layers3 size={15} />
              {project.category}
            </div>

            <h1>{project.title}</h1>
          </motion.div>
        </div>
      </section>

      {/* =================================================
          PROJECT CONTENT
      ================================================= */}

      <section className="project-content section">
        <div className="section-container">
          <div className="project-content__grid">
            <motion.aside
              className="project-content__sidebar"
              initial={{
                opacity: 0,
                x: -25,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
            >
              <div className="project-fact">
                <Code2 size={18} />
                <span>Project</span>
                <strong>
                  {String(project.id).padStart(2, "0")}
                </strong>
              </div>

              <div className="project-fact">
                <Layers3 size={18} />
                <span>Category</span>
                <strong>{project.category}</strong>
              </div>

              <Link
                to="/"
                className="project-sidebar-link"
              >
                Browse all projects
                <ArrowUpRight size={16} />
              </Link>
            </motion.aside>

            <motion.article
              className="project-content__body"
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
                amount: 0.15,
              }}
            >
              <p className="section-eyebrow">
                Project overview
              </p>

              <div className="project-rich-text">
                {project.body}
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* =================================================
          RELATED PROJECTS
      ================================================= */}

      {relatedProjects.length > 0 && (
        <section className="related-projects section">
          <div className="section-container">
            <div className="related-projects__heading">
              <div>
                <p className="section-eyebrow">
                  Continue exploring
                </p>

                <h2>
                  Related <span>projects.</span>
                </h2>
              </div>

              <Link
                to="/"
                className="text-link"
              >
                View complete portfolio
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="related-projects__grid">
              {relatedProjects.map(
                (relatedProject, index) => (
                  <motion.div
                    key={relatedProject.id}
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.08,
                    }}
                  >
                    <Link
                      to={`/projects/${relatedProject.slug}`}
                      className="related-project"
                    >
                      <div className="related-project__image">
                        <img
                          src={
                            relatedProject.featuredImage ||
                            "/images/project-placeholder.jpg"
                          }
                          alt={relatedProject.title}
                        />
                      </div>

                      <div className="related-project__content">
                        <span>
                          {relatedProject.category}
                        </span>

                        <h3>
                          {relatedProject.title}
                        </h3>

                        <ArrowUpRight size={18} />
                      </div>
                    </Link>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}