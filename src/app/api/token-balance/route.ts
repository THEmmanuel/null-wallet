import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")
  const token = searchParams.get("token") || "ethereum"
  const chain = searchParams.get("chain") || "ethereum"
  const contractAddress = searchParams.get("contractAddress") || "null"

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }

  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4444"
    
    // Call the backend wallet route - wallet routes are mounted at /wallet in index.js
    const response = await fetch(
      `${backendUrl}/wallet/get-token-usd-balance/${address}/${contractAddress}/${token}/${chain}`
    )

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      ...data
    })
  } catch (error) {
    console.error("Error fetching token USD balance:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch token USD balance",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
} 