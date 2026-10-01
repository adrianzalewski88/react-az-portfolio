import { useEffect, useState } from "react";
import {
  motion,
} from "motion/react";
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  KeyRound,
  LogIn,
  LogOut,
  Network,
  ShieldCheck,
  Terminal,
  UserRound,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  clearAccessToken,
  getAccessToken,
  startOAuthLogin,
} from "../auth/oauth";

import {
  getProtectedPortfolioProjects,
} from "../api/portfolioApi";

export default function DeveloperAuthenticationPage() {
  const [authenticated, setAuthenticated] =
    useState(() => Boolean(getAccessToken()));

  const [apiStatus, setApiStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [projectCount, setProjectCount] =
    useState<number | null>(null);

  const [error, setError] = useState<string | null>(
    null
  );

  useEffect(() => {
    setAuthenticated(Boolean(getAccessToken()));
  }, []);

  const handleLogin = () => {
    startOAuthLogin();
  };

  const handleLogout = () => {
    clearAccessToken();

    setAuthenticated(false);
    setApiStatus("idle");
    setProjectCount(null);
    setError(null);
  };

  const testProtectedApi = async () => {
    try {
      setApiStatus("loading");
      setError(null);

      const data =
        await getProtectedPortfolioProjects();

      setProjectCount(data.length);
      setApiStatus("success");
    } catch (apiError) {
      console.error(apiError);

      setApiStatus("error");

      setError(
        apiError instanceof Error
          ? apiError.message
          : "Protected API request failed."
      );
    }
  };

  return (
    <main className="developer-auth-page">
      <div className="developer-auth-page__background" />

      <div className="section-container">
        <Link
          to="/"
          className="project-page__back"
        >
          <ArrowLeft size={17} />
          Back to portfolio
        </Link>

        <motion.div
          className="developer-auth"
          initial={{
            opacity: 0,
            y: 35,
            filter: "blur(10px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.75,
          }}
        >
          <div className="developer-auth__header">
            <div className="developer-auth__icon">
              <ShieldCheck size={32} />
            </div>

            <div>
              <p className="section-eyebrow">
                Developer demonstration
              </p>

              <h1>OAuth2 Authentication</h1>

              <p>
                A working Laravel Passport OAuth2
                Authorization Code + PKCE integration
                powering this React application.
              </p>
            </div>
          </div>

          <div className="developer-auth__architecture">
            <div>
              <Code2 />
              <span>React Client</span>
            </div>

            <Network />

            <div>
              <KeyRound />
              <span>OAuth2 / PKCE</span>
            </div>

            <Network />

            <div>
              <ShieldCheck />
              <span>Laravel API</span>
            </div>
          </div>

          <div className="developer-auth__grid">
            <section className="developer-panel">
              <div className="developer-panel__heading">
                <Terminal size={18} />

                <div>
                  <span>AUTHENTICATION</span>
                  <h2>Connection status</h2>
                </div>
              </div>

              <div
                className={`auth-status ${
                  authenticated
                    ? "is-connected"
                    : "is-disconnected"
                }`}
              >
                {authenticated ? (
                  <CheckCircle2 size={22} />
                ) : (
                  <XCircle size={22} />
                )}

                <div>
                  <strong>
                    {authenticated
                      ? "Authenticated"
                      : "Not authenticated"}
                  </strong>

                  <span>
                    {authenticated
                      ? "OAuth2 access token available in this browser session."
                      : "Authenticate to access the protected portfolio API."}
                  </span>
                </div>
              </div>

              {!authenticated ? (
                <button
                  type="button"
                  className="button button--primary button--full"
                  onClick={handleLogin}
                >
                  <LogIn size={17} />
                  Authenticate with Laravel
                </button>
              ) : (
                <button
                  type="button"
                  className="button button--danger button--full"
                  onClick={handleLogout}
                >
                  <LogOut size={17} />
                  Sign out
                </button>
              )}
            </section>

            <section className="developer-panel">
              <div className="developer-panel__heading">
                <Network size={18} />

                <div>
                  <span>PROTECTED API</span>
                  <h2>Live API test</h2>
                </div>
              </div>

              <div className="api-terminal">
                <div className="api-terminal__bar">
                  <span />
                  <span />
                  <span />

                  <code>
                    GET /api/v1/projects
                  </code>
                </div>

                <div className="api-terminal__body">
                  <p>
                    <span>$</span>{" "}
                    Request protected resource
                  </p>

                  <p>
                    <span>→</span>{" "}
                    Bearer token + portfolio:read
                  </p>

                  {apiStatus === "success" && (
                    <p className="is-success">
                      <span>✓</span>{" "}
                      {projectCount} projects returned
                    </p>
                  )}

                  {apiStatus === "error" && (
                    <p className="is-error">
                      <span>×</span>{" "}
                      {error ?? "Request failed"}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="button button--secondary button--full"
                disabled={
                  !authenticated ||
                  apiStatus === "loading"
                }
                onClick={testProtectedApi}
              >
                {apiStatus === "loading" ? (
                  <>
                    <motion.span
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Network size={17} />
                    </motion.span>

                    Requesting...
                  </>
                ) : (
                  <>
                    <Terminal size={17} />
                    Test protected endpoint
                  </>
                )}
              </button>
            </section>
          </div>

          <div className="developer-auth__details">
            <div>
              <UserRound size={16} />
              <span>
                <small>Grant</small>
                Authorization Code
              </span>
            </div>

            <div>
              <KeyRound size={16} />
              <span>
                <small>Security</small>
                PKCE
              </span>
            </div>

            <div>
              <ShieldCheck size={16} />
              <span>
                <small>Scope</small>
                portfolio:read
              </span>
            </div>

            <div>
              <Code2 size={16} />
              <span>
                <small>Client</small>
                React SPA
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}