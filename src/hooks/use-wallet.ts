import { useState, useEffect } from 'react';
import { useChain } from '@/contexts/ChainContext';
import { getWalletForChain, getAllWallets } from '@/utils/wallet-helpers';

interface WalletData {
    walletName: string;
    walletAddress: string;
    walletKey: string | null;
    walletPhrase: string | null;
    _id: string;
}

export function useWallet() {
    const { currentNetwork } = useChain();
    const [currentWallet, setCurrentWallet] = useState<WalletData | null>(null);
    const [allWallets, setAllWallets] = useState<WalletData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        
        // Get all wallets
        const wallets = getAllWallets();
        setAllWallets(wallets);

        // Get the appropriate wallet for the current chain
        const wallet = getWalletForChain(currentNetwork.id);
        setCurrentWallet(wallet);
        
        setIsLoading(false);
    }, [currentNetwork.id]);

    return {
        currentWallet,
        walletAddress: currentWallet?.walletAddress || null,
        walletKey: currentWallet?.walletKey || null,
        walletName: currentWallet?.walletName || null,
        allWallets,
        isNullNet: currentNetwork.id === 'nullnet',
        isLoading
    };
} 