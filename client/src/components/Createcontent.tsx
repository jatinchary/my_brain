import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "lucide-react";
import axios from "axios";
import { BACKEND_URL }from "../../config" // Fixed typo in import name

interface CreateContentProps {
  open: boolean;
  onClose: () => void;
}

interface ContentSubmissionData {
  title: string;
  link: string;
  tags: string[];
  type: string;
}

interface ContentSubmissionFormProps {
  onSubmit: (data: ContentSubmissionData) => Promise<void>;
}

function ContentSubmissionForm({ onSubmit }: ContentSubmissionFormProps) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");
  const [type, setType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const submissionData: ContentSubmissionData = {
        title: title.trim(),
        link: link.trim(),
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        type,
      };

      await onSubmit(submissionData);
      setSuccess(true);
      
      // Only reset form if submission was successful
      setTitle("");
      setLink("");
      setTags("");
      setType("");
      
      // Auto-close the success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit content. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Submit Content</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
          <AlertDescription>Content submitted successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter content title"
          />
        </div>

        <div>
          <label
            htmlFor="link"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Link *
          </label>
          <input
            type="url"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="React, JavaScript, Tutorial"
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content Type *
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            
            <option value="document">Document</option>
            <option value="youtube">YouTube</option>
            <option value="twitter">Twitter</option>
            <option value="link">Link</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Content"
          )}
        </button>
      </div>
    </form>
  );
}

export default function CreateContent({ open, onClose }: CreateContentProps) {
  const handleSubmission = async (data: ContentSubmissionData) => {
    const Token = localStorage.getItem('Token');
    console.log('Token:', localStorage.getItem('Token'));
    
    if (!Token) {
      throw new Error('Authentication required. Please log in.');
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/content`, 
        data,
        {
          headers: {
            "Authorization": `Bearer ${Token.trim()}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data) {
        console.log("Content submitted successfully:", response.data);
        onClose();
     
        return response.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle specific status codes
        if (error.response?.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        if (error.response?.status === 403) {
          throw new Error('You do not have permission to perform this action.');
        }
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
      }
      throw error;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-60 z-50">
      <div className="relative bg-white rounded-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-2"
          aria-label="Close modal"
        >
          ✕
        </button>
        <ContentSubmissionForm onSubmit={handleSubmission} />
      </div>
    </div>
  );
}