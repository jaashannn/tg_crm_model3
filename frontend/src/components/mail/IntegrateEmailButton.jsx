// IntegrateEmailButton.jsx
import React from 'react';

const IntegrateEmailButton = ({ role }) => {
  const handleIntegrateEmail = () => {
    // Redirect to Microsoft's OAuth2.0 authorization endpoint with the role (employee/admin)
    window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=306fd3ed-5cc1-421a-92aa-6ecab4b62fe4&response_type=code&redirect_uri=http://localhost:5000/auth/callback&response_mode=query&scope=Mail.Read Mail.Send User.Read&state=${role}`;
  };

  return (
    <button onClick={handleIntegrateEmail}>
      Integrate Email
    </button>
  );
};

export default IntegrateEmailButton;
