import { Shareicon, Trashicon, Documenticon, Linkicon } from "../../icons/Icons"; // Import new icons

interface ContentCardProps {
  title: string;
  link: string;
  type: "youtube" | "twitter" | "link" | "document";
  tags: string[];
  onDelete?: () => void;
}

export default function ResponsiveContentCard({
  link,
  title,
  type,
  tags,
}: ContentCardProps) {
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className="w-full max-w-xs bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 mx-auto flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center p-2 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 truncate max-w-[60%]">
          {title}
        </h3>
        <div className="flex items-center space-x-2">
            <a href={link}>
            <Shareicon/>
            </a>
            <Trashicon/>
    
         
        </div>
      </div>

      {/* Media Section */}
      <div className="relative w-full aspect-video bg-gray-100 overflow-hidden min-h-0 min-w-0">
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
          <div className="absolute inset-0 overflow-auto scrollbar-hide">
            <blockquote className="twitter-tweet w-full min-h-full p-2 bg-gray-50 flex items-center justify-center">
              <a
                href={link.replace("x", "twitter")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full flex items-center justify-center text-xs text-gray-700 hover:bg-gray-100 transition-colors"
              >
                View Tweet
              </a>
            </blockquote>
          </div>
        ) : type === "link" ? (
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
        ) : type === "document" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <Documenticon className="w-12 h-12 text-gray-400 mb-2" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
              <a
                href={link}
                download
                className="mt-2 inline-block px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Download Document
              </a>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 p-4">
            Unsupported content type
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="p-2 mt-auto">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-block bg-gray-200 rounded-full px-2 py-0.5 text-xs font-medium text-gray-700 capitalize">
            {type}
          </span>
          <div className="flex flex-wrap gap-1">
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