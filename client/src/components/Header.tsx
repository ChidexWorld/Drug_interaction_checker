import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Database, Stethoscope, Menu } from "lucide-react";

const Header: React.FC = () => {
  const location = useLocation();

  const navigation = [
    {
      name: "Drug Information",
      href: "/",
      icon: Database,
      description: "Search drug information",
    },
    {
      name: "Drug Interactions",
      href: "/drug-interactions",
      icon: Shield,
      description: "Check drug interactions",
    },
    {
      name: "Medical Conditions",
      href: "/conditions",
      icon: Stethoscope,
      description: "Browse medical conditions",
    },
  ];

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-100/80 via-purple-100/80 to-pink-100/80 shadow-lg border-b border-blue-200/40 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo and Title (mobile: only logo, desktop: logo + text) */}
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow" />
            </div>
            <div className="hidden sm:block ml-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 drop-shadow-lg">
                Precious
              </h1>
              <p className="text-xs md:text-sm text-gray-500 font-medium tracking-wide">
                Medical Information System
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 rounded-xl transition font-semibold text-base tracking-wide shadow-sm ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl scale-105 border-2 border-blue-300"
                      : "text-blue-800 hover:bg-blue-100/60 hover:text-blue-700"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  title={item.description}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-xl bg-gradient-to-br from-blue-200 to-purple-200 text-blue-700 shadow hover:bg-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Open menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>

        {/* Mobile menu overlay */}
        {menuOpen && (
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex flex-col">
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 shadow-xl rounded-b-3xl p-6 pt-8 w-full max-w-xs mx-auto mt-8 animate-slide-down">
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg mb-2">
                  <Shield className="w-8 h-8 text-white drop-shadow" />
                </div>
                <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 drop-shadow-lg">
                  Precious
                </h1>
              </div>
              <nav className="flex flex-col space-y-3">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-3 rounded-xl transition font-semibold text-lg tracking-wide shadow-sm ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl scale-105 border-2 border-blue-300"
                          : "text-blue-800 hover:bg-blue-100/60 hover:text-blue-700"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                      title={item.description}
                      onClick={() => setMenuOpen(false)}
                    >
                      <Icon className="w-6 h-6 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            {/* Click outside to close */}
            <div className="flex-1" onClick={() => setMenuOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
