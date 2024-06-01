// navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Nav() {
  const auth = localStorage.getItem('user');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/signup');
  };

  // Close the navbar when the screen size changes to a larger size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <nav className="bg-blue-400 fixed top-0 w-full">
      <div className="container mx-auto flex justify-between items-center relative">
        <Link to="/" className="flex items-center">
          <img
            src="../src/assets/cart.png"
            className="w-40 object-contain"
            alt="Logo"
          />
        </Link>
        <div className="md:hidden absolute top-0 right-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
        <div className={`md:flex ${isOpen ? 'block' : 'hidden'} items-center`}>
          {auth ? (
            <ul className="nav-items md:flex md:gap-6 lg:p-4">
              <li>
                <Link to="/" className="hover:text-blue-800 text-white">Home</Link>
              </li>
              <li>
                <Link to="/add" className="hover:text-blue-800 text-white">Add Product</Link>
              </li>
              <li>
                <Link to="/update" className="hover:text-blue-800 text-white">Update Product</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-800 text-white">Profile</Link>
              </li>
              <li>
                <Link onClick={logout} to="/signup" className="hover:text-blue-800 text-white">Logout ({JSON.parse(auth).name})</Link>
              </li>
            </ul>
          ) : (
            <ul className="nav-items md:flex md:gap-8 pt-8 p-2 md:pt-0 lg:pt-0">
              <li>
                <Link to="/signup" className="hover:text-blue-800 text-white">Sign Up</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-800 text-white">Login</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
