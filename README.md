# freight-site

German website for freight in both directions between Germany and the Gulf (Dubai/UAE, Saudi Arabia), plus China and India. The operator of the site quotes and invoices the customers and is their contract partner; Trust Logistic FZCO (Dubai) organises the transport. The site says so in the hero, the steps, the footer, the Impressum and the privacy text. Keep those statements true if the setup changes.
Static pages plus one small PHP script for the request form. No external fonts, CDNs or trackers.

**Local preview only.** The site uses a real company's name and logo. Do not publish or deploy it until every placeholder is filled and Trust has agreed to the use of its name and logo. `site.noindex` is `true` until then.

## How to change anything

1. Edit **`config.js`**. It is the only file you need to touch for company data, contact details, rate ranges, sources and all texts.
2. Run the build:

   ```bash
   node build.js
   ```

3. Reload the page in the browser.

The build regenerates the seven HTML pages, `assets/js/data.js`, `api/config.php` and `SOURCES.md`, and prints every placeholder that is still open. Never edit the generated files by hand; the next build overwrites them.

Needs Node.js (any current version). No packages to install.

### Where things are in `config.js`

| Section | What it holds |
|---|---|
| `site` | Domain, `noindex` switch, "Stand" date of the privacy page, words that must not break across lines |
| `operator` | Your data: name, address, phone, e-mail, VAT ID, hosting provider |
| `trust` | Trust's verified company and licence data, JCtrans line |
| `form` | Request form: endpoint, sender address, confirmation e-mail, spam brake |
| `calculator` | Rules, limits, countries for "Von"/"Nach", **rate ranges**, market date, price drivers |
| `sources` | Every source, with URL, access date and what it supports |
| `texts` | All visible texts, page by page (`home`, `calculator`, `faq`, `checklist`, `request`, `ui`, `imprint`, `privacy`) |

### Rules for texts

- A value that starts with `PLATZHALTER` appears on the site as a pink dashed chip. Replace the whole string with the real value.
- `{{operator.name}}` inserts a value from the config. `[Text](seite.html)` makes a link. `[[64 kg]]` keeps words on one line; words listed in `site.keepTogether` are kept together everywhere.
- Write "Sie", no superlatives. Never write that Trust is cheaper than others, never state binding prices, and never promise the points listed under `texts.home.open` (pickup, export and import clearance, insurance, excluded goods, minimum weight). Do not mention tobacco or vapes.
- The 5–7 day transit time applies to air freight only.

### Contact profile and example shipments

- `texts.home.contact`: your photo (put the file in `assets/img/` and enter its path as `photo`), a short profile, languages and usual response time.
- `texts.home.examples`: three example shipments (goods, route, mode, size, transit time). Use real, anonymised shipments from Trust and no prices. Set `show: false` to hide the section until you have them.

### Changing a rate range

Rates are under `calculator.rates`, one entry per mode (`air`, `sea`, `seaair`) and lane `"FROM-TO"`, using the ids from `calculator.countries` (for example `"CN-DE"`). The calculator shows the range under the label "Richtwert, kein Angebot", a disclaimer and a request button.

```js
"CN-DE": { min: 4.4, max: 5.3, currency: "USD", per: "kg", scope: "what the price covers", sources: ["source-id"] }
```

- A lane without an entry (or with `null`) shows the chargeable weight only, plus a line naming the lanes that do have a range.
- The range is `flatMin`–`flatMax` per shipment plus `min`–`max` per unit (kg for air, sea-air and road; W/M for sea).
- `calculator.display` switches the source line and the market month under the range on or off (both off since 18.11.2026; the sources stay in `config.js` and `SOURCES.md`).

**The current values are illustration values, not real prices.** They were put together on 18.11.2026 from online freight-rate estimators and public market indices so that the calculator shows something for every lane and mode. Entries marked `illustration: "..."` say how each value was derived, and the site adds the sentence from `texts.ui.calc.illustrationNote` under every such range.

Before going live, replace them with values from real shipments:

1. Collect the prices of real shipments per lane and mode: fixed amounts per shipment (pickup, handling, clearance, documents) and the freight per kg or per m³.
2. Work out a typical range per lane and mode, for example from the cheapest and the most expensive of the last shipments.
3. Enter `flatMin`, `flatMax`, `min`, `max`, delete `illustration` and add a source entry such as "Eigene Sendungen, Stand …".
4. Re-check every few months; freight prices move fast.
- Every rate needs at least one id from `sources`, and `calculator.marketDate` must say when the data is from. The build stops if either is missing.
- Add the source first (publisher, title, URL, access date, what it supports, the quoted figure), then reference its id.
- `per` is `"kg"` for air and sea-air, `"wm"` for sea (per m³ or 1,000 kg).

