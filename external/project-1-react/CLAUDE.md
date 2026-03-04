# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AgOffice is a Korean marketing management web application built with Next.js 14, React 18, TypeScript, and Tailwind CSS. It provides a comprehensive dashboard for managing contracts, tasks, revenue, and marketing performance metrics.

## Tech Stack

- **Framework**: Next.js 14.2.16 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI + shadcn/ui (New York style)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React, Heroicons
- **Package Manager**: pnpm

## Development Commands

```bash
# Start development server with Turbo
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Project Structure

### App Router (Next.js 14)

The application uses the Next.js App Router with the following key routes:

- `/` - Landing page
- `/dashboard` - Main dashboard with customizable widgets
- `/login` & `/signup` - Authentication pages
- `/contract` - Contract management
- `/work` - Task/work status tracking
- `/posting` - Posting status
- `/keywords` - Keyword performance tracking
- `/revenue` - Revenue tracking
- `/performance` - Performance metrics
- `/chatbot` - AI chatbot support
- `/notices` - Notice board (with dynamic routes `/notices/[id]`)
- `/organization` - Organization management
- `/find` - Search functionality

### Component Architecture

**Layout Components:**
- `components/header.tsx` - Global header with notifications, user menu, and search
- `components/sidebar.tsx` - Collapsible sidebar navigation with workspace selector
  - Desktop: Toggles between collapsed (64px) and expanded (256px) states
  - Mobile: Slide-in overlay with backdrop
  - Includes workspace switching functionality

**UI Components (shadcn/ui):**
- Located in `components/ui/`
- Custom components include:
  - `custom-tabs.tsx` - Custom tab component
  - `custom-datepicker.tsx` - Date picker with Korean locale support
  - `common-select.tsx` - Reusable select component
  - `data-table.tsx` - Data table with sorting/filtering
  - `loading-modal.tsx`, `loading-bar.tsx`, `loading-animation.tsx` - Loading states
  - `event-popup.tsx` - Event popup with localStorage persistence
  - `alert-confirm-modal.tsx` - Confirmation modals
  - `search-filter-panel.tsx` - Search and filter UI
  - `step-indicator.tsx`, `step-navigation.tsx` - Multi-step forms

**Utilities:**
- `lib/utils.ts` - Common utility functions including `cn()` for className merging
- `lib/toast-utils.ts` - Toast notification utilities
- `hooks/use-mobile.ts` - Mobile detection hook
- `hooks/use-toast.ts` - Toast hook

### Path Aliases

```typescript
"@/*" -> "./*"
"@/components" -> "./components"
"@/lib" -> "./lib"
"@/hooks" -> "./hooks"
```

## Key Architectural Patterns

### Responsive Design

The application uses a mobile-first responsive design with breakpoints:
- Mobile: < 768px (md)
- Tablet: 768px - 1024px (lg)
- Desktop: 1024px+ (xl)

The sidebar has different behaviors:
- Desktop (xl+): Sticky sidebar with collapse/expand toggle
- Mobile/Tablet (< xl): Fixed overlay sidebar with backdrop

### Dashboard Widget System

The dashboard (`/dashboard`) implements a drag-and-drop widget system:

1. **Widget Management**: Users can add/remove widgets through a dialog
2. **Drag & Drop**: Widgets can be reordered in edit mode
3. **Widget Categories**: Widgets are organized by category (계약, 매출, 업무, 포스팅, 성과, 고객)
4. **Widget Types**: Includes charts (line, bar, pie, area), cards, and custom visualizations
5. **State Persistence**: Widget configuration can be saved (currently in-memory)

Widget data is defined in `app/dashboard/page.tsx` with rendering logic in `renderWidget()`.

### Styling Conventions

- Uses CSS variables for theming (defined in `app/globals.css`)
- Korean font: Pretendard (loaded via CDN in `app/layout.tsx`)
- Consistent spacing: Uses Tailwind's spacing scale
- Rounded corners: Typically `rounded-lg` or `rounded-2xl` for cards
- Shadows: `shadow-none` or `shadow-lg` for depth
- Colors: Primary color is defined via `--primary` CSS variable

### Form Handling

Forms use React Hook Form with Zod validation:
- Schema validation with Zod
- Form components from `components/ui/form.tsx`
- Custom form fields with proper error handling

### Data Visualization

Charts use Recharts library with consistent theming:
- Color palette defined in chart components (primary, orange, green, purple)
- Responsive containers for all charts
- Custom tooltips with white background and border styling
- Gradient fills for area charts

## Korean Language Support

The application is fully Korean-localized:
- All UI text is in Korean
- Date formatting uses Korean locale
- Font: Pretendard typeface
- Currency: Korean Won (₩)

## Build Configuration

### Next.js Config (`next.config.mjs`)

```javascript
{
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true }
}
```

**Important**: TypeScript and ESLint errors are ignored during builds. When fixing bugs, always run type checking manually.

### TypeScript Config

- Strict mode enabled
- Path aliases configured
- Target: ES6
- Module resolution: bundler

## Common Development Tasks

### Adding a New Page

1. Create page in `app/[route]/page.tsx`
2. Add navigation item to `components/sidebar.tsx` in appropriate menu group
3. Update the `getActiveMenuItems()` function to handle active state
4. Follow existing layout pattern with Header and Sidebar components

### Adding a New Widget to Dashboard

1. Add widget definition to `defaultWidgets` array in `app/dashboard/page.tsx`
2. Add rendering logic in `renderWidget()` switch statement
3. Add widget to the dialog list with category, name, and description
4. Use consistent chart theming from `chartPalette`

### Creating a New UI Component

1. Place in `components/ui/` if it's a reusable primitive
2. Use Radix UI primitives when possible
3. Follow shadcn/ui patterns for composition
4. Export from the component file

### Styling Guidelines

- Use Tailwind utility classes
- Leverage CSS variables for theme colors: `var(--primary)`, `var(--muted-foreground)`, etc.
- Use `cn()` utility for conditional classes
- Maintain responsive design with mobile-first approach

## Important Notes

- The application currently has no backend integration (using mock data)
- Authentication pages are UI-only (no actual auth implementation)
- Workspace selection is UI-only (no actual workspace switching)
- Event popup uses localStorage to track "don't show again" state
- Global state is managed with React useState (no external state management)

## Component Props Patterns

### Page-Level Components

Most page components follow this pattern:
```typescript
- Include Header with sidebar collapse toggle
- Include Sidebar with currentPage prop for active state
- Main content area with consistent padding: `p-4 lg:p-6`
```

### Common Props

- `className`: For style overrides (always merge with `cn()`)
- `sidebarCollapsed` / `onToggleSidebar`: Sidebar state management
- `currentPage`: For active menu highlighting

## File Naming Conventions

- Components: kebab-case (e.g., `custom-tabs.tsx`)
- Pages: `page.tsx` (Next.js App Router convention)
- Utilities: kebab-case (e.g., `toast-utils.ts`)
- All files use `.tsx` for components, `.ts` for utilities
