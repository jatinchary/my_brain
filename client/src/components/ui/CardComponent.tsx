import { useDeleteContent } from "../../hooks/useDeleteContent";
import { Shareicon, Trashicon, Documenticon, Linkicon } from "../../icons/Icons";
// import { BACKEND_URL } from "../../../config";

interface ContentCardProps {
  id: string;
  title: string;
  link: string;
  type: "youtube" | "twitter" | "link" | "document";
  tags: string[];
  onDeleteSuccess?: () => void;
}

export default function ResponsiveContentCard({
  id,
  title,
  link,
  type,
  tags,
  onDeleteSuccess,
}: ContentCardProps) {
  const { deleteContent, isDeleting, error } = useDeleteContent();

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const handleDelete = () => {
    deleteContent(id,  { onSuccess: onDeleteSuccess });
  };

  return (
    <div className="w-full max-w-xs bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mx-auto flex flex-col">
      <div className="flex justify-between items-center p-2 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 truncate max-w-[60%]">{title}</h3>
        <div className="flex items-center space-x-2">
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Shareicon />
          </a>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`hover:text-red-600 transition-colors ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label="Delete content"
          >
            <Trashicon />
          </button>
        </div>
      </div>

      <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
        {type === "youtube" && (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={link.replace("watch", "embed").replace("?v=", "/")}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
        {type === "twitter" && (
          <blockquote className="twitter-tweet w-full h-full flex items-center justify-center">
            <a href={link.replace("x", "twitter")} target="_blank" rel="noopener noreferrer">
              View Tweet
            </a>
          </blockquote>
        )}
        {type === "link" && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex flex-col items-center justify-center p-4 hover:bg-gray-50 transition-colors"
          >
            <Linkicon className="w-12 h-12 text-gray-400 mb-2" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
              <p className="text-xs text-gray-500 mt-1">{getDomain(link)}</p>
            </div>
          </a>
        )}
        {type === "document" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <Documenticon className="w-12 h-12 text-gray-400 mb-2" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
              <a
                href={link}
                download
                className="mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Download Document
              </a>
            </div>
          </div>
        )}
        {!["youtube", "twitter", "link", "document"].includes(type) && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            Unsupported content type
          </div>
        )}
      </div>

      <div className="p-2 mt-auto">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="bg-gray-200 rounded-full px-2 py-0.5 text-xs font-medium text-gray-700 capitalize">
            {type}
          </span>
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 rounded-full px-2 py-0.5 text-xs text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
}
