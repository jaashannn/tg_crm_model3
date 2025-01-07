import React, { useState, useEffect } from 'react';

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for 3 seconds (this can be replaced by actual loading logic)
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Adjust the time as needed
  }, []);

  return (
    <div className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 ${isLoading ? '' : 'hidden'}`}>
      <img
        src="path_to_your_logo.png" // Your logo image
        alt="Loading"
        className="w-32 h-32 opacity-0 scale-50 animate-fadeIn"
      />
    </div>
  );
};

export default Loader;
