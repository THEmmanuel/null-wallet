"use client";

import useSWR from "swr";
import { useChain } from "@/contexts/ChainContext";
import { getWalletAddressForChain } from '@/utils/wallet-helpers';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useBalances() {
  const { currentNetwork } = useChain();
  const chainId = currentNetwork?.id;
  const walletAddress = getWalletAddressForChain(chainId);
  
  const shouldFetch = walletAddress && chainId;

  const { data, error, isLoading } = useSWR(
    shouldFetch ? `/api/balances?address=${walletAddress}&chain=${chainId}` : null,
    fetcher
  );

  return {
    balances: data?.balances || [],
    isLoading,
    error
  };
} 