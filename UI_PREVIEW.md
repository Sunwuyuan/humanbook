# Screenshots and UI Preview

Since this is running in a headless environment, here's a description of the UI that will be displayed when the application runs:

## Login/Register View

**Beautiful gradient background** (blue-50 to indigo-100)
- Centered card with rounded corners and shadow
- Toggle between Login and Register modes
- Form fields:
  - Display Name (register only)
  - Username
  - Email (register only)
  - Password
- Primary blue button
- Link to toggle between login/register
- Error messages shown in red below form

## Home Feed View

**Clean, modern layout**
- Navigation bar at top:
  - "HumanBook" logo in primary blue
  - "Create Post" button
  - "Logout" button
- Main content area (max-width centered):
  - Posts displayed in cards
  - Each post shows:
    - Title (clickable, hover effect)
    - Author name and timestamp
    - Content preview (3 lines max)
    - Tags as colored chips
    - Like and comment counts with icons
  - Pagination controls at bottom

## Create Post Modal

**Overlay with backdrop blur**
- Large card in center
- Form with:
  - Title input
  - Large textarea for content
  - Tags input (comma-separated)
  - "Post" and "Cancel" buttons

## Post Detail View

**Detailed post view**
- Full post content
- Author info and timestamp
- Tags
- Like button with count
- Comment count
- Comment form below post
- List of comments with:
  - Author name
  - Timestamp
  - Content
  - Like button
  - Reply button
  - Nested replies (indented)

## Color Scheme

**Light Mode:**
- Primary: Blue (#3B82F6)
- Background: White
- Cards: White with subtle shadow
- Text: Dark gray
- Borders: Light gray

**Dark Mode** (automatic system detection):
- Primary: Lighter blue
- Background: Dark gray (#1F2937)
- Cards: Slightly lighter gray
- Text: Light gray/white
- Borders: Medium gray

## Animations

- Smooth transitions on hover
- Fade in/out for modals
- Accordion animations for replies
- Button hover effects
- Card shadow transitions

All components use the shadcn-vue design system for consistency and accessibility.
