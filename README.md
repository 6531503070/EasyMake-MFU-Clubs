# MFU Clubs Website

A modern, responsive web application for Mae Fah Luang University student clubs and activities. Built with Next.js, TypeScript, and Framer Motion.

## Features

- **Home Page**: Stunning hero section with "Laced of ART" branding, featured clubs, and "Stay Connected" features
- **Activities Page**: Event feed with social engagement, upcoming events grid, and category filtering
- **Club Page**: Browse all clubs with grid/list view toggle, search, and category filters
- **Club Detail Page**: Comprehensive club information with About/Events/Gallery tabs
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices
- **Smooth Animations**: Framer Motion animations throughout for enhanced UX
- **Bilingual Support**: Ready for Thai/English content (infrastructure in place)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui
- **Database**: Supabase (ready for integration)
- **Fonts**: Geist Sans, Geist Mono, Playfair Display

## Project Structure

\`\`\`
mfu-clubs-website/
├── app/
│   ├── activities/          # Activities feed page
│   ├── club/
│   │   ├── [id]/           # Dynamic club detail page
│   │   └── page.tsx        # Clubs listing page
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles and design tokens
├── components/
│   ├── navigation.tsx      # Main navigation bar
│   ├── footer.tsx          # Footer component
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── mock-data.ts        # Mock data for development
│   └── utils.ts            # Utility functions
└── public/                 # Static assets and images
\`\`\`

## Design System

### Colors

- **Primary**: Gold (#d4af37) - Brand color for CTAs and highlights
- **Background**: Dark (#0a0a0a) - Main background
- **Surface**: Dark Gray (#1a1a1a) - Card backgrounds
- **Foreground**: White (#ffffff) - Primary text
- **Muted**: Gray (#a0a0a0) - Secondary text

### Typography

- **Headings**: Playfair Display (serif, elegant)
- **Body**: Geist Sans (modern, readable)
- **Code**: Geist Mono (monospace)

### Layout Principles

- Mobile-first responsive design
- Flexbox for most layouts
- CSS Grid for complex 2D layouts
- Consistent spacing using Tailwind scale
- Smooth animations with Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Integration (Future)

The application is ready for Supabase integration:

1. Set up Supabase project
2. Add environment variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

3. Create database tables based on types in `lib/types.ts`:
   - `clubs`
   - `events`
   - `users`
   - `follows`
   - `notifications`

4. Replace mock data with Supabase queries

## Features Roadmap

### Phase 1 (MVP) - Completed
- [x] Home page with hero and featured clubs
- [x] Activities feed page
- [x] Clubs listing page
- [x] Club detail page
- [x] Responsive navigation and footer
- [x] Design system and animations

### Phase 2 (Next)
- [ ] User authentication (Supabase Auth)
- [ ] Database integration
- [ ] Follow/unfollow clubs
- [ ] Event registration
- [ ] Notification system
- [ ] Search functionality

### Phase 3 (Future)
- [ ] AI-powered recommendations
- [ ] Admin dashboard for club management
- [ ] Event calendar view
- [ ] User profiles
- [ ] Social features (likes, comments, shares)
- [ ] Bilingual content switching

## Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus visible states
- Screen reader friendly
- High contrast text

## Performance

- Image optimization with Next.js Image
- Code splitting with App Router
- Lazy loading for images
- Optimized animations
- Minimal bundle size

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This project follows best practices for:
- TypeScript strict mode
- ESLint configuration
- Component modularity
- Consistent naming conventions
- Comprehensive type definitions

## License

© 2025 Mae Fah Luang University. All rights reserved.

## Contact

For questions or support, contact the Student Affairs Division at Mae Fah Luang University.
