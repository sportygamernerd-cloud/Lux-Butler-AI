'use client';
import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

// --- COMPONENTS ---

// Sub-component for the Live Demo
function LiveDemoChat() {
    const [history, setHistory] = useState<{role: 'user'|'assistant', text: React.ReactNode}[]>([
        {role: 'assistant', text: "Bonjour ! Je suis votre majordome. Comment puis-je faciliter votre séjour ?"}
    ]);
    const [isTyping, setIsTyping] = useState(false);
    
    // Mock Questions DB
    const questions = [
        { label: "Code WiFi ?", prompt: "Quel est le mot de passe WiFi ?", answer: "Le réseau est 'Villa_Reve_5G' et le mot de passe est 'Luxe2026'. Le signal est optimal dans le salon." },
        { label: "Arrivée anticipée ?", prompt: "Puis-je arriver à 11h ?", answer: "L'arrivée standard est à 15h pour garantir un nettoyage parfait. Toutefois, je peux demander à l'équipe si le dépôt de bagages est possible à 11h ?" },
        { label: "Chauffage Piscine ?", prompt: "Comment chauffer la piscine ?", answer: "Le chauffage est automatique et réglé sur 28°C. Pour l'ajuster, le panneau de contrôle se trouve dans le local technique, code 1234." }
    ];

    const ask = (q: typeof questions[0]) => {
        if (isTyping) return;
        setHistory(prev => [...prev, {role: 'user', text: q.prompt}]);
        setIsTyping(true);

        setTimeout(() => {
            const text = q.answer;
            let i = 0;
            const isWifi = q.label === "Code WiFi ?";
            
            // Add empty assistant message
            setHistory(prev => [...prev, {role: 'assistant', text: ''}]);
            
            const interval = setInterval(() => {
                setHistory(prev => {
                    const newHist = [...prev];
                    const lastMsg = newHist[newHist.length - 1];
                    const currentText = text.substring(0, i + 1);
                    
                    if (isWifi && i === text.length - 1) {
                         lastMsg.text = (
                            <div>
                                Le réseau est <strong>Villa_Reve_5G</strong><br/>
                                Mot de passe : <span style={{display:'inline-block', background:'rgba(0,0,0,0.2)', padding:'2px 8px', borderRadius:'4px', fontFamily:'monospace', border:'1px solid var(--color-gold)'}}>Luxe2026</span><br/>
                                <span style={{fontSize:'0.85em', opacity:0.8}}>Le signal est optimal dans le salon.</span>
                            </div>
                         );
                    } else {
                        lastMsg.text = currentText;
                    }
                    return newHist;
                });
                i++;
                if (i === text.length) {
                    clearInterval(interval);
                    setIsTyping(false);
                }
            }, 30);
        }, 600);
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => { 
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
    }, [history.length]);

    return (
        <>
            <div style={{flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {history.map((msg, i) => (
                    <div key={i} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        padding: '12px 16px',
                        borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: msg.role === 'user' ? 'var(--color-gold)' : 'rgba(255,255,255,0.05)',
                        color: msg.role === 'user' ? '#0A0A0A' : '#fff',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        border: msg.role === 'assistant' ? '1px solid var(--color-border)' : 'none'
                    }}>
                        {msg.text}
                    </div>
                ))}
                {isTyping && typeof history[history.length - 1].text === 'string' && (history[history.length - 1].text as string) === '' && (
                     <div style={{alignSelf: 'flex-start', color: '#666', fontSize:'0.8rem', marginLeft:'10px'}}>Le majordome écrit...</div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div style={{display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom:'5px'}}>
                {questions.map((q, i) => (
                    <button key={i} onClick={() => ask(q)} disabled={isTyping} style={{
                        background: 'transparent', border: '1px solid var(--color-gold)', color: 'var(--color-gold)',
                        padding: '8px 12px', borderRadius: '100px', fontSize: '0.75rem', whiteSpace: 'nowrap',
                        cursor: isTyping ? 'default' : 'pointer', opacity: isTyping ? 0.5 : 1, transition:'all 0.2s'
                    }}>
                        {q.label}
                    </button>
                ))}
            </div>
        </>
    );
}

// --- MAIN PAGE ---

export default function LandingPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const [manualMode, setManualMode] = useState(false); // New: Manual Entry Flag
  
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
    if (showDashboard) {
        fetch('/api/properties').then(res => res.json()).then(setProperties);
    }
  }, [showDashboard]);

  const handleImport = async () => {
    if (!importUrl) return;
    setIsImporting(true);
    setImportedData(null);
    setProgress(10);
    
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
        alert("Échec de l'importation");
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
    setFormData({ name: '', airbnb_link: '', wifi_ssid: '', wifi_password: '', instructions_entree: '', secrets_maison: '' });
    setImportedData(null);
    setImportUrl('');
    setProgress(0);
    setManualMode(false); // Reset manual mode
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
        <p style="color: #A1A1AA;">ACCÈS CONCIERGERIE OFFERT</p>
        <div class="qr-box"><img src="${qr}" width="300" /></div>
        <p style="color: #EAEAEA; font-size: 1.1rem;">Scannez pour connexion instantanée</p>
        <a href="${url}" target="_blank" class="btn-link">Ouvrir le Chat</a>
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
              Connexion Hôte
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container" style={{padding: '100px 20px 60px', textAlign:'center'}}>
          <div style={{display: 'inline-block', padding: '6px 16px', background: 'rgba(215, 190, 130, 0.1)', borderRadius: '100px', color: '#D7BE82', fontSize: '0.85rem', marginBottom: '24px', fontWeight: '500'}}>
             ✨ Le Futur de l'Hospitalité
          </div>
          <h1 style={{fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1.1, marginBottom: '24px'}}>
            La Conciergerie IA <br/><span className="lux-text-gold">Réinventée.</span>
          </h1>
          <p style={{fontSize: '1.2rem', color: 'var(--color-text-muted)', maxWidth: '580px', margin: '0 auto 48px', fontWeight: 400}}>
            Sublimez l'expérience de vos voyageurs avec un majordome IA qui semble humain, haut de gamme et disponible 24/7.
          </p>
          <div style={{display: 'flex', gap: '16px', justifyContent: 'center'}}>
            <button className="lux-button" onClick={() => setShowDashboard(true)}>Essai Gratuit</button>
            <button className="lux-button secondary">Voir Démo Live</button>
          </div>
        </section>

        {/* Live Demo Section */}
        <section className="container" style={{paddingBottom: '120px', display:'flex', flexDirection:'column', alignItems:'center'}}>
           <div style={{
               width: '100%', maxWidth: '500px', background: 'var(--color-bg-surface)', 
               border: '1px solid var(--color-border)', borderRadius: '24px', overflow: 'hidden',
               boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)'
           }}>
              {/* Fake Phone Header */}
              <div style={{padding: '15px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent:'space-between'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                      <div style={{width:'30px', height:'30px', borderRadius:'50%', background:'var(--color-gold)', display:'flex', alignItems:'center', justifyContent:'center', color:'#0A0A0A', fontWeight:'bold', fontSize:'0.8rem'}}>LB</div>
                      <div>
                          <div style={{fontSize:'0.9rem', fontWeight:'600', color:'#fff'}}>Lux Butler</div>
                          <div style={{fontSize:'0.7rem', color:'#10B981'}}>En ligne</div>
                      </div>
                  </div>
                  <div style={{fontSize:'0.8rem', color:'var(--color-text-muted)'}}>Démo Live</div>
              </div>

              {/* Chat Area */}
              <div style={{height: '350px', padding: '20px', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                  <LiveDemoChat />
              </div>
           </div>
           <p style={{marginTop: '20px', fontSize:'0.85rem', color:'var(--color-text-muted)', fontStyle:'italic'}}>
               * Cliquez sur une question pour tester la vitesse de l'IA
           </p>
        </section>

        {/* Bento Box Grid */}
        <section className="container" style={{paddingBottom: '120px'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px'}}>
            <div className="bento-card" style={{gridColumn: 'span 2'}}>
              <h3 style={{fontSize: '1.5rem', marginBottom: '12px'}}>Intelligence 24/7</h3>
              <p style={{color: 'var(--color-text-muted)'}}>Répond instantanément aux questions sur le WiFi, les équipements et les envies locales sans que vous leviez le petit doigt.</p>
            </div>
            <div className="bento-card">
              <h3 style={{fontSize: '1.25rem', marginBottom: '12px'}}>Zéro Téléchargement</h3>
              <p style={{color: 'var(--color-text-muted)'}}>Vos invités scannent un QR Code. Pas d'app, pas d'inscription. Juste un service de luxe immédiat.</p>
            </div>
            <div className="bento-card">
              <h3 style={{fontSize: '1.25rem', marginBottom: '12px'}}>Cœur Polyglotte</h3>
              <p style={{color: 'var(--color-text-muted)'}}>Bilingue natif dans plus de 50 langues. Faites en sorte que chaque invité se sente chez lui.</p>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section style={{borderTop: '1px solid var(--color-border)', padding: '100px 0'}}>
           <div className="container" style={{textAlign: 'center'}}>
              <p style={{color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '40px', letterSpacing: '0.1em', textTransform: 'uppercase'}}>Approuvé par les Superhosts</p>
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
          <button onClick={() => setShowDashboard(false)} style={{color: 'var(--color-text-muted)', background:'transparent', border:'none', cursor:'pointer', fontSize:'0.9rem', fontWeight:500}}>Déconnexion</button>
        </div>
      </nav>

      <div className="container" style={{marginTop: '40px', paddingBottom:'60px'}}>
        
        {/* HERO Onboarding (Zero State) */}
        {properties.length === 0 && !importedData && !manualMode && (
            <div style={{textAlign: 'center', margin: '40px auto 100px', maxWidth: '700px'}}>
                <h1 style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, marginBottom: '40px'}}>
                  Votre Majordome IA est <br/><span className="lux-text-gold">à un clic.</span>
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
                                {progress < 30 && "Scan de l'annonce..."}
                                {progress >= 30 && progress < 70 && "Analyse du règlement..."}
                                {progress >= 70 && progress < 100 && "Entraînement de l'IA..."}
                                {progress === 100 && "Majordome Prêt !"}
                             </h3>
                             <p style={{color: 'var(--color-text-muted)'}}>{progress}% terminé</p>
                        </div>
                    )}

                    <label style={{display: 'block', fontSize: '0.85rem', marginBottom: '12px', color: 'var(--color-text-muted)', letterSpacing:'0.05em', textTransform:'uppercase'}}>Collez votre lien Airbnb / Booking</label>
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
                                color: importUrl ? '#0A0A0A' : '#555',
                                cursor: importUrl ? 'pointer' : 'not-allowed',
                                transform: importUrl ? 'scale(1)' : 'scale(1)'
                            }}
                            onClick={handleImport}
                            disabled={!importUrl}
                        >
                            Créer mon Majordome IA
                        </button>
                    </div>

                    <div style={{marginTop: '20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px'}}>
                        <button 
                            onClick={() => setManualMode(true)}
                            style={{background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem'}}
                        >
                            Je n'ai pas de lien ? Saisie manuelle
                        </button>
                    </div>
                </div>
                <p style={{marginTop: '20px', color: '#555', fontSize: '0.9rem'}}>Utilisé par 500+ Superhosts dans le monde</p>
            </div>
        )}

        {/* If properties exist OR we are in editing mode (Imported OR Manual) */}
        {(properties.length > 0 || importedData || manualMode) && (
            <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '30px'}}>
                <style jsx>{`
                   @media (min-width: 900px) {
                     div[style*="grid"] { grid-template-columns: 400px 1fr !important; }
                   }
                `}</style>

              {/* Business Metrics Section */}
              {properties.length > 0 && (
                <div style={{gridColumn: '1 / -1', marginBottom: '10px'}}>
                    <h2 style={{fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <span style={{color: 'var(--color-gold)'}}>📈</span> Performance Business
                    </h2>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px'}}>
                        {/* Metrics Cards */}
                        <div className="bento-card" style={{padding: '24px', display:'flex', flexDirection:'column', gap:'5px'}}>
                            <div style={{fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.05em'}}>Temps Économisé</div>
                            <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#fff', lineHeight: 1}}>
                                {Math.max(12, properties.length * 5.4).toFixed(1)}<span style={{fontSize:'1.2rem', color:'#666'}}>h</span>
                            </div>
                            <div style={{fontSize: '0.8rem', color: '#10B981', display:'flex', alignItems:'center', gap:'5px', marginTop:'5px'}}>
                                <span>▲ 12%</span> <span style={{color:'#555'}}>vs mois dernier</span>
                            </div>
                        </div>
                         <div className="bento-card" style={{padding: '24px', display:'flex', flexDirection:'column', gap:'5px'}}>
                            <div style={{fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.05em'}}>Taux d'Automatisation</div>
                            <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#fff', lineHeight: 1}}>
                                94<span style={{fontSize:'1.2rem', color:'#666'}}>%</span>
                            </div>
                            <div style={{fontSize: '0.8rem', color: '#10B981', display:'flex', alignItems:'center', gap:'5px', marginTop:'5px'}}>
                                <span>+2.1%</span> <span style={{color:'#555'}}>précision IA</span>
                            </div>
                        </div>
                         <div className="bento-card" style={{padding: '24px', display:'flex', flexDirection:'column', gap:'5px'}}>
                            <div style={{fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.05em'}}>Satisfaction Voyageurs</div>
                            <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#fff', lineHeight: 1}}>
                                4.9<span style={{fontSize:'1.2rem', color:'#666'}}>/5</span>
                            </div>
                            <div style={{fontSize: '0.8rem', color: 'var(--color-gold)', display:'flex', alignItems:'center', gap:'5px', marginTop:'5px'}}>
                                <span>★★★★★</span> <span style={{color:'#555'}}>basé sur 42 avis</span>
                            </div>
                        </div>
                    </div>
                </div>
              )}
              
              {/* Add/Edit Property Form */}
              <div className="bento-card" style={{position:'relative'}}>
                  
                {importedData && (
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', padding: '15px', 
                        borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                        <span style={{fontSize: '1.2rem'}}>🎉</span>
                        <div style={{color: '#fff', fontSize: '0.9rem'}}>
                            <strong>IA Prête (90%)</strong><br/>
                            Nous avons trouvé {importedData.house_rules?.length} règles et le WiFi.
                        </div>
                    </div>
                )}
                
                {/* Back Button for Manual Mode */}
                {manualMode && !importedData && (
                     <button onClick={() => setManualMode(false)} style={{background:'transparent', border:'none', color:'#666', marginBottom:'10px', cursor:'pointer'}}>← Retour</button>
                )}

                <h2 style={{fontSize: '1.1rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                   <span style={{color: 'var(--color-gold)'}}>{importedData ? '✦' : '+'}</span> 
                   {importedData ? 'Vérifier la Base de Connaissances' : 'Nouvelle Propriété'}
                </h2>

                <form onSubmit={handleSubmit}>
                  <div style={{marginBottom: '16px'}}>
                    <label style={{display: 'block', fontSize: '0.75rem', marginBottom: '8px', color: 'var(--color-text-muted)', letterSpacing:'0.05em', textTransform:'uppercase'}}>Nom de la Propriété</label>
                    <input className="lux-input" placeholder="ex: Le Penthouse" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  
                  <div style={{marginBottom: '16px'}}>
                    <label style={{display: 'block', fontSize: '0.75rem', marginBottom: '8px', color: 'var(--color-text-muted)', letterSpacing:'0.05em', textTransform:'uppercase'}}>Configuration WiFi</label>
                    <div style={{display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '12px'}}>
                      <input 
                        className="lux-input" 
                        placeholder="SSID" 
                        value={formData.wifi_ssid} 
                        onChange={e => setFormData({...formData, wifi_ssid: e.target.value})} 
                        style={{marginBottom: 0, minWidth: 0}}
                      />
                      <input 
                        className="lux-input" 
                        placeholder="Mot de Passe" 
                        value={formData.wifi_password} 
                        onChange={e => setFormData({...formData, wifi_password: e.target.value})} 
                        style={{marginBottom: 0, minWidth: 0}}
                      />
                    </div>
                  </div>

                  <div style={{marginBottom: '16px'}}>
                    <label style={{display: 'block', fontSize: '0.75rem', marginBottom: '8px', color: 'var(--color-text-muted)', letterSpacing:'0.05em', textTransform:'uppercase'}}>Détails d'Accès</label>
                    <textarea className="lux-textarea" rows={2} placeholder="Code boîte à clés..." value={formData.instructions_entree} onChange={e => setFormData({...formData, instructions_entree: e.target.value})} />
                  </div>

                  <div style={{marginBottom: '24px'}}>
                    <label style={{display: 'block', fontSize: '0.75rem', marginBottom: '8px', color: 'var(--color-text-muted)', letterSpacing:'0.05em', textTransform:'uppercase'}}>Guide de la Maison</label>
                    <textarea className="lux-textarea" rows={6} placeholder="Chauffage piscine, règles..." value={formData.secrets_maison} onChange={e => setFormData({...formData, secrets_maison: e.target.value})} />
                  </div>

                  <button type="submit" className="lux-button" style={{width: '100%', borderRadius: '8px'}}>
                      {importedData ? 'Activer le Majordome' : 'Créer Propriété'}
                  </button>
                </form>
              </div>

              {/* Properties List */}
              <div>
                <h2 style={{fontSize: '1.5rem', marginBottom: '24px'}}>Propriétés Gérées</h2>
                {properties.length === 0 ? (
                  <div style={{textAlign: 'center', padding: '80px', color: 'var(--color-text-muted)', border:'1px dashed var(--color-border)', borderRadius: '16px'}}>
                    Aucune propriété active. <br/>Sauvegardez le formulaire pour activer votre premier majordome.
                  </div>
                ) : (
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
                    {properties.map(p => (
                      <div key={p.id} className="bento-card" style={{padding: '24px', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:'180px'}}>
                        <div>
                          <h3 style={{fontSize: '1.2rem', marginBottom: '8px'}}>{p.name}</h3>
                          <div style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'0.85rem', color: 'var(--color-text-muted)'}}>
                            <span style={{width:'8px', height:'8px', background: p.wifi_ssid ? '#10B981' : '#333', borderRadius:'50%'}}></span>
                            {p.wifi_ssid ? 'WiFi Configuré' : 'Pas de WiFi'}
                          </div>
                        </div>
                        <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                           <a href={`/${p.id}/chat`} target="_blank" className="lux-button secondary icon-btn" style={{flex:1, justifyContent:'center', textDecoration:'none', border: '1px solid var(--color-border)'}}>
                             Tester Chat
                           </a>
                           <button className="lux-button icon-btn" onClick={() => generateQR(p.id)} style={{flex:1, justifyContent:'center'}}>
                             Code QR
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
