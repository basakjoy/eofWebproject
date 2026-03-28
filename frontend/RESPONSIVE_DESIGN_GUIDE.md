# Responsive Design Guide for EOF Web Project

## Overview
This guide outlines the responsive design patterns and best practices implemented in the EOF web application. The site is designed to be fully responsive across mobile, tablet, and desktop devices.

## Breakpoints

The project uses the following Tailwind CSS breakpoints:

- **xs**: 320px (small mobile phones)
- **sm**: 640px (large mobile phones and small tablets)
- **md**: 768px (tablets)
- **lg**: 1024px (small laptops)
- **xl**: 1280px (laptops)
- **2xl**: 1536px (large desktops)

### Usage Examples

```jsx
// Mobile-first approach - start with mobile styles
<div className="px-4 sm:px-6 md:px-8 lg:px-12">
  {/* 16px padding on mobile, 24px on sm, 32px on md, 48px on lg */}
</div>

// Text scaling
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>

// Grid layouts
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* 1 column on mobile, 2 on sm, 3 on md, 4 on lg */}
</div>
```

## Typography Scales

### Headings
- **H1**: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl` (landing pages)
- **H2**: `text-2xl sm:text-3xl md:text-4xl lg:text-5xl`
- **H3**: `text-xl sm:text-2xl md:text-3xl`
- **H4**: `text-lg sm:text-xl md:text-2xl`
- **Body**: `text-sm sm:text-base md:text-lg`
- **Small**: `text-xs sm:text-sm`

### Usage
```jsx
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
  Main Title
</h1>
<p className="text-sm sm:text-base md:text-lg text-gray-400">
  Body text that scales across devices
</p>
```

## Spacing Patterns

Use these responsive spacing patterns consistently:

```jsx
// Padding
<div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">Content</div>

// Margins
<div className="mb-6 sm:mb-8 md:mb-12">Content</div>

// Gap in grids/flex
<div className="grid gap-4 sm:gap-6 md:gap-8">Items</div>
```

## Grid Layouts

### Common Patterns

**Two Column with Responsive Breakpoints**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
  <div>Left column</div>
  <div>Right column</div>
</div>
```

**Three Column with Responsive Breakpoints**
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>
```

**Four Column Dashboard Grid**
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  <StatCard>Stat 1</StatCard>
  <StatCard>Stat 2</StatCard>
  <StatCard>Stat 3</StatCard>
  <StatCard>Stat 4</StatCard>
</div>
```

## Charts and Visualizations

When implementing responsive charts (using Recharts):

```jsx
const [isMobile, setIsMobile] = useState(false);
const [isTablet, setIsTablet] = useState(false);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 640);
    setIsTablet(window.innerWidth < 1024 && window.innerWidth >= 640);
  };

  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

const chartHeight = isMobile ? 250 : isTablet ? 280 : 320;

<div className="w-full h-64 sm:h-72 md:h-80">
  <ResponsiveContainer width="100%" height={chartHeight}>
    <LineChart data={data}>
      {/* Chart components with responsive font sizes */}
      <XAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
      <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
      <Line strokeWidth={isMobile ? 2 : 3} />
    </LineChart>
  </ResponsiveContainer>
</div>
```

## Tables

Tables should be horizontally scrollable on mobile devices:

```jsx
<div className="overflow-x-auto">
  <table className="w-full text-xs sm:text-sm">
    <thead>
      <tr>
        <th className="text-left py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap">Column 1</th>
        <th className="text-center py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap">Column 2</th>
        <th className="text-right py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap hidden sm:table-cell">Desktop Only</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="py-3 sm:py-4 px-2 sm:px-4">Data</td>
        <td className="py-3 sm:py-4 px-2 sm:px-4">Data</td>
        <td className="py-3 sm:py-4 px-2 sm:px-4 hidden sm:table-cell">Data</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Buttons

Responsive button sizing:

```jsx
<button className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm md:text-base rounded-lg">
  Click Me
