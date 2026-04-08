import React from "react";
import { Instagram, Linkedin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import img1 from "../assets/images/GetItOnPlayStore.png";
import img2 from "../assets/images/GetItOnAppStore.png";
import logo from "../assets/images/logo.svg";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-100 text-gray-700 py-8 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Center Section */}
        <div className="flex flex-col items-center justify-center space-y-3 text-center w-full">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <Link to="/" className="hover:text-teal-600">
            Events
          </Link>
          <Link to="/contact" className="hover:text-teal-600">
            Contact Us
          </Link>
          {/* <Link to="/about" className="hover:text-teal-600">
            About Us
          </Link> */}
          <Link to="/privacy" className="hover:text-teal-600">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-teal-600">
            Terms & Conditions
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center space-y-3">
          <h3 className="text-lg font-semibold">Connect with Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/go.sportomic/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-600"
            >
              <Instagram size={28} />
            </a>
            <a
              href="https://www.linkedin.com/company/sportomic/?originalSubdomain=in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600"
            >
              <Linkedin size={28} />
            </a>
          </div>
          <p className="text-sm">For Corporate Queries: +91 7899152424</p>
          <a
            href="https://docs.google.com/your-form-link"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:underline"
          >
            Contact Form
          </a>
          <p className="text-sm">help@sportomic.com</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-6 border-t border-gray-300 pt-4">
        <p className="text-sm text-gray-500">
          © 2024 Bluejersey18 Technologies Private Limited. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
