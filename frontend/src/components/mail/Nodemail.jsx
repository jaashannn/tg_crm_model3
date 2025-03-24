import { useState } from "react";
import { useForm } from "react-hook-form";
// import { sendEmail } from "../../emailService.js";
import { toast } from "react-hot-toast";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

const Email = ({ userId }) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await sendEmail({ userId, ...data });
      toast.success("Email sent successfully!");
      reset();
    } catch (error) {
      toast.error(error.message || "Failed to send email.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📧 Send an Email</h2>

        {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-gray-600 font-medium block mb-1">To</label>
            <input
              {...register("to")}
              type="email"
              placeholder="Enter recipient's email"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-gray-600 font-medium block mb-1">Subject</label>
            <input
              {...register("subject")}
              type="text"
              placeholder="Enter email subject"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-gray-600 font-medium block mb-1">Message</label>
            <textarea
              {...register("text")}
              placeholder="Write your message..."
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center items-center gap-2 font-semibold text-lg hover:bg-blue-700 transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Email"}
            {!loading && <PaperAirplaneIcon className="w-5 h-5 text-white" />}
          </button>
        </form> */}
      </div>
    </div>
  );
};

export default Email;
