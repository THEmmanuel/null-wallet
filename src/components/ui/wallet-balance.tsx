import { DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent } from "./card"

interface WalletBalanceProps {
  totalBalance: number
}

export function WalletBalance({ totalBalance = 3250 }: WalletBalanceProps) {
  return (
    <Card className="w-full mb-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 border-0 shadow-xl relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80 mb-1">Total Portfolio Value</p>
            <h2 className="text-4xl font-bold text-white mb-2">${totalBalance.toLocaleString()}</h2>
            <div className="flex items-center space-x-1 text-green-200">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+12.5% this month</span>
            </div>
          </div>
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
