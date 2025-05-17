"use client"

import type React from "react"

import { Wallet, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Network {
  id: string
  name: string
  icon: React.ReactNode
}

interface WalletHeaderProps {
  currentNetwork: Network
  networks: Network[]
  onNetworkChange: (networkId: string) => void
}

export function WalletHeader({ currentNetwork, networks, onNetworkChange }: WalletHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
          <Wallet className="h-5 w-5" />
        </Button>
        <span className="font-medium">My Wallet</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center space-x-1">
            <span>{currentNetwork.name}</span>
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {networks.map((network) => (
            <DropdownMenuItem
              key={network.id}
              onClick={() => onNetworkChange(network.id)}
              className="flex items-center space-x-2"
            >
              {network.icon}
              <span>{network.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
