import { FaUserCircle } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const Header = () => {
  return (
    <div className="bg-gray-800 text-white p-4 flex items-center justify-between shadow-md">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-extrabold tracking-wide">ChatBOX</h1>
      </div>

      {/* Placeholder for Right Section */}
      <div className="flex items-center gap-4">
        {/* Add any additional elements like search or settings */}
        <IoMdSettings className="text-2xl cursor-pointer hover:text-3xl" />
        <FaUserCircle className="text-3xl mx-2 cursor-pointer" />
      </div>
    </div>
  );
};

export default Header;
