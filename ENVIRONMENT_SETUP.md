# Environment Setup for Null Wallet Frontend

## Required Environment Variables

Create a `.env.local` file in the `null-wallet-ts` directory with the following variables:

```bash
# Backend API URL
BACKEND_URL=http://localhost:4444
NEXT_PUBLIC_BACKEND_URL=http://localhost:4444

# Etherscan API key (if using direct Etherscan calls)
ETHERSCAN_KEY=your_etherscan_api_key_here
```

## Development Setup

1. **Install dependencies**:
   ```bash
   cd null-wallet-ts
   npm install
   # or
   pnpm install
   ```

2. **Create `.env.local` file** with the variables above

3. **Start the development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Access the application** at http://localhost:3000

## Production Setup

For production deployment, update the environment variables:

```bash
# Production backend URL
BACKEND_URL=https://your-backend-url.com
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

## Troubleshooting

1. **Balance not showing**: 
   - Check that the backend is running on port 4444
   - Verify BACKEND_URL is set correctly
   - Check browser console for errors

2. **Network errors**:
   - Ensure the backend has proper RPC URLs configured
   - Check if you're hitting rate limits on public RPCs

3. **CORS errors**:
   - Verify the backend FRONTEND_URL matches your frontend URL
   - Check that credentials are included in fetch requests 