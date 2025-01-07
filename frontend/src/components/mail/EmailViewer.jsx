import React from "react";

const EmailViewer = ({ email }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800">{email.subject}</h2>
      <p className="text-sm text-gray-600">
        <strong>From:</strong> {email.sender}
      </p>
      <p className="text-sm text-gray-600">
        <strong>To:</strong> {email.recipients.join(", ")}
      </p>
      <div
        className="mt-4 p-4 border rounded-md bg-gray-50"
        dangerouslySetInnerHTML={{ __html: email.body }}
      ></div>
    </div>
  );
};

export default EmailViewer;
