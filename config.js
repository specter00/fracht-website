/* =====================================================================
   config.js – the ONE file to edit. Everything visible on the site
   (company data, contact, rate ranges, texts) lives here.

   After every change run:   node build.js
   That regenerates the HTML pages, assets/js/data.js and SOURCES.md
   and prints every placeholder that is still open.

   Rules
   - A value that starts with "PLATZHALTER" is shown on the site as a
     pink dashed chip. Replace the whole string with the real value.
   - In texts, {{operator.name}} inserts a value from this file and
     [Linktext](seite.html) makes a link. Nothing else is interpreted.
   - Every figure needs a source: add it under `sources` and reference
     its id. A lane without a reliable source gets `null` as its rate;
     the calculator then shows the weight only.
   - Never write that Trust is cheaper than others, never state binding
     prices, never promise the points listed under home.open.
   ===================================================================== */

/* What every calculator range covers (used in calculator.rates). */
const SCOPE = "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.";

const SITE_CONFIG = {

  /* ---------- Website ---------- */
  site: {
    name: "Frachtanfrage",  // sender name of the e-mails the form script sends
    baseUrl: "PLATZHALTER: https://www.ihre-domain.de",
    noindex: true,          // true = search engines are told not to index (keep until launch)
    lastUpdated: "November 2026",
    /* words that must not break across lines */
    keepTogether: ["Saudi-Arabien", "Sea-Air", "E-Mail", "EORI-Nummer", "Beauty-Produkte", "USt-IdNr.", "Hosting-Anbieter", "Server-Logdateien"],
    /* Demo version to send around (node tools/build-demo.js): banner on every page, the form sends nothing. */
    demo: {
      title: "Fracht-Website Demo",
      url: "https://specter00.github.io/fracht-website/",   // where GitHub Pages serves docs/; printed on the PDF cover
      banner: "Demo-Version, Entwurf: Inhalte und Angaben sind vorläufig. Über das Formular werden keine Anfragen versendet."
    }
  },

  /* ---------- You: operator of this site and the customers' contract partner (you quote and invoice) ---------- */
  operator: {
    name: "PLATZHALTER: Vor- und Nachname",
    company: "PLATZHALTER: Firma oder Zusatz, z. B. Einzelunternehmen",
    street: "PLATZHALTER: Straße und Hausnummer",
    zipCity: "PLATZHALTER: PLZ und Ort",
    country: "Deutschland",
    phone: "PLATZHALTER: Telefonnummer",
    email: "PLATZHALTER: E-Mail-Adresse",
    vatId: "PLATZHALTER: USt-IdNr. oder Hinweis auf § 19 UStG",
    register: "PLATZHALTER: Handelsregister und Nummer, falls eingetragen (sonst Zeile löschen)",
    terms: "PLATZHALTER: Geschäftsbedingungen für Ihre Aufträge und Angaben zur Haftungsversicherung (mit Anwalt klären, z. B. ADSp 2017)",
    logoPermission: "PLATZHALTER: Bestätigung, dass Trust Logistic FZCO der Nutzung von Name und Logo zugestimmt hat",
    hosting: "PLATZHALTER: Name und Anschrift des Hosting-Anbieters",
    logRetention: "PLATZHALTER: Speicherdauer der Server-Logdateien",
    supervisoryAuthority: "PLATZHALTER: zuständige Datenschutz-Aufsichtsbehörde (nach Bundesland)"
  },

  /* ---------- Trust Logistic FZCO: verified facts (licence document, valid to 27.10.2027) ---------- */
  trust: {
    name: "Trust Logistic FZCO",
    addressLine: "Dubai Airport Freezone, Gebäude 2E, Büro 303, Dubai",
    country: "Vereinigte Arabische Emirate",
    licenceNumber: "3813",
    licenceIssued: "28.10.2018",
    licenceValidTo: "27.10.2027",
    licenceAuthority: "Dubai Integrated Economic Zones Authority",
    activities: "Frachtvermittlung, Agentur für Landtransporte, Lagerhaltung",
    website: "https://www.trustlogfzco.com/",
    websiteLabel: "trustlogfzco.com (englisch)",
    /* JCtrans: set show to false to remove the line from the site. */
    jctrans: {
      show: true,
      text: "Bei JCtrans als Mitglied geführt: Mitglieds-ID 162111, Stufe JC Premium, gelistet seit 21.09.2026",
      url: "http://m.jctrans.com/en/company/07yknvc",
      sources: ["jctrans-profil", "jctrans-weekly"]
    }
  },

  /* ---------- Request form ---------- */
  form: {
    /* Where the form sends the request.
       "api/anfrage.php" = the script that ships with this site (needs a web host with PHP and e-mail; see README).
       ""                = no server: the visitor's mail program opens with the finished request.
       If sending fails, the form always falls back to the mail program and a copy button. */
    endpoint: "api/anfrage.php",
    /* Sender address of the e-mails the script sends. Must be an address of your own domain, otherwise mails land in spam. */
    fromEmail: "PLATZHALTER: Absenderadresse der eigenen Domain, z. B. anfrage@ihre-domain.de",
    subject: "Frachtanfrage über die Website",
    /* Automatic confirmation to the sender. Keep it free of advertising (§ 7 UWG). */
    confirmation: {
      subject: "Ihre Frachtanfrage ist eingegangen",
      body: [
        "Guten Tag,",
        "",
        "Ihre Anfrage über das Formular ist eingegangen. Sie erhalten eine Antwort per E-Mail, sobald Rückfragen geklärt sind oder ein Angebot vorliegt.",
        "",
        "Diese E-Mail wurde automatisch versendet. Wenn Sie die Anfrage nicht selbst gestellt haben, können Sie diese Nachricht ignorieren.",
        "",
        "Mit freundlichen Grüßen",
        "{{operator.name}}",
        "{{operator.phone}}"
      ]
    },
    /* Spam brake of the script: at most this many requests in the time window (no IP addresses are stored). */
    maxPerWindow: 20,
    windowSeconds: 600
  },

  /* ---------- Calculator ---------- */
  calculator: {
    marketDate: "Oktober/November 2026", // when the rate data is from; update together with the rates (air rates move fast: re-check monthly)
    /* What the calculator shows under a range. User decision 18.11.2026: no sources and no market month on the site.
       The sources stay recorded below and in SOURCES.md. */
    display: { sources: false, marketDate: false },
    rules: {
      air: { divisor: 6000, roundUpKg: 0.5, sources: ["iata-tact-asean"] },   // volumetric weight: cm³ / 6000, rounded up to 0.5 kg
      sea: { kgPerCbm: 1000, sources: ["wm-cogoport"] },                      // W/M: 1 m³ = 1,000 kg, the larger value counts
      land: { kgPerCbm: 333, roundUpKg: 1, sources: ["incodocs-ltl"] }                      // road groupage: 1 m³ = 333 kg, the larger value counts
    },
    limits: { maxPieces: 9999, maxEdgeCm: 1200, maxWeightPerPieceKg: 30000, maxRows: 12 },
    modes: [
      { id: "air", label: "Luftfracht" },
      { id: "sea", label: "Seefracht (Sammelgut)" },
      { id: "seaair", label: "Sea-Air" },
      { id: "land", label: "Landweg (Lkw)" }   // keep this order: it matches texts.request.options.mode
    ],
    /* Countries in the "Von" and "Nach" lists of calculator and form. "OTHER" shows a free text field in the form. */
    countries: [
      { id: "DE", label: "Deutschland" },
      { id: "AE", label: "Vereinigte Arabische Emirate" },
      { id: "SA", label: "Saudi-Arabien" },
      { id: "CN", label: "China" },
      { id: "IN", label: "Indien" },
      { id: "OTHER", label: "Anderes Land" }
    ],
    defaultFrom: "DE",
    defaultTo: "AE",
    /* Ranges per mode and lane ("FROM-TO", e.g. "DE-AE"): flatMin–flatMax per shipment plus min–max per unit.
       A lane without an entry (or with null) shows the weight only.
       Shape of an entry:
       "DE-AE": { flatMin: 100, flatMax: 250, min: 2.1, max: 3.4, currency: "USD", per: "kg" | "wm", scope: "what the price covers",
                  sources: ["id"], illustration: "how an example value was derived (delete once real values are in)" } */
    rates: {
      /* ILLUSTRATION VALUES (18.11.2026, user decision): not real prices. Put together from public forwarder price pages
         ("forwarder-ranges-2026-11"), market indices and assumptions so that every lane shows a range. The site says they are
         provisional. Replace them with values from real shipments (README, "Changing a rate range").
         Flat amount: pickup, handling, documents; derived from forwarder figures of 100–200 USD inland and 50–100 USD documents. */
      air: {   // USD per kg chargeable weight
        "CN-DE": { flatMin: 100, flatMax: 250, min: 4.4, max: 5.3, currency: "USD", per: "kg", scope: SCOPE, sources: ["fax-2026-11-03", "fax-2026-11-10", "tac-hkg-eur-2026-10"], illustration: "Rate from market indices Oct/Nov 2026; flat amount assumed" },
        "DE-CN": { flatMin: 100, flatMax: 250, min: 2.0, max: 5.0, currency: "USD", per: "kg", scope: SCOPE, sources: ["forwarder-ranges-2026-11"], illustration: "Between an undated Freightos index snapshot (1.22 USD/kg Europe–China) and a forwarder page (5–10 USD/kg)" },
        "IN-DE": { flatMin: 100, flatMax: 250, min: 3.5, max: 5.5, currency: "USD", per: "kg", scope: SCOPE, illustration: "No figure found; assumed close to China–Europe (Xeneta April 2026: South Asia–Europe 4.39 USD/kg, search snippet)" },
        "DE-IN": { flatMin: 100, flatMax: 250, min: 2.0, max: 5.0, currency: "USD", per: "kg", scope: SCOPE, illustration: "No figure found; same as Germany–China" },
        "DE-AE": { flatMin: 100, flatMax: 250, min: 5.0, max: 10.0, currency: "USD", per: "kg", scope: SCOPE, sources: ["forwarder-ranges-2026-11"], illustration: "Forwarder page: 5–10 USD/kg for 100–500 kg" },
        "AE-DE": { flatMin: 100, flatMax: 250, min: 5.0, max: 10.0, currency: "USD", per: "kg", scope: SCOPE, sources: ["forwarder-ranges-2026-11"], illustration: "Forwarder page: 5–15 USD/kg, narrowed to the Germany–UAE range" },
        "DE-SA": { flatMin: 100, flatMax: 250, min: 3.0, max: 6.0, currency: "USD", per: "kg", scope: SCOPE, sources: ["forwarder-ranges-2026-11"], illustration: "Forwarder pages: 2–5 USD/kg airport to airport, 3–6 EUR/kg door to door" },
        "SA-DE": { flatMin: 100, flatMax: 250, min: 4.0, max: 8.0, currency: "USD", per: "kg", scope: SCOPE, illustration: "No figure found; assumed between Germany–Saudi Arabia and UAE–Germany" }
      },
      sea: {   // USD per W/M (1 m³ or 1,000 kg, the larger value)
        "CN-DE": { flatMin: 150, flatMax: 300, min: 100, max: 230, currency: "USD", per: "wm", scope: SCOPE, sources: ["forwarder-ranges-2026-11"], illustration: "Forwarder pages: 70–150 USD/m³ base plus 15–40 USD/m³ terminal handling at each end" },
        "DE-CN": { flatMin: 150, flatMax: 300, min: 100, max: 200, currency: "USD", per: "wm", scope: SCOPE, sources: ["forwarder-ranges-2026-11"], illustration: "Forwarder page: 100–200 USD/m³" },
        "IN-DE": { flatMin: 150, flatMax: 300, min: 80, max: 170, currency: "USD", per: "wm", scope: SCOPE, sources: ["forwarder-ranges-2026-11"], illustration: "Forwarder pages: 50–90 USD/m³ base plus 15–40 USD/m³ terminal handling at each end" },
        "DE-IN": { flatMin: 150, flatMax: 300, min: 100, max: 200, currency: "USD", per: "wm", scope: SCOPE, illustration: "No figure found; same as Germany–China" },
        "DE-AE": { flatMin: 150, flatMax: 300, min: 200, max: 400, currency: "USD", per: "wm", scope: SCOPE, sources: ["forwarder-ranges-2026-11"], illustration: "Forwarder page: 200–450 USD/m³ under 15 m³" },
        "AE-DE": { flatMin: 150, flatMax: 300, min: 200, max: 300, currency: "USD", per: "wm", scope: SCOPE, sources: ["forwarder-ranges-2026-11"], illustration: "Forwarder page: 200–300 USD/m³" },
        "DE-SA": { flatMin: 150, flatMax: 300, min: 150, max: 350, currency: "USD", per: "wm", scope: SCOPE, sources: ["forwarder-ranges-2026-11"], illustration: "Forwarder pages: 100–300 and 250–400 USD/m³" },
        "SA-DE": { flatMin: 150, flatMax: 300, min: 200, max: 300, currency: "USD", per: "wm", scope: SCOPE, illustration: "No figure found; same as UAE–Germany" }
      },
      seaair: {   // USD per kg chargeable weight; sea leg to Dubai, air leg to Europe
        "CN-DE": { flatMin: 150, flatMax: 300, min: 2.5, max: 3.5, currency: "USD", per: "kg", scope: SCOPE, illustration: "Assumption: about 55–70 % of the air freight rate China–Germany" },
        "IN-DE": { flatMin: 150, flatMax: 300, min: 2.0, max: 3.5, currency: "USD", per: "kg", scope: SCOPE, illustration: "Assumption: about 55–65 % of the air freight rate India–Germany" }
      },
      land: {   // USD per kg chargeable weight (1 m³ = 333 kg), truck via Turkey
        "DE-AE": { flatMin: 150, flatMax: 300, min: 0.8, max: 1.6, currency: "USD", per: "kg", scope: SCOPE, illustration: "No figure found; free assumption for road groupage Germany–Gulf" },
        "AE-DE": { flatMin: 150, flatMax: 300, min: 0.8, max: 1.6, currency: "USD", per: "kg", scope: SCOPE, illustration: "No figure found; same as Germany–UAE" },
        "DE-SA": { flatMin: 150, flatMax: 300, min: 0.9, max: 1.8, currency: "USD", per: "kg", scope: SCOPE, illustration: "No figure found; Germany–UAE plus a longer route" },
        "SA-DE": { flatMin: 150, flatMax: 300, min: 0.9, max: 1.8, currency: "USD", per: "kg", scope: SCOPE, illustration: "No figure found; same as Germany–Saudi Arabia" }
      }
    },
    drivers: [
      "Tagesaktuelle Raten und Zuschläge der Fluggesellschaften und Reedereien",
      "Verfügbarer Frachtraum zum gewünschten Termin",
      "Abholort beim Absender und Zustellort beim Empfänger",
      "DAP oder DDP: Bei DDP kommen Zoll und Einfuhrabgaben hinzu",
      "Art der Ware, etwa Gefahrgut oder temperaturempfindliche Produkte",
      "Maße einzelner Packstücke, zum Beispiel Übermaß oder nicht stapelbare Ware"
    ]
  },

  /* ---------- Sources: every figure and fact on the site points here. SOURCES.md is generated from this list. ---------- */
  sources: {
    "lizenz": {
      publisher: "Dubai Airport Freezone / Dubai Integrated Economic Zones Authority",
      title: "Service License Nr. 3813, Trust Logistic FZCO (Lizenzurkunde, PDF)",
      url: "",
      accessed: "16.11.2026",
      supports: "Firma, Anschrift, Lizenznummer, Ausstellungs- und Ablaufdatum, ausstellende Behörde, lizenzierte Tätigkeiten"
    },
    "trust-angaben": {
      publisher: "Trust Logistic FZCO (Angaben gegenüber dem Betreiber dieser Seite)",
      title: "Transporte in beide Richtungen, grundsätzlich zwischen allen Ländern; Hauptländer Deutschland, VAE (Dubai), China und Indien; China und Indien direkt oder über Dubai (Angaben vom 17. und 18.11.2026); Luft, See, Sea-Air, Landweg; Luftfracht Europa – Golf typisch 5–7 Tage von Tür zu Tür; typische Güter auf der Strecke an den Golf: Kosmetik, Beauty-Produkte, allgemeine Handelsware (Angaben vom 16.11.2026)",
      url: "",
      accessed: "17.11.2026",
      supports: "Leistungsangaben auf der Startseite"
    },
    "jctrans-profil": {
      publisher: "JCtrans",
      title: "Firmenprofil TRUST LOGISTIC FZCO, Member ID 162111, JC Premium",
      url: "http://m.jctrans.com/en/company/07yknvc",
      accessed: "16.11.2026",
      supports: "JCtrans-Mitgliedschaft (Ablaufdatum wird dort nicht genannt)"
    },
    "jctrans-weekly": {
      publisher: "JCtrans",
      title: "Weekly New Members, Woche 39/2026",
      url: "https://marketing.jctrans.com/magazine/weekly/pc/weekly202639.html",
      accessed: "16.11.2026",
      supports: "Aufnahme am 21.09.2026"
    },

    /* --- document checklist --- */
    "zoll-unterlagen": {
      publisher: "Zoll (Generalzolldirektion)",
      title: "Notwendige Unterlagen",
      url: "https://www.zoll.de/DE/Fachthemen/Zoelle/Zollanmeldung/Notwendige-Unterlagen/notwendige-unterlagen_node.html",
      accessed: "17.11.2026",
      supports: "Handelsrechnung als Grundlage des Zollwerts; Liste der Packstücke und Beförderungspapiere auf Verlangen der Zollstelle; Unterlagen für Präferenzregelungen",
      quote: "Wird eine Ware in mehreren Packstücken gestellt, so kann die Zollstelle die Vorlage einer Liste der Packstücke",
      note: "General page on documents for customs declarations (export and import). Also lists 'Beförderungspapiere' and 'Unterlagen für die Anwendung von Präferenzregelungen oder einer anderen Sonderregelung' (checked 18.11.2026)."
    },
    "ihk-pfalz-ausfuhrdokumente": {
      publisher: "IHK Pfalz",
      title: "Ausfuhrdokumente",
      url: "https://www.ihk.de/pfalz/international/export-import/handel-mit-drittlaendern4/export/ausfuhrdokumente-1286832",
      accessed: "17.11.2026",
      supports: "Handelsrechnung wird vom Exporteur erstellt",
      quote: "Die Handelsrechnung ist ein wichtiges Dokument, das vom Exporteur (Verkäufer) zu erstellen ist."
    },
    "ihk-muenchen-uz": {
      publisher: "IHK für München und Oberbayern",
      title: "Ursprungszeugnis",
      url: "https://www.ihk-muenchen.de/ratgeber/internationalisierung/exportdokumente-zoll-exportkontrolle/ursprungszeugnis/",
      accessed: "17.11.2026",
      supports: "Ursprungszeugnis: öffentliche Urkunde über den nichtpräferenziellen Ursprung, Antrag bei der IHK",
      quote: "Das Ursprungszeugnis (UZ) ist eine öffentliche Urkunde und bescheinigt den nichtpräferenziellen Ursprung einer Ware."
    },
    "gtai-vae-papiere": {
      publisher: "Germany Trade & Invest (GTAI)",
      title: "Zollbericht Vereinigte Arabische Emirate: Zollanmeldung und Warenbegleitpapiere (Stand 28.07.2025)",
      url: "https://www.gtai.de/de/trade/vereinigte-arabische-emirate/zoll/zollanmeldung-und-warenbegleitpapiere-224606",
      accessed: "16.11.2026",
      supports: "VAE: benötigte Warenbegleitpapiere, Sprache und Ursprungsangabe der Handelsrechnung, Packliste, Ursprungszeugnis seit 2020 grundsätzlich nicht mehr erforderlich",
      quote: "eine Handelsrechnung, Frachtdokumente, eine Packliste und gegebenenfalls weitere Dokumente wie Genehmigungen",
      note: "German state agency reporting UAE rules; no UAE authority page with the document list could be fetched."
    },
    "mofa-edas": {
      publisher: "Außenministerium der VAE (MoFA)",
      title: "FAQs und Dienst „Attestation of commercial invoices via the Electronic Documents Attestation System (eDAS 2.0)“",
      url: "https://www.mofa.gov.ae/en/FAQs",
      accessed: "16.11.2026",
      supports: "VAE: elektronische Beglaubigung der Handelsrechnung ab 10.000 AED Warenwert, 150 AED je Rechnung zuzüglich Servicegebühren",
      quote: "mandatory for goods imported into the UAE valued at Dh10,000 and above",
      note: "Service page: https://www.mofa.gov.ae/en/Services/EDAS-Attestation-v2. The pages do not say whether the UAE importer or the foreign exporter has to do it; GTAI writes 'über 10.000 Dh'."
    },
    "zatca-import": {
      publisher: "ZATCA (Zakat, Tax and Customs Authority, Saudi-Arabien)",
      title: "Import Instructions (zuletzt aktualisiert 26.08.2026)",
      url: "https://zatca.gov.sa/en/RulesRegulations/Taxes/Pages/customs-bussiness/import-pages/Import-Instructions.aspx",
      accessed: "17.11.2026",
      supports: "Saudi-Arabien: Handelsrechnung, Konnossement und Ursprungszeugnis für die Einfuhr; Ursprungszeugnis entbehrlich, wenn das Ursprungsland eindeutig feststeht",
      quote: "A commercial invoice / A bill of lading / A certificate of origin",
      note: "Wording as reported by the fetch tool, not checked against the raw page. Air waybill and a general packing-list duty could not be confirmed."
    },
    "ihk-koeln-saudi": {
      publisher: "IHK Köln",
      title: "Einfuhr Saudi-Arabien",
      url: "https://www.ihk.de/koeln/hauptnavigation/international/zollrecht/einfuhr-saudi-arabien-5755742",
      accessed: "16.11.2026",
      supports: "Saudi-Arabien: Konformitätszertifikate über das Portal SABER, Antrag durch den Importeur vor der Zollanmeldung",
      quote: "Die Beantragung muss vor der Zollanmeldung der Importwaren erfolgen, da die Ware sonst nicht einfuhrfähig ist."
    },

    /* --- import into Germany (checked 18.11.2026; quotes as returned by the fetch tool, some are sentence fragments) --- */
    "zoll-atlas-allg": {
      publisher: "Zoll (Generalzolldirektion)",
      title: "ATLAS",
      url: "https://www.zoll.de/DE/Fachthemen/Zoelle/ATLAS/atlas_node.html",
      accessed: "18.11.2026",
      supports: "Die Zollverwaltung wickelt Zollverfahren über das IT-Verfahren ATLAS ab, mit einem Verfahrensteil Einfuhr",
      quote: "Mit dem IT-Verfahren ATLAS (Automatisiertes Tarif- und Lokales Zollabwicklungssystem)",
      note: "The page names the procedure part 'Einfuhr'. It does not state the duty to declare electronically in one sentence; see the Merkblatt zu Zollanmeldungen on zoll.de."
    },
    "zoll-zollsatz": {
      publisher: "Zoll (Generalzolldirektion)",
      title: "Zollsatz (Einfuhr aus einem Nicht-EU-Staat)",
      url: "https://www.zoll.de/DE/Unternehmen/Warenverkehr/Einfuhr-aus-einem-Nicht-EU-Staat/Zoll-und-Steuern/Normalfall-der-Verzollung/Zollsatz/zollsatz_node.html",
      accessed: "18.11.2026",
      supports: "Jede Tarifnummer hat eigene Zollsätze; Ermittlung über EZT-online und TARIC",
      quote: "Jede einzelne Tarifnummer enthält Zollsätze.",
      note: "The example rates on the page are from 2010; no rates are taken from it."
    },
    "zoll-eust-satz": {
      publisher: "Zoll (Generalzolldirektion)",
      title: "Zolltarifauskunft für Umsatzsteuerzwecke (Einfuhrumsatzsteuer)",
      url: "https://www.zoll.de/DE/Fachthemen/Steuern/Einfuhrumsatzsteuer/Zolltarifauskunft-fuer-umsatzsteuerzwecke/zolltarifauskunft_fuer_umsatzsteuerzwecke_node.html",
      accessed: "18.11.2026",
      supports: "Einfuhrumsatzsteuer: Regelsatz 19 %, 7 % nur für Waren aus Anlage 2 zum UStG",
      quote: "Nicht in der Anlage 2 aufgeführte Gegenstände sind somit nicht begünstigt und unterliegen dem Regelsteuersatz von 19 %"
    },
    "ustg-11": {
      publisher: "Bundesministerium der Justiz, Gesetze im Internet",
      title: "§ 11 UStG: Bemessungsgrundlage für die Einfuhr",
      url: "https://www.gesetze-im-internet.de/ustg_1980/__11.html",
      accessed: "18.11.2026",
      supports: "Bemessungsgrundlage der Einfuhrumsatzsteuer: Zollwert, hinzu kommen u. a. die Beförderungskosten bis zum ersten Bestimmungsort im Gemeinschaftsgebiet",
      quote: "Der Umsatz wird bei der Einfuhr (§ 1 Abs. 1 Nr. 4) nach dem Wert des eingeführten Gegenstands",
      note: "Abs. 3 Nr. 3 adds transport costs 'bis zum ersten Bestimmungsort im Gemeinschaftsgebiet'. The site says 'unter anderem' because Abs. 3 also adds duties and other charges."
    },
    "ustg-15": {
      publisher: "Bundesministerium der Justiz, Gesetze im Internet",
      title: "§ 15 UStG: Vorsteuerabzug",
      url: "https://www.gesetze-im-internet.de/ustg_1980/__15.html",
      accessed: "18.11.2026",
      supports: "Unternehmer können die Einfuhrumsatzsteuer für Gegenstände, die für ihr Unternehmen eingeführt wurden, als Vorsteuer abziehen (Abs. 1 Satz 1 Nr. 2)",
      quote: "die entstandene Einfuhrumsatzsteuer für Gegenstände, die für sein Unternehmen nach § 1 Absatz 1 Nummer 4 eingeführt worden sind"
    },
    "zoll-transaktionswert": {
      publisher: "Zoll (Generalzolldirektion)",
      title: "Transaktionswert für die eingeführte Ware",
      url: "https://www.zoll.de/DE/Fachthemen/Zoelle/Zollwert/Methoden-der-Zollwertermittlung/Transaktionswert-fuer-die-eingefuehrte-Ware/transaktionswert-fuer-die-eingefuehrte-ware_node.html",
      accessed: "18.11.2026",
      supports: "Der Zollwert beruht auf dem Transaktionswert, dem tatsächlich gezahlten oder zu zahlenden Preis (Art. 70 UZK)",
      quote: "Der Transaktionswert ist der tatsächlich gezahlte oder zu zahlende Preis"
    },
    "zoll-befoerderungskosten": {
      publisher: "Zoll (Generalzolldirektion)",
      title: "Beförderungs- und Versicherungskosten sowie Lade- und Behandlungskosten (Berichtigungen nach Art. 71 UZK)",
      url: "https://www.zoll.de/DE/Fachthemen/Zoelle/Zollwert/Methoden-der-Zollwertermittlung/Transaktionswert-fuer-die-eingefuehrte-Ware/Berichtigungen-Artikel-71-72-UZK/Befoerderungs-und-Versicherungskosten/befoerderungs-und-versicherungskosten_node.html",
      accessed: "18.11.2026",
      supports: "Beförderungs- und Versicherungskosten bis zum Ort des Verbringens in das Zollgebiet der Union werden dem Preis hinzugerechnet",
      quote: "Die Beförderungs- und die Versicherungskosten […] sind dem gezahlten oder zu zahlenden Preis hinzuzurechnen",
      note: "Quote shortened by the fetch tool ([…])."
    },
    "zoll-vertretung": {
      publisher: "Zoll (Generalzolldirektion)",
      title: "Vertretung",
      url: "https://www.zoll.de/DE/Fachthemen/Zoelle/Zollanmeldung/Vertretung/vertretung_node.html",
      accessed: "18.11.2026",
      supports: "Jede Person kann einen Zollvertreter ernennen; direkte und indirekte Vertretung",
      quote: "Der Artikel 18 Zollkodex der Europäischen Union (UZK) sieht vor, dass jede Person einen Zollvertreter ernennen kann."
    },
    "eu-gsp-rex": {
      publisher: "Europäische Kommission, Generaldirektion Steuern und Zollunion",
      title: "Generalised System of Preferences (GSP) (Abschnitt vom 13.10.2026)",
      url: "https://taxation-customs.ec.europa.eu/generalised-system-preferences_en",
      accessed: "18.11.2026",
      supports: "APS: Ursprungsnachweis durch Erklärung zum Ursprung registrierter Ausführer (REX)",
      quote: "To benefit from the EU's GSP, beneficiary countries must use the Registered Exporter (REX) system.",
      note: "Access2Markets confirms: 'the proof of origin to claim preferential tariff treatment under the GSP is a statement on origin.'"
    },
    "eu-gsp-2026": {
      publisher: "Europäische Kommission, Access2Markets",
      title: "GSP system updates for the period 2026–2028 (01.12.2025)",
      url: "https://trade.ec.europa.eu/access-to-markets/en/news/gsp-system-updates-period-2026-2028",
      accessed: "18.11.2026",
      supports: "Indien: APS-Präferenzen für weitere Warengruppen ausgesetzt (u. a. Mineralien, Kautschuk, Kraftfahrzeuge), 01.01.2026 bis 31.12.2028",
      quote: "India expands its list with three new excluded sections: S‑5 (minerals), S‑7b (rubber), and S‑17b (motor vehicles and other means of transport).",
      note: "The pages do not state in one sentence that India is a GSP beneficiary; the site therefore only names the suspended sections."
    },
    "eu-india-fta": {
      publisher: "Europäische Kommission",
      title: "The EU-India trade agreement (zuletzt aktualisiert 11.09.2026)",
      url: "https://commission.europa.eu/topics/trade/eu-india-trade-agreement_en",
      accessed: "18.11.2026",
      supports: "Handelsabkommen EU–Indien: Verhandlungen im Januar 2026 abgeschlossen, noch nicht in Kraft",
      quote: "Once India also ratifies the agreement, it can enter into force.",
      note: "Re-check: later steps (signature, ratification) may have happened after 11.09.2026."
    },

    /* --- legal pages --- */
    "ddg-5": {
      publisher: "Bundesministerium der Justiz, Gesetze im Internet",
      title: "§ 5 DDG: Allgemeine Informationspflichten",
      url: "https://www.gesetze-im-internet.de/ddg/__5.html",
      accessed: "16.11.2026",
      supports: "Pflichtangaben im Impressum"
    },
    "mstv-18": {
      publisher: "Bayerische Staatskanzlei, BAYERN.RECHT",
      title: "§ 18 Medienstaatsvertrag: Informationspflichten und Auskunftsrechte",
      url: "https://www.gesetze-bayern.de/Content/Document/MStV-18",
      accessed: "16.11.2026",
      supports: "Benennung eines Verantwortlichen nach § 18 Abs. 2 MStV im Impressum"
    },

    /* --- calculator --- */
    "iata-tact-asean": {
      publisher: "ASEAN (Schulungsunterlage, zitiert IATA TACT Rules 3.9.4)",
      title: "Air Freight – Calculation of Air Freight",
      url: "https://asean.org/wp-content/uploads/2023/02/Air-Freight-C5.-Calculation-of-Air-Freight-PPT-Trainer-V2.pdf",
      accessed: "16.11.2026",
      supports: "Volumengewicht 1 : 6000; Aufrundung auf volle 0,5 kg",
      quote: "Cubic volume divided by 6,000 = 1.0 kg.",
      note: "Secondary quote of the IATA TACT rule (the original is paywalled). Individual airlines can use other rules."
    },
    "wm-cogoport": {
      publisher: "Cogoport",
      title: "How to calculate chargeable weight in ocean freight (26.02.2026)",
      url: "https://www.cogoport.com/blogs/how-to-calculate-chargeable-weight-ocean-freight",
      accessed: "16.11.2026",
      supports: "Seefracht-Sammelgut: 1 m³ = 1.000 kg, der höhere Wert zählt (W/M)",
      quote: "1 RT = 1 CBM or 1,000 kg (1 MT), whichever is higher.",
      note: "Forwarder glossary, not a carrier tariff. Carriers can set their own factors."
    },
    "fax-2026-11-03": {
      label: "Freightos Air Index, 03.11.2026",  // short name shown under the range
      publisher: "Freightos (Freightos Air Index, FAX)",
      title: "Asia-US air rates already nearing last year's high on peak season volumes – November 3, 2026 Update",
      url: "https://www.freightos.com/freight-resources/asia-us-air-rates-already-nearing-last-years-high-on-peak-season-volumes-november-3-2026-update/",
      accessed: "18.11.2026",
      supports: "Untergrenze des Richtwerts China – Deutschland: Asien – Europa 4,39 USD/kg (Woche vor dem 03.11.2026)",
      quote: "were about level at $4.39/kg last week",
      note: "FAX is an indicative all-in spot rate for general cargo in USD/kg, weight breaks 100–3,000 kg. Lane named 'Asia – Europe'. Quote as returned by the fetch tool."
    },
    "fax-2026-11-10": {
      label: "Freightos Air Index, 10.11.2026",  // short name shown under the range
      publisher: "Freightos (Freightos Air Index, FAX)",
      title: "LA/LB strike deadline extended; Dem win increasing trade uncertainty – November 10, 2026 Update",
      url: "https://www.freightos.com/freight-resources/la-lb-strike-deadline-extended-dem-win-increasing-trade-uncertainty-november-10-2026-update/",
      accessed: "18.11.2026",
      supports: "Richtwert China – Deutschland: China – Europa 4,87 USD/kg (Woche vor dem 10.11.2026)",
      quote: "China – Europe rates increased 11% to $4.87/kg",
      note: "Indicative all-in spot rate, general cargo. Quote as returned by the fetch tool."
    },
    "tac-hkg-eur-2026-10": {
      label: "TAC Index über Air Cargo News, Oktober 2026",  // short name shown under the range
      publisher: "Air Cargo News (TAC Index / Baltic Air Freight Index)",
      title: "Transpacific airfreight rates take off in October (02.11.2026)",
      url: "https://www.aircargonews.net/supply-chains/2026/11/transpacific-airfreight-rates-take-off-in-october/",
      accessed: "18.11.2026",
      supports: "Obergrenze des Richtwerts China – Deutschland: Hongkong – Europa 5,31 USD/kg, Durchschnitt Oktober 2026",
      quote: "average airfreight rates – a combination of spot and contract – on services from Hong Kong",
      note: "Monthly average of spot and contract rates from Hong Kong to Europe: 5.31 USD/kg in October 2026 (September 4.80). Cross-check: Xeneta spot average Northeast Asia – Europe 4.97 USD/kg in October 2026 (Air Cargo News, 06.11.2026)."
    },
    "forwarder-ranges-2026-11": {
      publisher: "Preisseiten von Speditionen und Frachtportalen (u. a. FreightAmigo, Topway Shipping, Suaid Global)",
      title: "Veröffentlichte Preisspannen für Luftfracht und Seefracht-Sammelgut, gesammelt am 18.11.2026",
      url: "https://www.freightamigo.com/en/routes/shipping-from-germany-to-united-arab-emirates/",
      accessed: "18.11.2026",
      supports: "Grundlage der Beispielwerte im Rechner (keine echten Preise)",
      note: "Marketing ranges, partly from search snippets, inconsistent between pages. Examples: Germany–UAE LCL 200–450 USD/m³, air 5–10 USD/kg; UAE–Germany LCL 200–300 USD/m³, air 5–15 USD/kg; Germany–Saudi Arabia LCL 100–300 and 250–400 USD/m³, air 2–5 USD/kg airport to airport; Hamburg–China air 5–10 USD/kg, LCL 100–200 USD/m³; China–Germany LCL 70–150 USD/m³ base; India–Germany LCL 50–90 USD/m³ base, terminal handling 15–40 USD/m³ per end, documents 50–100 USD; inland delivery 100–200 USD. Pages: freightamigo.com routes UAE–Germany and Hamburg–China, topwayshipping.com, suaidglobal.com."
    },
    "incodocs-ltl": {
      publisher: "IncoDocs",
      title: "CBM Calculator for Roadfreight LTL Shipments",
      url: "https://incodocs.com/tools/cbm-calculator-roadfreight",
      accessed: "18.11.2026",
      supports: "Lkw-Sammelgut: Abrechnung je m³ bzw. 333 kg",
      quote: "If you ship goods via road freight LTL, the carrier will charge for the freight per 1m3 or usually per 333Kg",
      note: "Trade-documentation platform, not an authority. Carriers can use other factors (250 or 300 kg)."
    },

    /* --- export FAQ: official sources --- */
    "zoll-einstufig": {
      publisher: "Zoll (Generalzolldirektion)",
      title: "Warenausfuhr im einstufigen Verfahren (sogenannte Kleinsendungen)",
      url: "https://www.zoll.de/DE/Fachthemen/Zoelle/Zollverfahren/Ausfuhrverfahren/Warenausfuhr-einstufiges-Verfahren/warenausfuhr-einstufiges-verfahren_node.html",
      accessed: "16.11.2026",
      supports: "Mündliche Anmeldung bis 1.000 Euro bzw. 1.000 kg; einstufiges Verfahren bis 3.000 Euro; keine Stückelung",
      quote: "Sofern der Wert der Sendung 1.000 Euro bzw. eine Eigenmasse von 1.000 Kilogramm nicht übersteigt ... kann die Sendung mündlich direkt bei der Ausgangszollstelle angemeldet werden."
    },
    "zoll-ausfuhrverfahren": {
      publisher: "Zoll (Generalzolldirektion)",
      title: "Ausfuhrverfahren",
      url: "https://www.zoll.de/DE/Fachthemen/Zoelle/Zollverfahren/Ausfuhrverfahren/ausfuhrverfahren_node.html",
      accessed: "16.11.2026",
      supports: "Zweistufiges Verfahren mit Ausfuhrzollstelle und Ausgangszollstelle",
      quote: "(d.h. unter Beteiligung von zwei Zollstellen: Ausfuhrzollstelle und Ausgangszollstelle)"
    },
    "zoll-atlas": {
      publisher: "Zoll (Generalzolldirektion)",
      title: "Das IT-Verfahren ATLAS-Ausfuhr",
      url: "https://www.zoll.de/DE/Fachthemen/Zoelle/ATLAS/ATLAS-Ausfuhr/IT-Verfahren-ATLAS-Ausfuhr/it-verfahren-atlas-ausfuhr.html",
      accessed: "16.11.2026",
      supports: "Pflicht zum elektronischen Ausfuhrverfahren; Ausgangsvermerk",
      quote: "Es besteht EU-einheitlich die Pflicht zur Teilnahme am elektronischen Ausfuhrverfahren ATLAS-Ausfuhr"
    },
    "zoll-ausfuehrer": {
      publisher: "Zoll (Generalzolldirektion)",
      title: "Ausführer",
      url: "https://www.zoll.de/DE/Fachthemen/Zoelle/Zollverfahren/Ausfuhrverfahren/Ausfuehrer/ausfuehrer_node.html",
      accessed: "16.11.2026",
      supports: "Wer Ausführer ist und wer die Anmeldung abgibt; Übertragung auf einen Spediteur",
      quote: "Der zollrechtliche Ausführer bzw. Anmelder muss nach § 12 Abs. 2 Außenwirtschaftsverordnung (AWV) die Zollanmeldung abgeben"
    },
    "zoll-normales-verfahren": {
      publisher: "Zoll (Generalzolldirektion)",
      title: "Normales Verfahren (zweistufiges Ausfuhrverfahren)",
      url: "https://www.zoll.de/DE/Fachthemen/Zoelle/Zollverfahren/Ausfuhrverfahren/Warenausfuhr-zweistufiges-Verfahren/Normales-Verfahren/normales-verfahren_node.html",
      accessed: "16.11.2026",
      supports: "MRN als Registriernummer der Ausfuhranmeldung",
      quote: "Registriernummer der Ausfuhranmeldung (Master Reference Number - MRN)."
    },
    "ustdv-9-10": {
      publisher: "Bundesministerium der Justiz, Gesetze im Internet",
      title: "§ 9 und § 10 UStDV: Ausfuhrnachweis bei Ausfuhrlieferungen",
      url: "https://www.gesetze-im-internet.de/ustdv_1980/__9.html",
      accessed: "16.11.2026",
      supports: "Ausgangsvermerk als Ausfuhrnachweis für die Umsatzsteuer",
      quote: "mit der durch die zuständige Ausfuhrzollstelle auf elektronischem Weg übermittelten Bestätigung, dass der Gegenstand ausgeführt wurde (Ausgangsvermerk)",
      note: "§ 10 UStDV: https://www.gesetze-im-internet.de/ustdv_1980/__10.html, § 6 UStG: https://www.gesetze-im-internet.de/ustg_1980/__6.html"
    },
    "zoll-eori": {
      publisher: "Zoll (Generalzolldirektion)",
      title: "EORI-Nummer und Beantragung einer EORI-Nummer",
      url: "https://www.zoll.de/DE/Fachthemen/Zoelle/EORI-Nummer/Beantragung-einer-EORI-Nummer/beantragung-einer-eori-nummer_node.html",
      accessed: "16.11.2026",
      supports: "EORI als Voraussetzung der Zollabwicklung; kostenlos; Antrag über das Zoll-Portal, verpflichtend seit 01.10.2026",
      quote: "Ab dem 1. Oktober 2026 wird die Nutzung des Zoll-Portals verpflichtend!",
      note: "Overview page https://www.zoll.de/DE/Fachthemen/Zoelle/EORI-Nummer/eori-nummer_node.html (checked 18.11.2026): the number is used 'insbesondere in Zollanmeldungen und summarischen Ein- und Ausgangsanmeldungen', so for import as well as export; 'Die Beantragung der EORI-Nummer ist kostenfrei'."
    },
    "zoll-faq-iaa": {
      publisher: "Zoll (Generalzolldirektion)",
      title: "Internetzollanmeldungen: Fragen und Antworten",
      url: "https://www.zoll.de/DE/Fachthemen/Zoelle/ATLAS/Internetzollanmeldungen/Fragen-und-Antworten/fragen-antworten_node.html",
      accessed: "16.11.2026",
      supports: "Kleinsendungen bis 1.000 Euro mündlich auch ohne EORI-Nummer",
      quote: "Kleinsendungen bis 1.000 Euro können allerdings auch ohne EORI-Nummer mündlich unter Vorlage einer Rechnung"
    },
    "icc-academy-dap-ddp": {
      publisher: "ICC Academy (Internationale Handelskammer)",
      title: "DAP & DDP Incoterms 2020 explained: Key differences (25.02.2025)",
      url: "https://academy.iccwbo.org/incoterms/article/incoterms-2020-dap-or-ddp/",
      accessed: "16.11.2026",
      supports: "Aufgabenverteilung bei DAP und DDP; Hinweis auf Schwierigkeiten bei der Einfuhrabfertigung unter DDP",
      quote: "foreign sellers may have difficulty carrying out import clearance in the destination country as called for under DDP"
    },
    "icc-germany-incoterms": {
      publisher: "ICC Germany",
      title: "Die Incoterms 2020 als Übersicht",
      url: "https://www.iccgermany.de/standards-incoterms/incoterms-2020-in-der-uebersicht/",
      accessed: "16.11.2026",
      supports: "EXW, FCA, FOB, CIF, DAP und DDP: wo geliefert wird, wer Kosten und Gefahr trägt; DDP: Verkäufer macht die Ware zur Einfuhr frei",
      quote: "Der Verkäufer trägt alle Kosten und Gefahren, die im Zusammenhang mit der Beförderung der Ware bis zum Bestimmungsort stehen.",
      note: "Further quotes checked 18.11.2026: EXW 'Der Verkäufer muss die Ware weder auf ein abholendes Transportmittel verladen, noch muss er sie zur Ausfuhr freimachen'; FOB 'Der Käufer trägt ab diesem Zeitpunkt alle Kosten.'; CIF 'Der Verkäufer schließt den Beförderungsvertrag ab und trägt die Frachtkosten zum benannten Bestimmungshafen.' (re-check, returned once)."
    },
    "gtai-vae": {
      publisher: "Germany Trade & Invest (GTAI)",
      title: "Zollbericht Vereinigte Arabische Emirate: Einfuhrabgaben (Stand 28.07.2025)",
      url: "https://www.gtai.de/de/trade/vereinigte-arabische-emirate/zoll/einfuhrabgaben-224610",
      accessed: "16.11.2026",
      supports: "VAE: Regelzollsatz 5 % auf den CIF-Wert, Umsatzsteuer 5 %",
      quote: "Die meisten Waren werden mit fünf Prozent verzollt. Hinzu kommt die Umsatzsteuer in Höhe von fünf Prozent."
    },
    "zatca-vat-import": {
      publisher: "ZATCA (Zakat, Tax and Customs Authority, Saudi-Arabien)",
      title: "Guideline on Imports and Exports under VAT Provision, 2. Ausgabe, Mai 2026",
      url: "https://zatca.gov.sa/en/HelpCenter/guidelines/Documents/Guideline-on-Imports-and-Exports-under-VAT-Provision.pdf",
      accessed: "16.11.2026",
      supports: "Saudi-Arabien: 15 % Mehrwertsteuer auf alle eingeführten Waren, berechnet vom CIF-Wert",
      quote: "VAT at 15% is imposed on all goods imported into the Kingdom, regardless of the classification of such goods, the customs duty rate applicable to them, or in cases where goods are exempt from customs duties.",
      note: "English text is for guidance; the Arabic version prevails. Saudi customs duty rates could not be confirmed on an official page and are therefore not stated on the site."
    },
    "saso-saber": {
      publisher: "SASO (Saudi Standards, Metrology and Quality Organization)",
      title: "Saudi Standards Obligates Importers to Register All Products on Saber Platform (03.01.2021)",
      url: "https://www.saso.gov.sa/en/mediacenter/news/Pages/saso_news_1178.aspx",
      accessed: "16.11.2026",
      supports: "SABER: Registrierung von Produkten durch den Importeur",
      quote: "obligates importers to submit a self-declaration for local and imported products",
      note: "Page is from 2021; re-check before relying on details."
    },
    "dm-montaji": {
      publisher: "Dubai Municipality, Health & Safety Department",
      title: "Technical Guidelines for Cosmetics and Personal Care Products, Version 2.1 (15.09.2025)",
      url: "https://dmpmedia.dm.gov.ae/uploads/2026/01/DM-HSD-GU116-CPCP2_Technical-Guidelines-for-Cosmetic-Personal-Care-Products_V2.1.pdf",
      accessed: "16.11.2026",
      supports: "Dubai: Registrierung kosmetischer Produkte im System Montaji, gültig 5 Jahre",
      quote: "no Cosmetic product shall be manufactured, imported, exported, advertised, sold or distributed in Dubai unless it has been registered in Montaji system",
      note: "Applies to Dubai only. Other emirates and Saudi Arabia (SFDA) could not be confirmed unambiguously and are not stated."
    },
    "bafa-exportkontrolle": {
      publisher: "Bundesamt für Wirtschaft und Ausfuhrkontrolle (BAFA)",
      title: "Exportkontrolle und das BAFA (Leitfaden, Stand November 2025)",
      url: "https://www.bafa.de/SharedDocs/Downloads/DE/Wirtschaft/merkblatt_exportkontrolle.pdf?__blob=publicationFile&v=5",
      accessed: "16.11.2026",
      supports: "Genehmigungspflicht für Dual-Use-Güter nach Verordnung (EU) 2021/821",
      quote: "Ausfuhren von Dual-Use-Gütern sind genehmigungspflichtig, wenn sie Güter des Anhangs I der Verordnung (EU) 2021/821 (EU-Dual-Use-Verordnung) oder des Teils I B der Ausfuhrliste (Anlage zur Außenwirtschaftsverordnung) betreffen."
    },
    "iata-dgr-addendum": {
      publisher: "IATA",
      title: "Dangerous Goods Regulations, 66th Edition, Addendum (30.04.2025)",
      url: "https://www.iata.org/contentassets/b08040a138dc4442a4f066e6fb99fe2a/dgr-66-addendum-1---en.pdf",
      accessed: "16.11.2026",
      supports: "Parfümerieerzeugnisse als UN 1266 in den IATA-Gefahrgutvorschriften",
      quote: "UN 1266, Perfumery product",
      note: "Aerosols and nail polish as dangerous goods could not be confirmed on an authoritative page; the site only asks customers to declare them."
    }
  },

  /* ---------- Texts ---------- */
  texts: {

    nav: {
      services: "Leistungen",
      calculator: "Richtwert-Rechner",
      faq: "Zoll-FAQ",
      checklist: "Dokumente",
      about: "Über Trust",
      request: "Sendung anfragen",
      menu: "Menü",
      skip: "Zum Inhalt springen",
      brandNote: ["Angebot und Vertrag in Deutschland,", "Transport mit Trust Logistic FZCO"]
    },

    footer: {
      role: "Diese Seite betreibt {{operator.name}}, zugleich Ihr Vertragspartner für Angebot und Rechnung. Den Transport organisiert Trust Logistic FZCO, Dubai.",
      imprint: "Impressum",
      privacy: "Datenschutz",
      sourcesNote: "Richtwerte im Rechner sind unverbindlich und kein Angebot. Den Preis für Ihre Sendung erhalten Sie mit dem Angebot."
    },

    home: {
      title: "Fracht zwischen Deutschland und dem Golf, verbunden über Dubai | Trust Logistic FZCO",
      description: "Luftfracht, Seefracht, Sea-Air und Landtransport zwischen Deutschland und den Golfstaaten, in beide Richtungen, außerdem von und nach China und Indien. Anfrage, Angebot und Rechnung auf Deutsch, Transport mit Trust Logistic FZCO, Dubai Airport Freezone.",

      hero: {
        /* [[...]] keeps a hyphenated word on one line */
        h1: "Deutschland und der Golf, verbunden über Dubai",
        lead: "Fracht in beide Richtungen, per Luft, See und Land, organisiert von Trust Logistic FZCO in der Dubai Airport Freezone. Auch China und Indien gehören zu den Strecken, direkt oder über Dubai, je nach Sendung. Angebot und Rechnung erhalten Sie auf Deutsch von Ihrem Vertragspartner in Deutschland.",
        primary: "Sendung anfragen",
        secondary: "Richtwert berechnen",
        note: "Preise werden für jede Sendung einzeln vereinbart. Der Rechner zeigt das frachtpflichtige Gewicht und einen unverbindlichen Richtwert."
      },

      card: {
        title: "Strecke und Eckdaten",
        licence: "Trust-Lizenz Nr. 3813",
        /* twoWay: planes at both ends of the line. A code with spaces ("CN IN AE") is set smaller. */
        twoWay: true,
        fromLabel: "Zwischen", fromCode: "DE", fromPlace: "Deutschland",
        toLabel: "und", toCode: "AE", toPlace: "Dubai, den Emiraten und weiteren Golfstaaten",
        fields: [
          { label: "Verkehrsträger", value: "Luftfracht, Seefracht, [[Sea-Air]], Landweg" },
          { label: "Auch von und nach", value: "China und Indien" },
          { label: "Luftfracht Deutschland → Golf", value: "typisch 5–7 Tage von Tür zu Tür, je nach Sendung" },
          { label: "Verzollung", value: "bei Ausfuhr und Einfuhr: steht im Angebot" }
        ],
        partnerLabel: "Transportpartner in Dubai",
        partnerSub: "{{trust.addressLine}}. Lizenz gültig bis {{trust.licenceValidTo}}.",
        contactLabel: "Ihr Vertragspartner in Deutschland",
        contactValue: "{{operator.name}}, {{operator.phone}}"
      },

      audiences: {
        title: "Für wen die Strecken passen",
        intro: "Gedacht ist das Angebot für kleine und mittlere Unternehmen, die Ware an den Golf, nach China oder nach Indien liefern oder von dort beziehen.",
        items: [
          { title: "Exporteure mit Kunden am Golf", text: "Ob Händler, Endkunde oder Messestand in den Emiraten oder in Saudi-Arabien: Die Ware geht per Luft, See oder Land bis zum Empfänger. Bei DDP zahlt Ihr Empfänger bei der Zustellung nichts mehr, bei DAP trägt er die Einfuhrabgaben selbst." },
          { title: "Einkauf in China, Indien und am Golf", text: "Wer Ware oder Bauteile im Ausland einkauft, braucht den Transport bis nach Deutschland. Nennen Sie in der Anfrage den Abholort beim Lieferanten und die vereinbarte Lieferbedingung, zum Beispiel EXW oder FOB." },
          { title: "Beauty- und Kosmetikmarken", text: "Kosmetik und Beauty-Produkte gehören zu den typischen Waren auf der Strecke an den Golf. Enthält Ihre Sendung Sprays, Parfüm oder Nagellack, geben Sie das bitte in der Anfrage an." },
          { title: "Ersatzteile und Messegut", text: "Eilige Ersatzteile gehen in der Regel per Luftfracht, schwere oder sperrige Teile per Seefracht. Messegut hat einen festen Termin: Nennen Sie Messe, Aufbautag und Standnummer, damit Verkehrsträger und Vorlauf danach geplant werden." }
        ]
      },

      services: {
        title: "Leistungen",
        intro: "Den Transport organisiert Trust Logistic FZCO in Dubai, in beide Richtungen: von Deutschland an den Golf und zurück, außerdem von und nach China und Indien. Andere Strecken sind auf Anfrage möglich.",
        items: [
          { title: "Luftfracht", text: "Für eilige und hochwertige Sendungen. Von Deutschland an den Golf typisch 5–7 Tage von Tür zu Tür, je nach Sendung. Für andere Strecken steht die Laufzeit im Angebot." },
          { title: "Seefracht", text: "Für schwere oder großvolumige Sendungen, bei denen die Laufzeit nicht im Vordergrund steht." },
          { title: "Sea-Air", text: "Kombination aus See- und Luftstrecke. Laufzeit und Kosten liegen zwischen reiner Seefracht und reiner Luftfracht." },
          { title: "Landweg", text: "Trust ist auch als Agentur für Landtransporte lizenziert. Ob Ihre Sendung ganz oder teilweise auf dem Landweg läuft, steht im Angebot." },
          { title: "Lieferbedingungen", text: "Wer Transport, Zoll und Einfuhrabgaben trägt, regelt die Lieferbedingung im Kaufvertrag, etwa EXW, FOB, DAP oder DDP. Nennen Sie sie in der Anfrage, dann richtet sich das Angebot danach.", linkText: "Incoterms im Überblick", linkHref: "export-faq.html#dap-ddp" }
        ]
      },

      /* Points that are NOT settled. Do not turn these into promises. */
      open: {
        title: "Was erst im Angebot steht",
        intro: "Einige Punkte hängen von der einzelnen Sendung ab. Diese Seite sagt sie deshalb nicht zu; Sie finden sie im Angebot.",
        items: [
          "Abholung der Ware beim Absender, in Deutschland oder im Ausland",
          "Ausfuhrabfertigung im Abgangsland",
          "Einfuhrabfertigung im Zielland, auch in Deutschland",
          "Transportversicherung und ihre Bedingungen",
          "Waren, die nicht befördert werden",
          "Mindestgewicht je Sendung"
        ]
      },

      /* Example shipments. Fill with real, anonymised shipments from Trust. No prices here.
         Set show to false to hide the section until real examples exist. */
      examples: {
        show: true,
        title: "Beispielsendungen",
        intro: "PLATZHALTER: ein Satz zur Einordnung, z. B. dass es sich um tatsächlich durchgeführte Sendungen handelt",
        fields: [
          { key: "goods", label: "Ware" },
          { key: "route", label: "Strecke" },
          { key: "mode", label: "Verkehrsträger" },
          { key: "size", label: "Umfang" },
          { key: "transit", label: "Laufzeit von Tür zu Tür" }
        ],
        items: [
          { goods: "PLATZHALTER: Ware, Beispiel 1", route: "PLATZHALTER: von – nach", mode: "PLATZHALTER: Luft, See oder Sea-Air", size: "PLATZHALTER: Packstücke und Gewicht", transit: "PLATZHALTER: Tage" },
          { goods: "PLATZHALTER: Ware, Beispiel 2", route: "PLATZHALTER: von – nach", mode: "PLATZHALTER: Luft, See oder Sea-Air", size: "PLATZHALTER: Packstücke und Gewicht", transit: "PLATZHALTER: Tage" },
          { goods: "PLATZHALTER: Ware, Beispiel 3", route: "PLATZHALTER: von – nach", mode: "PLATZHALTER: Luft, See oder Sea-Air", size: "PLATZHALTER: Packstücke und Gewicht", transit: "PLATZHALTER: Tage" }
        ]
      },

      /* The person behind the German contact. photo: path to a file in assets/img/, e.g. "assets/img/portrait.jpg". */
      contact: {
        title: "Ihr Vertragspartner in Deutschland",
        photo: "PLATZHALTER: Porträtfoto",
        photoAlt: "Porträt",
        profile: "PLATZHALTER: zwei bis drei Sätze zu Ihrer Person, zum Beispiel beruflicher Hintergrund und Verbindung zu Trust",
        rows: [
          { label: "Telefon", value: "{{operator.phone}}" },
          { label: "E-Mail", value: "{{operator.email}}" },
          { label: "Sprachen", value: "PLATZHALTER: z. B. Deutsch, Englisch, Arabisch" },
          { label: "Antwort in der Regel", value: "PLATZHALTER: z. B. innerhalb eines Werktags" }
        ]
      },

      steps: {
        title: "So läuft eine Anfrage ab",
        items: [
          { title: "Sie schildern die Sendung", text: "Über das Formular oder per E-Mail, auf Deutsch. Maße, Gewicht, Ware, Abgangs- und Zielort genügen für den Anfang." },
          { title: "Rückfragen werden geklärt", text: "{{operator.name}} meldet sich bei offenen Punkten und stimmt die Sendung mit Trust in Dubai ab." },
          { title: "Sie erhalten das Angebot", text: "Von {{operator.name}}, mit Preis, Laufzeit und Bedingungen für genau diese Sendung." },
          { title: "Sie beauftragen den Transport", text: "Der Vertrag kommt zwischen Ihnen und {{operator.name}} zustande. Den Transport organisiert Trust Logistic FZCO." }
        ]
      },

      calcTeaser: {
        title: "Was wiegt Ihre Sendung für die Frachtrechnung?",
        text: "Luftfracht wird nach Gewicht oder nach Volumen abgerechnet, je nachdem, was mehr ergibt. Ein Beispiel: 4 Kartons mit je 60 × 40 × 40 cm und 12 kg wiegen zusammen [[48 kg]]. Abgerechnet werden [[64 kg]].",
        button: "Richtwert berechnen"
      },

      about: {
        title: "Wer Trust ist und wer diese Seite betreibt",
        paragraphs: [
          "Trust Logistic FZCO ist seit 2018 in der Dubai Airport Freezone lizenziert. Das Unternehmen organisiert die Transporte, die Sie über diese Seite anfragen.",
          "Diese Seite betreibt {{operator.name}}, zugleich Ihr Vertragspartner. Angebot und Rechnung kommen in deutscher Sprache von {{operator.name}}."
        ],
        photos: [
          { src: "assets/img/foto-paletten.jpg", width: 550, height: 326, alt: "Zwei umreifte und in Folie gewickelte Paletten mit Kartons", caption: "Verpackte Paletten vor dem Versand. Foto: Trust Logistic FZCO" },
          { src: "assets/img/foto-lager.jpg", width: 390, height: 296, alt: "Nummerierte Paletten mit Kartonware in einer Lagerhalle", caption: "Palettenware im Lager. Foto: Trust Logistic FZCO" }
        ],
        factsTitle: "Lizenzdaten",
        labels: {
          company: "Firma", seat: "Sitz", licence: "Lizenznummer", issued: "Ausgestellt am", validTo: "Gültig bis",
          authority: "Ausstellende Behörde", activities: "Lizenzierte Tätigkeiten", network: "Netzwerk", website: "Website"
        }
      },

      faqTeaser: {
        title: "Fragen zu Zoll, Export und Import",
        text: "Ausfuhranmeldung, EORI-Nummer, Incoterms, Einfuhr nach Deutschland mit Zoll und Einfuhrumsatzsteuer, Abgaben in den Emiraten und in Saudi-Arabien: die wichtigsten Antworten, jeweils mit Quelle.",
        button: "Zur Zoll-FAQ"
      },

      cta: {
        title: "Schildern Sie Ihre Sendung",
        text: "Je genauer die Angaben, desto weniger Rückfragen sind nötig.",
        button: "Sendung anfragen"
      }
    },

    calculator: {
      title: "Richtwert-Rechner für Luft- und Seefracht | Trust Logistic FZCO",
      description: "Frachtpflichtiges Gewicht für Luftfracht, Seefracht, Sea-Air und Landweg berechnen, mit unverbindlichem Richtwert. Den Preis erhalten Sie mit dem Angebot.",
      h1: "Richtwert-Rechner",
      intro: "Der Rechner ermittelt das frachtpflichtige Gewicht Ihrer Sendung, also das Gewicht, nach dem die Fracht berechnet wird. Dazu zeigt er einen unverbindlichen Richtwert für die Fracht. Das ist kein Angebot: Den Preis für Ihre Sendung erhalten Sie nach Ihrer Anfrage.",
      packagesLegend: "Packstücke",
      packagesHint: "Eine Zeile je Packstückart. Dezimalzahlen mit Komma, zum Beispiel 12,5.",
      modeLegend: "Verkehrsträger",
      fromLabel: "Von",
      toLabel: "Nach",
      resultTitle: "Ergebnis",
      noscript: "Der Rechner braucht JavaScript. Ohne JavaScript erreichen Sie uns über das Anfrageformular."
    },

    faq: {
      title: "Zoll-FAQ: Export, Import und Einfuhr am Golf | Trust Logistic FZCO",
      description: "Ausfuhr aus Deutschland, Einfuhr nach Deutschland mit Zoll und Einfuhrumsatzsteuer, Einfuhr in die Emirate und nach Saudi-Arabien, Incoterms: kurze Antworten, jeweils mit Quelle.",
      h1: "Zoll-FAQ",
      intro: "Kurze Antworten auf die Fragen, die vor einer Sendung am häufigsten offen sind, für beide Richtungen. Jede Angabe ist mit einer Quelle belegt: Zoll- und Steuerbehörden, Gesetzestexte, die EU-Kommission, die Internationale Handelskammer und Fachquellen. Die Antworten ersetzen keine Zoll- oder Steuerberatung für den Einzelfall.",
      sourceLabel: "Quelle",
      sourcesLabel: "Quellen",
      accessedLabel: "abgerufen am",
      /* Filled from verified sources only. Groups with items of this shape:
         { id: "eori", q: "Frage", a: ["Absatz", ["Punkt", "Punkt"], "Absatz"], sources: ["id"] }
         Keep the ids: other pages link to them (e.g. export-faq.html#dap-ddp). */
      groups: [
        {
          title: "Für jede Sendung",
          items: [
            {
              id: "eori",
              q: "Brauche ich eine EORI-Nummer?",
              a: [
                "Ja, sobald Sie eine Zollanmeldung abgeben, bei der Ausfuhr ebenso wie bei der Einfuhr. Die EORI-Nummer ist Voraussetzung für die Zollabwicklung in der EU und wird in Zollanmeldungen angegeben.",
                "Die Generalzolldirektion vergibt sie auf Antrag kostenlos. Der Antrag läuft über das Zoll-Portal (www.zoll-portal.de); seit dem [[1. Oktober 2026]] ist die Nutzung des Portals verpflichtend.",
                "Bei der Ausfuhr können Kleinsendungen bis 1.000 Euro auch ohne EORI-Nummer mündlich angemeldet werden."
              ],
              sources: ["zoll-eori", "zoll-faq-iaa"]
            },
            {
              id: "dap-ddp",
              q: "EXW, FOB, DAP oder DDP: Was regelt die Lieferbedingung?",
              a: [
                "Die Incoterms 2020 legen im Kaufvertrag fest, wo der Verkäufer liefert und wer bis dahin Kosten und Risiko trägt. Häufig verwendet werden:",
                [
                  "EXW (ab Werk): Alle Kosten ab dem benannten Abholort trägt der Käufer. Der Verkäufer muss die Ware weder verladen noch zur Ausfuhr freimachen.",
                  "FCA (frei Frachtführer): Der Verkäufer übergibt die Ware dem Frachtführer oder einer anderen vom Käufer benannten Person und trägt bis dahin das Risiko.",
                  "FOB (frei an Bord): Der Verkäufer liefert an Bord des vom Käufer benannten Schiffs. Ab dann trägt der Käufer Gefahr und Kosten.",
                  "CIF: Der Verkäufer schließt den Beförderungsvertrag und trägt die Fracht bis zum Bestimmungshafen. Die Gefahr geht aber schon an Bord auf den Käufer über.",
                  "DAP (Delivered at Place): Der Verkäufer liefert bis zum vereinbarten Bestimmungsort. Die Einfuhrabfertigung erledigt und bezahlt der Käufer.",
                  "DDP (Delivered Duty Paid): Der Verkäufer erledigt und bezahlt alle Zollformalitäten, für die Ausfuhr und für die Einfuhr."
                ],
                "Kaufen Sie zum Beispiel in China oder Indien EXW, FCA oder FOB ein, tragen Sie die Kosten des Transports ab diesem Punkt. Den Transport nach Deutschland können Sie über diese Seite anfragen.",
                "Die ICC weist darauf hin, dass ausländische Verkäufer Schwierigkeiten haben können, die Einfuhrabfertigung im Bestimmungsland unter DDP selbst durchzuführen. Wer die Einfuhrumsatzsteuer trägt, nennen die Übersichten der ICC nicht ausdrücklich; regeln Sie das im Kaufvertrag."
              ],
              sources: ["icc-germany-incoterms", "icc-academy-dap-ddp"]
            },
            {
              id: "frachtgewicht",
              q: "Wie wird das frachtpflichtige Gewicht berechnet?",
              a: [
                "In der Luftfracht zählt das tatsächliche Gewicht oder das Volumengewicht, je nachdem, was höher ist. Das Volumengewicht ergibt sich aus Länge × Breite × Höhe in Zentimetern, geteilt durch 6.000. Das Ergebnis wird auf volle 0,5 Kilogramm aufgerundet.",
                "Bei Seefracht-Sammelgut wird nach Kubikmeter oder Gewicht abgerechnet (W/M): 1.000 Kilogramm gelten als ein Kubikmeter, der höhere Wert zählt.",
                "Einzelne Fluggesellschaften und Reedereien können abweichende Regeln anwenden. Mit dem [Richtwert-Rechner](rechner.html) rechnen Sie Ihre Sendung durch."
              ],
              sources: ["iata-tact-asean", "wm-cogoport"]
            },
            {
              id: "gefahrgut",
              q: "Kann Kosmetik in der Luftfracht Gefahrgut sein?",
              a: [
                "Ja. Die Gefahrgutvorschriften der IATA führen zum Beispiel Parfümerieerzeugnisse unter der Nummer UN 1266.",
                "Geben Sie in der Anfrage an, ob Ihre Sendung Parfüm, Sprays oder Nagellack enthält. Die Einstufung wird dann vor dem Angebot geklärt."
              ],
              sources: ["iata-dgr-addendum"]
            }
          ]
        },
        {
          title: "Export aus Deutschland",
          intro: "Für Sendungen aus Deutschland in Länder außerhalb der EU, zum Beispiel an den Golf, nach China oder nach Indien. Die Einfuhrregeln Chinas und Indiens nennt diese Seite nicht; klären Sie diese mit Ihrem Empfänger.",
          items: [
            {
              id: "ausfuhranmeldung",
              q: "Wann brauche ich eine Ausfuhranmeldung?",
              a: [
                "Für Sendungen in ein Land außerhalb der EU ist die Ausfuhr beim Zoll anzumelden, in der Regel elektronisch über das IT-Verfahren ATLAS-Ausfuhr.",
                [
                  "Kleinsendungen: Übersteigt die Sendung einen Wert von 1.000 Euro bzw. eine Eigenmasse von 1.000 Kilogramm nicht, kann sie mündlich direkt bei der Ausgangszollstelle angemeldet werden.",
                  "Bis 3.000 Euro Warenwert ist das einstufige Verfahren möglich: Die Ware wird direkt bei der Ausgangszollstelle gestellt und angemeldet.",
                  "Darüber gilt das zweistufige Verfahren mit zwei Zollstellen, der Ausfuhrzollstelle und der Ausgangszollstelle."
                ],
                "Eine Sendung in Teilsendungen aufzuteilen, um unter der Wertgrenze zu bleiben, ist nicht zulässig. Ob die Ausfuhrabfertigung in Deutschland übernommen wird, steht im Angebot."
              ],
              sources: ["zoll-einstufig", "zoll-ausfuhrverfahren", "zoll-atlas"]
            },
            {
              id: "ausfuehrer",
              q: "Wer gibt die Ausfuhranmeldung ab?",
              a: [
                "Ausführer ist die in der EU ansässige Person, die über das Verbringen der Ware aus der EU bestimmt. Der Ausführer bzw. Anmelder muss die Zollanmeldung abgeben [[(§ 12 Abs. 2 AWV)]].",
                "Diese Bestimmungsbefugnis kann auf einen anderen in der EU Ansässigen übertragen werden, zum Beispiel auf einen Spediteur."
              ],
              sources: ["zoll-ausfuehrer"]
            },
            {
              id: "ausgangsvermerk",
              q: "Welchen Nachweis brauche ich für die umsatzsteuerfreie Ausfuhrlieferung?",
              a: [
                "Jede Ausfuhranmeldung erhält eine Registriernummer, die MRN (Master Reference Number). Hat die Ware die EU verlassen, übermittelt die Ausfuhrzollstelle elektronisch den Ausgangsvermerk.",
                "Bei elektronischer Ausfuhranmeldung ist der Ausgangsvermerk der Ausfuhrnachweis für die Umsatzsteuer (§ 6 UStG, §§ 9 und 10 UStDV). Bewahren Sie ihn zusammen mit der Rechnung auf."
              ],
              sources: ["zoll-normales-verfahren", "zoll-atlas", "ustdv-9-10"]
            },
            {
              id: "exportkontrolle",
              q: "Muss ich die Exportkontrolle beachten?",
              a: [
                "Ausfuhren von Dual-Use-Gütern sind genehmigungspflichtig, wenn die Güter in Anhang I der Verordnung (EU) 2021/821 oder in Teil I B der Ausfuhrliste stehen. Prüfen Sie vor dem Versand, ob Ihre Ware gelistet ist. Zuständig für Genehmigungen ist das Bundesamt für Wirtschaft und Ausfuhrkontrolle (BAFA)."
              ],
              sources: ["bafa-exportkontrolle"]
            }
          ]
        },
        {
          title: "Import nach Deutschland",
          intro: "Für Ware aus Ländern außerhalb der EU, zum Beispiel aus China, Indien oder den Emiraten.",
          items: [
            {
              id: "einfuhr",
              q: "Wie wird Ware aus einem Land außerhalb der EU eingeführt?",
              a: [
                "Die Ware ist beim Zoll anzumelden. Die deutsche Zollverwaltung wickelt Zollverfahren über das IT-Verfahren ATLAS ab, das einen eigenen Teil für die Einfuhr hat.",
                "In der Zollanmeldung wird die EORI-Nummer angegeben. Grundlage für den Zollwert ist die Handelsrechnung. Besteht die Sendung aus mehreren Packstücken, kann die Zollstelle eine Packliste verlangen, außerdem Beförderungspapiere.",
                "Ob die Einfuhrabfertigung in Deutschland übernommen wird, steht im Angebot."
              ],
              sources: ["zoll-atlas-allg", "zoll-eori", "zoll-unterlagen"]
            },
            {
              id: "zollvertreter",
              q: "Muss ich die Einfuhr selbst anmelden?",
              a: [
                "Nein. Jede Person kann einen Zollvertreter ernennen (Art. 18 Zollkodex der Union), zum Beispiel einen Spediteur oder Zolldienstleister. Es gibt zwei Formen:",
                [
                  "Direkte Vertretung: Der Vertreter handelt in Ihrem Namen und für Ihre Rechnung.",
                  "Indirekte Vertretung: Der Vertreter handelt im eigenen Namen, aber für Ihre Rechnung."
                ]
              ],
              sources: ["zoll-vertretung"]
            },
            {
              id: "zollsatz",
              q: "Wie hoch ist der Zoll?",
              a: [
                "Das hängt von der Ware ab: Jede Zolltarifnummer hat eigene Zollsätze. Nachschlagen lassen sie sich im Elektronischen Zolltarif (EZT-online) des deutschen Zolls und in der EU-Datenbank TARIC.",
                "Geben Sie die Zolltarifnummer (HS-Code) in der Anfrage an, wenn Sie sie kennen."
              ],
              sources: ["zoll-zollsatz"]
            },
            {
              id: "zollwert",
              q: "Wovon wird der Zoll berechnet?",
              a: [
                "Vom Zollwert. Er beruht in der Regel auf dem Transaktionswert, also dem tatsächlich gezahlten oder zu zahlenden Preis der Ware.",
                "Die Beförderungs- und Versicherungskosten bis zu dem Ort, an dem die Ware in die EU verbracht wird, werden dem Preis hinzugerechnet. Wer ab Werk oder FOB einkauft, zahlt Zoll also auch auf die Fracht bis zur EU-Grenze."
              ],
              sources: ["zoll-transaktionswert", "zoll-befoerderungskosten"]
            },
            {
              id: "einfuhrumsatzsteuer",
              q: "Was ist die Einfuhrumsatzsteuer, und kann ich sie abziehen?",
              a: [
                "Bei der Einfuhr fällt neben dem Zoll die Einfuhrumsatzsteuer an. Sie beträgt 19 Prozent, für Waren aus Anlage 2 zum Umsatzsteuergesetz 7 Prozent.",
                "Bemessen wird sie nach dem Zollwert. Hinzu kommen unter anderem die Kosten der Beförderung bis zum ersten Bestimmungsort in der EU [[(§ 11 UStG)]].",
                "Unternehmer können die Einfuhrumsatzsteuer für Waren, die sie für ihr Unternehmen einführen, als Vorsteuer abziehen [[(§ 15 Abs. 1 Nr. 2 UStG)]]."
              ],
              sources: ["zoll-eust-satz", "ustg-11", "ustg-15"]
            },
            {
              id: "praeferenz",
              q: "Gibt es niedrigere Zölle für Ware aus Indien?",
              a: [
                "Für die Anwendung von Präferenzregelungen verlangt der Zoll entsprechende Unterlagen. Im Allgemeinen Präferenzsystem der EU (APS) ist der Ursprungsnachweis eine Erklärung zum Ursprung, die ein im REX-System registrierter Ausführer auf die Rechnung setzt.",
                "Für Indien sind die APS-Präferenzen in mehreren Warengruppen ausgesetzt, von 2026 bis 2028 zum Beispiel für Mineralien, Kautschuk und Kraftfahrzeuge. Ob Ihre Ware begünstigt ist, lässt sich über die Zolltarifnummer prüfen.",
                "Das Handelsabkommen zwischen der EU und Indien ist ausgehandelt, aber noch nicht in Kraft (Stand der Seite der EU-Kommission: 11. September 2026)."
              ],
              sources: ["zoll-unterlagen", "eu-gsp-rex", "eu-gsp-2026", "eu-india-fta"]
            }
          ]
        },
        {
          title: "Einfuhr in die Emirate und nach Saudi-Arabien",
          items: [
            {
              id: "vae",
              q: "Welche Abgaben fallen bei der Einfuhr in die Emirate an?",
              a: [
                "Der Regelzollsatz beträgt in den Mitgliedstaaten des Golf-Kooperationsrats (GCC) fünf Prozent. Maßgeblich ist der CIF-Wert, also der Warenwert einschließlich Versicherung und Fracht.",
                "Die meisten Waren werden in den Emiraten mit fünf Prozent verzollt. Hinzu kommt die Umsatzsteuer von fünf Prozent. Für einzelne Warengruppen gelten andere Sätze oder Zollfreiheit; entscheidend ist die Zolltarifnummer."
              ],
              sources: ["gtai-vae"]
            },
            {
              id: "saudi-arabien",
              q: "Welche Abgaben fallen bei der Einfuhr nach Saudi-Arabien an?",
              a: [
                "Saudi-Arabien erhebt auf alle eingeführten Waren 15 Prozent Mehrwertsteuer, unabhängig von der Zolltarifnummer, vom Zollsatz und von einer Zollbefreiung. Im Rechenbeispiel der Steuerbehörde ZATCA wird sie vom CIF-Wert berechnet.",
                "Hinzu kommt der Zoll. Er richtet sich nach der Zolltarifnummer der Ware. Eine amtliche Übersicht der Sätze liegt für diese Seite nicht vor; lassen Sie sich den Satz für Ihre Ware vor dem Versand vom Importeur nennen.",
                "Importeure müssen ihre Produkte außerdem auf der Plattform SABER der saudischen Normungsbehörde SASO registrieren."
              ],
              sources: ["zatca-vat-import", "saso-saber"]
            },
            {
              id: "kosmetik-dubai",
              q: "Was gilt für Kosmetik in Dubai?",
              a: [
                "In Dubai dürfen kosmetische Produkte nur eingeführt, beworben und verkauft werden, wenn sie im System Montaji der Stadtverwaltung (Dubai Municipality) registriert sind. Die Registrierung gilt fünf Jahre.",
                "Für die übrigen Emirate und für Saudi-Arabien liegt keine eindeutige amtliche Quelle vor. Klären Sie die Anforderungen dort mit Ihrem Importeur."
              ],
              sources: ["dm-montaji"]
            }
          ]
        }
      ]
    },

    /* Document checklist (checkliste.html). Each item: { name, text, sources: ["id"] }.
       Only list what an official or institutional source confirms. */
    checklist: {
      title: "Dokumenten-Checkliste für Export und Import | Trust Logistic FZCO",
      description: "Welche Dokumente eine Sendung braucht: für jede Sendung, für die Ausfuhr aus Deutschland, die Einfuhr nach Deutschland und die Einfuhr in die Emirate oder nach Saudi-Arabien, jeweils mit Quelle.",
      h1: "Dokumenten-Checkliste",
      intro: "Welche Unterlagen eine Sendung braucht, hängt von der Richtung ab. Die Liste nennt nur, was sich mit einer Quelle belegen lässt. Für die Einfuhr nach China und Indien nennt sie keine Regeln; klären Sie diese mit Ihrem Empfänger.",
      note: "Die Checkliste ersetzt keine Zoll- oder Rechtsberatung. Anforderungen hängen von Ware, Wert und Empfänger ab und können sich ändern.",
      groups: [
        {
          title: "Für jede Sendung",
          items: [
            { name: "Handelsrechnung", text: "Die Handelsrechnung erstellt der Verkäufer. Auf ihrer Grundlage wird der Zollwert der Ware angemeldet, bei der Ausfuhr wie bei der Einfuhr.", sources: ["zoll-unterlagen", "ihk-pfalz-ausfuhrdokumente"] },
            { name: "Packliste", text: "Besteht die Sendung aus mehreren Packstücken, kann die Zollstelle eine Liste der Packstücke verlangen.", sources: ["zoll-unterlagen"] },
            { name: "Frachtdokument", text: "Luftfrachtbrief, Konnossement oder ein anderes Beförderungspapier. Die Zollstelle kann Beförderungspapiere verlangen.", sources: ["zoll-unterlagen"] },
            { name: "EORI-Nummer", text: "Sie ist Voraussetzung für die Zollabwicklung und wird in der Zollanmeldung angegeben. Der Antrag läuft kostenlos über das Zoll-Portal.", sources: ["zoll-eori"] }
          ]
        },
        {
          title: "Ausfuhr aus Deutschland",
          items: [
            { name: "Ausfuhranmeldung", text: "Sie wird elektronisch über ATLAS-Ausfuhr abgegeben und erhält eine Registriernummer (MRN). Kleinsendungen bis 1.000 Euro können mündlich angemeldet werden. Details stehen in der [Zoll-FAQ](export-faq.html#ausfuhranmeldung).", sources: ["zoll-normales-verfahren", "zoll-einstufig"] },
            { name: "Ursprungszeugnis, falls verlangt", text: "Das Ursprungszeugnis ist eine öffentliche Urkunde über den nichtpräferenziellen Ursprung der Ware. Den Antrag stellen Sie bei Ihrer IHK. Ob die Emirate oder Saudi-Arabien es verlangen, steht in den Abschnitten unten.", sources: ["ihk-muenchen-uz"] },
            { name: "Prüfung der Exportkontrolle", text: "Prüfen Sie, ob Ihre Ware als Dual-Use-Gut gelistet ist. Dann brauchen Sie eine Genehmigung des BAFA.", sources: ["bafa-exportkontrolle"] }
          ]
        },
        {
          title: "Einfuhr nach Deutschland",
          items: [
            { name: "Zollanmeldung", text: "Die Einfuhr ist beim Zoll anzumelden; die Zollverwaltung nutzt dafür das IT-Verfahren ATLAS. Details stehen in der [Zoll-FAQ](export-faq.html#einfuhr).", sources: ["zoll-atlas-allg"] },
            { name: "Zolltarifnummer der Ware", text: "Nach ihr richtet sich der Zollsatz. Nachschlagen lässt sie sich im Elektronischen Zolltarif (EZT-online) und in TARIC.", sources: ["zoll-zollsatz"] },
            { name: "Zollvertreter, falls gewünscht", text: "Soll ein Spediteur oder Zolldienstleister die Anmeldung abgeben, ernennen Sie ihn als direkten oder indirekten Vertreter.", sources: ["zoll-vertretung"] },
            { name: "Ursprungsnachweis für Zollpräferenzen, falls zutreffend", text: "Für einen Präferenzzollsatz verlangt der Zoll entsprechende Unterlagen. Im Allgemeinen Präferenzsystem der EU ist das eine Erklärung zum Ursprung eines im REX-System registrierten Ausführers.", sources: ["zoll-unterlagen", "eu-gsp-rex"] },
            { name: "Einfuhrumsatzsteuer einplanen", text: "19 Prozent, für Waren aus Anlage 2 zum Umsatzsteuergesetz 7 Prozent. Unternehmer können sie als Vorsteuer abziehen.", sources: ["zoll-eust-satz", "ustg-15"] }
          ]
        },
        {
          title: "Einfuhr in die Emirate",
          items: [
            { name: "Handelsrechnung in Arabisch oder Englisch", text: "Die Handelsrechnung ist in Arabisch oder Englisch zu erstellen. Bei deutscher Ware ist als Ursprungsland „Federal Republic of Germany“ anzugeben. Die Angabe „European Union“ reicht im Allgemeinen nicht aus.", sources: ["gtai-vae-papiere"] },
            { name: "Frachtdokumente", text: "Bei gewerblichen Einfuhren werden in der Regel Handelsrechnung, Frachtdokumente und Packliste benötigt, je nach Ware außerdem Genehmigungen.", sources: ["gtai-vae-papiere"] },
            { name: "Packliste", text: "Sie kann in Arabisch oder Englisch und mit HS-Codes verlangt werden.", sources: ["gtai-vae-papiere"] },
            { name: "Beglaubigung der Handelsrechnung ab 10.000 AED", text: "Für Waren, die in die Emirate eingeführt werden, ist ab einem Wert von 10.000 AED die elektronische Beglaubigung der Handelsrechnung über das System eDAS 2.0 des Außenministeriums Pflicht. Sie kostet 150 AED je Rechnung zuzüglich Servicegebühren. Klären Sie mit Ihrem Empfänger, wer die Beglaubigung vornimmt.", sources: ["mofa-edas"] },
            { name: "Ursprungszeugnis", text: "Seit 2020 ist ein Ursprungszeugnis in den Emiraten grundsätzlich nicht mehr erforderlich.", sources: ["gtai-vae-papiere"] },
            { name: "Kosmetik für Dubai", text: "Kosmetische Produkte müssen vor Einfuhr und Verkauf im System Montaji der Stadtverwaltung von Dubai registriert sein.", sources: ["dm-montaji"] }
          ]
        },
        {
          title: "Einfuhr nach Saudi-Arabien",
          intro: "Ob Handelsrechnung und Ursprungszeugnis für Saudi-Arabien von IHK oder Botschaft beglaubigt werden müssen, lässt sich nicht eindeutig belegen. Klären Sie das mit Ihrem Importeur und Ihrer IHK.",
          items: [
            { name: "Handelsrechnung", text: "Die saudische Zollbehörde ZATCA nennt sie als Dokument, das für die Einfuhr vorzulegen ist.", sources: ["zatca-import"] },
            { name: "Konnossement (Bill of Lading)", text: "ZATCA nennt das Konnossement als Frachtdokument für die Einfuhr.", sources: ["zatca-import"] },
            { name: "Ursprungszeugnis", text: "ZATCA nennt das Ursprungszeugnis als Einfuhrdokument. Entbehrlich ist es nur, wenn das Ursprungsland auch ohne Zeugnis eindeutig feststeht.", sources: ["zatca-import"] },
            { name: "Konformitätszertifikate über SABER", text: "Die nötigen Konformitätszertifikate beantragt der Importeur im Portal SABER. Der Antrag muss vor der Zollanmeldung gestellt sein, sonst ist die Ware nicht einfuhrfähig.", sources: ["ihk-koeln-saudi", "saso-saber"] }
          ]
        }
      ]
    },

    request: {
      title: "Sendung anfragen | Trust Logistic FZCO",
      description: "Frachtanfrage auf Deutsch, in beide Richtungen: zwischen Deutschland und dem Golf, von und nach China und Indien.",
      h1: "Sendung anfragen",
      intro: "Mit diesen Angaben lässt sich ein Angebot erstellen. Ihre Anfrage geht an {{operator.name}}. Um die Transportkosten zu ermitteln, werden die Angaben Ihrer Anfrage mit Ihrer Einwilligung an Trust Logistic FZCO in Dubai übermittelt. Das Angebot erhalten Sie von {{operator.name}}.",
      requiredNote: "Felder mit * werden für ein Angebot gebraucht.",
      sections: { contact: "Kontakt", route: "Strecke", goods: "Ware", packages: "Packstücke", timing: "Termin und Hinweise" },
      labels: {
        company: "Firma", name: "Ansprechperson", email: "E-Mail", phone: "Telefon",
        fromCountry: "Abgangsland", origin: "Abgangsort der Ware (PLZ und Ort)", destCountry: "Zielland", countryOther: "Welches Land?", destCity: "Zielort (PLZ und Ort)",
        receiver: "Empfänger", mode: "Verkehrsträger", incoterm: "Lieferbedingung (Incoterms)",
        goods: "Warenbeschreibung", hsCode: "Zolltarifnummer (HS-Code), falls bekannt", value: "Warenwert", currency: "Währung",
        dangerous: "Gefahrgut", dangerousNote: "Wenn ja: UN-Nummer oder Produktart",
        packaging: "Verpackung", stackable: "Stapelbar",
        readyDate: "Ware versandbereit ab", deadline: "Liefertermin oder Messetermin, falls fest", message: "Weitere Hinweise"
      },
      options: {
        receiver: ["Unternehmen", "Privatperson"],
        mode: ["Luftfracht", "Seefracht", "Sea-Air", "Landtransport", "Bitte empfehlen"],   // keep this order: the form script relies on it
        incoterm: ["EXW", "FCA", "FOB", "CIF", "DAP", "DDP", "Noch offen"],   // the last one is preselected
        dangerous: ["Nein", "Ja", "Weiß ich nicht"],
        packaging: ["Kartons", "Paletten", "Kisten", "Sonstiges"],
        stackable: ["Ja", "Nein", "Weiß ich nicht"],
        currency: ["EUR", "USD", "AED", "SAR", "CNY", "INR"]
      },
      originHint: "Ob die Ware dort abgeholt wird, steht im Angebot.",
      goodsHint: "Zum Beispiel: Hautpflege in Tiegeln, 30 Kartons, keine Sprays.",
      consent: "Ich bin einverstanden, dass meine Angaben an Trust Logistic FZCO in Dubai (Vereinigte Arabische Emirate) übermittelt werden, damit die Transportkosten ermittelt und der Transport organisiert werden können. Mir ist bekannt, dass dort kein mit der EU vergleichbares Datenschutzniveau gewährleistet ist. Die Einwilligung kann ich jederzeit widerrufen. Details stehen in der [Datenschutzerklärung](datenschutz.html).",
      submitEndpoint: "Anfrage senden",
      submitMail: "Anfrage im E-Mail-Programm öffnen",
      mailHint: "Ihr E-Mail-Programm öffnet sich mit der fertigen Anfrage. Gesendet wird sie erst, wenn Sie dort auf Senden klicken.",
      copyButton: "Anfragetext kopieren",
      submitDemo: "Anfrage senden"
    },

    /* Strings used by the scripts (calculator and form). {name} tokens are filled by the script. */
    ui: {
      row: { n: "Anzahl", l: "Länge (cm)", b: "Breite (cm)", h: "Höhe (cm)", w: "kg je Stück", add: "Weitere Packstückart hinzufügen", remove: "Zeile entfernen", rowName: "Packstückart {i}" },
      errors: {
        missing: "Bitte ausfüllen.",
        notNumber: "Bitte eine Zahl eingeben, zum Beispiel 12,5.",
        notPositive: "Der Wert muss größer als 0 sein.",
        notInteger: "Die Anzahl muss eine ganze Zahl sein.",
        tooManyPieces: "Mehr als {max} Packstücke: Bitte fragen Sie direkt an.",
        tooLong: "Kantenlänge über {max} cm: Bitte fragen Sie direkt an.",
        tooHeavy: "Mehr als {max} kg je Packstück: Bitte fragen Sie direkt an."
      },
      calc: {
        empty: "Tragen Sie Maße und Gewicht ein. Das frachtpflichtige Gewicht erscheint dann hier.",
        incomplete: "Es fehlen noch Angaben. Bitte füllen Sie jede begonnene Zeile vollständig aus.",
        invalid: "Mindestens eine Angabe lässt sich nicht berechnen. Bitte prüfen Sie die markierten Felder.",
        chargeableKg: "Frachtpflichtiges Gewicht",
        chargeableWm: "Frachtpflichtige Menge",
        unitKg: "kg",
        unitWm: "m³ (W/M)",
        gross: "Tatsächliches Gewicht",
        volume: "Volumen",
        volumeWeight: "Volumengewicht (1 : {divisor})",
        weightAsCbm: "Gewicht als Raummaß (1.000 kg = 1 m³)",
        pieces: "Packstücke",
        basisAirVolume: "Das Volumengewicht ist höher als das tatsächliche Gewicht. Abgerechnet wird der höhere Wert, aufgerundet auf volle {step} kg.",
        basisAirWeight: "Das tatsächliche Gewicht ist höher als das Volumengewicht. Abgerechnet wird der höhere Wert, aufgerundet auf volle {step} kg.",
        basisSeaVolume: "Bei Sammelgut zählt der höhere Wert aus Volumen und Gewicht. Hier ist es das Volumen.",
        basisSeaWeight: "Bei Sammelgut zählt der höhere Wert aus Volumen und Gewicht. Hier ist es das Gewicht.",
        basisLandVolume: "Das Gewicht aus dem Volumen ist höher als das tatsächliche Gewicht. Abgerechnet wird der höhere Wert, aufgerundet auf volle {step} kg.",
        basisLandWeight: "Das tatsächliche Gewicht ist höher als das Gewicht aus dem Volumen. Abgerechnet wird der höhere Wert, aufgerundet auf volle {step} kg.",
        volumeWeightLand: "Gewicht aus Volumen (1 m³ = {kg} kg)",
        seaAirNote: "Für Sea-Air wird hier wie bei Luftfracht gerechnet. Wie im Einzelfall abgerechnet wird, steht im Angebot.",
        priceBadge: "Richtwert, kein Angebot",
        priceTitle: "Richtwert für die Fracht",
        priceBasis: "Für die gesamte Sendung: {qty} {unit} zu {min} bis {max} {currency} je {unit}, gerundet.",
        from: "von",
        to: "bis",
        marketDate: "Marktstand: {date}",
        priceSource: "Quelle",
        noRate: "Für diese Strecke und diesen Verkehrsträger gibt es noch keinen Richtwert. Der Rechner zeigt deshalb nur das frachtpflichtige Gewicht.",
        ratedLanes: "Richtwerte gibt es für Strecken zwischen Deutschland und den Emiraten, Saudi-Arabien, China oder Indien.",
        priceDisclaimer: "Nur ein Richtwert, kein Angebot. Der Preis für Ihre Sendung hängt von Strecke, Termin, Ware und Leistungsumfang ab und kann deutlich davon abweichen.",
        illustrationNote: "Die Werte sind vorläufige Beispielwerte zur Veranschaulichung und werden durch Werte aus durchgeführten Sendungen ersetzt.",
        priceBasisFlat: "Für die gesamte Sendung: Pauschale {flatMin} bis {flatMax} {currency} plus {qty} {unit} zu {min} bis {max} {currency} je {unit}, gerundet.",
        ctaText: "Den tatsächlichen Preis erhalten Sie mit dem Angebot. Fragen Sie Ihre Sendung mit diesen Angaben an.",
        driversTitle: "Was den Preis bewegt",
        handover: "Sendung anfragen"
      },
      form: {
        fromCalculator: "Die Angaben aus dem Rechner sind übernommen.",
        required: "Bitte ausfüllen.",
        emailInvalid: "Bitte eine gültige E-Mail-Adresse eingeben.",
        packagesRequired: "Bitte mindestens eine Packstückart vollständig eintragen.",
        consentRequired: "Bitte bestätigen Sie die Übermittlung an Trust.",
        fixErrors: "Bitte prüfen Sie die markierten Felder.",
        sending: "Anfrage wird gesendet …",
        sent: "Ihre Anfrage ist gesendet. Eine Eingangsbestätigung geht an Ihre E-Mail-Adresse.",
        sendFailed: "Die Anfrage konnte nicht gesendet werden. Bitte schicken Sie den Anfragetext per E-Mail.",
        mailFallback: "Anfrage im E-Mail-Programm öffnen",
        mailOpened: "Ihr E-Mail-Programm sollte sich geöffnet haben. Die Anfrage ist erst gesendet, wenn Sie dort auf Senden klicken.",
        noEmail: "Die Empfängeradresse ist noch nicht hinterlegt. Kopieren Sie den Anfragetext und senden Sie ihn auf anderem Weg.",
        copied: "Der Anfragetext ist kopiert.",
        summaryTitle: "Anfragetext",
        demo: "Demo-Version: Die Anfrage wird nicht versendet. So sieht der Text aus, der beim Empfänger ankommt."
      }
    },

    imprint: {
      title: "Impressum | Fracht mit Trust Logistic FZCO",
      h1: "Impressum",
      sections: [
        { title: "Angaben gemäß § 5 DDG", lines: ["{{operator.name}}", "{{operator.company}}", "{{operator.street}}", "{{operator.zipCity}}", "{{operator.country}}"] },
        { title: "Kontakt", lines: ["Telefon: {{operator.phone}}", "E-Mail: {{operator.email}}"] },
        { title: "Umsatzsteuer", lines: ["{{operator.vatId}}"] },
        { title: "Registereintrag", lines: ["{{operator.register}}"] },
        { title: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV", lines: ["{{operator.name}}, Anschrift wie oben"] },
        { title: "Verhältnis zu Trust Logistic FZCO", lines: ["Diese Website wird nicht von Trust Logistic FZCO betrieben. Anbieter der hier beschriebenen Leistungen und Vertragspartner der Kunden ist {{operator.name}}. Angebote und Rechnungen stellt {{operator.name}} aus. Mit der Organisation der Transporte ist Trust Logistic FZCO, {{trust.addressLine}}, {{trust.country}}, beauftragt.", "", "Der Richtwert-Rechner ermittelt das frachtpflichtige Gewicht und zeigt unverbindliche Richtwerte. Seine Ergebnisse sind keine Angebote und nicht verbindlich."] },
        { title: "Geschäftsbedingungen", lines: ["{{operator.terms}}"] },
        { title: "Name und Logo", lines: ["{{operator.logoPermission}}"] },
        { title: "Links auf andere Websites", lines: ["Diese Seite verlinkt auf Websites von Behörden und anderen Anbietern. Für deren Inhalte sind die jeweiligen Betreiber verantwortlich."] }
      ]
    },

    privacy: {
      title: "Datenschutzerklärung | Fracht mit Trust Logistic FZCO",
      h1: "Datenschutzerklärung",
      sections: [
        { title: "Verantwortlicher", paragraphs: ["{{operator.name}}, {{operator.street}}, {{operator.zipCity}}, {{operator.country}}. Telefon: {{operator.phone}}, E-Mail: {{operator.email}}"] },
        { title: "Aufruf der Website", paragraphs: ["Beim Aufruf der Seiten verarbeitet der Hosting-Anbieter technisch notwendige Daten in Server-Logdateien: IP-Adresse, Datum und Uhrzeit, abgerufene Datei, übertragene Datenmenge, Browsertyp. Das ist nötig, um die Website auszuliefern und Störungen zu beheben (Art. 6 Abs. 1 lit. f DSGVO).", "Hosting-Anbieter: {{operator.hosting}}", "Speicherdauer der Logdateien: {{operator.logRetention}}"] },
        { title: "Keine Cookies, kein Tracking, keine fremden Inhalte", paragraphs: ["Diese Website setzt keine Cookies, verwendet keine Analyse-Werkzeuge und lädt keine Schriften, Skripte oder anderen Inhalte von Drittanbietern.", "Der Richtwert-Rechner rechnet ausschließlich in Ihrem Browser. Ihre Eingaben werden dabei nicht übertragen. Wenn Sie die Angaben in das Anfrageformular übernehmen, geschieht das innerhalb Ihres Browsers."] },
        { title: "Anfrageformular und E-Mail", paragraphs: ["Wenn Sie eine Anfrage stellen, werden Ihre Angaben verarbeitet, um die Anfrage zu beantworten und ein Angebot vorzubereiten: Firma, Ansprechperson, Kontaktdaten sowie die Angaben zur Sendung. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen auf Ihre Anfrage)."], endpointOff: "Das Formular öffnet Ihr eigenes E-Mail-Programm mit dem fertigen Anfragetext. Versendet wird die Anfrage als E-Mail über Ihren E-Mail-Anbieter.", endpointOn: "Das Formular überträgt die Anfrage verschlüsselt an ein Skript auf dem Server dieser Website. Das Skript sendet sie per E-Mail an den Verantwortlichen und schickt Ihnen eine automatische Eingangsbestätigung. Es speichert die Anfrage nicht auf dem Server und protokolliert keine IP-Adressen; gegen Missbrauch zählt es lediglich die Zahl der Anfragen in einem Zeitfenster. Kann die Anfrage nicht übertragen werden, bietet das Formular den Versand über Ihr E-Mail-Programm an." },
        { title: "Weitergabe an Trust Logistic FZCO in Dubai", paragraphs: ["Damit die Transportkosten ermittelt und der Transport organisiert werden können, übermittelt der Verantwortliche die Angaben Ihrer Anfrage an Trust Logistic FZCO, {{trust.addressLine}}, {{trust.country}}. Für die Vereinigten Arabischen Emirate liegt kein Angemessenheitsbeschluss der Europäischen Kommission vor; ein mit der EU vergleichbares Datenschutzniveau ist dort nicht gewährleistet.", "Die Weitergabe erfolgt nur mit Ihrer ausdrücklichen Einwilligung im Anfrageformular (Art. 49 Abs. 1 lit. a DSGVO). Sie können die Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen; eine formlose Nachricht an die oben genannte Adresse genügt."] },
        { title: "Speicherdauer", paragraphs: ["Anfragen werden gelöscht, sobald sie erledigt sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen."] },
        { title: "Ihre Rechte", paragraphs: ["Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15 bis 21 DSGVO). Sie können sich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO).", "Zuständige Aufsichtsbehörde: {{operator.supervisoryAuthority}}"] }
      ],
      updated: "Stand: {{site.lastUpdated}}"
    }
  }
};

if (typeof module === "object" && module.exports) module.exports = SITE_CONFIG;
