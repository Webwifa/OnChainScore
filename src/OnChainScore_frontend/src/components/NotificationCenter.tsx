import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Bell, X, Check, AlertCircle, TrendingUp, Award, Zap, Calendar } from 'lucide-react';

interface Notification {
  id: string;
  type: 'score_update' | 'achievement' | 'opportunity' | 'system' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  scoreChange?: number;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current || !backdropRef.current) return;

    if (isOpen) {
      gsap.fromTo(panelRef.current,
        { x: "100%", opacity: 0 },
        { 
          x: "0%", 
          opacity: 1, 
          duration: 0.5, 
          ease: "power3.out" 
        }
      );

      gsap.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );

      if (listRef.current) {
        const items = listRef.current.children;
        gsap.fromTo(items,
          { opacity: 0, x: 30 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.4, 
            stagger: 0.05, 
            delay: 0.2,
            ease: "power2.out" 
          }
        );
      }
    } else {
      gsap.to(panelRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
      });

      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3
      });
    }
  }, [isOpen]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'score_update': return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'achievement': return <Award className="w-5 h-5 text-yellow-400" />;
      case 'opportunity': return <Zap className="w-5 h-5 text-purple-400" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'score_update': return 'border-blue-400/30 bg-blue-500/10';
      case 'achievement': return 'border-yellow-400/30 bg-yellow-500/10';
      case 'opportunity': return 'border-purple-400/30 bg-purple-500/10';
      case 'warning': return 'border-red-400/30 bg-red-500/10';
      default: return 'border-gray-400/30 bg-gray-500/10';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <>
      <div 
        ref={backdropRef}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      <div
        ref={panelRef}
        className="fixed top-0 right-0 bottom-0 w-96 bg-black/40 backdrop-blur-2xl border-l border-white/20 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Notifications</h2>
              {unreadCount > 0 && (
                <div className="px-2 py-1 bg-blue-500 rounded-full">
                  <span className="text-xs text-white font-bold">{unreadCount}</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length > 0 ? (
            <div ref={listRef} className="p-4 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:bg-white/5 ${
                    notification.isRead 
                      ? 'bg-white/5 border-white/10' 
                      : `${getNotificationColor(notification.type)}`
                  }`}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-medium text-sm truncate">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                        {notification.scoreChange && (
                          <div className={`px-2 py-1 rounded-full text-xs ${
                            notification.scoreChange > 0 
                              ? 'text-green-400 bg-green-500/10' 
                              : 'text-red-400 bg-red-500/10'
                          }`}>
                            {notification.scoreChange > 0 ? '+' : ''}{notification.scoreChange} pts
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Bell className="w-16 h-16 text-gray-500 mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">No Notifications</h3>
              <p className="text-gray-400 text-sm">
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="text-center">
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Notification Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;