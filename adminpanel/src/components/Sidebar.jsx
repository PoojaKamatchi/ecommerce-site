// Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  CubeIcon,
  PlusCircleIcon,
  ShoppingCartIcon,
  UserIcon,
  ChartBarIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <HomeIcon className="w-5 h-5 mr-3" /> },
  { name: "Products", path: "/admin/products", icon: <CubeIcon className="w-5 h-5 mr-3" /> },
  { name: "Add Product", path: "/admin/products/add", icon: <PlusCircleIcon className="w-5 h-5 mr-3" /> },
  { name: "Orders", path: "/admin/orders", icon: <ShoppingCartIcon className="w-5 h-5 mr-3" /> },
  { name: "Users", path: "/admin/users", icon: <UserIcon className="w-5 h-5 mr-3" /> },
  { name: "Reports", path: "/admin/reports", icon: <ChartBarIcon className="w-5 h-5 mr-3" /> },
  { name: "Add Category", path: "/admin/add-category", icon: <TagIcon className="w-5 h-5 mr-3" /> },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex justify-between items-center bg-blue-800 text-white p-4">
        <span className="font-bold text-lg">Admin Panel</span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">☰</button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-blue-800 text-white z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:w-64 w-64 rounded-r-3xl shadow-2xl`}
      >
        <div className="hidden lg:flex items-center justify-center p-4 border-b border-white font-bold text-lg">
          Admin Panel
        </div>

        <nav className="mt-6 space-y-2 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center py-3 px-4 rounded-lg hover:bg-blue-700 transition
              ${location.pathname === item.path ? "bg-blue-700" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
