import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")
  const chain = searchParams.get("chain") || "ethereum"
  const page = searchParams.get("page") || "1"
  const offset = searchParams.get("offset") || "5"

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }

  try {
    // Route to backend API based on chain
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4444"
    
    let response;
    
    // Use backend API for all supported chains
    const supportedChains = ["ethereum", "polygon", "bsc", "sepolia", "mumbai", "bscTestnet", "nullnet", "flowTestnet"];
    
    if (supportedChains.includes(chain)) {
      // Use backend API for supported chains
      response = await fetch(`${backendUrl}/wallet/transactions/${chain}/${address}?page=${page}&offset=${offset}`)
    } else {
      // Fallback to Etherscan for unsupported chains (backwards compatibility)
      const etherscanKey = process.env.ETHERSCAN_KEY
      response = await fetch(
        `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${offset}&sort=desc&apikey=${etherscanKey}`
      )
    }

    const data = await response.json()
    
    // Normalize response format
    if (data.success !== undefined) {
      // Backend API response format
      return NextResponse.json(data)
    } else {
      // Etherscan API response format (backwards compatibility)
      return NextResponse.json(data)
    }
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    )
  }
} 