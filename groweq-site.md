# Codex Execution Plan: Swedish Ecommerce Website for Indoor Growing Equipment

## Goal

Build a Swedish ecommerce website for lawful indoor gardening and grow equipment.

The site should sell products such as grow tents, LED lighting, ventilation, filters, pots, substrates, nutrients, timers, meters, and accessories.

Positioning should be:

* Swedish-language first
* Clean, trustworthy, beginner-friendly
* Focused on indoor gardening, controlled-environment cultivation, hobby growing, and plant care
* Neutral and lawful in wording
* No explicit cannabis references
* No cultivation instructions for illegal plants
* No hidden or coded illegal targeting

The finished result should be a working ecommerce-style site with product browsing, product pages, cart, checkout flow, Swedish copy, compliance-safe placeholders, and deployment-ready documentation.

---

## Assumptions

1. Use the existing project stack if a project already exists.
2. If the repository is empty or not clearly configured, create a modern TypeScript web app using a mainstream framework.
3. The website is for Sweden, so use:

   * Swedish language
   * SEK pricing
   * Swedish-style address fields
   * Clear shipping and returns placeholders
4. Do not connect real payment, shipping, analytics, email, or CMS services unless credentials and exact provider choices already exist in the repo.
5. Product data may be seeded locally if no real product database exists.
6. Legal pages should be implemented as editable placeholders, not treated as legal advice.
7. The site must avoid cannabis-specific wording, instructions, images, SEO terms, tags, or metadata.

---

## Execution Rules for Codex

Work checkpoint by checkpoint.

After each checkpoint:

1. Complete the feature slice end-to-end.
2. Run the project’s available checks.
3. Fix regressions before moving on.
4. Leave the project in a runnable state.
5. Update documentation if the checkpoint changes setup, scripts, data, or behavior.

Do not split work into tiny unrelated tasks. Each checkpoint should produce a meaningful user-visible or developer-visible result.

Prefer simple, maintainable implementation over complex architecture.

Do not add unnecessary dependencies.

Do not introduce real third-party integrations unless they are already configured.

Do not invent legal claims, tax rules, delivery promises, medical claims, or guarantees.

Do not include any explicit or coded cannabis terms, including but not limited to:

* cannabis
* marijuana
* weed
* THC
* CBD
* 420
* smoke
* buds
* stealth grow
* illegal cultivation language

Use lawful neutral wording such as:

* inomhusodling
* växtbelysning
* odlingstält
* ventilation
* klimatkontroll
* hobbyodling
* växtvård
* fröstart
* kryddväxter
* tomater
* chili
* prydnadsväxter

---

# Checkpoints

## Checkpoint 1: Project Audit and Runnable Foundation

### Goal

Make the repository understandable, runnable, and ready for feature work.

### Implement

* Inspect the existing project structure.
* Identify the framework, package manager, scripts, and build process.
* Ensure local development works.
* Add or repair basic scripts for:

  * development
  * linting
  * type checking
  * testing if applicable
  * production build
* Add a basic README section explaining how to run the project.
* If the repo is empty, scaffold the app with TypeScript and a standard web framework.
* Create the base layout:

  * header
  * navigation
  * main content area
  * footer
  * responsive page shell

### Verify

* App starts locally.
* Production build succeeds.
* No obvious TypeScript or lint errors.
* README contains accurate run instructions.
* The homepage renders without broken layout.

---

## Checkpoint 2: Swedish Brand, Navigation, and Safe Positioning

### Goal

Create the site’s public identity and Swedish-language content direction.

### Implement

* Add a neutral Swedish brand structure.
* Create core navigation:

  * Startsida
  * Produkter
  * Kategorier
  * Guider
  * Om oss
  * Kontakt
* Write homepage copy focused on lawful indoor gardening.
* Add homepage sections:

  * hero section
  * featured categories
  * beginner-friendly value propositions
  * trust section
  * newsletter placeholder
* Use visual direction that feels modern, clean, and horticulture-focused.
* Avoid any explicit or coded cannabis language.
* Use example plants such as herbs, chili, tomatoes, leafy greens, and decorative plants.

### Verify

