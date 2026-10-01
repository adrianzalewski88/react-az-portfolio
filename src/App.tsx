import { AnimatePresence, motion } from "motion/react";
import DeveloperAuthenticationPage from "./pages/DeveloperAuthenticationPage";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
    >
      <motion.div
        key={location.pathname}
        className="page-transition"
        initial={{
          opacity: 0,
          y: 18,
          scale: 0.985,
          filter: "blur(8px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        }}
        exit={{
          opacity: 0,
          y: -18,
          scale: 0.985,
          filter: "blur(8px)",
        }}
        transition={{
          duration: 0.42,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Routes location={location}>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/projects/:slug"
            element={<ProjectPage />}
          />
          <Route
            path="/developer/authentication"
            element={<DeveloperAuthenticationPage />}
          />
          <Route
            path="/auth/callback"
            element={<AuthCallbackPage />}
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}