import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.svg";
import { isMobile } from "../utils/deviceDetection";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isMobileDevice = isMobile();

  const handleLinkClick = () => {
    setIsOpen(false); // Close menu when any link is clicked
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleNavigation = () => {
    setIsOpen(false); // Close menu when logo is clicked
    navigate("/"); // Navigate to home page
  };

  return (
    <header className="fixed top-0 w-full bg-white shadow-lg z-50">
      <div className="container mx-auto px-6 h-20 flex items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <h1 className="font-bebas text-4xl">
            <button onClick={handleNavigation} className="flex items-center">
              <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
              <span className="text-[#008080] font-bebas text-5xl pt-1.5">
                SPORTOMIC
              </span>
            </button>
          </h1>
        </div>

        {/* Mobile Refresh Button */}
        {isMobileDevice && (
          <button
            onClick={handleRefresh}
            className="md:hidden bg-[#008080] text-white rounded-full p-2 mr-2 hover:bg-[#006666] transition-colors"
            title="Refresh Page"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}

        {/* Burger Menu for Mobile */}
        <button
          className="md:hidden text-[#27262a]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <ul
          className={`${
            isOpen ? "block" : "hidden"
          } absolute top-20 left-0 w-full bg-white md:static md:flex md:flex-1 md:justify-end md:gap-8`}
        >
          <li>
            <Link
              to="/"
              onClick={handleLinkClick}
              className="block text-center font-Outfit text-2xl text-[#27262a] font-semibold py-2 px-4 hover:text-blue-500"
            >
              Event
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              onClick={handleLinkClick}
              className="block text-center font-Outfit text-2xl text-[#27262a] font-semibold py-2 px-4 hover:text-blue-500"
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
