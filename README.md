# 🛡️ Basti-Shield
**Two-Stage Satellite Risk Assessment & Portable Digital Address System for Informal Settlements**

Basti-Shield bridges geospatial satellite telemetry with portable household identity so migrant families and informal settlements gain climate-risk protection and uninterrupted access to civic services.

---

### 🚀 Key Features
- **Two-Stage Risk Screening:** Combines Stage 1 satellite thermal reflectance and DEM (Digital Elevation Model) low-basin anomaly detection with Stage 2 ground verification to separate vulnerable residential clusters from industrial tin roofs.
- **Live NavIC / GNSS Anchor & Telemetry:** Fetches real-time elevation, ambient/tin-roof surface heat, and nearby high-ground flood shelters and health/Anganwadi centers via Open-Meteo and OpenStreetMap APIs (with fast offline fallback).
- **Cool-Roof Thermal Mitigation Simulator:** Models the immediate **-5.4°C** surface heat reduction achieved through solar-reflective cool-roof coatings.
- **Portable Multilingual QR Digital ID (EN / हिन्दी):** Generates a dynamic QR household pass that re-anchors to new worksite coordinates upon migration without breaking family identity, complete with one-click **Print Pass** support.

---

### 🛠️ Tech Stack
- **Frontend:** React, Vite, Lucide Icons
- **Mapping & Geospatial:** Leaflet, React-Leaflet, Esri World Imagery
- **APIs & Identity:** Open-Meteo Elevation/Weather API, Overpass (OpenStreetMap) API, `qrcode.react`

---

### 💻 Run Locally
```bash
npm install
npm run dev
