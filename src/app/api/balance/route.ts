import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")
  const chain = searchParams.get("chain") || "ethereum"

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
      const url = `${backendUrl}/wallet/balance/${chain}/${address}`;
      console.log('Fetching balance from:', url);
      response = await fetch(url)
    } else {
      // Fallback to Etherscan for unsupported chains (backwards compatibility)
      const etherscanKey = process.env.ETHERSCAN_KEY
      response = await fetch(
        `https://api-sepolia.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${etherscanKey}`
      )
    }

    if (!response.ok) {
      console.error('Backend response not ok:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      return NextResponse.json(
        { 
          success: false,
          error: `Backend error: ${response.statusText}`,
          details: errorText 
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Balance API response:', data);
    
    // Handle different response formats
    if (data.success !== undefined) {
      // Backend API response format
      return NextResponse.json(data)
    } else if (data.status && data.result) {
      // Etherscan API response format - normalize it
      const balance = data.status === '1' ? 
        (parseFloat(data.result) / 1e18).toString() : '0';
      
      return NextResponse.json({
        success: true,
        balance: balance,
        chain: chain,
        walletAddress: address,
        source: 'etherscan'
      })
    } else {
      // Unknown format
      return NextResponse.json({
        success: false,
        error: 'Unknown response format',
        data: data
      })
    }
  } catch (error) {
    console.error("Error fetching balance:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch balance",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 