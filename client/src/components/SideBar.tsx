import { Brain, Document, Linkicon2, Twitter, YouTube } from "../icons/Icons";


export default function Sidebar() {
  return (
    <aside className="flex flex-col h-screen w-20 bg-[#004dff] text-white">
      <div className="flex-1">
        {/* Logo */}
        <div className="p-2">
        <Brain/>
        </div>
      </div>

      {/* Navigation buttons */}
      <nav className="flex flex-col items-center space-y-4 mb-4">
        {/* Twitter button */}
        <button
          className="p-3 rounded-lg hover:bg-[#0045e6] focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Twitter"
        >
        <Twitter/>
        </button>

        {/* YouTube button */}
        <button
          className="p-3 rounded-lg hover:bg-[#0045e6] focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="YouTube"
        >
          <YouTube/>
        </button>

        {/* Article button */}
        <button
          className="p-3 rounded-lg hover:bg-[#0045e6] focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Articles"
        >
         <Document/>
        </button>

        {/* Link button */}
        <button
          className="p-3 rounded-lg hover:bg-[#0045e6] focus:outline-none focus:ring-2 focus:ring-yellow-500"
          aria-label="Links"
        >
         <Linkicon2/>
        </button>
      </nav>
    </aside>
  )
}

