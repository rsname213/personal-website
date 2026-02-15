# Website Building with Iterative UI Perfection

## Overview
This skill provides best practices for building polished, production-ready websites through iterative refinement loops. Use this when users provide a design reference and want Claude Code to build and perfect a website through systematic iterations.

## When to Use This Skill
- User provides a design reference (screenshot, URL, or description) and wants a website built
- User asks to "make it look like [design]" or "build something similar to [site]"
- User wants iterative refinement to match a specific aesthetic
- User is working in Claude Code and wants UI perfection through loops

## Core Workflow

### Phase 1: Design Analysis
When user provides a design reference, start by analyzing:

1. **Visual hierarchy**: What draws attention first, second, third?
2. **Color palette**: Primary, secondary, accent colors and their usage
3. **Typography**: Font families, weights, sizes, line heights
4. **Spacing system**: Padding/margin patterns (e.g., 8px base unit, 16px, 24px, 32px)
5. **Layout structure**: Grid system, max-widths, breakpoints
6. **Component patterns**: Buttons, cards, navigation, forms
7. **Micro-interactions**: Hover states, transitions, animations
8. **Responsive behavior**: How layout adapts across breakpoints

### Phase 2: Initial Build
Create the foundational structure:

```bash
# Set up project structure
mkdir -p project-name/{css,js,images}
cd project-name
```

**index.html** - Semantic HTML structure
- Use semantic tags (header, nav, main, section, article, footer)
- Include proper meta tags (viewport, description, charset)
- Structure content hierarchy before styling

**css/styles.css** - Design system first
```css
/* 1. CSS Variables for design tokens */
:root {
  /* Colors */
  --color-primary: #...;
  --color-secondary: #...;
  --color-accent: #...;
  --color-text: #...;
  --color-bg: #...;
  
  /* Typography */
  --font-primary: 'Font Name', sans-serif;
  --font-secondary: 'Font Name', serif;
  
  /* Spacing scale (8px base) */
  --space-xs: 0.5rem;   /* 8px */
  --space-sm: 1rem;     /* 16px */
  --space-md: 1.5rem;   /* 24px */
  --space-lg: 2rem;     /* 32px */
  --space-xl: 3rem;     /* 48px */
  --space-2xl: 4rem;    /* 64px */
  
  /* Layout */
  --max-width: 1200px;
  --border-radius: 8px;
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
}

/* 2. Reset and base styles */
* { box-sizing: border-box; margin: 0; padding: 0; }

/* 3. Typography system */
/* 4. Layout utilities */
/* 5. Component styles */
```

### Phase 3: Iterative Refinement Loop

#### Loop Structure
Each iteration follows this pattern:

1. **Build/Update**: Make changes based on design reference
2. **Visual Compare**: Open in browser, compare side-by-side with reference
3. **Gap Analysis**: Identify specific differences
4. **Prioritize**: What has biggest visual impact?
5. **Refine**: Make targeted adjustments
6. **Repeat**: Continue until pixel-perfect

#### Iteration Checklist

**Iteration 1: Layout & Structure**
- [ ] Overall layout matches (grid, flexbox, positioning)
- [ ] Max-widths and container sizes correct
- [ ] Section spacing matches
- [ ] Responsive breakpoints identified

**Iteration 2: Typography**
- [ ] Font families loaded and applied
- [ ] Font sizes match across all elements
- [ ] Line heights and letter spacing
- [ ] Font weights correct
- [ ] Text colors accurate

**Iteration 3: Color & Visual Design**
- [ ] Background colors exact
- [ ] Text colors match
- [ ] Border colors and widths
- [ ] Shadow values (box-shadow, text-shadow)
- [ ] Gradient directions and stops

**Iteration 4: Spacing & Sizing**
- [ ] Padding values match
- [ ] Margin values match
- [ ] Gap values in flex/grid
- [ ] Border radius values
- [ ] Icon/image sizes

**Iteration 5: Components**
- [ ] Buttons (size, padding, hover states)
- [ ] Cards (spacing, shadows, borders)
- [ ] Navigation (alignment, spacing)
- [ ] Forms (input styling, focus states)
- [ ] Any custom components

**Iteration 6: Polish & Interactions**
- [ ] Hover effects match
- [ ] Transition speeds and easings
- [ ] Active/focus states
- [ ] Cursor changes
- [ ] Micro-animations

**Iteration 7: Responsive Design**
- [ ] Mobile layout matches
- [ ] Tablet layout matches
- [ ] Desktop layout matches
- [ ] Text scales appropriately
- [ ] Touch targets sized correctly

## Best Practices

### Design System Approach
Always establish a design system before building:
- Extract color palette to CSS variables
- Define spacing scale (usually 4px or 8px base)
- Identify typography scale
- Document reusable patterns

### Measurement Techniques
When matching a design:

