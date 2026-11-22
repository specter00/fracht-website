window.SITE_DATA = {
 "calculator": {
  "marketDate": "",
  "display": {
   "sources": false,
   "marketDate": false
  },
  "rules": {
   "air": {
    "divisor": 6000,
    "roundUpKg": 0.5,
    "sources": [
     "iata-tact-asean"
    ]
   },
   "sea": {
    "kgPerCbm": 1000,
    "sources": [
     "wm-cogoport"
    ]
   },
   "land": {
    "kgPerCbm": 333,
    "roundUpKg": 1,
    "sources": [
     "incodocs-ltl"
    ]
   }
  },
  "limits": {
   "maxPieces": 9999,
   "maxEdgeCm": 1200,
   "maxWeightPerPieceKg": 30000,
   "maxRows": 12
  },
  "modes": [
   {
    "id": "air",
    "label": "Air freight"
   },
   {
    "id": "sea",
    "label": "Sea freight (LCL)"
   },
   {
    "id": "seaair",
    "label": "Sea-Air"
   },
   {
    "id": "land",
    "label": "Road (truck)"
   }
  ],
  "countries": [
   {
    "id": "DE",
    "label": "Germany"
   },
   {
    "id": "AE",
    "label": "United Arab Emirates"
   },
   {
    "id": "SA",
    "label": "Saudi Arabia"
   },
   {
    "id": "CN",
    "label": "China"
   },
   {
    "id": "IN",
    "label": "India"
   },
   {
    "id": "OTHER",
    "label": "Other country"
   }
  ],
  "defaultFrom": "DE",
  "defaultTo": "AE",
  "rates": {
   "air": {
    "CN-DE": {
     "flatMin": 100,
     "flatMax": 250,
     "min": 4.4,
     "max": 5.3,
     "currency": "USD",
     "per": "kg",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "DE-CN": {
     "flatMin": 100,
     "flatMax": 250,
     "min": 2,
     "max": 5,
     "currency": "USD",
     "per": "kg",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "IN-DE": {
     "flatMin": 100,
     "flatMax": 250,
     "min": 3.5,
     "max": 5.5,
     "currency": "USD",
     "per": "kg",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "DE-IN": {
     "flatMin": 100,
     "flatMax": 250,
     "min": 2,
     "max": 5,
     "currency": "USD",
     "per": "kg",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "DE-AE": {
     "flatMin": 100,
     "flatMax": 250,
     "min": 5,
     "max": 10,
     "currency": "USD",
     "per": "kg",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "AE-DE": {
     "flatMin": 100,
     "flatMax": 250,
     "min": 5,
     "max": 10,
     "currency": "USD",
     "per": "kg",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "DE-SA": {
     "flatMin": 100,
     "flatMax": 250,
     "min": 3,
     "max": 6,
     "currency": "USD",
     "per": "kg",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "SA-DE": {
     "flatMin": 100,
     "flatMax": 250,
     "min": 4,
     "max": 8,
     "currency": "USD",
     "per": "kg",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    }
   },
   "sea": {
    "CN-DE": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 100,
     "max": 230,
     "currency": "USD",
     "per": "wm",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "DE-CN": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 100,
     "max": 200,
     "currency": "USD",
     "per": "wm",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "IN-DE": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 80,
     "max": 170,
     "currency": "USD",
     "per": "wm",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "DE-IN": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 100,
     "max": 200,
     "currency": "USD",
     "per": "wm",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "DE-AE": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 200,
     "max": 400,
     "currency": "USD",
     "per": "wm",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "AE-DE": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 200,
     "max": 300,
     "currency": "USD",
     "per": "wm",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "DE-SA": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 150,
     "max": 350,
     "currency": "USD",
     "per": "wm",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "SA-DE": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 200,
     "max": 300,
     "currency": "USD",
     "per": "wm",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    }
   },
   "seaair": {
    "CN-DE": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 2.5,
     "max": 3.5,
     "currency": "USD",
     "per": "kg",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "IN-DE": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 2,
     "max": 3.5,
     "currency": "USD",
     "per": "kg",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    }
   },
   "land": {
    "DE-AE": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 0.8,
     "max": 1.6,
     "currency": "USD",
     "per": "kg",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "AE-DE": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 0.8,
     "max": 1.6,
     "currency": "USD",
     "per": "kg",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "DE-SA": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 0.9,
     "max": 1.8,
     "currency": "USD",
     "per": "kg",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    },
    "SA-DE": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 0.9,
     "max": 1.8,
     "currency": "USD",
     "per": "kg",
     "scope": "Freight plus a flat amount for pickup, handling and documents. Customs duties and import taxes are not included.",
     "illustration": true
    }
   }
  },
  "drivers": [
   "Current rates and surcharges of airlines and shipping lines",
   "Available cargo space on the requested date",
   "Pickup location at the sender and delivery location at the recipient",
   "DAP or DDP: with DDP, customs duties and import taxes are added",
   "Type of goods, such as dangerous goods or temperature-sensitive products",
   "Dimensions of single packages, for example oversized or non-stackable goods"
  ]
 },
 "sources": {},
 "ui": {
  "row": {
   "n": "Quantity",
   "l": "Length (cm)",
   "b": "Width (cm)",
   "h": "Height (cm)",
   "w": "kg per piece",
   "add": "Add another type of package",
   "remove": "Remove row",
   "rowName": "Package type {i}"
  },
  "errors": {
   "missing": "Please fill in.",
   "notNumber": "Please enter a number, for example 12.5.",
   "notPositive": "The value must be greater than 0.",
   "notInteger": "The quantity must be a whole number.",
   "tooManyPieces": "More than {max} packages: please request directly.",
   "tooLong": "Edge length over {max} cm: please request directly.",
   "tooHeavy": "More than {max} kg per package: please request directly."
  },
  "calc": {
   "empty": "Enter dimensions and weight. The chargeable weight will then appear here.",
   "incomplete": "Some details are still missing. Please complete every row you have started.",
   "invalid": "At least one entry cannot be calculated. Please check the marked fields.",
   "chargeableKg": "Chargeable weight",
   "barLabel": "Chargeable",
   "barButton": "See result",
   "chargeableWm": "Chargeable quantity",
   "unitKg": "kg",
   "unitWm": "m³ (W/M)",
   "gross": "Actual weight",
   "volume": "Volume",
   "volumeWeight": "Volumetric weight (1 : {divisor})",
   "weightAsCbm": "Weight as volume (1,000 kg = 1 m³)",
   "pieces": "Packages",
   "basisAirVolume": "The volumetric weight is higher than the actual weight. The higher value is charged, rounded up to the next {step} kg.",
   "basisAirWeight": "The actual weight is higher than the volumetric weight. The higher value is charged, rounded up to the next {step} kg.",
   "basisSeaVolume": "For groupage, the higher of volume and weight counts. Here it is the volume.",
   "basisSeaWeight": "For groupage, the higher of volume and weight counts. Here it is the weight.",
   "basisLandVolume": "The weight from the volume is higher than the actual weight. The higher value is charged, rounded up to the next {step} kg.",
   "basisLandWeight": "The actual weight is higher than the weight from the volume. The higher value is charged, rounded up to the next {step} kg.",
   "volumeWeightLand": "Weight from volume (1 m³ = {kg} kg)",
   "seaAirNote": "Sea-Air is calculated here like air freight. How it is charged in the individual case is stated in the offer.",
   "priceBadge": "Estimate, not an offer",
   "priceTitle": "Freight estimate",
   "priceBasis": "For the whole shipment: {qty} {unit} at {min} to {max} {currency} per {unit}, rounded.",
   "from": "from",
   "to": "to",
   "marketDate": "Market data: {date}",
   "priceSource": "Source",
   "noRate": "There is no estimate yet for this route and mode of transport. The rate estimator therefore only shows the chargeable weight.",
   "ratedLanes": "Estimates are available for routes between Germany and the Emirates, Saudi Arabia, China or India.",
   "priceDisclaimer": "Only an estimate, not an offer. The price for your shipment depends on route, date, goods and scope of services and may differ considerably.",
   "illustrationNote": "The figures are provisional example values for illustration and will be replaced by values from completed shipments.",
   "priceBasisFlat": "For the whole shipment: flat amount {flatMin} to {flatMax} {currency} plus {qty} {unit} at {min} to {max} {currency} per {unit}, rounded.",
   "ctaText": "You receive the actual price with the offer. Request your shipment with these details.",
   "driversTitle": "What moves the price",
   "handover": "Request a shipment"
  },
  "form": {
   "fromCalculator": "The details from the rate estimator have been carried over.",
   "required": "Please fill in.",
   "emailInvalid": "Please enter a valid e-mail address.",
   "packagesRequired": "Please complete at least one type of package.",
   "consentRequired": "Please confirm the transfer to Trust.",
   "fixErrors": "Please check the marked fields.",
   "sending": "Sending request …",
   "sent": "Your request has been sent. A confirmation goes to your e-mail address.",
   "sendFailed": "The request could not be sent. Please send the request text by e-mail.",
   "mailFallback": "Open request in e-mail program",
   "mailOpened": "Your e-mail program should have opened. The request is only sent when you click Send there.",
   "noEmail": "The recipient address has not been set up yet. Copy the request text and send it another way.",
   "copied": "The request text has been copied.",
   "summaryTitle": "Request text",
   "demo": "Demo version: the request is not sent. This is the text the recipient would receive."
  },
  "summary": {
   "each": "each",
   "total": "Total",
   "pieces": "packages",
   "air": "Chargeable weight, air freight (1 : {divisor})",
   "sea": "Chargeable quantity, sea freight (W/M)",
   "land": "Chargeable weight, road (1 m³ = {kg} kg)",
   "consent": "Transfer to {trust} in Dubai: consent given"
  }
 },
 "form": {
  "endpoint": "",
  "email": "",
  "subject": "Freight request via the website"
 },
 "request": {
  "labels": {
   "company": "Company",
   "name": "Contact person",
   "email": "E-mail",
   "phone": "Phone",
   "fromCountry": "Country of departure",
   "origin": "Pickup location (postcode and city)",
   "destCountry": "Destination country",
   "countryOther": "Which country?",
   "destCity": "Destination (postcode and city)",
   "receiver": "Recipient",
   "mode": "Mode of transport",
   "incoterm": "Delivery terms (Incoterms)",
   "goods": "Description of goods",
   "hsCode": "Tariff number (HS code), if known",
   "value": "Value of goods",
   "currency": "Currency",
   "dangerous": "Dangerous goods",
   "dangerousNote": "If yes: UN number or type of product",
   "packaging": "Packaging",
   "stackable": "Stackable",
   "readyDate": "Goods ready from",
   "deadline": "Delivery date or trade fair date, if fixed",
   "message": "Further notes"
  },
  "sections": {
   "contact": "Contact",
   "route": "Route",
   "goods": "Goods",
   "packages": "Packages",
   "timing": "Dates and notes"
  }
 },
 "trustName": "Trust Logistic FZCO",
 "locale": "en-GB",
 "whatsapp": {
  "number": "4912345678",
  "glyph": "<svg class=\"wa-glyph\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z\"/></svg>",
  "button": "Ask on WhatsApp",
  "note": "Your details from the rate estimator are already in the message.",
  "message": "Hello, I would like to request a shipment: {mode}, {from} → {to}, {pieces} packages, {gross} kg, {cbm} m³, chargeable {charge}."
 }
};
window.SITE_DATA.demo = true;
window.SITE_DATA.form.endpoint = "";
window.SITE_DATA.form.email = "";
