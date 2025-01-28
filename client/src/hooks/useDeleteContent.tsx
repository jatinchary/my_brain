import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";

interface UseDeleteContentOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useDeleteContent() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteContent = async (id: string,  options: UseDeleteContentOptions = {}) => {
    const { onSuccess, onError } = options;

    if (!window.confirm("Are you sure you want to delete this content?")) return;

    setIsDeleting(true);
    setError(null);

    try {
      const Token = localStorage.getItem("token");
      if (!Token) throw new Error("Authentication required. Please log in.");

      await axios.delete(`${BACKEND_URL}/api/v1/content/${id}`, {
        headers: {
          Authorization: `Bearer ${Token.trim()}`,
          "Content-Type": "application/json",
        },
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
        if (errorMessage.includes("token")) {
          localStorage.removeItem("token");
          errorMessage = "Your session has expired. Please log in again.";
        }
      }
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteContent, isDeleting, error };
}
