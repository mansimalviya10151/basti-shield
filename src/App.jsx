import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ThermometerSun,
  Waves,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { SCREENED_ANOMALIES } from './data/satelliteZones';
import { fetchGeoTelemetry } from './services/geoTelemetry';
import BastiMap from './components/BastiMap';
import QrIdentityCard from './components/QrIdentityCard';

export default function App() {
  const [lang, setLang] = useState('en');
  const [selectedZone, setSelectedZone] = useState(SCREENED_ANOMALIES[0]);
  const [coords, setCoords] = useState(SCREENED_ANOMALIES[0].coords);
  const [verifiedZones, setVerifiedZones] = useState({
    'SAT-ANOM-01': true,
    'SAT-ANOM-02': false,
    'SAT-ANOM-03': true
  });
  const [telemetry, setTelemetry] = useState({
    elevation: 492,
    airTemp: 34.5,
    surfaceTemp: 41.8,
    nearestShelter: 'Scanning nearby civic infrastructure...',
    nearestClinic: 'Scanning health centers...'
  });
  const [loading, setLoading] = useState(false);
  const [coolRoofActive, setCoolRoofActive] = useState(false);
  const [familyId, setFamilyId] = useState('BPL-MP-2026-8841');
  const [migrationCount, setMigrationCount] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadTelemetry() {
      setLoading(true);
      const data = await fetchGeoTelemetry(coords[0], coords[1]);
      if (active) {
        setTelemetry(data);
        setLoading(false);
      }
    }
    loadTelemetry();
    return () => {
      active = false;
    };
  }, [coords]);

  const effectiveSurfaceTemp = coolRoofActive
    ? (telemetry.surfaceTemp - 5.4).toFixed(1)
    : telemetry.surfaceTemp.toFixed(1);

  const floodRisk =
    telemetry.elevation < 500
      ? lang === 'hi'
        ? 'उच्च जोखिम (निचला क्षेत्र)'
        : 'HIGH (Low-Elevation Basin)'
      : lang === 'hi'
      ? 'मध्यम जोखिम (ऊँचा क्षेत्र)'
      : 'MODERATE (Elevated Slope)';

  const isCurrentVerified = selectedZone
    ? verifiedZones[selectedZone.id]
    : false;

  const handleSelectZone = (zone) => {
    setSelectedZone(zone);
    setCoords(zone.coords);
  };

  const handleMapClick = (newCoords) => {
    setSelectedZone(null);
    setCoords(newCoords);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#0f172a', color: '#f8fafc' }}>
      {/* LEFT TELEMETRY & DIGITAL ID SIDEBAR */}
      <div style={{ width: '430px', padding: '18px', overflowY: 'auto', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={28} color="#38bdf8" />
            <div>
              <h1 style={{ fontSize: '19px', fontWeight: 'bold' }}>
                {lang === 'hi' ? 'बस्ती-शील्ड (BASTI-SHIELD)' : 'BASTI-SHIELD'}
              </h1>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>
                {lang === 'hi'
                  ? 'सैटेलाइट जोखिम और पोर्टेबल डिजिटल पता'
                  : 'Two-Stage Satellite Risk & Portable Digital Address'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setLang((l) => (l === 'en' ? 'hi' : 'en'))}
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid #38bdf8',
              background: '#1e293b',
              color: '#38bdf8',
              fontWeight: 'bold',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            {lang === 'en' ? 'हिन्दी' : 'EN'}
          </button>
        </div>

        {/* STAGE 1: SATELLITE ANOMALY SELECTOR */}
        <div style={{ background: '#1e293b', padding: '12px', borderRadius: '10px' }}>
          <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
            {lang === 'hi'
              ? 'चरण 1: सैटेलाइट हीट और बाढ़ क्षेत्र चुनें'
              : 'STAGE 1: SATELLITE THERMAL / DEM ANOMALIES'}
          </label>
          <select
            value={selectedZone ? selectedZone.id : 'CUSTOM'}
            onChange={(e) => {
              const found = SCREENED_ANOMALIES.find((z) => z.id === e.target.value);
              if (found) handleSelectZone(found);
            }}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0f172a', color: '#f8fafc', border: '1px solid #334155', fontSize: '12px' }}
          >
            {SCREENED_ANOMALIES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
            {!selectedZone && (
              <option value="CUSTOM">
                {lang === 'hi' ? 'कस्टम मैप पिन (असत्यापित)' : 'Custom Map Pin (Unverified)'}
              </option>
            )}
          </select>

          {/* STAGE 2: GROUND VERIFICATION GATE */}
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '8px 10px', borderRadius: '6px' }}>
            <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', color: isCurrentVerified ? '#4ade80' : '#fbbf24' }}>
              {isCurrentVerified ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              {isCurrentVerified
                ? lang === 'hi'
                  ? 'चरण 2: सत्यापित आवासीय बस्ती'
                  : 'Stage 2: Verified Residential Cluster'
                : lang === 'hi'
                ? 'चरण 2: असत्यापित थर्मल क्षेत्र'
                : 'Stage 2: Unverified Thermal Anomaly'}
            </span>
            {selectedZone && (
              <button
                onClick={() =>
                  setVerifiedZones((prev) => ({
                    ...prev,
                    [selectedZone.id]: !prev[selectedZone.id]
                  }))
                }
                style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px', border: 'none', background: '#334155', color: '#fff', cursor: 'pointer' }}
              >
                {isCurrentVerified
                  ? lang === 'hi'
                    ? 'असत्यापित करें'
                    : 'Mark Unverified'
                  : lang === 'hi'
                  ? 'सत्यापित करें'
                  : 'Verify Cluster'}
              </button>
            )}
          </div>
        </div>

        {/* NAVIC / GNSS LIVE PIN */}
        <div style={{ background: '#1e293b', padding: '10px 12px', borderRadius: '10px', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
            <MapPin size={15} /> {lang === 'hi' ? 'NavIC / GNSS पिन' : 'NavIC / GNSS Anchor'}
          </span>
          <span style={{ fontFamily: 'monospace' }}>
            {coords[0].toFixed(4)}° N, {coords[1].toFixed(4)}° E
          </span>
        </div>

        {/* LIVE THERMAL & ELEVATION TELEMETRY */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ background: '#1e293b', padding: '12px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#fb923c', fontSize: '11px' }}>
              <ThermometerSun size={15} /> {lang === 'hi' ? 'टिन-छत तापमान' : 'Tin-Roof Thermal'}
            </div>
            <div style={{ fontSize: '21px', fontWeight: 'bold', marginTop: '4px' }}>
              {loading ? '...' : `${effectiveSurfaceTemp}°C`} </div> <div style={{ fontSize: '10px', color: '#94a3b8' }}> {lang === 'hi' ? 'बाहरी तापमान:' : 'Ambient Air:'} {telemetry.airTemp}°C </div> </div>  <div style={{ background: '#1e293b', padding: '12px', borderRadius: '10px' }}> <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#60a5fa', fontSize: '11px' }}> <Waves size={15} /> {lang === 'hi' ? 'DEM ऊँचाई' : 'DEM Elevation'} </div> <div style={{ fontSize: '21px', fontWeight: 'bold', marginTop: '4px' }}> {loading ? '...' : `${telemetry.elevation}m`}
            </div>
            <div style={{ fontSize: '10px', color: '#f87171' }}>{floodRisk}</div>
          </div>
        </div>

        {/* COOL-ROOF MITIGATION SIMULATOR */}
        <button
          onClick={() => setCoolRoofActive(!coolRoofActive)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px',
            background: coolRoofActive ? '#16a34a' : '#2563eb',
            color: 'white'
          }}
        >
          {coolRoofActive
            ? lang === 'hi'
              ? '✓ कूल-रूफ कोटिंग सक्रिय (-5.4°C कमी)'
              : '✓ Cool-Roof Coating Active (-5.4°C Albedo Shift)'
            : lang === 'hi'
            ? 'सोलर-रिफ्लेक्टिव कूल रूफ का परीक्षण करें'
            : 'Simulate Solar-Reflective Cool Roof Coating'}
        </button>

        {/* PORTABLE QR DIGITAL ID CARD */}
        <QrIdentityCard
          familyId={familyId}
          setFamilyId={setFamilyId}
          isVerified={isCurrentVerified}
          coords={coords}
          migrationCount={migrationCount}
          nearestShelter={telemetry.nearestShelter}
          nearestClinic={telemetry.nearestClinic}
          onMigrate={() => setMigrationCount((c) => c + 1)}
          lang={lang}
        />
      </div>

      {/* RIGHT INTERACTIVE SATELLITE MAP */}
      <div style={{ flex: 1 }}>
        <BastiMap
          anomalies={SCREENED_ANOMALIES}
          verifiedZones={verifiedZones}
          coords={coords}
          onSelectCoords={handleMapClick}
          onSelectZone={handleSelectZone}
        />
      </div>
    </div>
  );
}