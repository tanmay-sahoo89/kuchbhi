import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Leaf,
  Home,
  Book,
  Target,
  Trophy,
  Award,
  BarChart,
  User,
  ShoppingBag,
  Menu,
} from "lucide-react";
import { useStudent } from "../contexts/StudentContext";
import MobileMenu from "./MobileMenu";
import SoundPlayer from "../utils/sounds";

const Header: React.FC = () => {
  const location = useLocation();
  const { currentStudent } = useStudent();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Lessons", href: "/lessons", icon: Book },
    { name: "Challenges", href: "/challenges", icon: Target },
    { name: "Leaderboards", href: "/leaderboards", icon: Trophy },
    { name: "Badges", href: "/badges", icon: Award },
    { name: "Points Shop", href: "/shop", icon: ShoppingBag },
    { name: "Analytics", href: "/analytics", icon: BarChart },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const handleNavHover = () => {
    SoundPlayer.play("tabSwitch");
  };

  return (
    <>
      <header className="bg-[#091D23]/80 backdrop-blur-md shadow-lg border-b border-[#F8D991]/20 sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-[#F8D991]" />
              <span className="text-2xl font-bold text-[#F8D991]">
                PrismWorlds
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.slice(0, 6).map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.href ||
                  (item.href === "/" && location.pathname === "/dashboard");
                return (
                  <Link
                    key={item.name}
                    to={item.href === "/" ? "/dashboard" : item.href}
                    onMouseEnter={handleNavHover}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#F8D991]/20 text-[#F8D991] border border-[#F8D991]/30"
                        : "text-gray-300 hover:text-[#E1664C] hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-[#F8D991]/20 backdrop-blur-sm px-3 py-1 rounded-full border border-[#F8D991]/30">
                <div className="w-2 h-2 bg-[#F8D991] rounded-full animate-pulse"></div>
                <span className="text-[#F8D991] font-semibold">
                  {currentStudent.ecoPoints} Points
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <img
                  src={currentStudent.avatar}
                  alt={currentStudent.name}
                  className="w-8 h-8 rounded-full border-2 border-[#F8D991]"
                />
                <span className="text-gray-200 font-medium">
                  {currentStudent.name}
                </span>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-gray-300 hover:text-[#E1664C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1664C] rounded-lg"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

export default Header;
