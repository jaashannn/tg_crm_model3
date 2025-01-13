import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6 w-full">
      <div className="w-full px-4 text-center md:text-left">
        {/* Footer content */}
        <div className="flex justify-center items-center p-4 bg-gray-800 text-white">
          <p className="text-sm">
            Testgrid - A software testing company using AI for testing.
          </p>
        </div>

        {/* Footer Bottom */}
        <div className="mt-6 border-t border-pink-400 pt-4 text-center">
          <p>© {currentYear} Testgrid. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-1">
            "Empowering businesses with innovation and trust."
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
