import { addToCart, cartCount, cartSubtotal, cartTotal, clearCart, estimatedShipping, getCart, getDemoOrder, removeFromCart, saveDemoOrder, updateQuantity } from './lib/cart.js';
import { filterProducts, formatPrice, getCategories, getCategory, getFeaturedProducts, getProduct, getProductsByCategory, getRelatedProducts, stockLabel } from './lib/catalog.js';
import type { CartItem, DemoOrder, Product } from './types/catalog.js';

type Route = { page: string; slug?: string };

const app = document.querySelector<HTMLDivElement>('#root');
if (!app) throw new Error('Root element saknas');

const navItems = [
  ['/', 'Startsida'],
  ['/products', 'Produkter'],
  ['/categories', 'Kategorier'],
  ['/guides', 'Guider'],
  ['/about', 'Om oss'],
  ['/contact', 'Kontakt'],
];

const supportLinks = [
  ['/shipping', 'Frakt & leverans'],
  ['/returns', 'Returer'],
  ['/privacy', 'Integritetspolicy'],
  ['/terms', 'Köpvillkor'],
];

const guides = [
  { slug: 'valj-ratt-vaxtbelysning', title: 'Välj rätt växtbelysning för inomhusodling', intro: 'Utgå från yta, avstånd och växttyp när du väljer armatur.', body: 'För mindre hyllor räcker ofta en kompakt LED-list. Större plantor eller flera krukor behöver jämnare spridning och möjlighet att höja lampan när växterna växer. Använd timer för regelbunden dygnsrytm och följ alltid produktens säkerhetsanvisningar.' },
  { slug: 'forbattra-luftflode', title: 'Så förbättrar du luftflödet i ett odlingsutrymme', intro: 'Luft i rörelse hjälper växter och gör miljön mer stabil.', body: 'Placera intag och frånluft så att luften passerar genom utrymmet. En liten cirkulationsfläkt kan minska stillastående luft runt blad. Kontrollera temperatur och luftfuktighet med mätare och justera varsamt.' },
  { slug: 'grundlaggande-klimatkontroll', title: 'Grundläggande klimatkontroll för växter inomhus', intro: 'Mät först, justera sedan i små steg.', body: 'Temperatur, luftfuktighet och ljus samverkar. Börja med en enkel termometer/hygrometer och jämför värden vid olika tider på dygnet. Välj utrustning efter växternas allmänna behov och rummets förutsättningar.' },
  { slug: 'skillnad-mellan-substrat', title: 'Skillnaden mellan olika substrat', intro: 'Substratet påverkar vattenhållning, luft och näring.', body: 'Jordmix är enkel för många krukväxter. Kokosfiber är lätt och luftig men kräver mer uppmärksamhet kring näring. Lecakulor används ofta för dränering eller som struktur i blandningar.' },
];

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': { title: 'Odlai | Utrustning för inomhusodling', description: 'Svensk webbshop för växtbelysning, odlingstält, ventilation och växtvård.' },
  '/products': { title: 'Produkter | Odlai', description: 'Bläddra bland utrustning för trygg och enkel inomhusodling.' },
  '/categories': { title: 'Kategorier | Odlai', description: 'Hitta rätt kategori för ljus, ventilation, krukor, substrat och tillbehör.' },
  '/guides': { title: 'Guider | Odlai', description: 'Neutrala guider för växtvård och utrustning inomhus.' },
  '/cart': { title: 'Varukorg | Odlai', description: 'Granska produkter och totalsumma innan demokassan.' },
  '/checkout': { title: 'Kassa | Odlai', description: 'Demokassa för svensk adress och orderöversikt.' },
};

const escapeHtml = (value: string): string =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');

