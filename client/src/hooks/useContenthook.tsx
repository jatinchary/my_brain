import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useEffect, useState } from "react";

export function useContent() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const Token = localStorage.getItem('Token');
    const controller = new AbortController();

    const fetchContent = async () => {
      try {
        if (!Token) {
          throw new Error("No authentication token found");
          
        }

        const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
          headers: {
            "Authorization": `Bearer ${Token.trim()}`,
            "Content-Type": "application/json"
          },
          signal: controller.signal
        });

        setContent(response.data || []);
        console.log(response.data);
        
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Failed to fetch content");
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    return () => {
      controller.abort();
    };
  }, []);

  return { content, loading, error };
}