import Message from "../models/UserChat.js";

// Fetch chat history between two users
export const getChatHistory = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    console.log('Fetching messages between:', senderId, receiverId);

    // Find messages between the two users
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};