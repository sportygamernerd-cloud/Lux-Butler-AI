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

  useEffect(() => {
    fetch('/api/properties').then(res => res.json()).then(setProperties);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const newProp = await res.json();
    setProperties([...properties, newProp]);
    setFormData({ name: '', airbnb_link: '', wifi_ssid: '', wifi_password: '', instructions_entree: '', secrets_maison: '' });
  };

  const generateQR = async (id: string) => {
    const url = `${window.location.origin}/${id}/chat`;
    const qr = await QRCode.toDataURL(url, { 
      color: { dark: '#121212', light: '#D4AF37' },
      width: 400
    });
    const win = window.open("");
    win?.document.write(`<div style="text-align:center; font-family: 'Montserrat', sans-serif; padding: 60px; background: #121212; height: 100vh; color: #EAEAEA;">
      <h1 style="color:#D4AF37; margin-bottom:10px; text-transform:uppercase; letter-spacing:4px;">Lux Butler</h1>
      <p style="color:#A0A0A0; margin-bottom:40px; font-weight:300;">ACCÈS CONCIERGERIE OFFERT</p>
      <div style="background:#fff; padding:20px; display:inline-block; border-radius:12px;">
         <img src="${qr}" width="300" />
      </div>
      <p style="margin-top:30px; font-size:0.9rem; color:#555;">Scannez pour vous connecter instantanément</p>
    </div>`);
  };

  if (!showDashboard) {
    return (
      <main className="min-h-screen">
        {/* Navigation */}
        <nav className="lux-nav">
          <div className="container flex" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div className="lux-title" style={{fontSize: '1.5rem', fontWeight:'bold'}}>
              LUX<span>BUTLER</span>
            </div>
            <button className="lux-button secondary icon-btn" onClick={() => setShowDashboard(true)}>
              Connexion Hôte
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container" style={{padding: '80px 20px', textAlign:'center'}}>
          <h1 style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, marginBottom: '20px', color: '#fff'}}>
            L'Élégance est dans les <br/><span style={{color: 'var(--color-gold)', fontStyle:'italic'}}>Détails</span>
          </h1>
          <p style={{fontSize: '1.1rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 50px', lineHeight:'1.8'}}>
            Le Concierge IA qui transforme votre location en expérience 5 étoiles. Utilisez la puissance de l'Intelligence Artificielle pour servir vos invités 24/7.
          </p>
          <div style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
            <button className="lux-button" onClick={() => setShowDashboard(true)}>
              Essai Gratuit
            </button>
            <button className="lux-button secondary">
              Voir un Exemple
            </button>
          </div>
        </section>

        {/* Feature Grid */}
        <section style={{background: '#1A1A1A', padding: '80px 0', borderTop:'1px solid #333'}}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{borderColor:'#333', background:'#121212'}}>
              <h3 style={{fontSize: '1.25rem', marginBottom: '1rem', color:'#fff'}}>Majordome 24/7</h3>
              <p style={{color: 'var(--color-text-muted)'}}>Réponses instantanées et polies à toutes les questions sur le WiFi, les équipements et les bons plans locaux.</p>
            </div>
            <div className="card" style={{borderColor:'#333', background:'#121212'}}>
              <h3 style={{fontSize: '1.25rem', marginBottom: '1rem', color:'#fff'}}>Zéro Téléchargement</h3>
              <p style={{color: 'var(--color-text-muted)'}}>Vos invités scannent simplement un QR code premium placé dans votre propriété pour discuter instantanément.</p>
            </div>
            <div className="card" style={{borderColor:'#333', background:'#121212'}}>
              <h3 style={{fontSize: '1.25rem', marginBottom: '1rem', color:'#fff'}}>Service Polyglotte</h3>
              <p style={{color: 'var(--color-text-muted)'}}>Parfaitement bilingue dans plus de 50 langues pour accueillir des invités du monde entier.</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container" style={{padding: '80px 20px', textAlign: 'center'}}>
          <h2 className="lux-title" style={{marginBottom: '60px', fontSize: '2rem'}}>
            Approuvé par les <span style={{color: 'var(--color-gold)'}}>Superhosts</span>
          </h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px'}}>
            
            {/* Testimonial 1 */}
            <div style={{background: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333'}}>
              <div style={{width: '50px', height: '50px', background: '#333', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'var(--color-gold)'}}>M</div>
              <p style={{fontStyle: 'italic', color: '#EAEAEA', marginBottom: '20px', lineHeight: '1.6'}}>
                "Mes voyageurs ont des réponses instantanées, même à 3h du matin. C'est un gain de temps incroyable."
              </p>
              <div style={{color: 'var(--color-gold)', fontSize: '0.9rem', fontWeight: 'bold'}}>Marc</div>
              <div style={{color: '#888', fontSize: '0.8rem'}}>Hôte à Paris</div>
            </div>

            {/* Testimonial 2 */}
            <div style={{background: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333'}}>
              <div style={{width: '50px', height: '50px', background: '#333', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'var(--color-gold)'}}>S</div>
              <p style={{fontStyle: 'italic', color: '#EAEAEA', marginBottom: '20px', lineHeight: '1.6'}}>
                "Plus besoin de répéter 10 fois le code d'entrée ou le mot de passe wifi. Tout est géré automatiquement."
              </p>
              <div style={{color: 'var(--color-gold)', fontSize: '0.9rem', fontWeight: 'bold'}}>Sophie</div>
              <div style={{color: '#888', fontSize: '0.8rem'}}>Hôte à Lyon</div>
            </div>

            {/* Testimonial 3 */}
            <div style={{background: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333'}}>
              <div style={{width: '50px', height: '50px', background: '#333', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'var(--color-gold)'}}>T</div>
              <p style={{fontStyle: 'italic', color: '#EAEAEA', marginBottom: '20px', lineHeight: '1.6'}}>
                "Le design est magnifique et mes clients adorent la simplicité du QR Code. Un service vraiment premium."
              </p>
              <div style={{color: 'var(--color-gold)', fontSize: '0.9rem', fontWeight: 'bold'}}>Thomas</div>
              <div style={{color: '#888', fontSize: '0.8rem'}}>Hôte à Nice</div>
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
          <div className="lux-title" style={{fontSize: '1.2rem', fontWeight:'bold'}}>
            LUX<span>BUTLER</span> <span style={{opacity:0.5, fontSize:'0.7em', color:'#fff', marginLeft:'10px'}}>TABLEAU DE BORD</span>
          </div>
          <button onClick={() => setShowDashboard(false)} style={{color:'#A0A0A0', background:'transparent', border:'none', cursor:'pointer', fontFamily:'var(--font-heading)', textTransform:'uppercase', fontSize:'0.8rem'}}>Déconnexion</button>
        </div>
      </nav>

      <div className="container" style={{marginTop: '40px', paddingBottom:'40px'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '30px'}}>
            {/* Desktop grid tweak */}
            <style jsx>{`
               @media (min-width: 768px) {
                 div[style*="grid"] { grid-template-columns: 1fr 2fr !important; }
               }
            `}</style>
          
          {/* Add Property Form */}
          <div className="card">
            <h2 style={{fontSize: '1.25rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', color:'#fff'}}>
              <span style={{color: 'var(--color-gold)'}}>✦</span> Nouvelle Propriété
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', fontSize: '0.8rem', marginBottom: '8px', color:'var(--color-gold)', letterSpacing:'1px', textTransform:'uppercase'}}>Nom de la Propriété</label>
                <input className="lux-input" placeholder="ex: Villa Sérénité" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              
              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', fontSize: '0.8rem', marginBottom: '8px', color:'var(--color-gold)', letterSpacing:'1px', textTransform:'uppercase'}}>Configuration WiFi</label>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                  <input className="lux-input" placeholder="Nom du réseau (SSID)" value={formData.wifi_ssid} onChange={e => setFormData({...formData, wifi_ssid: e.target.value})} />
                  <input className="lux-input" placeholder="Mot de passe" value={formData.wifi_password} onChange={e => setFormData({...formData, wifi_password: e.target.value})} />
                </div>
              </div>

              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', fontSize: '0.8rem', marginBottom: '8px', color:'var(--color-gold)', letterSpacing:'1px', textTransform:'uppercase'}}>Détails d'Accès</label>
                <textarea className="lux-textarea" rows={2} placeholder="Code boîte à clés, instructions portail..." value={formData.instructions_entree} onChange={e => setFormData({...formData, instructions_entree: e.target.value})} />
              </div>

              <div style={{marginBottom: '25px'}}>
                <label style={{display: 'block', fontSize: '0.8rem', marginBottom: '8px', color:'var(--color-gold)', letterSpacing:'1px', textTransform:'uppercase'}}>Guide de la Maison</label>
                <textarea className="lux-textarea" rows={4} placeholder="Chauffage piscine, climatisation, gestion des poubelles..." value={formData.secrets_maison} onChange={e => setFormData({...formData, secrets_maison: e.target.value})} />
              </div>

              <button type="submit" className="lux-button" style={{width: '100%'}}>Créer la Propriété</button>
            </form>
          </div>

          {/* Properties List */}
          <div>
            <h2 style={{fontSize: '1.5rem', marginBottom: '25px', color:'#fff'}}>Propriétés Gérées</h2>
            {properties.length === 0 ? (
              <div style={{textAlign: 'center', padding: '60px', color: '#555', border:'1px dashed #333', borderRadius: '12px'}}>
                Aucune propriété ajoutée pour le moment.
              </div>
            ) : (
              <div style={{display: 'grid', gap: '20px'}}>
                {properties.map(p => (
                  <div key={p.id} className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin:0, padding:'20px 25px'}}>
                    <div>
                      <h3 style={{fontSize: '1.1rem', marginBottom: '5px', color:'#fff'}}>{p.name}</h3>
                      <p style={{color: '#666', fontSize: '0.8rem', margin:0}}>WiFi: <span style={{color:'#888'}}>{p.wifi_ssid || 'Non défini'}</span></p>
                    </div>
                    <div>
                       <button 
                        className="lux-button secondary icon-btn" 
                        onClick={() => generateQR(p.id)}
                      >
                        <span style={{fontSize:'1.2em'}}>⚄</span> QR CODE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