</button>
```

## Cards and Panels

**Card Container Pattern**
```jsx
<div className="p-4 sm:p-6 md:p-8 rounded-lg border transition-all">
  <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6">
    Card Title
  </h2>
  <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
    Card content with responsive padding
  </p>
</div>
```

## Mobile-Specific Utilities

### Hiding Elements
```jsx
{/* Hide on mobile, show on tablet and up */}
<div className="hidden sm:block">Desktop content</div>

{/* Show on mobile, hide on tablet and up */}
<div className="sm:hidden">Mobile content</div>

{/* Show only on mobile */}
<div className="md:hidden">Mobile only</div>
```

### Responsive Flex Direction
```jsx
{/* Stack vertically on mobile, horizontal on desktop */}
<div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
  <div className="flex-1">Item 1</div>
  <div className="flex-1">Item 2</div>
</div>
```

## Common Components

### Hero Section
```jsx
<section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-24">
  <div className="max-w-5xl mx-auto w-full text-center">
    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6">
      Hero Title
    </h1>
    <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 sm:mb-8">
      Hero subtitle
    </p>
  </div>
</section>
```

### Stats Section
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  <div>
    <p className="text-xs sm:text-sm text-gray-400">Label</p>
    <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2">$100M+</p>
  </div>
</div>
```

## Admin Layouts

For admin dashboards with sidebars:

```jsx
<div className="flex flex-col md:flex-row">
  {/* Sidebar - hidden on mobile, use drawer */}
  <aside className="hidden md:block w-64 bg-gray-900">
    Mobile drawer toggles this on small screens
  </aside>
  
  {/* Main Content */}
  <main className="flex-1">
    Content area
  </main>
</div>
```

## Testing Responsive Design

### Manual Testing
Test these common viewport sizes:
- iPhone SE: 375px
- iPhone 12/13: 390px
- iPhone 14 Pro: 393px
- iPad Mini: 768px
- iPad Pro: 1024px
- Laptop: 1440px+

### Testing Approach
1. Test text readability and scaling
2. Verify touch targets are large enough (44px minimum)
3. Check horizontal scrolling on narrow screens
4. Ensure modals/dropdowns don't overflow
5. Verify navigation is accessible on mobile
6. Test form input sizing and spacing

## Performance Considerations

1. **Avoid window.innerWidth/innerHeight** - Use ResizeObserver or media queries when possible
2. **Use CSS media queries** first, JavaScript as fallback
3. **Lazy load images** - Use `<picture>` tag for different screen sizes
4. **Optimize for touch** - Use larger touch targets on mobile
5. **Test performance** - Use Chrome DevTools mobile simulation

## Best Practices

1. **Mobile-first** - Style for mobile first, then add larger breakpoints
2. **Progressive Enhancement** - Core functionality works everywhere
3. **Touch-friendly** - Buttons/links should be at least 44x44px
4. **Readable text** - Minimum 16px font size on mobile
5. **Avoid horizontal scroll** - Design should be scrollable vertically only
6. **Test on real devices** - Browser simulation isn't always accurate
7. **Maintain aspect ratios** - Use aspect-ratio or padding-bottom trick
8. **Shadow/depth** - Be subtle with shadows on small screens

## Common Issues and Solutions

### Issue: Text too large on mobile
**Solution**: Use responsive font sizes starting smaller
```jsx
// ❌ Wrong
<h1 className="text-7xl">Title</h1>

// ✅ Right
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl">Title</h1>
```

### Issue: Content overflows on mobile
**Solution**: Use proper padding and limit container width
```jsx
// ✅ Right
<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
  {/* Content won't overflow */}
</div>
```

### Issue: Dropdowns/modals cut off on mobile
**Solution**: Use proper positioning and check for viewport bounds
```jsx
// For dropdowns
<div className="absolute right-0 sm:left-0 mt-1 w-40 sm:w-48">
  {/* Dropdown content */}
</div>
```

## Resources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Mobile-First CSS](https://www.nngroup.com/articles/mobile-first-css/)

---

Last Updated: March 2026
