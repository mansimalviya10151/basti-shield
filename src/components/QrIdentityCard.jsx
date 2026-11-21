import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, ArrowRightLeft, Printer } from 'lucide-react';

export default function QrIdentityCard({
  familyId,
  setFamilyId,
  isVerified,
  coords,
  migrationCount,
  nearestShelter,
  nearestClinic,
  onMigrate,
  lang
}) {
  const qrPayload = JSON.stringify({
    familyId,
    status: isVerified ? 'VERIFIED_SETTLEMENT' : 'UNVERIFIED_ANOMALY',
    navicCoords: `${coords[0].toFixed(5)},${coords[1].toFixed(5)}`,
    relocations: migrationCount,
    floodShelter: nearestShelter,
    healthLink: nearestClinic
  });

  const handlePrintCard = () => {
    const win = window.open('', '_blank', 'width=420,height=520');
    win.document.write(`
      <html>
        <head><title>Basti-Shield ID - ${familyId}</title></head>
        <body style="font-family:sans-serif;padding:24px;border:2px solid #0f172a;margin:20px;border-radius:12px;">
          <h2 style="margin:0 0 4px 0;color:#1d4ed8;">BASTI-SHIELD DIGITAL ADDRESS</h2>
          <p style="margin:0 0 16px 0;font-size:12px;color:#475569;">Satellite-Verified Portable Household Pass</p>
          <p><strong>Family ID:</strong> ${familyId}</p>
          <p><strong>NavIC/GNSS Pin:</strong> ${coords[0].toFixed(5)}° N, ${coords[1].toFixed(5)}° E</p>
          <p><strong>Relocations Logged:</strong> ${migrationCount}</p>
          <p><strong>Nearest Flood Shelter:</strong> ${nearestShelter}</p>
          <p><strong>Health / Anganwadi:</strong> ${nearestClinic}</p>
          <p style="margin-top:16px;font-size:11px;color:#64748b;">Scan QR on Basti-Shield portal for live telemetry verification.</p>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div style={{ background: '#f8fafc', color: '#0f172a', padding: '14px', borderRadius: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <QrCode size={14} /> {lang === 'hi' ? 'पोर्टेबल परिवार डिजिटल आईडी' : 'PORTABLE FAMILY DIGITAL ID'}
        </span>
        <span style={{ fontSize: '10px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>
          {lang === 'hi' ? 'स्थान परिवर्तन:' : 'Relocations:'} {migrationCount}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <QRCodeSVG value={qrPayload} size={92} />
        <div style={{ fontSize: '11px', flex: 1 }}>
          <input
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
            style={{
              fontWeight: 'bold',
              fontSize: '13px',
              width: '100%',
              padding: '3px 6px',
              marginBottom: '4px',
              borderRadius: '4px',
              border: '1px solid #cbd5e1'
            }}
          />
          <div style={{ color: '#334155' }}>
            <strong>{lang === 'hi' ? 'बाढ़ आश्रय:' : 'Flood Shelter:'}</strong> {nearestShelter}
          </div>
          <div style={{ color: '#334155', marginTop: '2px' }}>
            <strong>{lang === 'hi' ? 'स्वास्थ्य / आंगनवाड़ी:' : 'Health / Anganwadi:'}</strong> {nearestClinic}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
        <button
          onClick={onMigrate}
          style={{
            flex: 1,
            padding: '7px',
            borderRadius: '6px',
            border: '1px solid #2563eb',
            background: '#eff6ff',
            color: '#1d4ed8',
            fontWeight: 'bold',
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <ArrowRightLeft size={13} /> {lang === 'hi' ? 'नया स्थान अपडेट करें' : 'Re-Anchor Family ID'}
        </button>

        <button
          onClick={handlePrintCard}
          style={{
            padding: '7px 10px',
            borderRadius: '6px',
            border: '1px solid #0f172a',
            background: '#0f172a',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Printer size={13} /> {lang === 'hi' ? 'प्रिंट पास' : 'Print Pass'}
        </button>
      </div>
    </div>
  );
}