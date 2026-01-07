import React, { useState } from 'react';
import { Asset, AssetType } from '../types';
import { CreditCard, Smartphone, Banknote, Edit2, Check, X } from 'lucide-react';
import Button from './Button';

interface AssetsViewProps {
  assets: Asset[];
  onUpdateAsset: (asset: Asset) => void;
}

const AssetsView: React.FC<AssetsViewProps> = ({ assets, onUpdateAsset }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const getTotalAssets = () => {
    return assets.reduce((sum, asset) => sum + asset.balance, 0);
  };

  const handleStartEdit = (asset: Asset) => {
    setEditingId(asset.id);
    setEditValue(asset.balance.toString());
  };

  const handleSaveEdit = (asset: Asset) => {
    const newBalance = parseFloat(editValue);
    if (!isNaN(newBalance)) {
      onUpdateAsset({ ...asset, balance: newBalance });
    }
    setEditingId(null);
  };

  const getAssetStyle = (type: AssetType) => {
    switch (type) {
      case 'wechat':
        return 'bg-gradient-to-br from-[#07C160] to-[#059B4C] text-white shadow-green-200';
      case 'alipay':
        return 'bg-gradient-to-br from-[#1677FF] to-[#0050B3] text-white shadow-blue-200';
      case 'bank':
        return 'bg-gradient-to-br from-[#FF4D4F] to-[#CF1322] text-white shadow-red-200';
      default:
        return 'bg-gradient-to-br from-gray-700 to-gray-900 text-white shadow-gray-300';
    }
  };

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case 'wechat':
      case 'alipay':
        return <Smartphone className="w-6 h-6 opacity-80" />;
      case 'bank':
        return <CreditCard className="w-6 h-6 opacity-80" />;
      default:
        return <Banknote className="w-6 h-6 opacity-80" />;
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Total Asset Summary */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
        <p className="text-sm text-gray-500 font-medium mb-1">净资产</p>
        <h2 className="text-4xl font-bold text-gray-900">¥{getTotalAssets().toFixed(2)}</h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 px-1">我的账户</h3>
        
        {assets.map((asset) => (
          <div 
            key={asset.id} 
            className={`relative p-5 rounded-2xl shadow-lg transition-transform transform ${getAssetStyle(asset.type)}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  {getAssetIcon(asset.type)}
                </div>
                <div>
                  <h4 className="font-bold text-lg tracking-wide">{asset.name}</h4>
                  {asset.accountNumber && (
                    <p className="text-xs text-white/70 font-mono tracking-wider">**** **** **** {asset.accountNumber}</p>
                  )}
                </div>
              </div>
              <div className="p-2">
                 <div className="w-8 h-5 rounded border border-white/30 flex items-center justify-center">
                    <div className="w-5 h-3 bg-white/20 rounded-sm"></div>
                 </div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-white/70 mb-1">当前余额</p>
                {editingId === asset.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">¥</span>
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-32 bg-white/20 border border-white/40 rounded px-2 py-1 text-white placeholder-white/50 focus:outline-none focus:bg-white/30 font-bold"
                      autoFocus
                    />
                  </div>
                ) : (
                  <p className="text-2xl font-bold tracking-tight">¥{asset.balance.toFixed(2)}</p>
                )}
              </div>

              <div>
                {editingId === asset.id ? (
                  <div className="flex gap-2">
                    <button onClick={() => setEditingId(null)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                      <X className="w-4 h-4 text-white" />
                    </button>
                    <button onClick={() => handleSaveEdit(asset)} className="p-2 bg-white text-indigo-600 rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleStartEdit(asset)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium backdrop-blur-sm transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>调整</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Decorative background circle */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          </div>
        ))}
        
        <div className="pt-4">
             <Button variant="ghost" className="w-full border-2 border-dashed border-gray-200 py-4 text-gray-400">
                + 添加新账户 (暂未开放)
             </Button>
        </div>
      </div>
    </div>
  );
};

export default AssetsView;
