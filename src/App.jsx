import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import Header from "./components/Header";

const App = () => {
  const [currentChat, setCurrentChat] = useState(null);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
      {/* Header Section */}
      <Header />

      {/* Main Content Section */}
      <div className="flex flex-1">
        <Sidebar setCurrentChat={setCurrentChat} />
        <ChatArea currentChat={currentChat} />
      </div>
    </div>
  );
};

export default App;
