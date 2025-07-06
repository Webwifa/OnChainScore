import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Home, User, History, Wallet, Settings, Bell, Search, Menu, X, Activity } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  notifications: number;
  isAuthenticated: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  notifications,
  isAuthenticated
}) => {
  const navRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!navRef.current) return;

    // Entrance animation
    gsap.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.6, 
        ease: "power3.out",
        delay: 0.2
      }
    );
  }, []);

  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (isMobileMenuOpen) {
      gsap.fromTo(mobileMenuRef.current,
        { x: "100%", opacity: 0 },
        { 
          x: "0%", 
          opacity: 1, 
          duration: 0.4, 
          ease: "power2.out" 
        }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      });
    }
  }, [isMobileMenuOpen]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'history', label: 'History', icon: History },
    { id: 'wallets', label: 'Wallets', icon: Wallet },
    { id: 'sync-demo', label: 'Sync Demo', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-40 bg-black/40 backdrop-blur-2xl border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OS</span>
              </div>
              <span className="text-xl font-bold text-white">OnChainScore</span>
            </div>

            {/* Desktop Navigation Items */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {notifications > 9 ? '9+' : notifications}
                    </span>
                  </div>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div
        ref={mobileMenuRef}
        className="fixed top-0 right-0 bottom-0 w-80 bg-black/90 backdrop-blur-2xl border-l border-white/20 z-50 md:hidden"
        style={{ transform: 'translateX(100%)' }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Menu</h3>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="border-t border-white/10 pt-6">
              <div className="text-sm text-gray-400 text-center">
                OnChainScore v2.0
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;