import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { User, Edit3, Camera, Shield, Wallet, Trophy, Calendar, ExternalLink, Copy, Settings } from 'lucide-react';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    principal: string;
    username?: string;
    avatar?: string;
    joinDate: string;
    totalScore: number;
    rank: number;
    totalUsers: number;
    achievements: Array<{
      id: string;
      name: string;
      description: string;
      earnedDate: string;
      rarity: 'common' | 'rare' | 'epic' | 'legendary';
    }>;
    wallets: Array<{
      type: string;
      name: string;
      balance: number;
      isConnected: boolean;
    }>;
    stats: {
      totalTransactions: number;
      totalVolume: number;
      daysActive: number;
      protocolsUsed: number;
    };
  };
  onUpdateProfile: (data: any) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  isOpen,
  onClose,
  userData,
  onUpdateProfile
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: userData.username || '',
    bio: ''
  });

  useEffect(() => {
    if (!modalRef.current || !backdropRef.current) return;

    if (isOpen) {
      gsap.fromTo(modalRef.current,
        { scale: 0, opacity: 0, rotationX: -90 },
        { 
          scale: 1, 
          opacity: 1, 
          rotationX: 0,
          duration: 0.6, 
          ease: "back.out(1.7)" 
        }
      );

      gsap.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );

      if (contentRef.current) {
        const sections = contentRef.current.children;
        gsap.fromTo(sections,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.5, 
            stagger: 0.1, 
            delay: 0.3,
            ease: "power2.out" 
          }
        );
      }
    } else {
      gsap.to(modalRef.current, {
        scale: 0,
        opacity: 0,
        rotationX: 90,
        duration: 0.4,
        ease: "power2.in"
      });

      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3
      });
    }
  }, [isOpen]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 bg-yellow-500/10 border-yellow-400/30';
      case 'epic': return 'text-purple-400 bg-purple-500/10 border-purple-400/30';
      case 'rare': return 'text-blue-400 bg-blue-500/10 border-blue-400/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-400/30';
    }
  };

  const handleSaveProfile = () => {
    onUpdateProfile(editData);
    setIsEditing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-black/40 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                {userData.avatar ? (
                  <img src={userData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Camera className="w-3 h-3 text-white" />
              </button>
            </div>
            <div>
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({...editData, username: e.target.value})}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-xl font-bold"
                    placeholder="Enter username"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-white">
                    {userData.username || 'Anonymous User'}
                  </h2>
                )}
                <button
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <span className="font-mono text-sm">{userData.principal.slice(0, 12)}...</span>
                <button
                  onClick={() => copyToClipboard(userData.principal)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Joined {userData.joinDate}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
          >
            <ExternalLink className="w-6 h-6 text-white rotate-45" />
          </button>
        </div>

        <div ref={contentRef} className="space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{userData.totalScore}</div>
              <div className="text-sm text-gray-400">OnChain Score</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">#{userData.rank}</div>
              <div className="text-sm text-gray-400">Global Rank</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{userData.stats.totalTransactions.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Transactions</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{userData.stats.daysActive}</div>
              <div className="text-sm text-gray-400">Days Active</div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">Achievements</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl border ${getRarityColor(achievement.rarity)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{achievement.name}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs border ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
                  <div className="text-xs text-gray-500">
                    Earned {achievement.earnedDate}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Wallets */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Wallet className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Connected Wallets</h3>
            </div>
            <div className="space-y-3">
              {userData.wallets.map((wallet, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">{wallet.name}</div>
                      <div className="text-gray-400 text-sm">{wallet.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {wallet.balance.toLocaleString()} ICP
                    </div>
                    <div className={`text-sm ${wallet.isConnected ? 'text-green-400' : 'text-gray-400'}`}>
                      {wallet.isConnected ? 'Connected' : 'Disconnected'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Stats */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-green-400" />
              <h3 className="text-xl font-bold text-white">Activity Overview</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                <div className="text-lg font-bold text-white mb-1">
                  {userData.stats.totalVolume.toLocaleString()} ICP
                </div>
                <div className="text-sm text-gray-400">Total Volume Traded</div>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                <div className="text-lg font-bold text-white mb-1">
                  {userData.stats.protocolsUsed}
                </div>
                <div className="text-sm text-gray-400">Protocols Used</div>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                <div className="text-lg font-bold text-white mb-1">
                  {Math.round((userData.rank / userData.totalUsers) * 100)}%
                </div>
                <div className="text-sm text-gray-400">Top Percentile</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t border-white/10 flex justify-between">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600/20 border border-gray-500/30 rounded-xl text-gray-300 hover:bg-gray-600/30 transition-all duration-200">
            <Settings className="w-4 h-4" />
            <span>Privacy Settings</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-xl text-blue-400 hover:bg-blue-500/30 transition-all duration-200">
            <ExternalLink className="w-4 h-4" />
            <span>View Public Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;