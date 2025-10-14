# Architecture Documentation

## Overview

The MFU Clubs website follows a modern Next.js App Router architecture with a focus on performance, maintainability, and scalability.

## Architecture Principles

### 1. Modular Monolith (MVP)
- Single codebase with clear domain boundaries
- Organized by feature (clubs, events, activities)
- Easy to extract into microservices later

### 2. Component-Based Architecture
- Reusable UI components (shadcn/ui)
- Feature-specific components
- Shared layout components (Navigation, Footer)

### 3. Type Safety
- TypeScript throughout
- Comprehensive type definitions in `lib/types.ts`
- Type-safe API calls (ready for Supabase)

## Directory Structure

### `/app` - Application Routes
- **App Router**: Next.js 15 file-based routing
- **Server Components**: Default for better performance
- **Client Components**: Only when needed (animations, interactivity)

### `/components` - Reusable Components
- **UI Components**: shadcn/ui primitives
- **Feature Components**: Navigation, Footer
- **Layout Components**: Shared across pages

### `/lib` - Business Logic
- **Types**: TypeScript definitions
- **Mock Data**: Development data
- **Utils**: Helper functions
- **API Clients**: (Future) Supabase queries

### `/public` - Static Assets
- Images and media files
- Optimized with Next.js Image component

## Data Flow

### Current (MVP with Mock Data)
\`\`\`
Component → Mock Data (lib/mock-data.ts) → Render
\`\`\`

### Future (With Supabase)
\`\`\`
Component → API Client (lib/supabase.ts) → Supabase → Render
\`\`\`

## State Management

### Current Approach
- React useState for local state
- URL params for navigation state
- No global state needed yet

### Future Considerations
- SWR for data fetching and caching
- React Context for user authentication
- Zustand for complex client state (if needed)

## Styling Architecture

### Tailwind CSS v4
- Utility-first approach
- Custom design tokens in `globals.css`
- Responsive design with mobile-first breakpoints

### Design Tokens
\`\`\`css
--color-primary: #d4af37 (Gold)
--color-background: #0a0a0a (Dark)
--color-surface: #1a1a1a (Dark Gray)
--color-foreground: #ffffff (White)
\`\`\`

## Animation Strategy

### Framer Motion
- Page transitions
- Scroll-triggered animations
- Hover effects
- Stagger animations for lists

### Performance Considerations
- `viewport={{ once: true }}` for scroll animations
- Optimized animation properties (transform, opacity)
- Reduced motion support (future)

## Routing Strategy

### Static Routes
- `/` - Home page
- `/club` - Clubs listing
- `/activities` - Activities feed

### Dynamic Routes
- `/club/[id]` - Club detail page

### Future Routes
- `/auth/login` - Authentication
- `/profile` - User profile
- `/admin` - Admin dashboard

## Database Schema (Future)

### Core Tables

**clubs**
- id, name, description, category
- cover_image, logo, member_count
- contact_email, social_links
- created_at, updated_at

**events**
- id, club_id, title, description
- cover_image, date, time, location
- capacity, registered_count, status
- created_at, updated_at

**users**
- id, student_id, name, email
- faculty, year, interests
- followed_clubs, language, avatar
- created_at, updated_at

**follows**
- id, user_id, club_id
- created_at

**notifications**
- id, user_id, type, content
- read, created_at

## Security Considerations

### Current
- No authentication (public pages)
- No sensitive data handling

### Future
- Supabase Row Level Security (RLS)
- JWT-based authentication
- PDPA compliance for user data
- Input validation and sanitization
- Rate limiting for API calls

## Performance Optimization

### Current
- Next.js Image optimization
- Code splitting with App Router
- Lazy loading images
- Optimized fonts (Geist, Playfair)

### Future
- SWR for data caching
- Redis for session management
- CDN for static assets
- Database query optimization
- Server-side rendering for SEO

## Scalability Plan

### Phase 1: MVP (Current)
- Static pages with mock data
- Client-side rendering
- Single deployment

### Phase 2: Database Integration
- Supabase integration
- Server-side data fetching
- User authentication

### Phase 3: Advanced Features
- Real-time notifications
- AI recommendations
- Analytics dashboard
- Admin panel

### Phase 4: Microservices (If Needed)
- Separate services for:
  - User management
  - Event management
  - Notification service
  - Recommendation engine

## Testing Strategy (Future)

### Unit Tests
- Component testing with Jest
- Utility function tests

### Integration Tests
- API endpoint tests
- Database query tests

### E2E Tests
- User flow testing with Playwright
- Critical path coverage

## Deployment

### Current
- Vercel deployment
- Automatic preview deployments
- Production deployment on merge

### Future
- CI/CD pipeline
- Automated testing
- Database migrations
- Environment-specific configs

## Monitoring (Future)

### Application Monitoring
- Vercel Analytics
- Error tracking (Sentry)
- Performance monitoring

### User Analytics
- Event tracking
- User behavior analysis
- A/B testing

## Compliance

### PDPA (Thailand)
- User consent for data collection
- Data retention policies
- Right to access/delete data
- Secure data storage

### Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode

## Documentation Standards

### Code Comments
- JSDoc for functions
- Inline comments for complex logic
- Component prop documentation

### README Files
- Setup instructions
- Feature documentation
- API documentation (future)

## Maintenance

### Regular Updates
- Dependency updates
- Security patches
- Performance optimization
- Bug fixes

### Code Quality
- TypeScript strict mode
- ESLint rules
- Prettier formatting
- Code reviews
