echo-drishti
Geospatial intelligence platform for visualizing, analyzing, and
monitoring watershed development outcomes.

Smart India Hackathon 2026 | Team SYNC
echo-drishti is a web-based watershed monitoring and verification
prototype designed around the Smart India Hackathon problem statement
SIH26015: Application of Geospatial Techniques for visualization
and analysis to interpret Geo-Coded Images to enhance Watershed
Development Outcomes.
The platform brings together satellite-derived environmental layers,
geotagged field observations, completed watershed work sites, and
analytical reports into a single interface for faster monitoring and
verification.
What the Project Does
echo-drishti provides a GIS-oriented monitoring workspace where users
can:
- Visualize watershed areas on an interactive map
- Compare before/after NDVI imagery to observe vegetation change
- Compare NDWI imagery for water-related analysis
- Overlay land-use information
- View watershed boundaries and mapped intervention sites
- Inspect geotagged field survey/photo points
- Compare satellite observations with ground-truth observations
- Track verification status and flag potential mismatches
- View details of completed watershed structures
- Measure map distances
- Inspect elevation-profile information
- Simulate water-budget scenarios
- Generate watershed, verification, and financial reports
- Export audit/report information
- Switch between pilot and reference watershed locations
- Use a dedicated officer/public login interface in the prototype
Key Workflow
Satellite / Environmental Imagery
              │
              ▼
     Geospatial Map Layers
              │
      ┌───────┴────────┐
      ▼                ▼
 Ground-Truth       Work-Site
 Photo Points       Records
      │                │
      └───────┬────────┘
              ▼
     Verification Engine
              │
      ┌───────┴────────┐
      ▼                ▼
  Confirmed        Mismatch /
  Observation      Review Alert
      │                │
      └───────┬────────┘
              ▼
     Reports & Decisions
Main Features
1. GIS Monitoring Dashboard
The application provides a map-centric monitoring interface with:
- Interactive Leaflet map
- Watershed boundary visualization
- Site markers
- Field-photo markers
- Layer controls
- Before/after imagery controls
- Location switching
- Map details and site inspection panels
2. NDVI Change Analysis
The prototype includes NDVI imagery for the Chandur Railway pilot area
and reference locations.
The application samples imagery around mapped coordinates and calculates
a continuous NDVI value. Before/after values are compared to produce a
vegetation-change signal.
The NDVI processing includes:
- Geographic coordinate to raster-pixel mapping
- Neighborhood sampling
- Color-to-NDVI interpolation for the supplied raster layers
- Before/after comparison
- Change thresholding
- Verification status generation
3. NDWI and Land-Use Layers
The Chandur Railway pilot includes:
- NDWI before imagery
- NDWI after imagery
- Land-use imagery
These layers provide additional environmental context alongside
vegetation analysis.
4. Ground-Truth Verification
Field survey points contain:
- Geographic coordinates
- Field image
- Observation location
- Verification status
- Ground sampling metadata
- Sensor information
- Survey insight
The prototype demonstrates both matching and mismatching observations so
that the verification workflow can be shown during a demo.
5. Watershed Work-Site Tracking
Completed interventions can be mapped and inspected with:
- Structure name
- Geographic coordinates
- Completion date
- Completion photograph
- Structure description
- Location association
The current prototype contains examples including check dams, contour
trenches, farm ponds, nala bunds, percolation structures, and
afforestation-related works.
6. Verification Reports
The system can generate structured watershed reports covering:
- Catchment summary
- Structure verification
- Risk observations
- Satellite vs ground-truth correlation
- Recommended actions
7. Financial / Disbursement Reporting
The application includes a disbursement reporting interface for
watershed-program expenditure information, including:
- Sanctioned amount
- Disbursed amount
- Pending amount
- Structure/category-wise expenditure
- Panchayat-wise information
- Compliance observations
8. Analysis Utilities
Additional prototype modules include:
- Distance measurement
- Elevation profile visualization
- Water budget simulation
- NDVI legend
- Site detail panels
- Verification queue
- Audit report export
Pilot and Reference Locations
Pilot Site
Chandur Railway, Amravati, Maharashtra
The pilot location contains the primary demonstration data, including:
- NDVI before/after imagery
- NDWI before/after imagery
- Land-use layer
- Watershed boundary
- Field-photo points
- Watershed intervention sites
Reference Cases
The prototype also includes reference locations:
- Hiware Bazar
- Ralegan Siddhi
These are used to demonstrate how the same monitoring interface can be
extended to other watershed-development contexts.
Technology Stack
  Layer                   Technology
  Frontend                React 19
  Build Tool              Vite
  GIS Mapping             Leaflet
  React GIS Integration   React Leaflet
  Styling                 CSS
  Data Format             JavaScript modules + GeoJSON
  AI Reporting            Google Gemini API
  Code Quality            Oxlint
  Language                JavaScript / JSX
