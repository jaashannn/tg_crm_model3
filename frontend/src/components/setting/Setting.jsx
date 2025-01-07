import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [userInfo, setUserInfo] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleIntegrateEmail = () => {
    window.location.href = `https://login.microsoftonline.com/e5430463-8807-41c4-b7e0-f2434bbd3e1d/oauth2/v2.0/authorize?client_id=306fd3ed-5cc1-421a-92aa-6ecab4b62fe4&response_type=code&redirect_uri=${apiUrl}/auth/callback&response_mode=query&scope=Mail.Read Mail.Send User.Read&state=employee`;
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetchUserInfo(accessToken);
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/fetchEmails`, {
        method: 'GET',
        headers: {
          'Authorization': token,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUserInfo(data);
      }
    } catch (error) {
      console.error('Error fetching user info', error);
    }
  };

  return (
    <div className="settings-page p-6">
      <div className="email-integration p-4 shadow bg-white rounded">
        <h2 className="text-lg font-semibold mb-4">Email Integration</h2>
        <p className="text-gray-700 mb-4">
          Integrate your email services to sync notifications, updates, and communication.
        </p>
        {userInfo ? (
          <div>
            <h3>User Info</h3>
            <p>Email: {userInfo.email}</p>
            <p>Name: {userInfo.name}</p>
          </div>
        ) : (
          <button
            onClick={handleIntegrateEmail}
            className="bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded hover:shadow-md"
          >
            Integrate Email
          </button>
        )}
      </div>
    </div>
  );
};

export default Settings;