### Adding an FAQ or checklist entry

- FAQ: add an object to the `items` of one of the groups in `texts.faq.groups` ("Für jede Sendung", "Export aus Deutschland", "Import nach Deutschland", "Einfuhr in die Emirate und nach Saudi-Arabien") with `id`, `q`, `a` (list of paragraphs; a nested list becomes bullet points) and `sources`. Ids must be unique; other pages link to them.
- Checklist: add `{ name, text, sources }` to a group in `texts.checklist.groups`.

Only state what a source confirms, and add that source to `sources` first. The build stops if an entry has no source.

## Request form

The form sends the request to `api/anfrage.php`. The script e-mails it to `operator.email` (replies go to the sender) and sends the fixed confirmation text from `form.confirmation` to the sender. It stores no request and no IP address. If sending fails for any reason, the form shows the finished text with a copy button and offers the visitor's mail program instead, so no request is lost silently.

The script stays switched off until `operator.name`, `operator.phone`, `operator.email` and `form.fromEmail` are filled in. Until then the form uses the mail program directly.

What the host must provide:

- PHP 7.4 or newer with `mbstring`, and a working `mail()` function. Most German shared hosting packages have this.
- HTTPS with a valid certificate for the whole site.
- An e-mail address of your own domain for `form.fromEmail` (for example `anfrage@your-domain.de`). Mails sent from a foreign address land in spam.
- The folder `api/data/` must be writable by PHP (it holds only a counter for the spam brake).

**The PHP script has not been run yet**: PHP is not installed on the machine it was written on. Before going live, upload the site, send a test request and check that both e-mails arrive and are not in spam. `tools/dev-server.js` contains a stand-in with the same checks, which was tested.

To use no server at all, set `form.endpoint` to `""`.

### What the law requires for the form

Researched on 16–17 November 2026 against official sources. This is not legal advice; have a lawyer confirm it together with Impressum and Datenschutzerklärung.