Core Dependencies
- react
- react-dom
- react-leaflet
- leaflet
- leaflet-rotate
- vite
- oxlint
Project Structure
SIH_26-main/
│
├── public/
│   ├── eco_drishti_logo.png
│   ├── favicon.svg
│   └── watershed_bg.jpg
│
├── src/
│   ├── assets/
│   │   ├── NDVI imagery
│   │   ├── NDWI imagery
│   │   ├── land-use imagery
│   │   ├── reference-site imagery
│   │   └── site photos
│   │
│   ├── components/
│   │   ├── Dashboard/
│   │   ├── MapView/
│   │   ├── LayerControls/
│   │   ├── SiteDetailPanel/
│   │   ├── PhotoMarker/
│   │   ├── SiteMarker/
│   │   ├── VerificationQueue/
│   │   ├── AuditReportExport/
│   │   ├── DisbursementsReports/
│   │   ├── WaterBudgetSimulator/
│   │   ├── ElevationProfile/
│   │   ├── MeasureTool/
│   │   └── ...
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── LanguageContext.jsx
│   │
│   ├── data/
│   │   ├── locations.js
│   │   ├── photoPoints.js
│   │   ├── sitePoints.js
│   │   └── watershedBoundary.geojson
│   │
│   ├── utils/
│   │   ├── geminiApi.js
│   │   ├── geoUtils.js
│   │   └── ndviCompare.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
Getting Started
Prerequisites
Install:
- Node.js
- npm
Check your installation:
node --version
npm --version
1. Clone the Repository
git clone <your-repository-url>
cd SIH_26-main
2. Install Dependencies
npm install
3. Configure Gemini API
The application can use Google's Gemini API for AI-assisted report
generation.
Create a .env file in the project root:
VITE_GEMINI_API_KEY=your_gemini_api_key
Do not commit .env or expose a real API key in the repository.
4. Start the Development Server
npm run dev
Vite will provide a local development URL, normally similar to:
http://localhost:5173
5. Build for Production
npm run build
6. Preview the Production Build
npm run preview
7. Run Linting
npm run lint
AI-Assisted Reporting
The project contains a Gemini integration in:
src/utils/geminiApi.js
The integration is used to generate structured watershed reports from
predefined domain prompts.
The application also includes deterministic fallback report generation
so the report workflow can continue when the Gemini request fails, times
out, or is unavailable.
Important: The current implementation calls the Gemini API from
the frontend. For a production government deployment, the API key
should be moved behind a secure backend service rather than being
exposed through a browser-side VITE_ environment variable.

Data and Prototype Scope
This repository is a working prototype / demonstration application.
The current data layer contains locally bundled imagery, GeoJSON,
JavaScript datasets, and sample field observations. Some image URLs are
placeholder/demo resources.
The current implementation demonstrates the end-to-end concept of:
Geospatial visualization → environmental comparison → field
verification → discrepancy detection → reporting
It should not be interpreted as a production-grade government GIS system
or as a source of authoritative field measurements.
Innovation Direction
echo-drishti is designed around the idea of connecting two evidence
sources:
Drishti
Ground-level evidence such as:
- Geotagged photographs
- Field observations
- Completed-work records
- Site verification
Srishti
Geospatial/environmental evidence such as:
- Satellite imagery
- NDVI
- NDWI
- Land-use information
- Watershed boundaries
Instead of treating these as separate datasets, the platform presents
them together to help identify whether reported watershed interventions
are consistent with observable environmental changes.
Current Prototype Limitations
The current repository still has important limitations before production
deployment:
- Most application data is bundled locally rather than retrieved from
  a production database.
- Satellite imagery is represented by supplied raster assets rather
  than a live satellite-data pipeline.
- Field observations are sample/demo records.
- Authentication is prototype-level and not a production identity
  system.
- Gemini is accessed from the frontend and should be moved server-side
  for secure deployment.
- Real government GIS, MIS, finance, and field-survey integrations are
  not included.
- Production-grade authorization, audit logging, encryption,
  monitoring, and API security would still be required.
Future Scope
The architecture can be extended toward:
- Live Sentinel-2 / other remote-sensing data ingestion
- Automated satellite-image processing
- Real field-survey mobile application integration
- Government MIS integration
- Secure officer authentication and role-based access
- Central spatial database using PostgreSQL/PostGIS
- Automated anomaly detection
- Multi-temporal vegetation and water analysis
- Drone imagery integration
- AI-assisted image and document verification
- State/district/block-level monitoring
- Automated alerts and inspection prioritization
- Production audit trails and analytics
Smart India Hackathon Context
Problem Statement: SIH26015
Theme: Agriculture, FoodTech & Rural Development
Organization: Ministry of Rural Development, Department of Land
Resources (DoLR)
Project: echo-drishti
Team: Team SYNC
The project is intended as a technology prototype demonstrating how
geospatial analysis and geo-coded field evidence can support
watershed-development monitoring and verification.
Team
Team SYNC
Built for Smart India Hackathon 2026.
License
This project is currently intended as an academic and hackathon
prototype.
Add an appropriate open-source license before publicly distributing the
repository for reuse.
