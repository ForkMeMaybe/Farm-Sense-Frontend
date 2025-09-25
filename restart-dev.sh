#!/bin/bash
echo "🔄 Restarting FarmSense development server with proxy configuration..."
echo ""
echo "📝 The proxy will now handle ngrok CORS issues automatically"
echo "🌐 API requests will be proxied to: https://1ed820349c88.ngrok-free.app"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
npm run dev
