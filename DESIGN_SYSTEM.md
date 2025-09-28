# Toto's Bureau Design System

## 🎨 Color Palette

### Primary Colors
- **Forest Green**: `#50957d` - Primary brand color
- **Teal**: `#09cba2` - Accent color for CTAs
- **Orange**: `#fd9f48` - Secondary accent
- **Yellow**: `#ffbd59` - Highlight color

### Neutral Colors
- **Background**: `hsl(30 25% 96%)` - Warm, off-white
- **Card**: `hsl(30 25% 98%)` - Slightly warmer than background
- **Muted**: `hsl(30 25% 94%)` - Subtle backgrounds
- **Border**: `hsl(30 25% 90%)` - Soft borders

## 📝 Typography

### Font Families
- **Primary**: Inter (300, 400, 500, 600, 700, 800)
- **Fallback**: Poppins, system-ui, sans-serif

### Font Sizes
- **Display**: 4xl (2.25rem) - Hero headings
- **Heading 1**: 3xl (1.875rem) - Page titles
- **Heading 2**: 2xl (1.5rem) - Section titles
- **Heading 3**: xl (1.25rem) - Card titles
- **Body**: base (1rem) - Regular text
- **Small**: sm (0.875rem) - Secondary text

## 🎯 Spacing System

### Consistent Spacing Scale
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

## 🧩 Component Guidelines

### Buttons
- **Primary**: Teal background with white text
- **Secondary**: Ghost variant with hover states
- **Size**: sm, md, lg variants
- **States**: Default, hover, active, disabled

### Cards
- **Background**: Gradient from card to primary/5
- **Border**: Subtle border with rounded corners
- **Shadow**: Soft shadow for depth
- **Padding**: Consistent internal spacing

### Forms
- **Input**: Rounded borders with focus states
- **Validation**: Red borders and error messages
- **Labels**: Clear, descriptive labels
- **Required**: Asterisk for required fields

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
- Start with mobile design
- Progressive enhancement for larger screens
- Touch-friendly button sizes (44px minimum)

## ♿ Accessibility

### Color Contrast
- Minimum 4.5:1 ratio for normal text
- Minimum 3:1 ratio for large text
- Test with color contrast analyzers

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Visible focus indicators

### Screen Readers
- Semantic HTML elements
- ARIA labels where needed
- Alt text for images

## 🎨 Visual Hierarchy

### Information Architecture
1. **Primary Actions**: Teal buttons, prominent placement
2. **Secondary Actions**: Ghost buttons, less prominent
3. **Navigation**: Clear, consistent placement
4. **Content**: Proper heading structure

### Visual Weight
- **Heavy**: Bold text, large sizes, bright colors
- **Medium**: Regular text, medium sizes, muted colors
- **Light**: Small text, subtle colors, secondary info

## 🚀 Performance Guidelines

### Code Splitting
- Lazy load page components
- Split vendor bundles
- Optimize bundle size

### Image Optimization
- WebP format preferred
- Responsive images
- Lazy loading for below-fold images

### Loading States
- Skeleton screens for content
- Spinners for actions
- Progressive loading

## 🔧 Development Standards

### File Organization
```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── contexts/      # React contexts
├── utils/         # Utility functions
├── hooks/         # Custom hooks
└── types/         # TypeScript types
```

### Naming Conventions
- **Components**: PascalCase (e.g., `ProductCard`)
- **Files**: kebab-case (e.g., `product-card.tsx`)
- **Variables**: camelCase (e.g., `productName`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Consistent indentation (2 spaces)

## 📊 Testing Strategy

### Unit Tests
- Component rendering
- User interactions
- State management

### Integration Tests
- Page navigation
- Form submissions
- API interactions

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation

## 🎯 Future Improvements

### Planned Enhancements
- Dark mode support
- Advanced animations
- Micro-interactions
- Advanced filtering
- Search suggestions
- Product recommendations

### Performance Optimizations
- Service worker implementation
- Advanced caching strategies
- Image optimization pipeline
- Bundle analysis and optimization
