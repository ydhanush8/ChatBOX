import { useState } from "react";

const ChatArea = ({ currentChat }) => {
  const [messages, setMessages] = useState({
    "Chat 1": ["Hello!", "How are you?", "What are you doing?"],
    "Chat 2": ["Hey!", "Let's catch up soon."],
    "Chat 3": ["Hi there!", "Long time no see."],
  });
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFromOllama = async (message) => {
    try {
      const response = await fetch("http://127.0.0.1:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.1:8b",
          prompt: message,
        }),
      });

      if (!response.ok) {
        console.error("Error from Ollama API:", response.statusText);
        return "An error occurred while fetching the response.";
      }

      // Use response.body for streaming updates
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // Decode the chunk and process
        const chunk = decoder.decode(value);
        const json = JSON.parse(chunk);
        fullResponse += json.response || "";

        if (json.done) {
          break;
        }
      }

      return fullResponse || "No response generated.";
    } catch (error) {
      console.error("Error fetching response:", error);
      return "A network error occurred.";
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    setMessages((prevMessages) => ({
      ...prevMessages,
      [currentChat]: [
        ...(prevMessages[currentChat] || []),
        `You: ${newMessage}`,
      ],
    }));

    setNewMessage("");
    setLoading(true);

    try {
      const botResponse = await fetchFromOllama(newMessage);

      setMessages((prevMessages) => ({
        ...prevMessages,
        [currentChat]: [
          ...(prevMessages[currentChat] || []),
          `Bot: ${botResponse}`,
        ],
      }));
    } catch (error) {
      console.error("Error while fetching bot response:", error);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [currentChat]: [
          ...(prevMessages[currentChat] || []),
          "Bot: An error occurred. Please try again later.",
        ],
      }));
    }

    setLoading(false);
  };

  return (
    <div className="flex-1 bg-gray-900 text-white flex flex-col p-4">
      {currentChat ? (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-200">{currentChat}</h2>
          </div>
          <div className="flex-1 overflow-y-auto mb-4">
            <ul>
              {(messages[currentChat] || []).map((msg, index) => (
                <li
                  key={index}
                  className={`mb-2 p-2 rounded ${
                    index % 2 === 0
                      ? "bg-gray-800 text-gray-200"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {msg}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded mr-2 bg-gray-800 text-gray-200 placeholder-gray-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </>
      ) : (
        <div className="text-gray-500 flex items-center justify-center h-full">
          Select a chat to view messages
        </div>
      )}
    </div>
  );
};

export default ChatArea;