* All main navigation links work.
* Homepage is fully Swedish.
* No forbidden cannabis-related terms appear in visible text, metadata, routes, filenames, seed data, or comments.
* Layout works on mobile and desktop.
* Copy sounds like a legitimate indoor gardening shop.

---

## Checkpoint 3: Product Catalog Data and Category Structure

### Goal

Create a realistic product catalog that can power the storefront.

### Implement

* Add a product data model or local product data file.
* Include categories such as:

  * Växtbelysning
  * Odlingstält
  * Ventilation & filter
  * Krukor & brickor
  * Substrat
  * Näring & tillskott
  * Mätare & styrning
  * Tillbehör
* Add realistic seeded products with:

  * name
  * slug
  * category
  * short description
  * long description
  * price in SEK
  * stock status
  * image placeholder
  * specifications
  * beginner suitability
* Keep all product descriptions neutral and lawful.
* Avoid plant-specific illegal use cases.
* Add utility functions for retrieving products, categories, featured products, and related products.

### Verify

* Product data loads correctly.
* Each product has a unique slug.
* Each category has at least a few products.
* No product description contains forbidden cannabis-related language.
* Missing images or optional fields do not break pages.
* Type checks pass.

---

## Checkpoint 4: Storefront Browsing Experience

### Goal

Build the customer-facing catalog experience.

### Implement

* Create product listing pages.
* Create category pages.
* Add filtering or sorting where practical:

  * category
  * price range
  * beginner-friendly
  * in stock
* Add search across product names and descriptions.
* Add product cards with:

  * image
  * name
  * price
  * short description
  * stock badge
  * link to product page
* Add empty states for search and filters.
* Add breadcrumbs where useful.

### Verify

* Product listing page renders all products.
* Category pages show the correct products.
* Search works.
* Filtering and sorting do not break URLs or page state.
* Empty states are useful and Swedish-language.
* Mobile layout is usable.
* Build and type checks pass.

---

## Checkpoint 5: Product Detail Pages

### Goal

Make each product page useful enough for a customer to evaluate a purchase.

### Implement

* Create dynamic product detail pages.
* Include:

  * product title
  * image/gallery placeholder
  * price
  * stock status
  * add-to-cart button
  * description
  * specifications
  * delivery/returns placeholder
  * related products
* Add beginner-friendly guidance framed around general indoor gardening.
* Avoid instructions that explain how to grow illegal plants.
* Add basic SEO metadata for each product using lawful horticulture terms only.

### Verify

* Every product slug resolves to a product page.
* Invalid slugs show a proper not-found page.
* Related products render correctly.
* Add-to-cart button is visible and functional once cart exists, or safely stubbed if cart is implemented later in the same checkpoint.
* No forbidden terms appear in product metadata.
* Build passes.

---

## Checkpoint 6: Cart and Checkout Flow

### Goal

Create a complete ecommerce flow without connecting real payment services.

### Implement

* Add cart functionality:

  * add item
  * remove item
  * change quantity
  * persist cart locally
  * clear cart
* Add cart page with:

  * line items
  * quantities
  * subtotal
  * estimated shipping placeholder
  * total
* Add checkout page with:

  * customer details
  * Swedish address fields
  * delivery method placeholder
  * payment method placeholder
  * order summary
* Add confirmation page after placing a demo order.
* Store demo order state locally or in a simple backend route, depending on project architecture.
* Make it clear that payment is not live if no real payment provider is configured.

### Verify

* Customer can add products to cart.
* Cart persists after refresh.
* Quantities update totals correctly.
* Checkout validation works.
* Demo order confirmation works.
* Empty cart and invalid checkout states are handled.
* No real payment is attempted.
* Build and checks pass.

---

## Checkpoint 7: Content Pages and Trust Layer

### Goal

Add supporting content that makes the shop feel credible without creating legal or unsafe claims.

### Implement

* Add pages:

  * Om oss
  * Kontakt
  * Frakt & leverans
  * Returer
  * Integritetspolicy
  * Köpvillkor
