# Odlai

Odlai är en svensk demowebbshop för laglig inomhusodling och växtvård. Webbplatsen är byggd som en statisk TypeScript-app utan externa runtime-tjänster och innehåller produktkatalog, kategorier, guider, varukorg och demokassa.

## Projektöversikt

- Språk: TypeScript, HTML och CSS.
- Appmodell: statisk hash-baserad webbapp som byggs till `dist/`.
- Data: lokal produktkatalog i `src/data/catalog.ts`.
- Kassa: lokal demo med `localStorage`; ingen betalning, fraktbokning eller e-post skickas.
- Inriktning: neutral växtvård för kryddväxter, chili, tomater, bladgrönt och prydnadsväxter.

## Kom igång

Det finns inga tredjepartsberoenden att installera. Node.js och TypeScript-kommandot `tsc` behöver finnas i miljön.

```bash
npm run dev
```

Öppna sedan den lokala adressen som skrivs ut i terminalen, normalt `http://localhost:4173`.

## Tillgängliga scripts

- `npm run dev` bygger appen och startar en lokal server från `dist/`.
- `npm run build` typkontrollerar och bygger produktionsfiler till `dist/`.
- `npm run typecheck` kör TypeScript utan att skriva filer.
- `npm run lint` kör en enkel repoanpassad lintkontroll.
- `npm run test` bygger appen, validerar produktdata och kör språkgenomgång.
- `npm run preview` serverar befintlig build från `dist/`.

## Produktdata och redigering

Produktkatalogen finns i `src/data/catalog.ts` och typas av `src/types/catalog.ts`.

När du ändrar produkter:

1. Lägg till eller ändra kategori i `categories` om det behövs.
2. Lägg till produkten i `products` med unik `slug`.
3. Fyll i namn, kategori, kort och lång beskrivning, pris i SEK, lagerstatus, bildplaceholder, specifikationer och om produkten är nybörjarvänlig.
4. Sätt `hidden: true` om en produkt ska döljas från den publika butiken.
5. Kör `npm run test` innan ändringen lämnas vidare.

Valideringen kontrollerar att slugs är unika, att kategorier har produkter och att obligatoriska fält finns. Språkgenomgången flaggar ord som inte passar webbplatsens neutrala och lagliga inriktning.

## Demo och begränsningar

- Varukorgen sparas lokalt i webbläsaren.
- Kassa och orderbekräftelse är endast en demo.
- Inga kunduppgifter skickas till server eller externa system.
- Frakt, returer, integritetspolicy och köpvillkor är placeholders som måste granskas innan verklig lansering.
- Produktpriser, lager och bilder är exempeldata.

## Miljövariabler

Inga miljövariabler krävs i nuläget. Skapa `.env.example` först när en framtida integration behöver dokumenterade variabler.

## Deployment

1. Kör `npm run test`.
2. Kör `npm run build`.
3. Publicera innehållet i `dist/` till valfri statisk hosting.
4. Uppdatera `public/robots.txt` och `public/sitemap.xml` med verklig domän innan publik lansering.

## Framtida integrationer

- Betalningsleverantör för riktiga transaktioner.
- Fraktleverantör för priser, etiketter och spårning.
- E-postleverantör för orderbekräftelser och kontaktformulär.
- CMS eller databas för produktadministration.
- Analysverktyg med samtyckeshantering.
