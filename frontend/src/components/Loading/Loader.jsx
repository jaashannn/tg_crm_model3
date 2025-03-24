import React from 'react';
import Img from '../../assets/icon.ico';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <img
        src={Img}
        alt="Loading"
        className="w-24 h-24 opacity-100 animate-fade-in-out"
      />
    </div>
  );
};

export default Loader;

