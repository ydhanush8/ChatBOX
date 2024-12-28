import { useState } from "react";

const Sidebar = ({ setCurrentChat }) => {
  const [boxes, setBoxes] = useState([
    { name: "Work", chats: [] },
    { name: "Personal", chats: [] },
  ]);
  const [chats, setChats] = useState(["Chat 1", "Chat 2", "Chat 3"]);
  const [showBoxModal, setShowBoxModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [newBoxName, setNewBoxName] = useState("");
  const [newChatName, setNewChatName] = useState("");
  const [editBoxIndex, setEditBoxIndex] = useState(null);
  const [editChatIndex, setEditChatIndex] = useState(null);

  const handleChatClick = (chat) => {
    setCurrentChat(chat);
  };

  const handleDragStart = (chat, source) => {
    localStorage.setItem("draggedChat", JSON.stringify({ chat, source }));
  };

  const handleDropToBox = (boxIndex) => {
    const draggedItem = JSON.parse(localStorage.getItem("draggedChat"));
    if (!draggedItem) return;

    if (draggedItem.source === "main") {
      setChats((prev) => prev.filter((chat) => chat !== draggedItem.chat));
    } else {
      setBoxes((prev) =>
        prev.map((box, index) =>
          index === draggedItem.source
            ? {
                ...box,
                chats: box.chats.filter((c) => c !== draggedItem.chat),
              }
            : box
        )
      );
    }

    setBoxes((prev) =>
      prev.map((box, index) =>
        index === boxIndex
          ? { ...box, chats: [...box.chats, draggedItem.chat] }
          : box
      )
    );

    localStorage.removeItem("draggedChat");
  };

  const handleDropToMain = () => {
    const draggedItem = JSON.parse(localStorage.getItem("draggedChat"));
    if (!draggedItem) return;

    if (draggedItem.source !== "main") {
      setBoxes((prev) =>
        prev.map((box, index) =>
          index === draggedItem.source
            ? {
                ...box,
                chats: box.chats.filter((c) => c !== draggedItem.chat),
              }
            : box
        )
      );

      setChats((prev) => [...prev, draggedItem.chat]);
    }

    localStorage.removeItem("draggedChat");
  };

  const addBox = () => {
    if (newBoxName.trim() === "") {
      alert("Box name cannot be empty!");
      return;
    }

    if (editBoxIndex !== null) {
      setBoxes((prev) =>
        prev.map((box, index) =>
          index === editBoxIndex ? { ...box, name: newBoxName } : box
        )
      );
      setEditBoxIndex(null);
    } else {
      setBoxes([...boxes, { name: newBoxName, chats: [] }]);
    }

    setNewBoxName("");
    setShowBoxModal(false);
  };

  const addChat = () => {
    if (newChatName.trim() === "") {
      alert("Chat name cannot be empty!");
      return;
    }

    if (editChatIndex !== null) {
      setChats((prev) =>
        prev.map((chat, index) =>
          index === editChatIndex ? newChatName : chat
        )
      );
      setEditChatIndex(null);
    } else {
      setChats([...chats, newChatName]);
    }

    setNewChatName("");
    setShowChatModal(false);
  };

  const deleteBox = (index) => {
    setBoxes((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteChat = (index) => {
    setChats((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-lg font-bold mb-4">Boxes</h2>
      <ul>
        {boxes.map((box, index) => (
          <li
            key={index}
            className="p-2 mb-2 rounded hover:bg-gray-700 border border-dashed flex flex-col items-start"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDropToBox(index)}
          >
            <div className="flex justify-between w-full">
              <span>{box.name}</span>
              <div className="flex space-x-2">
                <button
                  className="text-gray-400 hover:text-gray-300"
                  onClick={() => {
                    setNewBoxName(box.name);
                    setEditBoxIndex(index);
                    setShowBoxModal(true);
                  }}
                >
                  ✏️
                </button>
                <button
                  className="text-gray-400 hover:text-gray-300"
                  onClick={() => deleteBox(index)}
                >
                  🗑️
                </button>
              </div>
            </div>
            <ul className="ml-4 mt-2 text-sm">
              {box.chats.map((chat, idx) => (
                <li
                  key={idx}
                  className="p-1 bg-gray-600 rounded hover:bg-gray-500 cursor-pointer"
                  draggable
                  onClick={() => handleChatClick(chat)}
                  onDragStart={() => handleDragStart(chat, index)}
                >
                  {chat}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <button
        className="w-full bg-gray-700 p-2 rounded hover:bg-gray-600 mt-4"
        onClick={() => setShowBoxModal(true)}
      >
        + Add Box
      </button>

      <h2 className="text-lg font-bold mt-8 mb-4">Chats</h2>
      <ul
        className="border border-dashed p-2"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropToMain}
      >
        {chats.map((chat, index) => (
          <li
            key={index}
            className="p-2 mb-2 rounded hover:bg-gray-700 cursor-pointer flex justify-between items-center"
            draggable
            onClick={() => handleChatClick(chat)}
            onDragStart={() => handleDragStart(chat, "main")}
          >
            <span>{chat}</span>
            <div className="flex space-x-2">
              <button
                className="text-gray-400 hover:text-gray-300"
                onClick={() => {
                  setNewChatName(chat);
                  setEditChatIndex(index);
                  setShowChatModal(true);
                }}
              >
                ✏️
              </button>
              <button
                className="text-gray-400 hover:text-gray-300"
                onClick={() => deleteChat(index)}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="w-full bg-gray-700 p-2 rounded hover:bg-gray-600 mt-4"
        onClick={() => setShowChatModal(true)}
      >
        + New Chat
      </button>

      {/* Modal for Adding/Editing Box */}
      {showBoxModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">
              {editBoxIndex !== null ? "Edit Box" : "Create New Box"}
            </h3>
            <input
              type="text"
              value={newBoxName}
              onChange={(e) => setNewBoxName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addBox();
                }
              }}
              placeholder="Box Name"
              className="w-full p-2 border rounded mb-4 text-white bg-gray-800"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 p-2 rounded hover:bg-gray-600"
                onClick={() => setShowBoxModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 p-2 rounded hover:bg-blue-600 text-white"
                onClick={addBox}
              >
                {editBoxIndex !== null ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding/Editing Chat */}
      {showChatModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">
              {editChatIndex !== null ? "Edit Chat" : "Create New Chat"}
            </h3>
            <input
              type="text"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addChat();
                }
              }}
              placeholder="Chat Name"
              className="w-full p-2 border rounded mb-4 text-white  bg-gray-800"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 p-2 rounded hover:bg-gray-600"
                onClick={() => setShowChatModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 p-2 rounded hover:bg-green-600 text-white"
                onClick={addChat}
              >
                {editChatIndex !== null ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;