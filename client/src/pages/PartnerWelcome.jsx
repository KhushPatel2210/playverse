import React from "react";
import { useLocation } from "react-router-dom";

const PartnerWelcome = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const name = params.get("name");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-xl text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to the partner console</h2>
        <p className="text-lg text-gray-700">{name}</p>
      </div>
    </div>
  );
};

export default PartnerWelcome;


