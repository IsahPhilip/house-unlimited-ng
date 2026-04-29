"use client";

import { useEffect, useState } from "react";

const query = `{
  generalSettings {
    title
  }
}`;

const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT;

export function GraphQLHealthCheck() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Checking GraphQL endpoint...");

  useEffect(() => {
    if (!endpoint) {
      setStatus("error");
      setMessage("WPGraphQL endpoint is not configured.");
      return;
    }

    async function check() {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (result.errors?.length) {
          throw new Error(result.errors.map((error: any) => error.message).join("; "));
        }

        if (result.data?.generalSettings?.title) {
          setStatus("success");
          setMessage(`GraphQL endpoint is reachable: ${result.data.generalSettings.title}`);
        } else {
          setStatus("error");
          setMessage("GraphQL endpoint responded but did not return generalSettings.title.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(`GraphQL health check failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    check();
  }, []);

  const statusClasses = {
    loading: "bg-blue-50 text-blue-700 border-blue-100",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    error: "bg-rose-50 text-rose-700 border-rose-100"
  };

  return (
    <div className={`rounded-3xl border p-4 ${statusClasses[status]} shadow-sm`}> 
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">WPGraphQL Health Check</p>
          <p className="text-xs sm:text-sm text-current">{message}</p>
        </div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em]">
          {status === "loading" ? "Checking…" : status === "success" ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
}
