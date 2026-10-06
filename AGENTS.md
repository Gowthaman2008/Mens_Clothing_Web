<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Homepage sections live in src/components/sections/*, shared UI in src/components/ui/*, site chrome in src/components/layout/* — keeps routes thin.
- Product data is a typed static catalogue in src/lib/products.ts; colours are referenced by design-token names (Tone), never raw hex — keeps theming central.
- Cart/wishlist use a persisted zustand store with skipHydration, rehydrated client-side in AppEffects — avoids SSR hydration mismatches.

- Admin panel data (products, orders, messages, content, admins) lives in a persisted zustand store (src/store/admin.ts); storefront shop/product/checkout/contact/hero read from it — demo-only until a real backend is added.
