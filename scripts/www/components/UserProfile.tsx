import React from 'react';
import { Settings, Download, Map, PiggyBank, Info, X, ChevronRight, User } from 'lucide-react';
import Button from './Button';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const menuItems = [
    { icon: Settings, label: '设置', sub: '' },
    { icon: Download, label: '账本导出', sub: 'Excel / PDF' },
    { icon: Map, label: '新增旅游账本', sub: '记录美好旅程' },
    { icon: PiggyBank, label: '存钱计划', sub: 'Dream 愿望清单' },
  ];

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center sm:items-center animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 relative z-10 shadow-2xl animate-slide-up pb-10 sm:pb-6">
        {/* Handle bar for mobile feel */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">个人中心</h2>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Info Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 text-white flex items-center gap-4 mb-6 shadow-lg shadow-indigo-200">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30 text-xl font-bold">
            Me
          </div>
          <div>
            <h3 className="font-bold text-lg">Dream 用户</h3>
            <p className="text-indigo-100 text-sm">已坚持记账 12 天</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <button 
              key={index}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{item.label}</p>
                  {item.sub && <p className="text-xs text-gray-400">{item.sub}</p>}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          ))}
        </div>

        {/* Version Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
            <Info className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400 font-medium">版本号 v1.0.0 (Beta)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
