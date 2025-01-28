import { Shareicon, Trashicon } from "../../icons/Icons";

interface ContentCardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube";
  tags: string[];
  onDelete?: () => void;
}

export default function ResponsiveContentCard({
  link,
  title,
  type,
  tags,
//   onDelete,
}: ContentCardProps) {
  return (
    <div className="w-full max-w-xs bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center p-2 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 truncate max-w-[60%]">
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          {/* {onDelete && (
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-600 transition-colors"
              aria-label="Delete content"
            > */}
              <Trashicon  />
            {/* </button> */}
          {/* )} */}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 transition-colors"
            aria-label="Share content"
          >
            <Shareicon  />
          </a>
        </div>
      </div>

      {/* Media Section */}
      <div className="relative w-full aspect-video">
        {type === "youtube" ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={link.replace("watch", "embed").replace("?v=", "/")}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : type === "twitter" ? (
          <blockquote className="twitter-tweet p-2 bg-gray-50 rounded-lg text-xs text-gray-700">
            <a href={link.replace("x", "twitter")} target="_blank" rel="noopener noreferrer">
              View Tweet
            </a>
          </blockquote>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 p-4">
            Unsupported content type
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="p-2">
        <div className="flex flex-wrap items-center justify-between">
          <span className="inline-block bg-gray-200 rounded-full px-2 py-0.5 text-xs font-medium text-gray-700 capitalize">
            {type}
          </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
