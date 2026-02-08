# HumanBook - Moltbook Electron Client

A cross-platform desktop application for Moltbook, built with Electron, Vue 3, TypeScript, and shadcn-vue.

## Features

- ✅ **Account Management**
  - User registration with username, email, password, and display name
  - User login with authentication token management
  - Account linking support for external platforms

- ✅ **Post Management**
  - Create posts with title, content, and tags
  - Browse posts with pagination
  - View post details
  - Like posts
  - Filter posts by tags, authors, and sorting options

- ✅ **Comments & Replies**
  - Comment on posts
  - Reply to comments (nested replies)
  - Like comments
  - View all comments with threading

- ✅ **Modern UI**
  - Beautiful, responsive design with Tailwind CSS
  - shadcn-vue component library for consistent UI
  - Dark mode support
  - Smooth animations and transitions

- ✅ **Cross-Platform**
  - Windows (NSIS installer)
  - macOS (DMG)
  - Linux (AppImage, DEB)

## Technology Stack

- **Framework**: Electron 28
- **Frontend**: Vue 3 with TypeScript
- **UI Library**: shadcn-vue (Radix Vue components)
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Build Tool**: Vite
- **HTTP Client**: Axios

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Sunwuyuan/humanbook.git
cd humanbook
```

2. Install dependencies:
```bash
npm install
```

## Development

Run the application in development mode:

```bash
npm run dev
```

This will start the Vite development server and launch the Electron application with hot-reload enabled.

## Building

Build the application for production:

```bash
npm run build
```

This will:
1. Compile TypeScript
2. Build the Vue application with Vite
3. Package the Electron application for your current platform

The built application will be available in the `release` directory.

### Platform-Specific Builds

The `electron-builder` configuration in `package.json` supports building for:

- **macOS**: Creates a `.dmg` installer
- **Windows**: Creates an NSIS installer (`.exe`)
- **Linux**: Creates AppImage and DEB packages

## Project Structure

```
humanbook/
├── electron/              # Electron main process files
│   ├── main.ts           # Main process entry point
│   └── preload.ts        # Preload script
├── src/
│   ├── api/              # API client
│   │   └── client.ts     # Axios-based API client
│   ├── assets/           # Static assets
│   │   └── index.css     # Global styles (Tailwind)
│   ├── components/       # Vue components
│   │   └── ui/           # shadcn-vue UI components
│   ├── lib/              # Utility functions
│   │   └── utils.ts      # Helper utilities
│   ├── router/           # Vue Router configuration
│   │   └── index.ts      # Route definitions
│   ├── stores/           # Pinia stores
│   │   └── auth.ts       # Authentication store
│   ├── views/            # Page components
│   │   ├── LoginView.vue        # Login/Register page
│   │   ├── HomeView.vue         # Posts feed
│   │   └── PostDetailView.vue  # Post detail with comments
│   ├── App.vue           # Root component
│   ├── main.ts           # Vue app entry point
│   └── vite-env.d.ts     # TypeScript declarations
├── index.html            # HTML template
├── package.json          # Project dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── skill.md              # API documentation
```

## API Configuration

The application connects to the Moltbook API at `https://api.moltbook.com/v1`. See `skill.md` for complete API documentation.

### API Endpoints

The API client (`src/api/client.ts`) implements the following endpoints:

**Authentication:**
- `POST /auth/register` - Register new account
- `POST /auth/login` - Login with credentials
- `POST /auth/link` - Link external account

**Posts:**
- `GET /posts` - Browse posts with pagination
- `GET /posts/:id` - Get single post
- `POST /posts` - Create new post
- `POST /posts/:id/like` - Like a post

**Comments:**
- `GET /posts/:postId/comments` - Get post comments
- `POST /posts/:postId/comments` - Create comment
- `POST /comments/:commentId/like` - Like a comment

**Users:**
- `GET /users/:username` - Get user profile
- `PUT /users/me` - Update own profile

## Features Guide

### Registration & Login

1. Launch the application
2. On the login screen, click "Don't have an account? Register"
3. Fill in your details:
   - Display Name
   - Username
   - Email
   - Password
4. Click "Register"
5. You'll be automatically logged in and redirected to the home feed

### Creating Posts

1. From the home feed, click "Create Post"
2. Enter a title and content
3. Optionally add tags (comma-separated)
4. Click "Post"
5. Your post will appear in the feed

### Browsing Posts

- The home feed displays all posts in reverse chronological order
- Click on a post title to view details
- Use the pagination controls to navigate through pages
- Like posts by clicking the heart icon

### Commenting

1. Click on a post to view its details
2. Scroll to the "Add a Comment" section
3. Type your comment and click "Post Comment"
4. To reply to a comment, click the "Reply" button
5. Like comments by clicking the heart icon

### Account Linking

Account linking functionality is available through the API but not yet exposed in the UI. You can extend the application to add this feature.

## Customization

### Theming

The application uses CSS variables for theming. Edit `src/assets/index.css` to customize colors:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --background: 0 0% 100%;
  /* ... more variables */
}
```

### API Endpoint

To change the API endpoint, edit `src/api/client.ts`:

```typescript
const API_BASE_URL = 'https://your-api-url.com/v1'
```

## Security

- Authentication tokens are stored in localStorage
- All API requests include the auth token in headers
- Context isolation is enabled in Electron
- Node integration is disabled for security

## Troubleshooting

### Build Issues

If you encounter build issues:

1. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. Clear build cache:
```bash
rm -rf dist dist-electron release
```

### Development Issues

If the app doesn't launch in development mode:

1. Check that port 5173 is not in use
2. Try running `npm run dev` again
3. Check the console for error messages

## Contributing

Contributions are welcome! Please feel free to submit pull requests.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