| Requirement | What to do | Source |
|---|---|---|
| Encrypted transmission | Run the site on HTTPS with a valid certificate. Data protection authorities treat this as required for contact forms under Art. 32 GDPR. | [HmbBfDI, 21.04.2023](https://datenschutz-hamburg.de/fileadmin/user_upload/HmbBfDI/Datenschutz/Informationen/2023-04-Information_Webseitenbetreiber_innen.pdf), [HBDI Hessen, 18.08.2025](https://datenschutz.hessen.de/datenschutz/vereine/umsetzungshinweise-zur-transportverschluesselung-von-webseiten/http-seite-ohne-https-erreichbar) |
| Information before sending | The privacy notice must be reachable before the form is sent. Done: the form links to it, and it names purpose, legal basis, recipients and the transfer to the UAE (Art. 13 GDPR). | [Art. 13 GDPR](https://dsgvo-gesetz.de/art-13-dsgvo/), [LfDI Rheinland-Pfalz](https://www.datenschutz.rlp.de/themen/vereine) |
| Only necessary data | Mandatory fields are limited to what a quote needs; phone is optional (Art. 5(1)(c) GDPR). | [Art. 5 GDPR](https://dsgvo-gesetz.de/art-5-dsgvo/) |
| Contract with the host | Conclude a data processing agreement (AVV, Art. 28 GDPR) with your hosting provider. Hosts usually offer it in the customer login. | [Art. 28 GDPR](https://dsgvo-gesetz.de/art-28-dsgvo/), [BayLDA FAQ](https://www.lda.bayern.de/de/faq.html) |
| Transfer to Trust in Dubai | There is no EU adequacy decision for the UAE. The form therefore asks for explicit consent and names the risk (Art. 49(1)(a) GDPR). Keep the checkbox and its wording. | [Art. 49 GDPR](https://dsgvo-gesetz.de/art-49-dsgvo/), [EU Commission, adequacy decisions](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en), [EDPB Guidelines 2/2018](https://www.edpb.europa.eu/system/files/documents/files/file1/edpb_guidelines_2_2018_derogations_en.pdf) |
| Confirmation e-mail | Keep it free of advertising. The BGH ruled against advertising in automatic reply mails (15.12.2015, VI ZR 134/15). | [BGH press release 205/2015](https://www.bundesgerichtshof.de/SharedDocs/Pressemitteilungen/DE/2015/2015205.html), [§ 7 UWG](https://www.gesetze-im-internet.de/uwg_2004/__7.html) |
| Spam protection | No Google reCAPTCHA or other third-party captcha. The form uses a hidden trap field and a request counter instead; nothing is stored on the visitor's device (§ 25 TDDDG). | [BayLDA FAQ](https://www.lda.bayern.de/de/faq.html), [§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html) |
| E-mail transport | Your mailbox provider must accept and send mail with transport encryption (TLS). This is standard with German providers; check it once. | [DSK, Orientierungshilfe E-Mail, 16.06.2021](https://www.datenschutzkonferenz-online.de/media/oh/20210616_orientierungshilfe_e_mail_verschluesselung.pdf) |
| Keeping and deleting requests | Delete requests that lead to nothing once they are settled. Requests that lead to a contract are business letters and must be kept six years. | [Art. 5 GDPR](https://dsgvo-gesetz.de/art-5-dsgvo/), [§ 257 HGB](https://www.gesetze-im-internet.de/hgb/__257.html), [§ 147 AO](https://www.gesetze-im-internet.de/ao_1977/__147.html) |
| Record of processing | Keep a short record of processing activities (Art. 30 GDPR). The exemption for small businesses does not cover regular processing such as a request form. | [Art. 30 GDPR](https://dsgvo-gesetz.de/art-30-dsgvo/), [DSK Kurzpapier Nr. 1](https://www.datenschutzkonferenz-online.de/media/kp/dsk_kpnr_1.pdf) |

Not confirmed on an official page: that a contact form needs no consent checkbox of its own (the form has none besides the UAE consent), a fixed deletion period for requests, and any authority statement on trap fields or request counters.

## Files

```
config.js              the one file to edit
build.js               node build.js
src/templates.js       HTML structure of the pages (no texts)
api/anfrage.php        form script (runs on the web host)
api/config.php         generated settings for the form script
api/data/              counter file of the spam brake (not public)
assets/css/site.css    styles; the hero block at the top is the approved design
assets/js/calc-core.js calculator maths (pure functions)
assets/js/rechner.js   calculator page
assets/js/anfrage.js   request form
assets/js/packstuecke.js  package rows shared by calculator and form
assets/js/data.js      generated
assets/img/            logo and photos
tools/dev-server.js    local preview server with a stand-in for the form script
tools/test-calc.js     node tools/test-calc.js  (calculator tests, incl. odd inputs)
*.html, SOURCES.md     generated
_preview/              screenshots from the build session, not part of the site
```

When uploading to the web host, upload only the seven HTML pages, `assets/` and `api/`. Everything else (`docs/`, `_preview/`, `_share/`, `tools/`, `src/`, `config.js`, `build.js`, the `.md` files) is not needed on the host.

`PRIVATE-NOTES.md` holds private notes that must not be shared. It is excluded from git; never upload or send it.

## Preview

Double-click **`Website-Vorschau starten.cmd`**. It starts the preview and opens http://localhost:4173 in the browser; close its window to stop it. If the preview is already running, it just opens the browser.

From a terminal:

```bash
node tools/dev-server.js
```

Then open http://localhost:4173. Form requests are not e-mailed locally; the stand-in writes both mails as text files to `_preview/outbox/`. While placeholders are open it refuses requests exactly like the real script; start it with `--accept` to test the full flow anyway.

## Demo version to send around

Live demo (GitHub Pages, served from `docs/`): https://specter00.github.io/fracht-website/. After a change, run the command below, commit and push; Pages updates within a few minutes.

```bash
uv run --with pillow python tools/make-share.py
```

This builds `docs/` (a copy of the site with a "Demo-Version, Entwurf" banner on every page, a form that only shows the request text, and no form script, `config.js` or `SOURCES.md`) and writes two files to `_share/`:

- `Website-Vorschau.pdf`: each main page as computer view and phone view. Opens on any phone or computer; send it by e-mail or WhatsApp.
- `Website-Demo.zip`: the clickable demo for a computer. Unzip it first, then double-click `index.html`. Works offline.

Needs Node.js, Microsoft Edge and `uv`. Run it again after every change.

## Before going live

- Fill every placeholder (`node build.js` lists them).
- Have Impressum and Datenschutzerklärung checked by a lawyer; they are templates.
- Ask the lawyer what selling transport in your own name requires (terms and conditions such as ADSp 2017, liability insurance, trade registration, VAT on the invoice) and fill `operator.terms`.
- Conclude the data processing agreement with your host and send a test request through the form.
- Set `site.noindex` to `false`.
