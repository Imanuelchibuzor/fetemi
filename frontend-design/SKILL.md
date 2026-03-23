---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics while strictly adhering to rigorous implementation standards and code reviews for React/Next.js.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details, creative choices, and strict engineering standards.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

## Frontend Code Review & Engineering Standards (React / Next.js)

When generating or refactoring React/Next.js code, apply these quality, performance, scalability, accessibility, and security standards before every output. Try to explain your architectural choices to the user rather than just outputting code blindly.

### 1. Architecture & Code Structure
- **Feature-Based Organization**: Place code in the correct `feature/` folder; shared components in `components/ui`; business logic outside UI components; services/API logic in `services/`.
- **Types**: Centralize and make reusable.
- **Separation of Concerns**: No API calls or business logic inside presentation components. No direct DOM manipulation.

### 2. Naming Conventions
- Components use `PascalCase`. Hooks use `useSomething`. Variables use `camelCase`. Constants use `UPPER_CASE`.
- Boolean props start with `is`, `has`, or `can`.
- Files follow consistent casing (e.g., kebab-case folders).

### 3. API & Data Fetching
- **Client Components**: Use `useQuery` (or equivalent). Ensure query keys are stable/predictable. Handle loading/error states. Define caching behavior.
- **Server Components**: Use native `fetch`. Apply correct caching strategy (`no-store`, `force-cache`, `revalidate`). Prevent sensitive data leaks to the client.

### 4. OOP & Domain Modeling
- Classes used only for domain/business logic, not UI components. Methods encapsulate business behavior without unnecessary abstraction.

### 5. State Management
- Use `useState` appropriately for local state. Do not overuse Context. Global state only when necessary.
- Handle server state via React Query (or similar). No derived state duplication.

### 6. Performance Optimization
- **React Optimization**: Wrap expensive calculations in `useMemo` and functions in `useCallback` when needed. Use `React.memo` where beneficial. Avoid unnecessary re-renders.
- **Lists**: Virtualize large lists. Ensure keys are stable and unique.
- **Code Splitting**: Use dynamic imports natively. Lazy-load heavy components. Confirm route-based splitting.

### 7. Images & Media Optimization
- Use modern formats (AVIF/WebP). Use `next/image` instead of `<img>`. Define width and height. Use `priority` only for LCP images. Provide proper alt text.

### 8. SEO Optimization
- Correctly define metadata (meaningful title/description). Use semantic HTML (`header`, `main`, `section`). Include OpenGraph tags and Structured data (if applicable). Maintain clean URL structure and resolve hydration mismatch warnings.

### 9. Responsive Design
- Follow mobile-first approach with consistent breakpoints. Avoid horizontal overflow. Use fluid typography (`clamp`). Ensure large enough touch targets (min 44px).

### 10. Accessibility (WCAG 2)
- Prefer semantic HTML over divs. Maintain proper heading hierarchy. Keep interactive elements keyboard accessible and focus states visible. Use ARIA only when necessary. Ensure images have descriptive alt text and color contrast meets standards.

### 11. Core Web Vitals
- **LCP**: Optimize hero image. No blocking scripts above the fold.
- **CLS**: Set dimensions on images. Prevent layout shifts during load.
- **INP**: Avoid heavy synchronous tasks. Optimize event handlers.

### 12. Lighthouse Review Standards
- Target: Performance >= 95, Accessibility >= 99, Best Practices >= 99, SEO >= 99. Minimize unused JavaScript and third-party scripts.

### 13. Caching Strategy (Next.js)
- Select correct rendering strategy (SSG/ISR/SSR/Edge). Define `revalidate` for ISR. Avoid accidental `no-store` usage. Cache API responses properly.

### 14. Advanced React Patterns
- Structure compound components correctly. Clearly define controlled vs. uncontrolled behavior. Avoid prop drilling (use context or component composition). Appropriately use render props, preventing overcomplicated abstractions.

### 15. TypeScript Quality
- Avoid `any` unless justified. Use generics appropriately. Leverage utility types (`Partial`, `Pick`, `Omit`). Strongly type API responses. Avoid type duplication. Ensure inference works and Zod schemas align with TypeScript types.

### 16. Validation (Zod / Forms)
- Implement runtime validation. Validate form inputs client-side and API payloads server-side. Provide user-friendly error messages.

### 17. Testing & Reliability
- Cover critical logic with unit tests. Test UI behavior and edge cases. Ensure no failing tests or console errors/warnings.

### 18. Security
- **XSS**: Avoid `dangerouslySetInnerHTML`. Sanitize user input. No inline scripts.
- **CSRF**: Enable SameSite cookies. Implement CSRF tokens if needed.
- **Authentication**: Use secure OAuth flow (PKCE). Keep JWT expiration short. Implement refresh tokens. DO NOT store tokens in `localStorage`. Use HttpOnly cookies.
- **CSP**: Define Content Security Policy. No unsafe-inline scripts. Restrict to trusted domains.

### 19. Animation & Micro-Interactions
- Use animations to enhance UX, not distract. Respect `prefers-reduced-motion`. Ensure no layout shift from animations. Provide feedback on actions (loading, success).

### 20. UX Psychology
- Minimize cognitive overload. Establish clear visual hierarchy. Make CTA buttons obvious. Provide informative error states and use progressive disclosure where appropriate.

### 21. Ecosystem Awareness
- Use stable React/Next.js APIs. Avoid deprecated patterns. Keep dependencies up to date. Avoid adding unnecessary packages.

## Final Pre-Commit Gate
Before finalizing any code output, verify that:
- Code is formatted and linting passes without errors.
- Type checks pass and the build would run successfully.
- No `console.log` statements are left behind.
- Your explanation addresses these points where appropriate.

## 🔥 Golden Rule
If a generated code block or change:
- Breaks accessibility
- Introduces a security risk
- Degrades performance
- Violates architecture
- Adds unnecessary complexity
**👉 It should not be outputted or suggested to the user. Fix the issue first.**
