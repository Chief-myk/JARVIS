import React, { useState, useEffect , useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRobot } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { userDataContext } from '../context/UserContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { userData, serverUrl } = useContext(userDataContext)

  const handleLogout = async () => {
    try{
    const res = axios.get(`${serverUrl}/api/auth/logout`, {withCredentials:true})
    console.log('logout succesfully');
    
    console.log(res.data);
    
    }catch(err){
      console.log('err' , err);
      
    }
  }

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/aboutProject", label: "About Project" },
    { path: "/aboutDevelopers", label: "About Developers" },
    { path: "/signUp", label: "Sign Up" },
    { path: "/signIn", label: "Sign In" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-gray-900/90 shadow-xl backdrop-blur-md"
          : "bg-gray-900/50 backdrop-blur-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center group transition-transform duration-300 hover:scale-105"
          aria-label="Home"
        >
          <FaRobot className="text-3xl text-cyan-400 animate-pulse" />
          <span className="ml-2 text-white font-bold text-xl">JARVIS</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex space-x-6 text-white font-medium cursor-pointer tracking-wide text-lg">
            {navLinks.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                currentPath={location.pathname}
              />
            ))}
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 text-gray-200 hover:text-cyan-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-md transition-all"
        >
          Log Out
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden z-50 p-2 text-gray-200 hover:text-cyan-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-md transition-all"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <IoClose className="w-8 h-8 text-cyan-400" />
          ) : (
            <GiHamburgerMenu className="w-8 h-8" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-900/95 backdrop-blur-lg pt-20">
          <ul className="flex flex-col items-center space-y-6">
            {navLinks.map((item) => (
              <MobileNavItem
                key={item.path}
                item={item}
                currentPath={location.pathname}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </ul>
        </div>
      )}
    </motion.nav>
  );
};

// Desktop Nav Item Component
const NavItem = ({ item, currentPath }) => (
  <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link
      to={item.path}
      className={`relative px-3 py-2 hover:text-cyan-400 transition-all duration-300 ${currentPath === item.path ? "text-cyan-400 font-semibold" : "text-gray-200"
        }`}
      aria-current={currentPath === item.path ? "page" : undefined}
    >
      {item.label}
      <span
        className={`absolute left-0 bottom-0 w-full h-0.5 bg-cyan-400 transform transition-transform duration-300 scale-x-0 hover:scale-x-100 ${currentPath === item.path ? "scale-x-100" : ""
          }`}
      />
    </Link>
  </motion.li>
);

// Mobile Nav Item Component
const MobileNavItem = ({ item, currentPath, onClick }) => (
  <motion.li className="w-full px-8" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Link
      to={item.path}
      onClick={onClick}
      className={`block px-6 py-4 rounded-lg w-full text-center text-xl ${currentPath === item.path
          ? "bg-cyan-600 text-white shadow-md font-medium"
          : "hover:bg-gray-800 text-gray-200 transition"
        }`}
      aria-current={currentPath === item.path ? "page" : undefined}
    >
      {item.label}
    </Link>
  </motion.li>
);

export default Navbar;