import { Card, CardContent } from "./card"
import { EclipseIcon as Ethereum } from "lucide-react"

interface EthereumBalanceCardProps {
  balance: number
  usdValue: number
}

export function EthereumBalanceCard({ balance = 1.2, usdValue = 2764 }: EthereumBalanceCardProps) {
  return (
    <Card className="w-full max-w-md overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Ethereum className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Ethereum</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">ETH</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{balance} ETH</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">${usdValue.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
