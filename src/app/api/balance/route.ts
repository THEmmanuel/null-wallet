import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }

  try {
    const etherscanKey = process.env.ETHERSCAN_KEY
    const response = await fetch(
      `https://api-sepolia.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${etherscanKey}`
    )

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching balance:", error)
    return NextResponse.json(
      { error: "Failed to fetch balance" },
      { status: 500 }
    )
  }
} 