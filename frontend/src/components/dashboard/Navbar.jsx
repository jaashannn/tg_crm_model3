import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Logo from "../../assets/icon.ico";
import { FaUsersCog, FaBell, FaComment, FaPaperPlane, FaSearch, FaPlus, FaUserPlus, FaTasks, FaArrowLeft } from "react-icons/fa";
import toast from 'react-hot-toast';
import axios from 'axios';
import { io } from "socket.io-client";

const socket = io('http://localhost:5001'); // Replace with your backend URL

function Navbar() {
  const { user, logout } = useAuth();
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  
  const messagesEndRef = useRef(null);
   // Define refs for dropdowns
    const cardRef = useRef(null);
    const cardButtonRef = useRef(null);
    const notificationRef = useRef(null);  // Initialize notificationRef
  const apiUrl = import.meta.env.VITE_API_URL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch notifications
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/notification/${user._id}`);
        setNotifications(res.data.data);
        const unread = res.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchNotifications();

    socket.emit("join", user._id);

    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast.info(notification.message);
    });

    return () => {
      socket.off("newNotification");
    };
  }, [user._id]);

  // Fetch all users (employees and admins) for chat
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await axios.get(`${apiUrl}/api/employee`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsers(response.data.employees.filter(u => u._id !== user._id)); // Exclude logged-in user
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [user._id]);

  // Emit login event when user is available
  useEffect(() => {
    if (user && user._id) {
      console.log("entered in user and user._id");
      socket.emit('login', user._id);
      console.log('Emitted login event with userId:', user._id);
    }
  }, [user]);

  // Select a user to chat with
  const selectUser = (userId) => {
    setSelectedUser(userId);
    fetchChatHistory(userId);
  };

  // Fetch chat history for the selected user
  const fetchChatHistory = async (userId) => {
    setIsLoadingMessages(true);
    try {
      const response = await axios.get(`http://localhost:5001/api/chat/messages/${user._id}/${userId}`);
      setMessages(response.data);
      console.log('Fetched chat history:', response.data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast.error('Failed to fetch chat history');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Send a message
  const sendMessage = () => {
    if (message.trim() === '') {
      toast.error('Message cannot be empty');
      return;
    }

    const newMessage = {
      senderId: user._id,
      receiverId: selectedUser,
      message: message,
    };

    socket.emit('sendMessage', newMessage);
    console.log('Emitted sendMessage event:', newMessage);

    // Optimistically update the UI
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...newMessage, timestamp: new Date().toISOString() },
    ]);
    setMessage('');
  };

  // Listen for incoming messages
  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      console.log('Received message:', data);
      if (data.senderId === selectedUser) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedUser]);

  // Handle logout
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
  };

  // Toggle card visibility
  const toggleCard = () => {
    setIsCardOpen(!isCardOpen);
  };

  // Toggle quick actions dropdown
  const toggleQuickActions = () => {
    setIsQuickActionsOpen(!isQuickActionsOpen);
  };

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setUnreadCount(0);
    axios.put(`${apiUrl}/api/notification/mark-all-read/${user._id}`);
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    await axios.put(`${apiUrl}/api/notification/read/${id}`);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
  };

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cardRef.current && !cardRef.current.contains(event.target) &&
        !cardButtonRef.current.contains(event.target)
      ) {
        setIsCardOpen(false);
      }
      if (
        notificationRef.current && !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="bg-white">
        <div className="flex-col flex">
          <div className="w-full border-b-2 border-gray-200">
            <div className="bg-white h-16 justify-between items-center mx-auto px-4 flex">
              <div>
                <img src={Logo} className="block h-8 w-auto" alt="Logo" />
              </div>

              {/* Search Input */}
              <div className="lg:block mr-auto ml-40 hidden relative max-w-xs">
                <p className="pl-3 items-center flex absolute inset-y-0 left-0 pointer-events-none">
                  <span className="justify-center items-center flex">
                    <FaSearch className="w-5 h-5 text-gray-400" />
                  </span>
                </p>
                <input
                  placeholder="Type to search"
                  type="search"
                  className="border border-gray-300 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm w-full rounded-lg pt-2 pb-2 pl-10 px-3"
                />
              </div>

              {/* Icons Section */}
              <div className="md:space-x-6 justify-end items-center ml-auto flex space-x-3">
                {/* Chat Icon */}
                <button
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className="p-2 text-gray-700 hover:bg-gray-200 rounded-md relative"
                >
                  <FaComment className="w-6 h-6" />
                </button>

                {/* Quick Actions Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleQuickActions}
                    className="flex items-center px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    <FaPlus className="mr-2" />
                    Quick Actions
                  </button>
                  {isQuickActionsOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-300 z-50">
                      <ul className="py-2">
                        <li className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200" onClick={() => toast.info('Create Contact action triggered!')}>
                          <FaUserPlus className="inline-block mr-2" />
                          Create Contact
                        </li>
                        <li className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200" onClick={() => toast.info('Assign Lead action triggered!')}>
                          <FaTasks className="inline-block mr-2" />
                          Assign Lead
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Notification Bell Icon */}
                <div className="relative cursor-pointer" onClick={toggleNotifications} ref={notificationRef}>
                  <FaBell className="h-5 w-5 text-gray-800" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                      {unreadCount}
                    </span>
                  )}
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md border border-gray-300 z-50 p-2">
                      <h3 className="font-semibold text-sm p-2">Notifications</h3>
                      {notifications.length === 0 ? (
                        <p className="text-gray-500 text-sm p-2">No notifications</p>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif._id} className={`p-2 text-sm ${notif.isRead ? "text-gray-500" : "text-black font-bold"}`}>
                            <p>{notif.message}</p>
                            {!notif.isRead && (
                              <button className="text-blue-500 text-xs" onClick={() => markAsRead(notif._id)}>
                                Mark as Read
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Icon and Dropdown */}
                <div className="justify-center items-center flex relative cursor-pointer" onClick={toggleCard} ref={cardButtonRef}>
                  <FaUsersCog className="h-12 w-12 rounded-full bg-white text-gray-800 p-2" />
                  <p className="font-semibold text-sm">{user.name}</p>
                  {isCardOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-300 z-50" ref={cardRef}>
                      <ul className="py-2">
                        <li className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200" onClick={handleLogout}>
                          Logout
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isChatOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              {selectedUser ? (
                <span className="flex items-center">
                  <FaArrowLeft
                    className="mr-2 cursor-pointer hover:text-indigo-500"
                    onClick={() => setSelectedUser(null)}
                  />
                  Chat with {users.find(u => u._id === selectedUser)?.name}
                </span>
              ) : "Chat"}
            </h2>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* User List */}
            {!selectedUser ? (
              <div className="space-y-2">
                {isLoadingUsers ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-gray-500">No users available</p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => selectUser(user._id)}
                      className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                      <p className="ml-2 text-gray-800">{user.name}</p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.length === 0 && !isLoadingMessages && (
                  <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.timestamp}
                    className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${msg.senderId === user._id
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                        }`}
                    >
                      <p>{msg.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
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
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600"
                />
                <button
                  onClick={sendMessage}
                  className="ml-2 p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >
                  <FaPaperPlane className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;