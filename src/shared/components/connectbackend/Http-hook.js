import { useCallback, useEffect, useRef, useState } from "react";

// ✅ Centralized API base URL (with safe fallback)
const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://mernapp-6uvs.onrender.com/api";

export const useHttpClient = () => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      setIsLoading(true);

      // ✅ Normalize URL (absolute OR relative)
      const fullUrl = url.startsWith("http")
        ? url
        : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;

      try {
        const response = await fetch(fullUrl, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal
        });

        const responseData = await response.json();

        // remove completed request
        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message || "Request failed");
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        if (err.name === "AbortError") {
          setIsLoading(false);
          return;
        }

        setError(err.message || "Something went wrong");
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { sendRequest, error, isLoading, clearError };
};