**Browser DevTools**
```javascript
// Get computed styles of reference element
const element = document.querySelector('.target');
const styles = window.getComputedStyle(element);

console.log({
  fontSize: styles.fontSize,
  padding: styles.padding,
  margin: styles.margin,
  color: styles.color,
  backgroundColor: styles.backgroundColor
});
```

**Visual Comparison**
- Use browser split-screen with reference
- Toggle between builds using browser tabs
- Overlay reference image at 50% opacity
- Use browser zoom to check pixel perfection

### Common Refinement Areas

**Spacing is Everything**
- 90% of "something looks off" is spacing issues
- Check padding, margin, gap, and line-height
- Ensure consistent spacing scale throughout

**Typography Hierarchy**
- Font size differences must be noticeable (1.2x+ ratio)
- Line height typically 1.4-1.6 for body text
- Letter spacing for headings (often negative)

**Color Accuracy**
- Use eyedropper tools for exact colors
- Check for subtle opacity/transparency
- Verify hover state color shifts

**Alignment & Positioning**
- Everything should align to a grid
- Use flexbox/grid for automatic alignment
- Check vertical rhythm (baseline grid)

### Performance Optimization
Throughout iterations, maintain performance:

**CSS**
- Use CSS custom properties for maintainability
- Minimize use of expensive properties (box-shadow, filter)
- Use `will-change` sparingly
- Leverage CSS containment

**Images**
- Use modern formats (WebP, AVIF)
- Implement responsive images (srcset)
- Lazy load below-fold images
- Optimize and compress all assets

**JavaScript**
- Defer non-critical JS
- Use event delegation
- Debounce scroll/resize handlers
- Minimize DOM manipulation

### Accessibility Throughout
Never sacrifice accessibility for design:
- Maintain WCAG AA contrast ratios (4.5:1 text, 3:1 UI)
- Ensure focus indicators are visible
- Provide keyboard navigation
- Use semantic HTML
- Add ARIA labels where needed
- Test with screen reader

## Code Organization

### File Structure
```
project-name/
├── index.html
├── css/
│   ├── reset.css          # Browser normalization
│   ├── variables.css      # Design tokens
│   ├── typography.css     # Font and text styles
│   ├── layout.css         # Grid and layout utilities
│   ├── components.css     # Reusable components
│   └── styles.css         # Main styles (imports above)
├── js/
│   ├── main.js           # Primary interactions
│   └── utils.js          # Helper functions
└── images/
    └── [optimized assets]
```

### CSS Methodology
Use a consistent naming convention:

**BEM (Block Element Modifier)**
```css
.card { }                    /* Block */
.card__title { }            /* Element */
.card__title--large { }     /* Modifier */
```

**Utility-First** (when appropriate)
```css
.flex { display: flex; }
.gap-md { gap: var(--space-md); }
.text-center { text-align: center; }
```

## Iterative Refinement Script

### Systematic Comparison Process
For each iteration, run through this script:

```markdown
## Iteration [N] Focus: [Area]

### Changes Made
- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

### Comparison Notes
**What matches:**
- [Aspect 1]
- [Aspect 2]

**What's off:**
- [Specific difference 1] → [Planned fix]
- [Specific difference 2] → [Planned fix]

### Next Iteration Priority
1. [Highest impact item]
2. [Second priority]
3. [Third priority]
```

### Quality Checkpoints
Before marking an iteration complete:

1. **Pixel-level accuracy** (80%+ match to reference)
2. **Responsive behavior** (works on mobile, tablet, desktop)
3. **Interactive states** (hover, focus, active work correctly)
4. **Performance** (fast load, smooth animations)
5. **Accessibility** (keyboard nav, contrast, semantics)
6. **Code quality** (clean, maintainable, commented)

## Common Patterns

### Hero Section
```html
<section class="hero">
  <div class="container">
    <h1 class="hero__title">Heading</h1>
    <p class="hero__subtitle">Subheading</p>
    <div class="hero__cta">
      <a href="#" class="btn btn--primary">Primary CTA</a>
      <a href="#" class="btn btn--secondary">Secondary CTA</a>
    </div>
  </div>
</section>
```

### Card Grid
```html
<section class="cards">
  <div class="container">
    <div class="card-grid">
      <article class="card">
        <img src="..." alt="..." class="card__image">
        <div class="card__content">
          <h3 class="card__title">Title</h3>
          <p class="card__description">Description</p>
        </div>
      </article>
      <!-- Repeat cards -->
    </div>
  </div>
</section>
```

### Responsive Navigation
```html
<nav class="nav">
  <div class="container nav__container">
    <a href="/" class="nav__logo">Logo</a>
    <button class="nav__toggle" aria-label="Menu">☰</button>
    <ul class="nav__menu">
      <li><a href="#" class="nav__link">Link 1</a></li>
      <li><a href="#" class="nav__link">Link 2</a></li>
      <li><a href="#" class="nav__link">Link 3</a></li>
    </ul>
  </div>
</nav>
```

