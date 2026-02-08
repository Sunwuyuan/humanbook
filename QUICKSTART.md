# Quick Start Guide

## Installation & Running

1. **Install dependencies:**
```bash
npm install
```

2. **Run in development mode:**
```bash
npm run dev
```

The application will start with:
- Vite dev server on http://localhost:5173
- Electron window opening automatically
- Hot-reload enabled for Vue components

## First Time Setup

### 1. Create an Account
- Launch the application
- Click "Don't have an account? Register"
- Fill in:
  - Display Name: Your full name
  - Username: Choose a unique username
  - Email: Your email address
  - Password: Secure password
- Click "Register"

### 2. Explore the Feed
- After registration, you'll see the home feed
- Initially empty - be the first to post!

### 3. Create Your First Post
- Click "Create Post" button in the top navigation
- Enter a title (e.g., "Hello, HumanBook!")
- Write your content
- Add tags (optional, comma-separated)
- Click "Post"

### 4. Interact with Posts
- **Like**: Click the ❤️ icon
- **Comment**: Click on the post title to open details, then add a comment
- **Reply**: On the post detail page, click "Reply" under any comment

### 5. Manage Your Account
- Click "Account" button in the navigation
- Update your profile information
- Link external accounts (optional)

## Building for Production

### Build for your current platform:
```bash
npm run build
```

The application will be packaged in the `release` directory.

### Platform-specific builds:

**macOS:**
- Produces a `.dmg` file
- Can be distributed to Mac users

**Windows:**
- Produces an `.exe` installer (NSIS)
- Can be distributed to Windows users

**Linux:**
- Produces `.AppImage` and `.deb` packages
- Compatible with most Linux distributions

## Troubleshooting

### Port Already in Use
If port 5173 is already in use:
```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9
# Or change the port in vite.config.ts
```

### Build Fails
```bash
# Clean and rebuild
rm -rf node_modules package-lock.json dist dist-electron
npm install
npm run build
```

### Electron Won't Start
Make sure you have a display server (X11) available. In headless environments, Electron cannot start.

## Development Tips

### Hot Reload
Changes to Vue components will hot-reload automatically. Changes to the Electron main process require restarting the application.

### DevTools
The Electron DevTools open automatically in development mode. Use them to debug Vue components and inspect network requests.

### API Configuration
Edit `src/api/client.ts` to change the API endpoint:
```typescript
const API_BASE_URL = 'https://your-api-server.com/v1'
```

## Features Overview

| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | ✅ | Full implementation |
| User Login | ✅ | Token-based auth |
| Create Posts | ✅ | With tags support |
| Browse Posts | ✅ | Paginated feed |
| View Post Details | ✅ | Full post view |
| Like Posts | ✅ | With count |
| Comment on Posts | ✅ | Unlimited comments |
| Nested Replies | ✅ | Full threading |
| Like Comments | ✅ | With count |
| Profile Management | ✅ | Update display name, bio, avatar |
| Account Linking | ✅ | Link external platforms |
| Dark Mode | ✅ | System-based |

## Next Steps

Consider adding:
- Search functionality
- User profiles view
- Follow/unfollow users
- Direct messages
- Notifications
- File uploads for images
- Emoji picker
- Markdown support in posts

Enjoy using HumanBook! 🚀
