import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { exchangeCodeForToken } from "../auth/oauth";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("Completing authentication...");

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      setStatus(`Authentication failed: ${error}`);
      return;
    }

    if (!code) {
      setStatus("Authentication failed: No authorization code received.");
      return;
    }

    const authenticate = async () => {
      try {
        await exchangeCodeForToken(code);

        setStatus("Authentication successful.");

        setTimeout(() => {
          navigate("/");
        }, 800);
      } catch (error) {
        console.error(error);

        setStatus(
          error instanceof Error
            ? error.message
            : "Authentication failed.",
        );
      }
    };

    void authenticate();
  }, [navigate, searchParams]);

  return (
    <main>
      <section>
        <h1>Laravel Authentication</h1>

        <p>{status}</p>
      </section>
    </main>
  );
}