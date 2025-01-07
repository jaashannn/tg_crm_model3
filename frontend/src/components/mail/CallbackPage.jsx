// CallbackPage.jsx
import React, { useEffect } from 'react';
import axios from 'axios';

const CallbackPage = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const role = params.get('state'); // "employee" or "admin"
    console.log(code,"code")

    // Send the authorization code to the backend to exchange for an access token
    axios.post('http://localhost:5000/api/auth/exchange', { code, role })
      .then(response => {
        // Store the access token and role (maybe in localStorage or state)
        console.log(response.data);
      })
      .catch(error => console.error('Error during token exchange', error));
  }, []);

  return (
    <div>
      <h2>Processing...</h2>
    </div>
  );
};

export default CallbackPage;
