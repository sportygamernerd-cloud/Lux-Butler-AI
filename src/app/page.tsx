'use client';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function LandingPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    airbnb_link: '',
    wifi_ssid: '',
    wifi_password: '',
    instructions_entree: '',
    secrets_maison: ''
  });
  
  // Airbnb Import State
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importedData, setImportedData] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch('/api/properties').then(res => res.json()).then(setProperties);
  }, []);

  const handleImport = async () => {
    if (!importUrl) return;
    setIsImporting(true);
    setImportedData(null);
    setProgress(10);
    
    // Simulate steps for psychological effect
    const interval = setInterval(() => {
        setProgress(prev => {
            if (prev < 80) return prev + 10;
            return prev;
        });
    }, 500);

    try {
        const res = await fetch('/api/import-airbnb', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: importUrl })
        });
        clearInterval(interval);
        const data = await res.json();
        
        if (data.error) {
            alert(data.error);
            setProgress(0);
        } else {
            setProgress(100);
            setImportedData(data);
            // Autofill form
            setFormData({
                name: data.property_name,
                airbnb_link: importUrl,
                wifi_ssid: data.wifi_ssid !== "Not specified" ? data.wifi_ssid : '',
                wifi_password: data.wifi_password !== "Not specified" ? data.wifi_password : '',
                instructions_entree: data.instructions_entree,
                secrets_maison: data.secrets_maison
            });
        }
    } catch(e) {
        clearInterval(interval);
        alert("Import failed");
        setProgress(0);
    }
    setIsImporting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const newProp = await res.json();
    setProperties([...properties, newProp]);
    // Reset
    setFormData({ name: '', airbnb_link: '', wifi_ssid: '', wifi_password: '', instructions_entree: '', secrets_maison: '' });
    setImportedData(null);
    setImportUrl('');
    setProgress(0);
  };

  const generateQR = async (id: string) => {
    const url = `${window.location.origin}/${id}/chat`;
    const qr = await QRCode.toDataURL(url, { 
      color: { dark: '#0A0A0A', light: '#D7BE82' },
      width: 400,
      margin: 2
    });
    const win = window.open("");
    win?.document.write(`
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600&display=swap');
        body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background: #0A0A0A; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center; }
        .card { background: #161616; padding: 60px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.5); max-width: 500px; }
        h1 { color: #D7BE82; letter-spacing: -0.02em; margin-bottom: 10px; font-weight: 600; }
        .qr-box { background: #fff; padding: 20px; border-radius: 16px; margin: 40px auto; display: inline-block; }
        .btn-link { color: #D7BE82; text-decoration: none; border: 1px solid rgba(215, 190, 130, 0.3); padding: 10px 20px; border-radius: 100px; font-size: 0.9rem; transition: all 0.3s; display: inline-block; margin-top: 20px; }
      </style>
      <div class="card">
        <h1>LUX BUTLER</h1>
        <p style="color: #A1A1AA;">COMPLIMENTARY CONCIERGE ACCESS</p>
        <div class="qr-box"><img src="${qr}" width="300" /></div>
        <p style="color: #EAEAEA; font-size: 1.1rem;">Scan to connect instantly</p>
        <a href="${url}" target="_blank" class="btn-link">Open Chat Directly</a>
      </div>
    `);
  };

  if (!showDashboard) {
    return (
      <main className="min-h-screen">
        <nav className="lux-nav">
          <div className="container flex" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div style={{fontSize: '1.25rem', fontWeight:'600', letterSpacing: '-0.02em', color: '#fff'}}>
              Lux<span className="lux-text-gold">Butler</span>
            </div>
            <button className="lux-button secondary icon-btn" onClick={() => setShowDashboard(true)} style={{borderRadius: '100px', fontSize: '0.8rem'}}>
              Owner Login
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container" style={{padding: '120px 20px', textAlign:'center'}}>
          <div style={{display: 'inline-block', padding: '6px 16px', background: 'rgba(215, 190, 130, 0.1)', borderRadius: '100px', color: '#D7BE82', fontSize: '0.85rem', marginBottom: '24px', fontWeight: '500'}}>
             ✨ The Future of Hospitality
          </div>
          <h1 style={{fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1.1, marginBottom: '24px'}}>
            Concierge AI <br/><span className="lux-text-gold">Reimagined.</span>
          </h1>
          <p style={{fontSize: '1.2rem', color: 'var(--color-text-muted)', maxWidth: '580px', margin: '0 auto 48px', fontWeight: 400}}>
            Elevate your guest experience with an AI butler that feels human, looks premium, and works 24/7.
          </p>
          <div style={{display: 'flex', gap: '16px', justifyContent: 'center'}}>
            <button className="lux-button" onClick={() => setShowDashboard(true)}>Start Free Trial</button>
            <button className="lux-button secondary">View Live Demo</button>
          </div>
        </section>

        {/* Bento Box Grid */}
        <section className="container" style={{paddingBottom: '120px'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px'}}>
            <div className="bento-card" style={{gridColumn: 'span 2'}}>
              <h3 style={{fontSize: '1.5rem', marginBottom: '12px'}}>24/7 Intelligence</h3>
              <p style={{color: 'var(--color-text-muted)'}}>Instantly answers questions about WiFi, amenities, and local recommendations without you lifting a finger.</p>
            </div>
            <div className="bento-card">
              <h3 style={{fontSize: '1.25rem', marginBottom: '12px'}}>Zero-Download</h3>
              <p style={{color: 'var(--color-text-muted)'}}>Guests scan a QR code. No apps, no registrations. Just instant luxury service.</p>
            </div>
            <div className="bento-card">
              <h3 style={{fontSize: '1.25rem', marginBottom: '12px'}}>Polyglot Core</h3>
              <p style={{color: 'var(--color-text-muted)'}}>Native-level fluency in 50+ languages. Make every guest feel at home.</p>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section style={{borderTop: '1px solid var(--color-border)', padding: '100px 0'}}>
           <div className="container" style={{textAlign: 'center'}}>
              <p style={{color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '40px', letterSpacing: '0.1em', textTransform: 'uppercase'}}>Trusted by Top-Tier Hosts</p>
              <div style={{display: 'flex', gap: '40px', justifyContent: 'center', opacity: 0.5, flexWrap: 'wrap'}}>
                {/* Simulated Logos */}
                <span style={{fontSize: '1.5rem', fontWeight: 700}}>AIRBNB<span style={{fontWeight:300}}>LUXE</span></span>
                <span style={{fontSize: '1.5rem', fontWeight: 700}}>VILLA<span style={{fontWeight:300}}>PRO</span></span>
                <span style={{fontSize: '1.5rem', fontWeight: 700}}>ELITE<span style={{fontWeight:300}}>STAYS</span></span>
              </div>
           </div>
        </section>
      </main>
    );
  }

  // Dashboard styles
  return (
    <main className="min-h-screen">
      <nav className="lux-nav">
        <div className="container flex" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{fontSize: '1.1rem', fontWeight:'600'}}>
             Lux<span className="lux-text-gold">Butler</span> <span style={{opacity:0.4, fontWeight:400, marginLeft:'8px'}}>Console</span>
          </div>
          <button onClick={() => setShowDashboard(false)} style={{color: 'var(--color-text-muted)', background:'transparent', border:'none', cursor:'pointer', fontSize:'0.9rem', fontWeight:500}}>Logout</button>
        </div>
      </nav>

      <div className="container" style={{marginTop: '40px', paddingBottom:'60px'}}>
        {/* If no properties, show HERO onboarding */}
        {properties.length === 0 && !importedData && (
            <div style={{textAlign: 'center', margin: '40px auto 100px', maxWidth: '700px'}}>
                <h1 style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, marginBottom: '40px'}}>
                  Your AI Butler is <br/><span className="lux-text-gold">One Click Away.</span>
                </h1>
                
                <div className="bento-card" style={{padding: '40px', textAlign: 'left', position: 'relative', overflow:'hidden'}}>
                    
                    {/* Progress Bar Overlay */}
                    {(isImporting || progress > 0) && (
                        <div style={{
                            position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(10px)', 
                            zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }}>
                             <div style={{width: '60%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px'}}>
                                 <div style={{width: `${progress}%`, height: '100%', background: 'var(--color-gold)', transition: 'width 0.5s ease'}}></div>
                             </div>
                             <h3 style={{color: '#fff', fontSize: '1.2rem', marginBottom: '5px'}}>
                                {progress < 30 && "Scanning listing..."}
                                {progress >= 30 && progress < 70 && "Analysing house rules..."}
                                {progress >= 70 && progress < 100 && "Training AI Model..."}
                                {progress === 100 && "Concierge Ready!"}
                             </h3>
                             <p style={{color: 'var(--color-text-muted)'}}>{progress}% completed</p>
                        </div>
                    )}

                    <label style={{display: 'block', fontSize: '0.85rem', marginBottom: '12px', color: 'var(--color-text-muted)', letterSpacing:'0.05em', textTransform:'uppercase'}}>Paste your Airbnb / Booking.com Link</label>
                    <div style={{display: 'flex', gap: '15px', flexDirection: 'column'}}>
                        <input 
                            className="lux-input" 
                            style={{
                                fontSize: '1.1rem', padding: '20px', marginBottom: 0, 
                                background: '#0f0f0f', border: '1px solid #333'
                            }}
                            placeholder="https://airbnb.com/rooms/..." 
                            value={importUrl} 
                            onChange={e => setImportUrl(e.target.value)} 
                        />
                        <button 
                            className="lux-button" 
                            style={{
                                width: '100%', padding: '20px', fontSize: '1rem', 
                                background: importUrl ? 'var(--color-gold)' : '#222', 
                                color: importUrl ? '#000' : '#555',
                                cursor: importUrl ? 'pointer' : 'not-allowed',
                                transform: importUrl ? 'scale(1)' : 'scale(1)'
                            }}
                            onClick={handleImport}
                            disabled={!importUrl}
                        >
                            Build My AI Concierge
                        </button>
                    </div>
                </div>
                <p style={{marginTop: '20px', color: '#555', fontSize: '0.9rem'}}>Used by 500+ Superhosts worldwide</p>
            </div>
        )}

        {/* If properties exist OR we are in editing mode after import */}
        {(properties.length > 0 || importedData) && (
            <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '30px'}}>
                <style jsx>{`
                   @media (min-width: 900px) {
                     div[style*="grid"] { grid-template-columns: 400px 1fr !important; }
                   }
                `}</style>
              
              {/* Add/Edit Property Form */}
              <div className="bento-card" style={{position:'relative'}}>
                  
                {importedData && (
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', padding: '15px', 
                        borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                        <span style={{fontSize: '1.2rem'}}>🎉</span>
                        <div style={{color: '#fff', fontSize: '0.9rem'}}>
                            <strong>AI Ready (90%)</strong><br/>
                            We found {importedData.house_rules?.length} rules and WiFi details.
                        </div>
                    </div>
                )}

                <h2 style={{fontSize: '1.1rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                   <span style={{color: 'var(--color-gold)'}}>{importedData ? '✦' : '+'}</span> 
                   {importedData ? 'Review AI Knowledge Base' : 'New Property'}
                </h2>

                <form onSubmit={handleSubmit}>
                  <div style={{marginBottom: '16px'}}>
                    <label style={{display: 'block', fontSize: '0.75rem', marginBottom: '8px', color: 'var(--color-text-muted)', letterSpacing:'0.05em', textTransform:'uppercase'}}>Property Name</label>
                    <input className="lux-input" placeholder="e.g. The Penthouse" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  
                  <div style={{marginBottom: '16px'}}>
                    <label style={{display: 'block', fontSize: '0.75rem', marginBottom: '8px', color: 'var(--color-text-muted)', letterSpacing:'0.05em', textTransform:'uppercase'}}>WiFi Configuration</label>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                      <input className="lux-input" placeholder="SSID" value={formData.wifi_ssid} onChange={e => setFormData({...formData, wifi_ssid: e.target.value})} />
                      <input className="lux-input" placeholder="Password" value={formData.wifi_password} onChange={e => setFormData({...formData, wifi_password: e.target.value})} />
                    </div>
                  </div>

                  <div style={{marginBottom: '16px'}}>
                    <label style={{display: 'block', fontSize: '0.75rem', marginBottom: '8px', color: 'var(--color-text-muted)', letterSpacing:'0.05em', textTransform:'uppercase'}}>Access Details</label>
                    <textarea className="lux-textarea" rows={2} placeholder="Keybox code..." value={formData.instructions_entree} onChange={e => setFormData({...formData, instructions_entree: e.target.value})} />
                  </div>

                  <div style={{marginBottom: '24px'}}>
                    <label style={{display: 'block', fontSize: '0.75rem', marginBottom: '8px', color: 'var(--color-text-muted)', letterSpacing:'0.05em', textTransform:'uppercase'}}>House Guide</label>
                    <textarea className="lux-textarea" rows={6} placeholder="Pool heating, rules..." value={formData.secrets_maison} onChange={e => setFormData({...formData, secrets_maison: e.target.value})} />
                  </div>

                  <button type="submit" className="lux-button" style={{width: '100%', borderRadius: '8px'}}>
                      {importedData ? 'Activate Concierge' : 'Create Property'}
                  </button>
                </form>
              </div>

              {/* Properties List */}
              <div>
                <h2 style={{fontSize: '1.5rem', marginBottom: '24px'}}>Managed Properties</h2>
                {properties.length === 0 ? (
                  <div style={{textAlign: 'center', padding: '80px', color: 'var(--color-text-muted)', border:'1px dashed var(--color-border)', borderRadius: '16px'}}>
                    No properties active. <br/>Save the form to activate your first butler.
                  </div>
                ) : (
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
                    {properties.map(p => (
                      <div key={p.id} className="bento-card" style={{padding: '24px', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:'180px'}}>
                        <div>
                          <h3 style={{fontSize: '1.2rem', marginBottom: '8px'}}>{p.name}</h3>
                          <div style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'0.85rem', color: 'var(--color-text-muted)'}}>
                            <span style={{width:'8px', height:'8px', background: p.wifi_ssid ? '#10B981' : '#333', borderRadius:'50%'}}></span>
                            {p.wifi_ssid ? 'WiFi Configured' : 'No WiFi'}
                          </div>
                        </div>
                        <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                           <a href={`/${p.id}/chat`} target="_blank" className="lux-button secondary icon-btn" style={{flex:1, justifyContent:'center', textDecoration:'none', border: '1px solid var(--color-border)'}}>
                             Test Chat
                           </a>
                           <button className="lux-button icon-btn" onClick={() => generateQR(p.id)} style={{flex:1, justifyContent:'center'}}>
                             QR Code
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
        )}
      </div>
    </main>
  );
}
