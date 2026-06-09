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

const productCard = (product: Product): string => `
  <article class="card product-card">
    <a class="product-image" href="#/products/${product.slug}" aria-label="Visa ${escapeHtml(product.name)}"><span>${product.image}</span></a>
    <div class="card-body">
      <div class="badge-row"><span class="badge ${product.stockStatus}">${stockLabel(product.stockStatus)}</span>${product.beginnerFriendly ? '<span class="badge soft">Enkel start</span>' : ''}</div>
      <h3>${link(`/products/${product.slug}`, escapeHtml(product.name))}</h3>
      <p>${escapeHtml(product.shortDescription)}</p>
      <div class="card-row"><strong>${formatPrice(product.price)}</strong>${link(`/products/${product.slug}`, 'Visa produkt', 'button ghost')}</div>
    </div>
  </article>`;

const shell = (content: string): string => `
  <header class="site-header">
    <a class="brand" href="#/" aria-label="Odlai startsida"><span class="brand-mark">O</span><span><strong>Odlai</strong><small>Utrustning för odling inomhus</small></span></a>
    <nav aria-label="Huvudnavigation">${navItems.map(([href, text]) => link(href, text)).join('')}</nav>
    <a class="cart-link" href="#/cart">Varukorg <span id="cart-count">${cartCount()}</span></a>
  </header>
  <main id="main-content">${content}</main>
  <footer class="site-footer">
    <div><strong>Odlai</strong><p>Svensk butikskänsla för dig som vill odla örter, bladgrönt och prydnadsväxter hemma med rätt ljus, luft och tillbehör.</p></div>
    <div><h2>Handla</h2>${navItems.slice(1, 4).map(([href, text]) => link(href, text)).join('')}</div>
    <div><h2>Support</h2>${supportLinks.map(([href, text]) => link(href, text)).join('')}</div>
    <div><h2>Kundservice</h2><p>Frågor om produkter, val av utrustning eller orderflöde?</p>${link('/contact', 'Kontakta oss')}</div>
  </footer>`;

const home = (): string => `
  <section class="hero">
    <div><p class="eyebrow">Svensk webbshop för växtvård</p><h1>Allt för en frisk odlingsplats hemma.</h1><p>Välj växtbelysning, odlingstält, ventilation, substrat och smarta tillbehör för örter, chili, tomater, bladgrönt och prydnadsväxter.</p><div class="actions">${link('/products', 'Handla produkter', 'button')} ${link('/categories', 'Se kategorier', 'button ghost')}</div></div>
    <div class="hero-panel" role="img" aria-label="Illustration av växter på odlingshylla"><span>🌿</span><span>☀️</span><span>🪴</span></div>
  </section>
  <section><div class="section-heading"><div><p class="eyebrow">Populära kategorier</p><h2>Bygg din odlingshörna steg för steg</h2></div>${link('/products', 'Alla produkter', 'section-link')}</div><div class="grid categories">${getCategories().slice(0, 6).map((category) => `<article class="card category-card"><div class="emoji">${category.image}</div><h3>${link(`/categories/${category.slug}`, category.name)}</h3><p>${category.description}</p></article>`).join('')}</div></section>
  <section class="value-grid"><article><h2>Rätt ljus</h2><p>Ljuskällor och upphängning för små fönsterodlingar, hyllor och större odlingsytor.</p></article><article><h2>Stabilt klimat</h2><p>Ventilation och mätare som gör det enklare att hålla koll på temperatur och luftfuktighet.</p></article><article><h2>Snygg ordning</h2><p>Krukor, brickor och märkning som får odlingen att kännas genomtänkt i hemmet.</p></article></section>
  <section><div class="section-heading"><div><p class="eyebrow">Utvalt sortiment</p><h2>Populärt just nu</h2></div>${link('/products', 'Visa fler', 'section-link')}</div><div class="grid products">${getFeaturedProducts().map(productCard).join('')}</div></section>
  <section class="trust"><div><p class="eyebrow">Odlai hjälper dig välja</p><h2>En renare butik för inomhusodling</h2></div><p>Sortimentet presenteras med tydliga användningsområden, lugna råd och svensk butikskänsla så att du kan jämföra utrustning utan krångel.</p></section>`;

const filtersFromUrl = (): URLSearchParams => new URLSearchParams(path().split('?')[1] ?? '');

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
  return `<section class="page-hero"><p class="breadcrumbs">${link('/', 'Start')} / ${category ? `${link('/categories', 'Kategorier')} / ${category.name}` : 'Produkter'}</p><h1>${title}</h1><p>${category?.description ?? 'Sök, filtrera och jämför utrustning för en trivsam odlingsplats inomhus.'}</p></section>
    <section class="catalog-layout"><aside class="filters"><h2>Filtrera sortimentet</h2><form data-filters action="#${action}"><label>Sök<input name="q" value="${escapeHtml(params.get('q') ?? '')}" placeholder="Sök produkter"></label><label>Minpris<input name="min" type="number" min="0" value="${escapeHtml(params.get('min') ?? '')}"></label><label>Maxpris<input name="max" type="number" min="0" value="${escapeHtml(params.get('max') ?? '')}"></label><label>Sortera<select name="sort"><option value="featured">Utvalt</option><option value="price-asc">Pris stigande</option><option value="price-desc">Pris fallande</option><option value="name">Namn</option></select></label><label class="check"><input name="beginner" type="checkbox" ${params.get('beginner') === '1' ? 'checked' : ''}> Enkel start</label><label class="check"><input name="stock" type="checkbox" ${params.get('stock') === '1' ? 'checked' : ''}> I lager</label><button class="button" type="submit">Uppdatera</button>${link(action, 'Rensa filter', 'button ghost')}</form></aside><div class="catalog-results"><div class="catalog-toolbar"><p>${products.length} produkter visas</p></div>${products.length ? `<div class="grid products">${products.map(productCard).join('')}</div>` : '<div class="empty"><h2>Inga produkter hittades</h2><p>Prova bredare sökning eller ta bort något filter.</p></div>'}</div></section>`;
};

const categoriesPage = (): string => `<section class="page-hero"><p class="breadcrumbs">${link('/', 'Start')} / Kategorier</p><h1>Kategorier</h1><p>Välj område efter vad din odlingsplats behöver.</p></section><div class="grid categories">${getCategories().map((category) => `<article class="card category-card"><div class="emoji">${category.image}</div><h2>${link(`/categories/${category.slug}`, category.name)}</h2><p>${category.description}</p><p>${getProductsByCategory(category.slug).length} produkter</p></article>`).join('')}</div>`;

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