## Tools & Resources

### Development Tools
- **Browser DevTools**: Inspect, measure, debug
- **Responsively App**: Test multiple viewports simultaneously
- **ColorZilla**: Extract exact colors from reference
- **WhatFont**: Identify fonts from reference sites
- **PageSpeed Insights**: Performance testing

### Design Reference Tools
- **Figma/Sketch**: If design files available
- **Screenshot tools**: Full-page captures for reference
- **Grid overlay tools**: Check alignment
- **Accessibility checkers**: WAVE, axe DevTools

## Troubleshooting

### "Something looks off but I can't pinpoint it"
1. Check spacing (padding, margin, gap)
2. Verify font sizes and weights
3. Compare line heights
4. Check subtle color differences
5. Verify border radius values
6. Look at shadow intensity

### "Layout breaks on mobile"
1. Use `max-width: 100%` on images
2. Ensure no fixed widths that exceed viewport
3. Use flexible units (%, rem, vw)
4. Test with browser DevTools mobile view
5. Check for horizontal overflow

### "Animations feel janky"
1. Use `transform` and `opacity` for animations (GPU accelerated)
2. Avoid animating `width`, `height`, `left`, `top`
3. Use `will-change` for complex animations
4. Reduce animation complexity
5. Check for layout thrashing

## Success Criteria

A website iteration is complete when:

1. ✅ **Visual match**: 90%+ similarity to reference design
2. ✅ **Responsive**: Works flawlessly on mobile, tablet, desktop
3. ✅ **Interactive**: All hover/focus/active states implemented
4. ✅ **Performant**: Loads quickly, animates smoothly
5. ✅ **Accessible**: Keyboard navigable, proper contrast, semantic HTML
6. ✅ **Clean code**: Well-organized, commented, maintainable
7. ✅ **Cross-browser**: Works in Chrome, Firefox, Safari, Edge

## Final Iteration Checklist

Before declaring the website complete:

- [ ] All design reference elements implemented
- [ ] Responsive design tested at 320px, 768px, 1024px, 1440px
- [ ] All interactive states working (hover, focus, active, disabled)
- [ ] Forms validate and submit correctly
- [ ] Images optimized and loading efficiently
- [ ] Accessibility audit passed (keyboard nav, screen reader, contrast)
- [ ] Performance audit passed (PageSpeed score 90+)
- [ ] Cross-browser testing completed
- [ ] Code reviewed and cleaned up
- [ ] Documentation added where needed

## Example Iteration Flow

```
User: "Build me a website like stripe.com"

Iteration 1: Layout Structure
→ Analyze Stripe's layout
→ Build basic HTML structure with semantic tags
→ Create grid system matching Stripe's columns
→ Result: Basic structure in place

Iteration 2: Typography System  
→ Identify Stripe's fonts (likely Inter or similar)
→ Extract font sizes for h1-h6, body, small text
→ Set up typography CSS with proper scale
→ Result: Text hierarchy matches reference

Iteration 3: Color Palette
→ Extract exact hex values from Stripe site
→ Set up CSS variables for all colors
→ Apply to backgrounds, text, borders
→ Result: Color scheme matches

Iteration 4: Component Building
→ Build hero section to match Stripe's
→ Create card components with proper spacing
→ Build CTA buttons with hover effects
→ Result: Main components look similar

Iteration 5: Spacing Refinement
→ Measure padding/margin from reference
→ Adjust to match exactly
→ Ensure consistent spacing scale
→ Result: Spacing now matches

Iteration 6: Polish & Details
→ Add subtle shadows and gradients
→ Implement hover animations
→ Add micro-interactions
→ Result: Feels polished like reference

Iteration 7: Responsive
→ Test and adjust mobile layout
→ Adjust typography scale for smaller screens
→ Ensure touch targets are 44px minimum
→ Result: Works beautifully on all devices

Complete: Website matches Stripe aesthetic
```

## Tips for Claude Code

When working in Claude Code specifically:

1. **Use relative paths**: All links should use relative paths
2. **Live server**: Open HTML files directly in browser and refresh
3. **Incremental commits**: Save iterations as you go
4. **Comment changes**: Note what each iteration addressed
5. **Side-by-side**: Keep reference and build open simultaneously
6. **DevTools friendly**: Structure code for easy inspection
7. **Fast iteration**: Make small changes, check immediately, repeat

## Remember

- **Iteration is normal**: Expect 5-10 iterations for pixel-perfect results
- **Details matter**: Small spacing/sizing differences add up
- **Test continuously**: Check after every change
- **Stay organized**: Keep CSS organized throughout iterations
- **Document decisions**: Comment why specific values were chosen
- **User feedback**: Get user sign-off at major milestones

Perfect UI is achieved through systematic, focused iteration. Trust the process.
