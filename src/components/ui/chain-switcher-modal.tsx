"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Globe, Landmark, EclipseIcon } from 'lucide-react';
import { useChain, Network } from '@/contexts/ChainContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ChainSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChainSwitcherModal: React.FC<ChainSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentNetwork, networks, switchNetwork, isLoading } = useChain();
  const [selectedChain, setSelectedChain] = useState(currentNetwork.id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChainSelect = async (networkId: string) => {
    setSelectedChain(networkId);
    await switchNetwork(networkId);
    onClose();
  };

  if (!isOpen || !mounted) return null;

  // Get network icon based on chain ID
  const getNetworkIcon = (chainId: string) => {
    switch (chainId) {
      case 'ethereum':
      case 'sepolia':
        return <EclipseIcon className="h-6 w-6 text-blue-600" />;
      case 'polygon':
      case 'mumbai':
        return <Landmark className="h-6 w-6 text-purple-600" />;
      case 'bsc':
      case 'bscTestnet':
        return <Globe className="h-6 w-6 text-yellow-600" />;
      case 'nullnet':
        return <EclipseIcon className="h-6 w-6 text-indigo-600" />;
      default:
        return <Globe className="h-6 w-6 text-gray-600" />;
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      style={{ zIndex: 99999 }}
    >
      <div className="relative w-full max-w-md mx-4" style={{ zIndex: 100000 }}>
        {/* Decorative blur orbs */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <Card className="w-full bg-gray-900/95 backdrop-blur-xl border-gray-700/50 shadow-2xl relative" style={{ zIndex: 100001 }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Select Network</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {networks.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Loading networks...</p>
                </div>
              ) : (
                networks.map((network) => (
                  <button
                    key={network.id}
                    onClick={() => handleChainSelect(network.id)}
                    disabled={isLoading}
                    className={`w-full p-4 rounded-lg border transition-all duration-200 ${
                      currentNetwork.id === network.id
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getNetworkIcon(network.id)}
                        <div className="text-left">
                          <div className="font-medium">{network.name}</div>
                          <div className="text-sm opacity-70">{network.symbol}</div>
                        </div>
                      </div>
                      {currentNetwork.id === network.id && (
                        <Check className="h-5 w-5 text-blue-400" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

            {networks.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500 text-center">
                  {networks.length} networks available
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Use portal to render at document root
  return createPortal(modalContent, document.body);
}; 