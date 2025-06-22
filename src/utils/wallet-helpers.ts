// Wallet helper functions for managing multi-chain wallets

interface WalletData {
    walletName: string;
    walletAddress: string;
    walletKey: string | null;
    walletPhrase: string | null;
    _id: string;
}

/**
 * Get the appropriate wallet for a given chain from sessionStorage
 */
export function getWalletForChain(chainId: string): WalletData | null {
    try {
        const walletsJson = sessionStorage.getItem('userWallets');
        if (!walletsJson) return null;

        const wallets: WalletData[] = JSON.parse(walletsJson);
        
        // For NullNet, use the NullNet wallet
        if (chainId === 'nullnet') {
            return wallets.find(w => w.walletName === 'NullNet Wallet') || null;
        }

        // For all other chains (EVM chains), use the Ethereum wallet
        return wallets.find(w => w.walletName === 'Ethereum Wallet') || null;
    } catch (error) {
        console.error('Error getting wallet for chain:', error);
        return null;
    }
}

/**
 * Get wallet address for a specific chain
 */
export function getWalletAddressForChain(chainId: string): string | null {
    const wallet = getWalletForChain(chainId);
    return wallet?.walletAddress || null;
}

/**
 * Update the current wallet in sessionStorage based on chain
 */
export function updateCurrentWallet(chainId: string): void {
    const wallet = getWalletForChain(chainId);
    if (wallet) {
        sessionStorage.setItem('userWalletAddress', wallet.walletAddress);
        sessionStorage.setItem('userWalletKey', wallet.walletKey || '');
        sessionStorage.setItem('userWalletPhrase', wallet.walletPhrase || '');
    }
}

/**
 * Check if the current chain is NullNet
 */
export function isNullNetChain(chainId: string): boolean {
    return chainId === 'nullnet';
}

/**
 * Get all user wallets from sessionStorage
 */
export function getAllWallets(): WalletData[] {
    try {
        const walletsJson = sessionStorage.getItem('userWallets');
        if (!walletsJson) return [];
        return JSON.parse(walletsJson);
    } catch (error) {
        console.error('Error getting all wallets:', error);
        return [];
    }
} 