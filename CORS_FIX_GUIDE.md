# CORS Fix Guide for FarmSense Application

## 🚨 Current Issue

The application is experiencing CORS (Cross-Origin Resource Sharing) issues with the ngrok tunnel. The `ngrok-skip-browser-warning` header is being blocked by the backend's CORS policy.

## 🔧 Solutions

### Solution 1: Backend CORS Configuration (Recommended)

If you have access to the backend code, update the CORS settings to allow the ngrok header:

#### For Django (if using Django REST Framework):

```python
# In settings.py
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'ngrok-skip-browser-warning',  # Add this line
]

# Also ensure your frontend URL is in allowed origins
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Or for development, you can use:
CORS_ALLOW_ALL_ORIGINS = True  # Only for development!
```

#### For FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  # This should include ngrok-skip-browser-warning
)
```

### Solution 2: Use ngrok with Custom Domain (Alternative)

Instead of using the free ngrok tunnel, you can:

1. **Upgrade to ngrok Pro** and use a custom domain
2. **Use ngrok with authentication** to avoid the browser warning

```bash
# Install ngrok and authenticate
ngrok config add-authtoken YOUR_AUTH_TOKEN

# Start tunnel with custom subdomain (requires paid plan)
ngrok http 8000 --subdomain=your-custom-name
```

### Solution 3: Local Development Setup

For local development, you can run both frontend and backend locally:

1. **Backend**: Run on `http://localhost:8000`
2. **Frontend**: Run on `http://localhost:5173`
3. **Update environment variables**:

```bash
# In your .env file
VITE_API_BASE_URL=http://localhost:8000
```

### Solution 4: Proxy Configuration (Vite)

Add a proxy configuration to your `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://1ed820349c88.ngrok-free.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            proxyReq.setHeader("ngrok-skip-browser-warning", "true");
          });
        },
      },
    },
  },
});
```

## 🚀 Quick Fix for Testing

If you need to test immediately, you can:

1. **Disable CORS in your browser** (Chrome):

   ```bash
   # Windows
   chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security --disable-features=VizDisplayCompositor

   # macOS
   open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

   # Linux
   google-chrome --disable-web-security --user-data-dir="/tmp/chrome_dev_test"
   ```

2. **Use a CORS browser extension** like "CORS Unblock" or "Disable CORS"

## 📝 Environment Variables

Make sure your `.env` file has the correct API URL:

```bash
# For ngrok tunnel
VITE_API_BASE_URL=https://1ed820349c88.ngrok-free.app

# For local development
VITE_API_BASE_URL=http://localhost:8000

# API timeout (optional)
VITE_API_TIMEOUT=10000
```

## 🔍 Testing the Fix

After implementing any of the above solutions:

1. **Restart your development server**:

   ```bash
   npm run dev
   ```

2. **Check the browser console** for any remaining CORS errors

3. **Test API connectivity** by trying to log in or access the dashboard

## 📞 Need Help?

If you're still experiencing issues:

1. **Check the backend logs** for CORS-related errors
2. **Verify the ngrok tunnel** is still active
3. **Ensure the backend is running** and accessible
4. **Check network tab** in browser dev tools for detailed error information

## 🎯 Recommended Approach

For the best development experience:

1. **Use local development** when possible (Solution 3)
2. **Configure backend CORS properly** (Solution 1)
3. **Use ngrok Pro** for production-like testing (Solution 2)

The frontend code has been updated to handle ngrok headers properly, so once the backend CORS is configured correctly, everything should work smoothly!
