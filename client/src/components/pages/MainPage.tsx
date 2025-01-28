
import { useState } from "react";
import Createcontent from "../Createcontent";
import { Button } from "../ui/button";
import Cardcomponent from "../ui/CardComponent";
import { Addicon, Shareicon } from "../../icons/Icons";
import Sidebar from "../SideBar";
const MainPage = () => {
    const [modalOpen, setModalopen] = useState(false);
    return (
      <>
      {/* <SignIn/> */}
        <Createcontent open={modalOpen} onClose={() => setModalopen(false)} />
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* Sidebar Section */}
          <Sidebar />
  
          {/* Main Content */}
          <div className="flex-1 flex flex-col p-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 mb-6">
              {/* Title Section */}
              <div className="flex items-center text-xl font-semibold gap-3 mb-4 md:mb-0">
               
                <span>Brainly</span>
              </div>
  
              {/* Buttons Section */}
              <div className="flex flex-wrap gap-4">
                {/* Add Content Button */}
                <Button
                  onClick={() => setModalopen(!modalOpen)}
                  className="bg-customBlue-dark text-white hover:bg-customBlue-light flex items-center gap-2 px-4 py-2 rounded-lg shadow-md"
                >
                  <Addicon />
                  Add content
                </Button>
  
                {/* Share Button */}
                <Button
                  variant="secondary"
                  className="bg-customBlue text-black hover:bg-customBlue-light hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-md"
                >
                  <Shareicon />
                  Share
                </Button>
              </div>
            </div>
  
            {/* Card Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Cardcomponent
                link="https://www.youtube.com/watch?v=tg_Qmigw3pU"
                title="Sample Title"
                type="youtube"
                tags={["sample", "test"]}
              />
              <Cardcomponent
                link="https://x.com/04Acgsilva/status/1883516421948559829"
                title="Sample Title"
                type="twitter"
                tags={["sample", "test"]}
              />
            </div>
          </div>
        </div>
      </>
    );
}

export default MainPage