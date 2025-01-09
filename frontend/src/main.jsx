import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import AuthContext from './context/authContext.jsx';
import { Toaster } from 'react-hot-toast'; // Import Toaster
import Footer from './components/Footer/Footer';  // Import Footer

createRoot(document.getElementById('root')).render(
  <AuthContext>
    <>
      {/* Show this for desktop screens */}
      <div id="app-content" className="hidden sm:block">
        <Toaster position="top-right" /> {/* Add Toaster here */}
        <App />
        <Footer /> {/* Add Footer globally */}
      </div>

      {/* Show this for mobile screens */}
      <div id="mobile-restricted" className="sm:hidden flex justify-center items-center h-screen bg-gray-100 text-center text-xl font-semibold">
        This application is optimized for desktop screens. <br />
        Please use a computer to access the CRM.
      </div>
    </>
  </AuthContext>
);
