import Link from "next/link"

export function Navbar() {
  return (
    <nav className="w-full bg-blue-600 text-white p-4">
      <div className="max-w-[1280px] mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Null Wallet
        </Link>
        <div className="space-x-6">
          <Link href="/" className="hover:text-blue-200 transition-colors">
            Home
          </Link>
          <Link href="/features" className="hover:text-blue-200 transition-colors">
            Features
          </Link>
          <Link href="/about" className="hover:text-blue-200 transition-colors">
            About
          </Link>
        </div>
      </div>
    </nav>
  )
} 