* Add a “Guider” section with neutral beginner content, for example:

  * Välj rätt växtbelysning för inomhusodling
  * Så förbättrar du luftflödet i ett odlingsutrymme
  * Grundläggande klimatkontroll för växter inomhus
  * Skillnaden mellan olika substrat
* Keep guides general and lawful.
* Do not include crop-specific illegal cultivation instructions.
* Add contact form UI, but do not send real email unless already configured.
* Add footer links to all support pages.

### Verify

* All content pages are reachable.
* Footer links work.
* Contact form validates input and shows safe placeholder behavior.
* Guides do not contain illegal plant references.
* Legal pages clearly use placeholder text where business/legal review is needed.
* Build passes.

---

## Checkpoint 8: Admin or Product Management Foundation

### Goal

Make product management easier without overbuilding.

### Implement

Choose the simplest option that fits the project:

* If the project already has a backend/database, add basic admin product CRUD.
* If the project is static/local-data based, add a documented product data editing workflow.
* If authentication does not exist, do not build a fake insecure admin login unless the app architecture supports it cleanly.

Admin/product management should support:

* viewing products
* adding a product
* editing a product
* disabling or hiding a product
* validating required fields
* preventing forbidden cannabis-related terms in product text

### Verify

* Product editing workflow works end-to-end.
* Invalid product data is rejected.
* Forbidden terms are blocked or flagged.
* Public storefront reflects product changes if dynamic storage exists.
* If static data is used, README explains exactly how to update products.
* No insecure admin area is exposed accidentally.
* Build passes.

---

## Checkpoint 9: SEO, Accessibility, and Performance Pass

### Goal

Prepare the site for real users and search engines while keeping positioning lawful and neutral.

### Implement

* Add page titles and descriptions.
* Add Open Graph metadata.
* Add sitemap and robots handling if supported by the framework.
* Add structured data for products where appropriate.
* Improve accessibility:

  * semantic headings
  * alt text
  * keyboard navigation
  * focus states
  * form labels
* Improve performance:

  * optimized images/placeholders
  * avoid excessive client-side JavaScript
  * remove unused code
* Ensure SEO terms remain focused on indoor gardening and grow equipment.

### Verify

* Metadata exists for main pages.
* No cannabis-related SEO terms exist.
* Product pages have useful titles and descriptions.
* Keyboard navigation works.
* Forms have accessible labels.
* Images have alt text.
* Production build passes.
* No major console errors.

---

## Checkpoint 10: Final Hardening and Handoff

### Goal

Leave the project ready for review, deployment, and future extension.

### Implement

* Clean up unused code.
* Ensure consistent formatting.
* Add or update README with:

  * project overview
  * setup instructions
  * available scripts
  * product data workflow
  * environment variables
  * demo checkout limitations
  * deployment notes
* Add `.env.example` if environment variables are used.
* Add a final safety scan for forbidden terms.
* Add notes for future integrations:

  * real payment provider
  * shipping provider
  * email provider
  * CMS
  * analytics
* Ensure no secrets are committed.

### Verify

* Fresh install works.
* Development server starts.
* Production build succeeds.
* Main user journey works:

  * homepage
  * category page
  * product page
  * cart
  * checkout
  * confirmation
* README is accurate.
* No forbidden terms appear in code, content, metadata, test data, or comments.
* No real credentials or secrets exist in the repo.

---

# Stop and Ask Instead of Continuing

Codex should stop and ask the user before continuing if any of the following happens:

1. A real payment provider must be chosen or configured.
2. A real shipping provider must be chosen or configured.
3. Legal, tax, privacy, refund, or compliance wording needs to be finalized.
4. Real company information is required, such as:

   * organization number
   * address
   * phone number
   * support email
   * bank/payment details
5. Real product pricing, stock, suppliers, or images are required.
6. The user asks for cannabis-specific wording, SEO, product claims, guides, or cultivation instructions.
7. The implementation would require storing customer data in a real database without clear security requirements.
8. Deployment credentials or production secrets are needed.
9. The repo contains an existing architecture where changing direction would be destructive.
10. Tests fail because an external service or missing credential is required.

When stopping, explain:

* what decision is needed
* why it matters
* the safest default option
* what alternatives the user can choose from