const path = (): string => window.location.hash.replace(/^#/, '') || '/';

const route = (): Route => {
  const [clean] = path().split('?');
  const parts = clean.split('/').filter(Boolean);
  if (parts[0] === 'products' && parts[1]) return { page: 'product', slug: parts[1] };
  if (parts[0] === 'categories' && parts[1]) return { page: 'category', slug: parts[1] };
  if (parts[0] === 'guides' && parts[1]) return { page: 'guide', slug: parts[1] };
  return { page: clean || '/' };
};

const setMeta = (title: string, description: string): void => {
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
};

const link = (href: string, text: string, className = ''): string => `<a class="${className}" href="#${href}">${text}</a>`;

const isActiveHref = (href: string): boolean => {
  const current = path().split('?')[0];
  if (href === '/') return current === '/';
  return current === href || current.startsWith(`${href}/`);
};

const navLink = (href: string, text: string): string => link(href, text, isActiveHref(href) ? 'active' : '');

const categoryTone = (slug: string): string => slug.replace(/[^a-z0-9-]/gi, '');

const productVisual = (product: Product): string => {
  const category = getCategory(product.categorySlug);
  return `<span class="visual-card visual-${categoryTone(product.categorySlug)}" aria-hidden="true"><span class="visual-emoji">${escapeHtml(product.image)}</span><span class="visual-label">${escapeHtml(category?.name ?? 'Produkt')}</span></span>`;
};

const categoryVisual = (slug: string, name: string): string => `<span class="category-visual visual-${categoryTone(slug)}" aria-hidden="true"><span>${escapeHtml(name.slice(0, 2).toUpperCase())}</span></span>`;

const productCard = (product: Product): string => {
  const category = getCategory(product.categorySlug);
  return `
    <article class="card product-card">
      <a class="product-image" href="#/products/${product.slug}" aria-label="Visa ${escapeHtml(product.name)}">${productVisual(product)}</a>
      <div class="card-body">
        <div class="badge-row"><span class="badge category-badge">${escapeHtml(category?.name ?? 'Produkt')}</span><span class="badge ${product.stockStatus}">${stockLabel(product.stockStatus)}</span></div>
        <h3>${link(`/products/${product.slug}`, escapeHtml(product.name), 'product-title-link')}</h3>
        <p>${escapeHtml(product.shortDescription)}</p>
        <div class="product-meta"><span>${stockLabel(product.stockStatus)}</span><span>${escapeHtml(category?.name ?? 'Produkt')}</span></div><div class="card-row"><strong>${formatPrice(product.price)}</strong>${link(`/products/${product.slug}`, 'Visa produkt', 'card-link')}</div>
      </div>
    </article>`;
};

const shell = (content: string): string => `
  <header class="site-header">
    <a class="brand" href="#/" aria-label="Odlai startsida"><span class="brand-mark">O</span><span><strong>Odlai</strong><small>Utrustning för odling inomhus</small></span></a>
    <nav aria-label="Huvudnavigation">${navItems.map(([href, text]) => navLink(href, text)).join('')}</nav>
    <a class="cart-link ${isActiveHref('/cart') ? 'active' : ''}" href="#/cart"><span>Varukorg</span> <span id="cart-count">${cartCount()}</span></a>
  </header>
  <main id="main-content">${content}</main>
  <footer class="site-footer">
    <div><strong>Odlai</strong><p>Svensk butikskänsla för dig som vill odla örter, bladgrönt och prydnadsväxter hemma med rätt ljus, luft och tillbehör.</p></div>
    <div><h2>Handla</h2>${navItems.slice(1, 4).map(([href, text]) => link(href, text)).join('')}</div>
    <div><h2>Support</h2>${supportLinks.map(([href, text]) => link(href, text)).join('')}</div>
    <div><h2>Kundservice</h2><p>Frågor om produkter, val av utrustning eller orderflöde?</p>${link('/contact', 'Kontakta oss')}</div>
  </footer>`;

const home = (): string => `
  <section class="hero storefront-hero">
    <div class="hero-copy">
      <p class="eyebrow">Svensk webbshop</p>
      <h1>Utrustning för inomhusodling.</h1>
      <p class="lead">Växtbelysning, ventilation, krukor, substrat och tillbehör för kryddväxter, chili, tomater och prydnadsväxter.</p>
      <div class="actions">${link('/products', 'Se sortimentet', 'button')} ${link('/categories', 'Välj kategori', 'button ghost')}</div>
    </div>
    <aside class="hero-shop-panel" aria-label="Exempel på sortiment">
      <div class="panel-card panel-main"><strong>Välj efter plats</strong><small>Fönsterbräda, hylla eller odlingstält</small></div>
      <div class="panel-card"><strong>Jämför pris</strong><small>Sortera sortimentet efter budget</small></div>
      <div class="panel-card"><strong>Se lagerstatus</strong><small>I lager, få kvar eller slut</small></div>
    </aside>
  </section>
  <section><div class="section-heading"><div><p class="eyebrow">Kategorier</p><h2>Handla efter utrustning</h2></div>${link('/categories', 'Alla kategorier', 'section-link')}</div><div class="grid categories category-grid">${getCategories().slice(0, 6).map((category) => `<article class="card category-card">${categoryVisual(category.slug, category.name)}<h3>${link(`/categories/${category.slug}`, category.name)}</h3><p>${category.description}</p></article>`).join('')}</div></section>
  <section><div class="section-heading"><div><p class="eyebrow">Produkter</p><h2>Utvalda produkter i sortimentet</h2></div>${link('/products', 'Visa alla produkter', 'section-link')}</div><div class="grid products">${getFeaturedProducts().map(productCard).join('')}</div></section>
  <section class="beginner-help"><div><p class="eyebrow">Köpråd</p><h2>Välj efter utrymme, ljusbehov och budget</h2><p>Börja med platsen hemma och vilka växter du vill odla. Välj därefter ljus, luftflöde och krukor som passar måtten och vardagen.</p></div><div class="help-steps"><article><strong>1</strong><span>Mät platsen</span></article><article><strong>2</strong><span>Välj ljus och timer</span></article><article><strong>3</strong><span>Kontrollera lager och pris</span></article></div></section>
  <section class="shop-notes"><span>Priser visas i SEK</span><span>Sortiment för laglig växtvård inomhus</span><span>Kassan är en demofunktion</span></section>`;

const filtersFromUrl = (): URLSearchParams => new URLSearchParams(path().split('?')[1] ?? '');

const selected = (value: string, current: string): string => value === current ? ' selected' : '';

const productsPage = (categorySlug?: string): string => {
  const params = filtersFromUrl();
  const category = categorySlug ? getCategory(categorySlug) : undefined;
  const products = filterProducts({
    category: categorySlug || params.get('category') || undefined,
    query: params.get('q') || undefined,
    beginner: params.get('beginner') === '1',
    inStock: params.get('stock') === '1',
    minPrice: params.get('min') ? Number(params.get('min')) : undefined,
    maxPrice: params.get('max') ? Number(params.get('max')) : undefined,
    sort: (params.get('sort') as never) || 'featured',
  });
  if (categorySlug && !category) return notFound();
  const title = category ? category.name : 'Alla produkter';
  const action = categorySlug ? `/categories/${categorySlug}` : '/products';
  return `<section class="page-hero catalog-hero"><p class="breadcrumbs">${link('/', 'Start')} / ${category ? `${link('/categories', 'Kategorier')} / ${category.name}` : 'Produkter'}</p><p class="eyebrow">Sortiment</p><h1>${title}</h1><p>${category?.description ?? 'Sök, filtrera och jämför pris, kategori och lagerstatus för produkter till odling inomhus.'}</p><div class="catalog-quicklinks">${getCategories().slice(0, 5).map((item) => link(`/categories/${item.slug}`, item.name)).join('')}</div></section>
    <section class="catalog-layout"><aside class="filters"><div class="filters-heading"><p class="eyebrow">Hitta rätt</p><h2>Filtrera sortimentet</h2></div><form data-filters action="#${action}"><label>Sök produkt<input name="q" value="${escapeHtml(params.get('q') ?? '')}" placeholder="Sök ljus, krukor eller mätare"></label><div class="filter-prices"><label>Minpris<input name="min" type="number" min="0" value="${escapeHtml(params.get('min') ?? '')}"></label><label>Maxpris<input name="max" type="number" min="0" value="${escapeHtml(params.get('max') ?? '')}"></label></div><label>Sortera<select name="sort"><option value="featured"${selected('featured', params.get('sort') ?? 'featured')}>Utvalt först</option><option value="price-asc"${selected('price-asc', params.get('sort') ?? 'featured')}>Pris stigande</option><option value="price-desc"${selected('price-desc', params.get('sort') ?? 'featured')}>Pris fallande</option><option value="name"${selected('name', params.get('sort') ?? 'featured')}>Namn A–Ö</option></select></label><label class="check"><input name="beginner" type="checkbox" ${params.get('beginner') === '1' ? 'checked' : ''}> Visa enkel start</label><label class="check"><input name="stock" type="checkbox" ${params.get('stock') === '1' ? 'checked' : ''}> Endast i lager</label><button class="button" type="submit">Uppdatera filter</button>${link(action, 'Rensa filter', 'button ghost')}</form></aside><div class="catalog-results"><div class="catalog-toolbar"><div><p>${products.length} produkter visas</p><span>Pris, kategori och lagerstatus visas på varje produktkort.</span></div></div>${products.length ? `<div class="grid products catalog-grid">${products.map(productCard).join('')}</div>` : '<div class="empty catalog-empty"><h2>Inga produkter matchar dina val</h2><p>Prova att söka bredare, höja maxpriset eller rensa filtren för att se hela sortimentet för inomhusodling.</p></div>'}</div></section>`;
};

const categoriesPage = (): string => `<section class="page-hero"><p class="breadcrumbs">${link('/', 'Start')} / Kategorier</p><h1>Kategorier</h1><p>Välj område efter vad din odlingsplats behöver.</p></section><div class="grid categories">${getCategories().map((category) => `<article class="card category-card">${categoryVisual(category.slug, category.name)}<h2>${link(`/categories/${category.slug}`, category.name)}</h2><p>${category.description}</p><p>${getProductsByCategory(category.slug).length} produkter</p></article>`).join('')}</div>`;

const productPage = (slug?: string): string => {
  const product = slug ? getProduct(slug) : undefined;
  if (!product) return notFound();
  const category = getCategory(product.categorySlug);
  setMeta(`${product.name} | Odlai`, `${product.shortDescription} Pris ${formatPrice(product.price)}.`);
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.shortDescription, offers: { '@type': 'Offer', priceCurrency: 'SEK', price: product.price, availability: product.stockStatus === 'out-of-stock' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock' } };
  return `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script><section class="product-detail"><p class="breadcrumbs">${link('/', 'Start')} / ${link('/products', 'Produkter')} / ${category ? link(`/categories/${category.slug}`, category.name) : ''}</p><div class="detail-grid"><div class="detail-image" role="img" aria-label="Produktbild för ${escapeHtml(product.name)}">${product.image}</div><div><span class="badge ${product.stockStatus}">${stockLabel(product.stockStatus)}</span>${product.beginnerFriendly ? '<span class="badge soft">Nybörjarvänlig</span>' : ''}<h1>${escapeHtml(product.name)}</h1><p class="lead">${escapeHtml(product.shortDescription)}</p><p class="price">${formatPrice(product.price)}</p><button class="button" data-add-cart="${product.slug}" ${product.stockStatus === 'out-of-stock' ? 'disabled' : ''}>Lägg i varukorg</button><p class="form-note" aria-live="polite"></p><div class="info-box"><h2>Leverans och retur</h2><p>Se aktuella villkor i kassan och välj produkter efter ditt utrymme, dina växter och säkerhetsanvisningarna.</p></div></div></div><article class="rich-text"><h2>Beskrivning</h2><p>${escapeHtml(product.longDescription)}</p><h2>Vägledning</h2><p>Passar för allmän växtvård inomhus. Läs alltid produktens säkerhetsinformation och anpassa val efter växtsort, utrymme och vardagsrutiner.</p><h2>Specifikationer</h2><dl>${Object.entries(product.specifications).map(([key, value]) => `<dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd>`).join('')}</dl></article><section><h2>Relaterade produkter</h2><div class="grid products">${getRelatedProducts(product).map(productCard).join('')}</div></section></section>`;
};

const cartPage = (): string => {
  const items = getCart();
  if (!items.length) return `<section class="page-hero"><h1>Varukorg</h1><p>Din varukorg är tom.</p>${link('/products', 'Fortsätt handla', 'button')}</section>`;
  return `<section class="page-hero"><h1>Varukorg</h1><p>Granska dina produkter innan du går vidare till demokassan.</p></section><section class="cart-layout"><div class="cart-items">${items.map((item) => { const product = getProduct(item.productSlug); return product ? `<article class="cart-item"><div class="cart-thumb">${product.image}</div><div><h2>${link(`/products/${product.slug}`, product.name)}</h2><p>${formatPrice(product.price)}</p></div><label>Antal<input data-qty="${product.slug}" type="number" min="0" value="${item.quantity}"></label><strong>${formatPrice(product.price * item.quantity)}</strong><button class="text-button" data-remove="${product.slug}">Ta bort</button></article>` : ''; }).join('')}</div>${summary(items, true)}</section>`;
};

const summary = (items: CartItem[], checkoutLink = false): string => `<aside class="summary"><h2>Ordersammanfattning</h2><p><span>Delsumma</span><strong>${formatPrice(cartSubtotal(items))}</strong></p><p><span>Frakt uppskattad</span><strong>${formatPrice(estimatedShipping(items))}</strong></p><p class="total"><span>Totalt</span><strong>${formatPrice(cartTotal(items))}</strong></p><p>Betalning är inte live i denna demo.</p>${checkoutLink ? link('/checkout', 'Till demokassa', 'button') : ''}</aside>`;

const checkoutPage = (): string => {
  const items = getCart();
  if (!items.length) return `<section class="page-hero"><h1>Kassa</h1><p>Varukorgen är tom. Lägg till produkter innan du fortsätter.</p>${link('/products', 'Se produkter', 'button')}</section>`;
  return `<section class="page-hero"><h1>Demokassa</h1><p>Fyll i uppgifter för att skapa en lokal demoorder. Ingen betalning genomförs.</p></section><section class="checkout-layout"><form class="checkout-form" data-checkout><h2>Kunduppgifter</h2><label>Namn<input name="name" required autocomplete="name"></label><label>E-post<input name="email" type="email" required autocomplete="email"></label><label>Adress<input name="address" required autocomplete="street-address"></label><label>Postnummer<input name="postal" required pattern="[0-9 ]{5,6}" placeholder="123 45" autocomplete="postal-code"></label><label>Ort<input name="city" required autocomplete="address-level2"></label><label>Land<input name="country" value="Sverige" required autocomplete="country-name"></label><fieldset><legend>Leveranssätt</legend><label class="check"><input type="radio" name="delivery" checked> Standardfrakt placeholder</label></fieldset><fieldset><legend>Betalsätt</legend><label class="check"><input type="radio" name="payment" checked> Demoorder utan betalning</label></fieldset><button class="button" type="submit">Skapa demoorder</button><p class="form-note" aria-live="polite"></p></form>${summary(items)}</section>`;
};

const confirmationPage = (): string => {
  const order = getDemoOrder();
  if (!order) return `<section class="page-hero"><h1>Ingen order hittades</h1><p>Skapa en demoorder via kassan först.</p>${link('/checkout', 'Till kassan', 'button')}</section>`;
  return `<section class="page-hero"><h1>Tack för din demoorder</h1><p>Order ${order.id} sparades lokalt ${new Date(order.createdAt).toLocaleString('sv-SE')}.</p><p>Ingen betalning har genomförts och inga uppgifter har skickats till externa tjänster.</p>${link('/products', 'Fortsätt handla', 'button')}</section>`;
};

const contentPage = (kind: string): string => {
  const pages: Record<string, string> = {
    '/about': '<h1>Om oss</h1><p>Odlai är en demobutik för svensk inomhusodling med fokus på tydliga val, ren design och neutral växtvård.</p><p>Företagsuppgifter är placeholders tills verklig verksamhetsinformation finns.</p>',
    '/contact': '<h1>Kontakt</h1><p>Formuläret skickar inte e-post i denna demo.</p><form data-contact class="contact-form"><label>Namn<input name="name" required></label><label>E-post<input name="email" type="email" required></label><label>Meddelande<textarea name="message" required minlength="10"></textarea></label><button class="button" type="submit">Visa bekräftelse</button><p class="form-note" aria-live="polite"></p></form>',
    '/shipping': '<h1>Frakt & leverans</h1><p>Denna sida innehåller placeholdertext. Leveransmetoder, priser och tider ska beslutas och granskas innan lansering.</p>',
    '/returns': '<h1>Returer</h1><p>Denna sida innehåller placeholdertext. Returprocess och villkor ska granskas av ansvarig verksamhet innan lansering.</p>',
    '/privacy': '<h1>Integritetspolicy</h1><p>Placeholder: ingen extern lagring används i demon. Slutlig integritetstext ska tas fram innan verkliga kunduppgifter behandlas.</p>',
    '/terms': '<h1>Köpvillkor</h1><p>Placeholder: priser och orderflöde visas endast för demo. Slutliga köpvillkor behöver verksamhets- och juridisk granskning.</p>',
  };
  return `<section class="page-hero legal">${pages[kind] ?? notFound()}</section>`;
};

const guidesPage = (): string => `<section class="page-hero"><h1>Guider</h1><p>Allmänna och lagliga råd för utrustning, miljö och växtvård.</p></section><div class="grid guides">${guides.map((guide) => `<article class="card"><h2>${link(`/guides/${guide.slug}`, guide.title)}</h2><p>${guide.intro}</p></article>`).join('')}</div>`;

const guidePage = (slug?: string): string => {
  const guide = guides.find((candidate) => candidate.slug === slug);
  if (!guide) return notFound();
  setMeta(`${guide.title} | Odlai`, guide.intro);
  return `<article class="page-hero rich-text"><p class="breadcrumbs">${link('/', 'Start')} / ${link('/guides', 'Guider')}</p><h1>${guide.title}</h1><p class="lead">${guide.intro}</p><p>${guide.body}</p><div class="info-box"><strong>Observera:</strong> Anpassa alltid utrustning efter lagliga växter, bostadsmiljö och produkternas säkerhetsanvisningar.</div></article>`;
};

const notFound = (): string => `<section class="page-hero"><h1>Sidan hittades inte</h1><p>Kontrollera länken eller gå tillbaka till startsidan.</p>${link('/', 'Till startsidan', 'button')}</section>`;

const render = (): void => {
  const current = route();
  const meta = pageMeta[path().split('?')[0]];
  if (meta) setMeta(meta.title, meta.description);
  let content = '';
  if (current.page === '/') content = home();
  else if (current.page === '/products') content = productsPage();
  else if (current.page === 'category') content = productsPage(current.slug);
  else if (current.page === '/categories') content = categoriesPage();
  else if (current.page === 'product') content = productPage(current.slug);
  else if (current.page === '/cart') content = cartPage();
  else if (current.page === '/checkout') content = checkoutPage();
  else if (current.page === '/confirmation') content = confirmationPage();
  else if (current.page === '/guides') content = guidesPage();
  else if (current.page === 'guide') content = guidePage(current.slug);
  else if (['/about', '/contact', '/shipping', '/returns', '/privacy', '/terms'].includes(current.page)) content = contentPage(current.page);
  else content = notFound();
  app.innerHTML = shell(content);
  bindEvents();
  window.scrollTo({ top: 0, behavior: 'instant' });
};

const bindEvents = (): void => {
  document.querySelectorAll<HTMLButtonElement>('[data-add-cart]').forEach((button) => button.addEventListener('click', () => {
    addToCart(button.dataset.addCart ?? '');
    const note = button.parentElement?.querySelector<HTMLElement>('.form-note');
    if (note) note.textContent = 'Produkten lades i varukorgen.';
    const count = document.querySelector('#cart-count');
    if (count) count.textContent = String(cartCount());
  }));
  document.querySelectorAll<HTMLInputElement>('[data-qty]').forEach((input) => input.addEventListener('change', () => { updateQuantity(input.dataset.qty ?? '', Number(input.value)); render(); }));
  document.querySelectorAll<HTMLButtonElement>('[data-remove]').forEach((button) => button.addEventListener('click', () => { removeFromCart(button.dataset.remove ?? ''); render(); }));
  document.querySelector<HTMLFormElement>('[data-filters]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const target = event.currentTarget as HTMLFormElement;
    const form = new FormData(target);
    const params = new URLSearchParams();
    ['q', 'min', 'max', 'sort'].forEach((key) => { const value = String(form.get(key) ?? '').trim(); if (value && value !== 'featured') params.set(key, value); });
    if (form.get('beginner')) params.set('beginner', '1');
    if (form.get('stock')) params.set('stock', '1');
    const base = target.getAttribute('action')?.replace(/^#/, '') ?? '/products';
    window.location.hash = `${base}${params.toString() ? `?${params}` : ''}`;
  });
  document.querySelector<HTMLFormElement>('[data-checkout]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const target = event.currentTarget as HTMLFormElement;
    if (!target.reportValidity()) return;
    const form = new FormData(target);
    const order: DemoOrder = { id: `OD-${Date.now().toString().slice(-6)}`, createdAt: new Date().toISOString(), customerName: String(form.get('name')), email: String(form.get('email')), total: cartTotal(), items: getCart() };
    saveDemoOrder(order);
    clearCart();
    window.location.hash = '/confirmation';
  });
  document.querySelector<HTMLFormElement>('[data-contact]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const target = event.currentTarget as HTMLFormElement;
    const note = target.querySelector<HTMLElement>('.form-note');
    if (target.reportValidity() && note) note.textContent = 'Tack! I demon visas bara denna bekräftelse, inget meddelande skickas.';
  });
  document.querySelector<HTMLFormElement>('[data-newsletter]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const target = event.currentTarget as HTMLFormElement;
    const note = target.parentElement?.querySelector<HTMLElement>('.form-note');
    if (target.reportValidity() && note) note.textContent = 'Tack! Detta är en lokal placeholder.';
  });
};

window.addEventListener('hashchange', render);
window.addEventListener('cart:changed', () => { const count = document.querySelector('#cart-count'); if (count) count.textContent = String(cartCount()); });
render();
