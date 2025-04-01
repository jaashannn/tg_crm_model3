import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import AuthContext from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast'; // React Hot Toast for notifications
import Footer from './components/Footer/Footer'; // Footer component


// Render the main application
createRoot(document.getElementById('root')).render(
  <AuthContext> {/* Provide authentication context to the entire app */}
    <>
      {/* Desktop view */}
      <div id="app-content" className="hidden sm:block">
        <Toaster position="top-right" /> {/* Toast notifications positioned at the top-right */}
        <App /> {/* Main application component */}
      </div>

      {/* Mobile view */}
      <div
        id="mobile-restricted"
        className="sm:hidden flex justify-center items-center h-screen bg-gray-100 text-center text-xl font-semibold"
      >
        {/* Inform users about desktop optimization */}
        This application is optimized for desktop screens. <br />
        Please use a computer to access the CRM.
      </div>
    </>
  </AuthContext>
);
