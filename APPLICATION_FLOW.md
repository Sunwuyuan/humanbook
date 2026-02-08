# HumanBook Application Flow

## User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                      Application Launch                         │
│                     (Electron Window)                           │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │  Check Auth?     │
                    └──────────────────┘
                         │          │
                   No    │          │    Yes
                         │          │
            ┌────────────┘          └────────────┐
            ▼                                     ▼
   ┌─────────────────┐                  ┌──────────────┐
   │  Login/Register │                  │  Home Feed   │
   │     View        │                  │   (Posts)    │
   └─────────────────┘                  └──────────────┘
            │                                     │
            │ Authenticate                        │
            └──────────────┬──────────────────────┘
                           ▼
                  ┌──────────────────┐
                  │    Home Feed     │
                  │  (Authenticated) │
                  └──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Create Post  │  │  View Post   │  │   Account    │
│   (Modal)    │  │   Details    │  │   Settings   │
└──────────────┘  └──────────────┘  └──────────────┘
                           │
                           ▼
                  ┌──────────────┐
                  │   Comments   │
                  │  & Replies   │
                  └──────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           App.vue                               │
│                      (Root Component)                           │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Vue Router                               │
│                   (Route Management)                            │
└─────────────────────────────────────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ LoginView    │      │  HomeView    │      │ AccountView  │
│              │      │              │      │              │
│ ┌──────────┐ │      │ ┌──────────┐ │      │ ┌──────────┐ │
│ │  Card    │ │      │ │  Card    │ │      │ │  Card    │ │
│ │  Input   │ │      │ │  Button  │ │      │ │  Input   │ │
│ │  Button  │ │      │ │  Post*   │ │      │ │  Button  │ │
│ └──────────┘ │      │ └──────────┘ │      │ └──────────┘ │
└──────────────┘      └──────────────┘      └──────────────┘
                               │
                               ▼
                      ┌──────────────┐
                      │PostDetailView│
                      │              │
                      │ ┌──────────┐ │
                      │ │  Card    │ │
                      │ │  Textarea│ │
                      │ │  Comment*│ │
                      │ └──────────┘ │
                      └──────────────┘
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Pinia Store                              │
│                      (Auth Store)                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  State:                                                   │  │
│  │  - user                                                   │  │
│  │  - token                                                  │  │
│  │  - isAuthenticated                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Actions:                                                 │  │
│  │  - login()      → API call → Set user & token           │  │
│  │  - register()   → API call → Set user & token           │  │
│  │  - logout()     → Clear state & localStorage            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                     ┌──────────────────┐
                     │   localStorage   │
                     │  (Token Persist) │
                     └──────────────────┘
```

## API Communication Flow

```
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│             │          │             │          │             │
│   Vue       │  HTTP    │   Axios     │  HTTP    │  Moltbook   │
│ Components  │ Request  │  API Client │ Request  │   API       │
│             │ ────────>│             │ ────────>│  Server     │
│             │          │             │          │             │
└─────────────┘          └─────────────┘          └─────────────┘
      │                         │                         │
      │                         │                         │
      │                         │ Response                │
      │                         │<────────────────────────┘
      │                         │
      │                         │ (Transform)
      │                         │
      │  Vue State Update       │
      │<────────────────────────┘
      │
      ▼
┌─────────────┐
│     UI      │
│   Update    │
└─────────────┘

Interceptors:
1. Request: Add Authorization header (Bearer token)
2. Response: Handle errors, transform data
```

## Feature Interactions

### Creating a Post
```
User → Click "Create Post" 
     → Modal opens (HomeView)
     → Fill form (title, content, tags)
     → Submit
     → API.createPost()
     → Success → Close modal
     → Reload feed
     → New post appears
```

### Viewing & Commenting
```
User → Click post title
     → Navigate to /post/:id (PostDetailView)
     → Load post details
     → Load comments
     → User writes comment
     → Submit
     → API.createComment()
     → Success → Reload comments
     → New comment appears
```

### Account Linking
```
User → Click "Account"
     → Navigate to /account (AccountView)
     → Fill platform details
     → Submit
     → API.linkAccount()
     → Success → Show in linked accounts list
```

## Build & Distribution Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Source     │     │     Vite     │     │   Electron   │
│    Code      │────>│    Build     │────>│   Builder    │
│  (Vue/TS)    │     │  (Bundle)    │     │  (Package)   │
└──────────────┘     └──────────────┘     └──────────────┘
                                                   │
                        ┌──────────────────────────┼──────────────────────────┐
                        │                          │                          │
                        ▼                          ▼                          ▼
                ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
                │   Windows    │          │    macOS     │          │    Linux     │
                │    .exe      │          │    .dmg      │          │  AppImage    │
                │   (NSIS)     │          │              │          │    .deb      │
                └──────────────┘          └──────────────┘          └──────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Electron Security                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Main Process                                             │  │
│  │  - Node.js access                                        │  │
│  │  - File system access                                    │  │
│  │  - System APIs                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│                   Context Bridge (Isolated)                     │
│                            │                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Renderer Process                                        │  │
│  │  - Vue application                                       │  │
│  │  - No Node.js access                                    │  │
│  │  - No direct system access                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                     ┌──────────────────┐
                     │   HTTPS Only     │
                     │   API Calls      │
                     └──────────────────┘
```

This architecture ensures security through:
- Context isolation
- No node integration in renderer
- Secure token storage
- HTTPS API communication
- XSS protection via Vue
