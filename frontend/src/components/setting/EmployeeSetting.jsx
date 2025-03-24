import React, { useState } from "react";
// import { useMsal, useIsAuthenticated } from "@azure/msal-react";
// import { loginRequest } from "../../authConfig"; // Ensure you have an authConfig.js file for MSAL setup
// import { callMsGraph } from '../../graph';
const Settings = () => {
    // const { instance, accounts } = useMsal();
    // const isAuthenticated = useIsAuthenticated();
    const [userInfo, setUserInfo] = useState(null);

    // Function to handle login
    const handleLogin = (loginType) => {
        // if (loginType === "popup") {
        //     instance.loginPopup(loginRequest).catch((e) => console.error(e));
        // } else if (loginType === "redirect") {
        //     instance.loginRedirect(loginRequest).catch((e) => console.error(e));
        // }
    };

    // Function to handle logout
    const handleLogout = (logoutType) => {
        // if (logoutType === "popup") {
        //     instance.logoutPopup({
        //         postLogoutRedirectUri: "/settings",
        //         mainWindowRedirectUri: "/settings",
        //     });
        // } else if (logoutType === "redirect") {
        //     instance.logoutRedirect({
        //         postLogoutRedirectUri: "/settings",
        //     });
        // }
    };

    // // Function to fetch user info
    // const fetchUserInfo = () => {
    //     if (accounts.length > 0) {
    //         instance
    //             .acquireTokenSilent({
    //                 ...loginRequest,
    //                 account: accounts[0],
    //             })
    //             .then((response) => {
    //               console.log(response.accessToken,"its access token");
    //                 // Call your backend API or Microsoft Graph API
    //                 callMsGraph(response.accessToken).then((response) => setUserInfo(response));
    //                 console.log(userInfo,"its user info")
    //             })
    //             .catch((e) => console.error(e));
    //     }
    // };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar
            <nav className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
                <h1 className="text-lg font-bold">CRM Settings</h1>
                <div>
                    {isAuthenticated ? (
                        <div className="relative inline-block">
                            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow">
                                Account
                            </button>
                            <div className="absolute right-0 mt-2 bg-white text-gray-800 shadow-lg rounded-md">
                                <button
                                    className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                                    onClick={() => handleLogout("popup")}
                                >
                                    Logout (Popup)
                                </button>
                                <button
                                    className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                                    onClick={() => handleLogout("redirect")}
                                >
                                    Logout (Redirect)
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative inline-block">
                            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow">
                                Login
                            </button>
                            <div className="absolute right-0 mt-2 bg-white text-gray-800 shadow-lg rounded-md">
                                <button
                                    className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                                    onClick={() => handleLogin("popup")}
                                >
                                    Login (Popup)
                                </button>
                                <button
                                    className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                                    onClick={() => handleLogin("redirect")}
                                >
                                    Login (Redirect)
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            {/* <div className="max-w-4xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h2>
                <p className="text-gray-600 mb-6">Manage your CRM settings and user account information here.</p>

                {isAuthenticated ? (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Welcome, {accounts[0]?.name}</h3>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                            onClick={fetchUserInfo}
                        >
                            Fetch User Info
                        </button>
                        {userInfo && (
                            <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow">
                                <p className="text-gray-800">
                                    <strong>Email:</strong> {userInfo.userPrincipalName}
                                </p>
                                <p className="text-gray-800">
                                    <strong>First Name:</strong> {userInfo.givenName}
                                </p>
                                <p className="text-gray-800">
                                    <strong>Last Name:</strong> {userInfo.surname}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-600">Please log in to view and manage your account details.</p>
                )}
            </div> */} 
        </div>
    );
};

export default Settings;
