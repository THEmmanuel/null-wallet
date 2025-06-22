import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")
  const chain = searchParams.get("chain") || "ethereum"

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }

  try {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4444"

    const response = await fetch(`${backendUrl}/wallet/balances/${chain}/${address}`)
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching balances:", error)
    return NextResponse.json({ error: "Failed to fetch balances" }, { status: 500 })
  }
} 