import { useState, useEffect } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  apiCall: () => Promise<{ success: boolean; data?: T; error?: string }>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiCall();

        if (!isCancelled) {
          if (response.success && response.data) {
            setState({ data: response.data, loading: false, error: null });
          } else {
            setState({
              data: null,
              loading: false,
              error: response.error || "Erreur inconnue",
            });
          }
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            data: null,
            loading: false,
            error: "Erreur de connexion",
          });
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, dependencies);

  const refetch = () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    // Relancer l'effet
  };

  return { ...state, refetch };
}
