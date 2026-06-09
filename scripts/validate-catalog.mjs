import { categories, products } from '../dist/assets/data/catalog.js';

const errors = [];
const categorySlugs = new Set(categories.map((category) => category.slug));
const productSlugs = new Set(products.map((product) => product.slug));
if (productSlugs.size !== products.length) errors.push('Produkt-slugs måste vara unika.');
for (const category of categories) {
  const count = products.filter((product) => product.categorySlug === category.slug && !product.hidden).length;
  if (count < 3) errors.push(`${category.name} har färre än tre produkter.`);
}
for (const product of products) {
  for (const field of ['id', 'slug', 'name', 'categorySlug', 'shortDescription', 'longDescription', 'price', 'stockStatus', 'image', 'specifications']) {
    if (!product[field]) errors.push(`${product.slug || product.id} saknar ${field}.`);
  }
  if (!categorySlugs.has(product.categorySlug)) errors.push(`${product.slug} har okänd kategori.`);
  if (typeof product.price !== 'number' || product.price <= 0) errors.push(`${product.slug} har ogiltigt pris.`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`${products.length} produkter och ${categories.length} kategorier validerade.`);
