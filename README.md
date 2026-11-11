# DriveBack Marketing Intelligence

DriveBack is a browser-based marketing and customer-retention dashboard for automotive dealerships. It analyzes historical purchase patterns to identify customers who may be approaching their next vehicle-replacement cycle and helps dealership teams decide whom to contact, when to follow up, and which vehicle to recommend.

## Features

- Marketing dashboard with customer, repeat-purchase, follow-up, and estimated-opportunity metrics
- Customer history with search and status filters
- Smart-lead prioritization based on purchase frequency and replacement cycles
- Recommended communication actions such as a phone call, email, gift, or home visit
- Vehicle matching based on category, price range, and previous purchases
- Local vehicle-content catalog for customer conversations
- Playable 30-second dealership campaign storyboard
- Local customer creation and browser-based persistence

## How it works

DriveBack calculates buying-cycle and lead scores from the included transaction history. These recommendations are produced by deterministic rules in the browser; the project does not send data to an external AI service or third-party API.

The dashboard is intended as a demonstration of marketing analytics and customer-retention workflows. Opportunity values and lead scores are estimates, not financial forecasts.

## Run locally

No installation, account, server, or internet connection is required.

1. Download or clone the repository.
2. Open `index.html` in a modern web browser.

New customer records entered through the interface are stored only in that browser's `localStorage`.

## Dataset

The project includes the CC0-licensed **Auto Dealership Transactions v4** sample dataset from DatabaseSample.com. The unchanged source file is stored at `data/auto-showroom-source.json` and contains 1,080 rows across six related tables.

The transformation script converts the source into the browser-ready `data/dataset.js` file:

```powershell
node .\scripts\transform-dataset.js
```

The application currently uses 129 sample customers with completed transactions, 100 locally adapted vehicle models, and 362 purchase-history records. The names and contact details displayed by the demo are sample data and must not be treated as real customer information.

## Project structure

```text
.
|-- index.html                         # Application interface
|-- styles.css                         # Layout and visual design
|-- app.js                             # Dashboard logic and interactions
|-- data/
|   |-- auto-showroom-source.json      # Original CC0 sample dataset
|   `-- dataset.js                     # Browser-ready transformed data
`-- scripts/
    `-- transform-dataset.js           # Deterministic data transformation
```

## Privacy and security

- The application runs entirely in the browser.
- It does not contain API keys, passwords, or external-service credentials.
- It does not upload customer records to a server.
- Clearing the browser's site data removes customer records added through the interface.

Do not replace the sample dataset with real customer information in a public repository.

## Technology

Built with HTML, CSS, and vanilla JavaScript. Node.js is needed only when regenerating the transformed dataset.
