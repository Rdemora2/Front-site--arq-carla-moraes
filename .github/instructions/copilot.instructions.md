---
applyTo: "**"
---

# Copilot Instructions - Carla Moraes Arquitetura Paisagística

## Architecture Overview

This is a **React 18 + Vite** portfolio site for landscape architecture with premium conversion optimization. The
codebase prioritizes **performance (Lighthouse 95+)**, **accessibility (WCAG AA)**, and **SEO**.

### Styling System (Critical)

Uses **triple-stack styling**: Styled Components + Twin.macro + Tailwind CSS

```jsx
// Correct pattern used throughout codebase
const Button = styled.button`
  ${tw`px-6 py-3 bg-blue-500`} // Twin.macro for Tailwind classes
  &:hover {
    color: red;
  } // Styled Components for custom CSS
`;
```

### Code Splitting Strategy

Vite config implements **granular manual chunks** (see `vite.config.js:89-103`):

- React core separated from vendor
- Page-based chunks: `page-Home.js`, `page-ContactUs.js`
- Heavy libraries isolated: `animations` (Framer Motion), `carousel` (Slick)

**When adding new dependencies**, update `manualChunks` if >50KB.

## Component Patterns

### 1. No Code Comments Policy

**All production code must be clean without annotations**. Use self-documenting names and PropTypes.

### 2. Image Optimization

Use `OptimizedImage` component (`src/components/misc/OptimizedImage.jsx`) for all images:

```jsx
<OptimizedImage src="/images/hero/image.jpg" alt="Descriptive alt text" sizes="(max-width: 768px) 100vw, 50vw" />
```

Expects pre-generated variants: `-320w.avif`, `-640w.webp`, etc. Run `node scripts/optimize-images.js --all` before
deploy.

### 3. Form Validation

Use `useFormValidation` hook (`src/hooks/useFormValidation.js`):

```jsx
const form = useFormValidation(initialValues, validationRules);
// Access: form.values, form.errors, form.handleChange, form.isFormValid
```

### 4. Analytics Tracking

Import from `src/utils/analytics.js` and track user interactions:

```jsx
import { trackCTAClick, trackFormSubmit } from "utils/analytics";
trackCTAClick("Agende Sua Consultoria", "hero-section");
```

## Developer Workflows

### Essential Commands

```bash
npm run dev              # Dev server on :3000
npm run build            # Production build with code splitting
npm run test:e2e         # Playwright E2E tests (60 tests, 5 browsers)
npm run test:e2e:ui      # Interactive test UI
node scripts/optimize-images.js --hero  # Generate image variants
```

### Testing Strategy

- **E2E with Playwright** covers critical conversion flows (form submission, mobile navigation, CTAs)
- Tests use `force: true` for clicks on Framer Motion animated elements
- Modal of development shows "Formulário em Desenvolvimento" instead of real submission

### Build Optimization

Environment variables control build behavior (`vite.config.js:8-11`):

- `VITE_ENABLE_CODE_SPLITTING=true` - Enable manual chunks
- `VITE_ENABLE_ANALYZER=true` - Generate `stats.html` bundle analysis
- `VITE_BUILD_OPTIMIZATION=true` - Enable Terser minification

## Project-Specific Conventions

### SEO & Structured Data

- **Schema.org**: Use `MetaTags` component with LocalBusiness + Service schemas
- **FAQ Schema**: Automatically injected via `useEffect` in `SimpleWithSideImage.jsx`
- **Replace placeholder data** before deploy: GPS coordinates, reviews, business hours (see `TODO.md`)

### File Organization

- `src/components/`: UI components grouped by feature (cards/, forms/, hero/)
- `src/helpers/`: HOCs like `AnimationRevealPage.jsx` for page transitions
- `src/hooks/`: Custom hooks (validation, accessibility, performance)
- `backup/`: Template components from original design system (reference only)

### Path Aliases (vite.config.js:53-66)

```jsx
import Hero from "components/hero/FullWidthWithImage.jsx"; // Not '../components'
import { useFormValidation } from "hooks/useFormValidation"; // Not '../../hooks'
```

### PropTypes Convention

All components must have PropTypes with default values:

```jsx
Component.propTypes = {
  heading: PropTypes.node.isRequired,
  primaryActionText: PropTypes.string,
};
Component.defaultProps = {
  primaryActionText: "Saiba Mais",
};
```

## Critical Integration Points

### React Router Structure

- `src/App.jsx`: Main router with lazy-loaded pages
- `src/pages/`: Page components (Home, ContactUs, Projects, etc.)
- Use `<NavLink>` for navigation to preserve scroll position

### Framer Motion Animations

- Import lazy: `const motion = lazy(() => import('framer-motion'))`
- Default animation wrapper: `AnimationRevealPage` with 0.6s fade-in
- Mobile menu uses `animate` prop with `{x: "150%"}` initial state

### Form Modal (Development Mode)

Contact form shows modal with "Formulário em Desenvolvimento" header. Adjust test expectations to match modal text, not
success messages.

## Common Pitfalls

1. **Don't use `React.lazy()` directly** - Use HOC pattern in `src/components/lazy/`
2. **Avoid inline styles** - Use styled-components or twin.macro
3. **Image paths**: Reference from `/public/images/` not `./images/`
4. **Schema.org data**: Must update real business data before production deploy
5. **E2E tests fail on menu**: Use `.click({ force: true })` for animated mobile menu links

## Reference Files

- `vite.config.js` - Build optimization patterns
- `e2e/contact-form.spec.js` - Test patterns for conversion flows
- `src/components/misc/OptimizedImage.jsx` - Image optimization implementation
