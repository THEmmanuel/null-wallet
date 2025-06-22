import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const address = searchParams.get('address')
  const chain = searchParams.get('chain')
  const token = searchParams.get('token')
  const page = searchParams.get('page') || '1'
  const offset = searchParams.get('offset') || '10'

  if (!address || !chain || !token) {
    return NextResponse.json({ 
      success: false, 
      error: 'Missing required parameters: address, chain, and token' 
    }, { status: 400 })
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4444'
    const response = await fetch(
      `${backendUrl}/wallet/token-transactions/${chain}/${token}/${address}?page=${page}&offset=${offset}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({
        success: false,
        error: errorData.error || 'Failed to fetch token transactions',
        details: errorData.details
      }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching token transactions:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch token transactions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 