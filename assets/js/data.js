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
    "label": "Luftfracht"
   },
   {
    "id": "sea",
    "label": "Seefracht (Sammelgut)"
   },
   {
    "id": "seaair",
    "label": "Sea-Air"
   },
   {
    "id": "land",
    "label": "Landweg (Lkw)"
   }
  ],
  "countries": [
   {
    "id": "DE",
    "label": "Deutschland"
   },
   {
    "id": "AE",
    "label": "Vereinigte Arabische Emirate"
   },
   {
    "id": "SA",
    "label": "Saudi-Arabien"
   },
   {
    "id": "CN",
    "label": "China"
   },
   {
    "id": "IN",
    "label": "Indien"
   },
   {
    "id": "OTHER",
    "label": "Anderes Land"
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
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "DE-CN": {
     "flatMin": 100,
     "flatMax": 250,
     "min": 2,
     "max": 5,
     "currency": "USD",
     "per": "kg",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "IN-DE": {
     "flatMin": 100,
     "flatMax": 250,
     "min": 3.5,
     "max": 5.5,
     "currency": "USD",
     "per": "kg",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "DE-IN": {
     "flatMin": 100,
     "flatMax": 250,
     "min": 2,
     "max": 5,
     "currency": "USD",
     "per": "kg",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "DE-AE": {
     "flatMin": 100,
     "flatMax": 250,
     "min": 5,
     "max": 10,
     "currency": "USD",
     "per": "kg",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "AE-DE": {
     "flatMin": 100,
     "flatMax": 250,
     "min": 5,
     "max": 10,
     "currency": "USD",
     "per": "kg",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "DE-SA": {
     "flatMin": 100,
     "flatMax": 250,
     "min": 3,
     "max": 6,
     "currency": "USD",
     "per": "kg",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "SA-DE": {
     "flatMin": 100,
     "flatMax": 250,
     "min": 4,
     "max": 8,
     "currency": "USD",
     "per": "kg",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
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
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "DE-CN": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 100,
     "max": 200,
     "currency": "USD",
     "per": "wm",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "IN-DE": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 80,
     "max": 170,
     "currency": "USD",
     "per": "wm",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "DE-IN": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 100,
     "max": 200,
     "currency": "USD",
     "per": "wm",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "DE-AE": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 200,
     "max": 400,
     "currency": "USD",
     "per": "wm",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "AE-DE": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 200,
     "max": 300,
     "currency": "USD",
     "per": "wm",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "DE-SA": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 150,
     "max": 350,
     "currency": "USD",
     "per": "wm",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "SA-DE": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 200,
     "max": 300,
     "currency": "USD",
     "per": "wm",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
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
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "IN-DE": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 2,
     "max": 3.5,
     "currency": "USD",
     "per": "kg",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
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
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "AE-DE": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 0.8,
     "max": 1.6,
     "currency": "USD",
     "per": "kg",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "DE-SA": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 0.9,
     "max": 1.8,
     "currency": "USD",
     "per": "kg",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    },
    "SA-DE": {
     "flatMin": 150,
     "flatMax": 300,
     "min": 0.9,
     "max": 1.8,
     "currency": "USD",
     "per": "kg",
     "scope": "Fracht plus Pauschale für Abholung, Abfertigung und Dokumente. Zoll und Einfuhrabgaben sind nicht enthalten.",
     "illustration": true
    }
   }
  },
  "drivers": [
   "Tagesaktuelle Raten und Zuschläge der Fluggesellschaften und Reedereien",
   "Verfügbarer Frachtraum zum gewünschten Termin",
   "Abholort beim Absender und Zustellort beim Empfänger",
   "DAP oder DDP: Bei DDP kommen Zoll und Einfuhrabgaben hinzu",
   "Art der Ware, etwa Gefahrgut oder temperaturempfindliche Produkte",
   "Maße einzelner Packstücke, zum Beispiel Übermaß oder nicht stapelbare Ware"
  ]
 },
 "sources": {},
 "ui": {
  "row": {
   "n": "Anzahl",
   "l": "Länge (cm)",
   "b": "Breite (cm)",
   "h": "Höhe (cm)",
   "w": "kg je Stück",
   "add": "Weitere Packstückart hinzufügen",
   "remove": "Zeile entfernen",
   "rowName": "Packstückart {i}"
  },
  "errors": {
   "missing": "Bitte ausfüllen.",
   "notNumber": "Bitte eine Zahl eingeben, zum Beispiel 12,5.",
   "notPositive": "Der Wert muss größer als 0 sein.",
   "notInteger": "Die Anzahl muss eine ganze Zahl sein.",
   "tooManyPieces": "Mehr als {max} Packstücke: Bitte fragen Sie direkt an.",
   "tooLong": "Kantenlänge über {max} cm: Bitte fragen Sie direkt an.",
   "tooHeavy": "Mehr als {max} kg je Packstück: Bitte fragen Sie direkt an."
  },
  "calc": {
   "empty": "Tragen Sie Maße und Gewicht ein. Das frachtpflichtige Gewicht erscheint dann hier.",
   "incomplete": "Es fehlen noch Angaben. Bitte füllen Sie jede begonnene Zeile vollständig aus.",
   "invalid": "Mindestens eine Angabe lässt sich nicht berechnen. Bitte prüfen Sie die markierten Felder.",
   "chargeableKg": "Frachtpflichtiges Gewicht",
   "chargeableWm": "Frachtpflichtige Menge",
   "barLabel": "Frachtpflichtig",
   "barButton": "Zum Ergebnis",
   "unitKg": "kg",
   "unitWm": "m³ (W/M)",
   "gross": "Tatsächliches Gewicht",
   "volume": "Volumen",
   "volumeWeight": "Volumengewicht (1 : {divisor})",
   "weightAsCbm": "Gewicht als Raummaß (1.000 kg = 1 m³)",
   "pieces": "Packstücke",
   "basisAirVolume": "Das Volumengewicht ist höher als das tatsächliche Gewicht. Abgerechnet wird der höhere Wert, aufgerundet auf volle {step} kg.",
   "basisAirWeight": "Das tatsächliche Gewicht ist höher als das Volumengewicht. Abgerechnet wird der höhere Wert, aufgerundet auf volle {step} kg.",
   "basisSeaVolume": "Bei Sammelgut zählt der höhere Wert aus Volumen und Gewicht. Hier ist es das Volumen.",
   "basisSeaWeight": "Bei Sammelgut zählt der höhere Wert aus Volumen und Gewicht. Hier ist es das Gewicht.",
   "basisLandVolume": "Das Gewicht aus dem Volumen ist höher als das tatsächliche Gewicht. Abgerechnet wird der höhere Wert, aufgerundet auf volle {step} kg.",
   "basisLandWeight": "Das tatsächliche Gewicht ist höher als das Gewicht aus dem Volumen. Abgerechnet wird der höhere Wert, aufgerundet auf volle {step} kg.",
   "volumeWeightLand": "Gewicht aus Volumen (1 m³ = {kg} kg)",
   "seaAirNote": "Für Sea-Air wird hier wie bei Luftfracht gerechnet. Wie im Einzelfall abgerechnet wird, steht im Angebot.",
   "priceBadge": "Richtwert, kein Angebot",
   "priceTitle": "Richtwert für die Fracht",
   "priceBasis": "Für die gesamte Sendung: {qty} {unit} zu {min} bis {max} {currency} je {unit}, gerundet.",
   "from": "von",
   "to": "bis",
   "marketDate": "Marktstand: {date}",
   "priceSource": "Quelle",
   "noRate": "Für diese Strecke und diesen Verkehrsträger gibt es noch keinen Richtwert. Der Rechner zeigt deshalb nur das frachtpflichtige Gewicht.",
   "ratedLanes": "Richtwerte gibt es für Strecken zwischen Deutschland und den Emiraten, Saudi-Arabien, China oder Indien.",
   "priceDisclaimer": "Nur ein Richtwert, kein Angebot. Der Preis für Ihre Sendung hängt von Strecke, Termin, Ware und Leistungsumfang ab und kann deutlich davon abweichen.",
   "illustrationNote": "Die Werte sind vorläufige Beispielwerte zur Veranschaulichung und werden durch Werte aus durchgeführten Sendungen ersetzt.",
   "priceBasisFlat": "Für die gesamte Sendung: Pauschale {flatMin} bis {flatMax} {currency} plus {qty} {unit} zu {min} bis {max} {currency} je {unit}, gerundet.",
   "ctaText": "Den tatsächlichen Preis erhalten Sie mit dem Angebot. Fragen Sie Ihre Sendung mit diesen Angaben an.",
   "driversTitle": "Was den Preis bewegt",
   "handover": "Sendung anfragen"
  },
  "form": {
   "fromCalculator": "Die Angaben aus dem Rechner sind übernommen.",
   "required": "Bitte ausfüllen.",
   "emailInvalid": "Bitte eine gültige E-Mail-Adresse eingeben.",
   "packagesRequired": "Bitte mindestens eine Packstückart vollständig eintragen.",
   "consentRequired": "Bitte bestätigen Sie die Übermittlung an Trust.",
   "fixErrors": "Bitte prüfen Sie die markierten Felder.",
   "sending": "Anfrage wird gesendet …",
   "sent": "Ihre Anfrage ist gesendet. Eine Eingangsbestätigung geht an Ihre E-Mail-Adresse.",
   "sendFailed": "Die Anfrage konnte nicht gesendet werden. Bitte schicken Sie den Anfragetext per E-Mail.",
   "mailFallback": "Anfrage im E-Mail-Programm öffnen",
   "mailOpened": "Ihr E-Mail-Programm sollte sich geöffnet haben. Die Anfrage ist erst gesendet, wenn Sie dort auf Senden klicken.",
   "noEmail": "Die Empfängeradresse ist noch nicht hinterlegt. Kopieren Sie den Anfragetext und senden Sie ihn auf anderem Weg.",
   "copied": "Der Anfragetext ist kopiert.",
   "summaryTitle": "Anfragetext",
   "demo": "Demo-Version: Die Anfrage wird nicht versendet. So sieht der Text aus, der beim Empfänger ankommt."
  },
  "summary": {
   "each": "je",
   "total": "Summe",
   "pieces": "Packstücke",
   "air": "Frachtpflichtiges Gewicht Luftfracht (1 : {divisor})",
   "sea": "Frachtpflichtige Menge Seefracht (W/M)",
   "land": "Frachtpflichtiges Gewicht Landweg (1 m³ = {kg} kg)",
   "consent": "Übermittlung an {trust} in Dubai: eingewilligt"
  }
 },
 "form": {
  "endpoint": "",
  "email": "",
  "subject": "Frachtanfrage über die Website"
 },
 "request": {
  "labels": {
   "company": "Firma",
   "name": "Ansprechperson",
   "email": "E-Mail",
   "phone": "Telefon",
   "fromCountry": "Abgangsland",
   "origin": "Abgangsort der Ware (PLZ und Ort)",
   "destCountry": "Zielland",
   "countryOther": "Welches Land?",
   "destCity": "Zielort (PLZ und Ort)",
   "receiver": "Empfänger",
   "mode": "Verkehrsträger",
   "incoterm": "Lieferbedingung (Incoterms)",
   "goods": "Warenbeschreibung",
   "hsCode": "Zolltarifnummer (HS-Code), falls bekannt",
   "value": "Warenwert",
   "currency": "Währung",
   "dangerous": "Gefahrgut",
   "dangerousNote": "Wenn ja: UN-Nummer oder Produktart",
   "packaging": "Verpackung",
   "stackable": "Stapelbar",
   "readyDate": "Ware versandbereit ab",
   "deadline": "Liefertermin oder Messetermin, falls fest",
   "message": "Weitere Hinweise"
  },
  "sections": {
   "contact": "Kontakt",
   "route": "Strecke",
   "goods": "Ware",
   "packages": "Packstücke",
   "timing": "Termin und Hinweise"
  }
 },
 "trustName": "Trust Logistic FZCO",
 "locale": "de-DE",
 "whatsapp": {
  "number": "4915129586227",
  "glyph": "<svg class=\"wa-glyph\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z\"/></svg>",
  "button": "Per WhatsApp fragen",
  "note": "Die Angaben aus dem Rechner stehen schon in der Nachricht.",
  "message": "Guten Tag, ich möchte eine Sendung anfragen: {mode}, {from} → {to}, {pieces} Packstücke, {gross} kg, {cbm} m³, frachtpflichtig {charge}."
 }
};
window.SITE_DATA.demo = true;
window.SITE_DATA.form.endpoint = "";
window.SITE_DATA.form.email = "";
