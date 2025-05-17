import { DollarSign } from "lucide-react"
import { Card, CardContent } from "./card"

interface WalletBalanceProps {
  totalBalance: number
}

export function WalletBalance({ totalBalance = 3250 }: WalletBalanceProps) {
  return (
    <Card className="w-full mb-6 bg-gradient-to-r from-violet-500 to-purple-500">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">Total Balance</p>
            <h2 className="text-3xl font-bold text-white">${totalBalance.toLocaleString()}</h2>
          </div>
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-white/20">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
