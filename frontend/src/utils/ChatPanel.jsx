import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5001"); // Connect to the backend

const ChatPanel = ({ isOpen, onClose }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", avatar: "https://via.placeholder.com/40" },
    { id: 2, name: "Jane Smith", avatar: "https://via.placeholder.com/40" },
    { id: 3, name: "Alice Johnson", avatar: "https://via.placeholder.com/40" },
  ]);

  const messagesEndRef = useRef(null);

  // Fetch chat history when a user is selected
  useEffect(() => {
    if (selectedUser) {
      axios
        .get(`http://localhost:5001/api/chat/messages/1/${selectedUser}`) // Replace `1` with the logged-in user's ID
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          console.error("Error fetching chat history:", error);
        });
    }
  }, [selectedUser]);

  // Scroll to the bottom of the chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Send a message
  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      senderId: 1, // Replace with the logged-in user's ID
      receiverId: selectedUser,
      message: message,
    };

    socket.emit("sendMessage", newMessage);
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...newMessage, timestamp: new Date().toISOString() },
    ]);
    setMessage("");
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Chat</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* User List */}
          {!selectedUser && (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user.id)}
                  className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                >
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <p className="ml-2 text-gray-800 dark:text-gray-200">{user.name}</p>
                </div>
              ))}
            </div>
          )}

          {/* Messages */}
          {selectedUser && (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.timestamp}
                  className={`flex ${msg.senderId === 1 ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.senderId === 1
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-300 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Chat Footer */}
        {selectedUser && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={sendMessage}
                className="ml-2 p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;