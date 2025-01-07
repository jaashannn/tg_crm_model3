import React, { useEffect, useState } from "react";

const EmailIntegration = ({ accessToken }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  // Fetch emails
  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://graph.microsoft.com/v1.0/me/messages", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setEmails(data.value || []);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send email
  const sendEmail = async () => {
    if (!recipient || !subject || !body) {
      alert("Please fill in all fields before sending.");
      return;
    }

    try {
      const response = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            subject: subject,
            body: {
              contentType: "Text",
              content: body,
            },
            toRecipients: [
              {
                emailAddress: { address: recipient },
              },
            ],
          },
        }),
      });

      if (response.ok) {
        alert("Email sent successfully!");
        setRecipient("");
        setSubject("");
        setBody("");
      } else {
        const error = await response.json();
        console.error("Error sending email:", error);
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Fetch emails on component mount
  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className="email-integration p-6">
      {/* Fetch Emails Section */}
      <div className="emails bg-white p-4 shadow rounded mb-6">
        <h2 className="text-lg font-semibold mb-4">Inbox</h2>
        {loading ? (
          <p>Loading emails...</p>
        ) : emails.length ? (
          <ul className="space-y-4">
            {emails.map((email) => (
              <li key={email.id} className="border-b pb-4">
                <p className="font-semibold">{email.subject}</p>
                <p className="text-gray-500">
                  From: {email.from?.emailAddress?.address}
                </p>
                <p className="text-gray-500">
                  Received: {new Date(email.receivedDateTime).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No emails found.</p>
        )}
      </div>

      {/* Send Email Section */}
      <div className="send-email bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-4">Send Email</h2>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Recipient Email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
          />
          <textarea
            placeholder="Message"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="border p-2 w-full rounded"
            rows="5"
          />
        </div>
        <button
          onClick={sendEmail}
          className="bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded hover:shadow-md"
        >
          Send Email
        </button>
      </div>
    </div>
  );
};

export default EmailIntegration;
