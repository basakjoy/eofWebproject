# ResponsiveVideo Component Guide

A flexible, reusable React component for embedding responsive videos in your Next.js application.

## Basic Usage

### Using a Local Video File

```tsx
import ResponsiveVideo from '@/components/common/ResponsiveVideo';

export default function MyComponent() {
  return (
    <ResponsiveVideo
      src="trading-hero.mp4"
      isExternalUrl={false}
      loop={true}
      autoPlay={true}
      muted={true}
    />
  );
}
```

**Note:** Local videos should be placed in the `public/videos/` folder. They are referenced without the `/videos/` prefix.

### Using an External URL

```tsx
<ResponsiveVideo
  src="https://example.com/path/to/video.mp4"
  isExternalUrl={true}
  loop={true}
  autoPlay={true}
  muted={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | Required | Video source URL or filename |
| `isExternalUrl` | `boolean` | `true` | Set to `false` for local videos in `/public/videos/` |
| `autoPlay` | `boolean` | `true` | Automatically start playing when component loads |
| `muted` | `boolean` | `true` | Mute audio by default (required for autoPlay in most browsers) |
| `loop` | `boolean` | `true` | Loop the video continuously |
| `controls` | `boolean` | `false` | Show video player controls |
| `playsInline` | `boolean` | `true` | Play inline on mobile (recommended) |
| `poster` | `string` | undefined | Thumbnail image URL to show before playback |
| `title` | `string` | `'Video'` | Video title for accessibility |
| `className` | `string` | `'w-full h-auto'` | Custom video element classes |
| `containerClassName` | `string` | `'relative w-full rounded-3xl overflow-hidden group'` | Custom container classes |
| `showPlayButton` | `boolean` | `false` | Show a play button overlay |
| `animationVariants` | `object` | Framer Motion config | Custom animation settings |

## Examples

### Hero Section with Local Video

```tsx
<ResponsiveVideo
  src="hero-background.mp4"
  isExternalUrl={false}
  autoPlay={true}
  loop={true}
  muted={true}
  containerClassName="w-full h-screen object-cover"
/>
```

### Video with Play Button

```tsx
<ResponsiveVideo
  src="https://example.com/demo-video.mp4"
  isExternalUrl={true}
  showPlayButton={true}
  autoPlay={false}
  loop={false}
  controls={true}
/>
```

### Video with Poster Image

```tsx
<ResponsiveVideo
  src="product-demo.mp4"
  isExternalUrl={false}
  poster="/images/video-thumbnail.jpg"
  autoPlay={true}
  loop={true}
  muted={true}
/>
```

### Custom Animation

```tsx
<ResponsiveVideo
  src="testimonial.mp4"
  isExternalUrl={false}
  animationVariants={{
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }}
/>
```

## Setting Up Local Videos

1. Create a `videos` folder in your `public` directory:
   ```
   public/
   ├── videos/
   │   ├── trading-hero.mp4
   │   ├── demo.mp4
   │   └── testimonial.mp4
   └── images/
   ```

2. Reference videos by filename:
   ```tsx
   <ResponsiveVideo src="trading-hero.mp4" isExternalUrl={false} />
   ```

## Video Formats & Best Practices

### Supported Formats
- `.mp4` (H.264 codec) - Most compatible
- `.webm` - Better compression for web
- `.ogv` - Fallback format

### Recommendations
1. **Compress videos** to reduce load times
2. **Use MP4 format** for best browser compatibility
3. **Provide a poster image** for better perceived performance
4. **Keep file size under 10MB** for hero videos
5. **Always mute autoplay videos** (browser requirement)
6. **Use HTTPS** for external video URLs

## Error Handling

The component includes built-in error handling:
- If a video fails to load, an error message is displayed
- Check browser console for specific error details
- Ensure video files are accessible and proper formats

## Responsive Behavior

The component automatically handles:
- Desktop, tablet, and mobile viewports
- Maintains aspect ratio across all screen sizes
- Hover animations and interactions
- Touch-friendly play button on mobile

## CSS Classes Available

Customize appearance with these class combinations:

```tsx
// Full width, responsive height
className="w-full h-auto"

// Fixed aspect ratio
className="w-full aspect-video"

// Full screen
className="w-screen h-screen object-cover"
```

## Integration with IntroSection

The component is already integrated in `IntroSection.tsx`:

```tsx
<ResponsiveVideo
  src="trading-hero.mp4"
  isExternalUrl={false}
  autoPlay={true}
  loop={true}
  muted={true}
  controls={false}
  title="Trading Platform Demo"
/>
```

## Next Steps

1. **Add your video:** Place your video file in `public/videos/`
2. **Update src prop:** Change `src="trading-hero.mp4"` to your filename
3. **Customize:** Adjust props for your specific needs
4. **Test:** Check on different devices and browsers

## Troubleshooting

### Video Not Playing
- Ensure `muted={true}` for autoplay videos
- Check that video file exists in correct location
- Verify video format is supported

### Video Not Responsive
- Use `className="w-full h-auto"` (default)
- Add `containerClassName` with proper sizing

### External URLs Not Loading
- Ensure `isExternalUrl={true}`
- Check CORS headers on the video host
- Verify URL is accessible from browser

---

For more details, check the component source: `src/components/common/ResponsiveVideo.tsx`
