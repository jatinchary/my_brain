import { useState } from "react";
import { Button } from "../ui/button";
import { Addicon, Shareicon } from "../../icons/Icons";
import { useContent } from "@/hooks/useContenthook";
import Createcontent from "../Createcontent";
import Cardcomponent from "../ui/CardComponent";
import Sidebar from "../SideBar";

// Define types
interface Content {
  _id: string;
  type: "youtube" | "twitter" | "link" | "document";
  link: string;
  title: string;
  tags: string[];
}

function logout (){
  localStorage.clear()
}

// Separate header component for better organization
const Header = ({ onAddContent }: { onAddContent: () => void }) => (
  <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 mb-6">
    <div className="flex items-center text-xl font-semibold gap-3 mb-4 md:mb-0">
      <span>Brain.ly</span>
    </div>
    
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={onAddContent}
        className="bg-customBlue-dark text-white hover:bg-customBlue-light flex items-center gap-2 px-4 py-2 rounded-lg shadow-md"
      >
        <Addicon />
        Add content
      </Button>

      <Button
        variant="secondary"
        className="bg-customBlue text-black hover:bg-customBlue-light hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-md"
      >
        <Shareicon />
        Share
      </Button>
      <Button
        variant="secondary"
        onClick={logout}
        className="bg-customBlue-dark text-white hover:bg-customBlue-light flex items-center gap-2 px-4 py-2 rounded-lg shadow-md"
      >
      
      Logout
      </Button>
    </div>
  </div>
);

// Separate content grid component
const ContentGrid = ({ contents }: { contents: Content[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {contents.map(({ type, link, title, tags, _id }) => (
      <Cardcomponent
        key={_id}
        id={_id}
        link={link}
        title={title}
        type={type}
        tags={tags}
      />
    ))}
  </div>
);

const MainPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { content } = useContent();

  const handleModalToggle = () => setIsModalOpen(prev => !prev);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Modal */}
      <Createcontent 
        open={isModalOpen} 
        onClose={handleModalClose} 
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4">
        <Header onAddContent={handleModalToggle} />
        <ContentGrid contents={content} />
      </main>
    </div>
  );
};

export default MainPage;