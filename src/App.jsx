import { useState, useEffect, useRef } from "react";

// ── Design tokens — Home blue warm ───────────────────────────────────────────
const C = {
  bg:"#fdf8f0",        // fond sable très clair
  surface:"#ffffff",   // surfaces blanches chaudes
  card:"#fffcf7",      // cartes légèrement crème
  border:"#e8d9c0",    // bordures caramel clair
  borderDark:"#c9b48a",
  accent:"#2B5A9E",    // bleu acier — accent principal
  accentLight:"#eaf1fb",
  accentBorder:"#BAD6F0",
  ink:"#0F1D2B",       // bleu nuit — texte principal
  muted:"#5a6e7f",     // muted bleuté
  subtle:"#8B5E20",    // caramel — éléments discrets
  green:"#2d7a4f", greenLight:"#edf7f1",
  red:"#c0392b", redLight:"#fdf0ef",
  amber:"#8B5E20", amberLight:"#fdf3e3",
  blue:"#2B5A9E", blueLight:"#eaf1fb",
  gold:"#F5C97A", goldLight:"#fdf8ed",
};

// ── Chapitres / Tags ──────────────────────────────────────────────────────────
const CHAPTERS = [
  { id:"marche",     emoji:"📊", label:"Marché" },
  { id:"nouveautes", emoji:"🆕", label:"Nouveautés" },
  { id:"logistique", emoji:"🚚", label:"Logistique" },
  { id:"propositions",emoji:"💡", label:"Propositions" },
  { id:"performances",emoji:"🏆", label:"Performances" },
  { id:"alertes",    emoji:"⚠️", label:"Alertes" },
  { id:"reassorts",  emoji:"🔄", label:"Réassorts" },
  { id:"operations", emoji:"🎯", label:"Opérations en cours" },
  { id:"saisonnalite",emoji:"🎄", label:"Saisonnalité" },
  { id:"dedicaces",  emoji:"✍️", label:"Demandes de dédicace" },
];

// ── Périodes Synthèse ─────────────────────────────────────────────────────────
const SYNTHESE_PERIODS = [
  { id:"s1", start:"2026-05-22", end:"2026-06-01", label:"Synthèse Mai" },
  { id:"s2", start:"2026-06-01", end:"2026-07-06", label:"Synthèse Juin–Juillet" },
  { id:"s3", start:"2026-07-06", end:"2026-09-07", label:"Synthèse Juil–Août" },
  { id:"s4", start:"2026-09-07", end:"2026-10-05", label:"Synthèse Sept–Oct" },
  { id:"s5", start:"2026-10-05", end:"2026-11-02", label:"Synthèse Oct–Nov" },
  { id:"s6", start:"2026-11-02", end:"2026-12-07", label:"Synthèse Nov–Déc" },
];

// ── Notes existantes importées depuis les événements Synthèse ────────────────
const IMPORTED_NOTES = [
  { id:"imp1", text:"Attention offre stick", chapter:"alertes",     createdAt:"2026-05-22T08:00:00", imported:true },
  { id:"imp2", text:"Forte baisse en hyper Peppa — prudence sur navres PatPat (65% écoulement Osny à Noël)", chapter:"alertes", createdAt:"2026-05-22T08:01:00", imported:true },
  { id:"imp3", text:"Possibilité d'extraire fiches articles Compagnon en JPEG/PNG pour corps de mail", chapter:"propositions", createdAt:"2026-05-22T08:02:00", imported:true },
  { id:"imp4", text:"Dans les e-mails : alerter François avec EAN plutôt que nuart", chapter:"logistique", createdAt:"2026-05-22T08:03:00", imported:true },
  { id:"imp5", text:"CGT adresse Fosses à vérifier", chapter:"logistique", createdAt:"2026-05-22T08:04:00", imported:true },
  { id:"imp6", text:"Encore des soucis de livraison à Chambly", chapter:"logistique", createdAt:"2026-05-22T08:05:00", imported:true },
  { id:"imp7", text:"Couverture France en train — à surveiller", chapter:"marche", createdAt:"2026-05-22T08:06:00", imported:true },
  { id:"imp8", text:"Avoir dates de dispo Compagnon des BdC : coffrets sept, coffrets T4, Enjeux Jeun & Adultes, Noël, campagnes de réassort", chapter:"nouveautes", createdAt:"2026-05-22T08:07:00", imported:true },
  { id:"imp9", text:"Création mobilier permanent assortiment coffrets (loisirs créa Eyrolles)", chapter:"operations", createdAt:"2026-05-22T08:08:00", imported:true },
  { id:"imp10",text:"Bonnes performances des beaux livres voyages (VDM)", chapter:"performances", createdAt:"2026-05-22T08:09:00", imported:true },
];

// ── RDV Client important ──────────────────────────────────────────────────────
const CALENDAR_EVENTS = [
  { id:"e1",  title:"LA GRANDE LIBRAIRIE",       start:"2026-05-22T10:00:00", location:"Arras" },
  { id:"e2",  title:"FURET ARRAS",               start:"2026-05-22T11:00:00", location:"Arras" },
  { id:"e3",  title:"CULTURA AMIENS",            start:"2026-05-26T14:00:00", location:"Amiens" },
  { id:"e4",  title:"LIBRAIRIE EYROLLES",        start:"2026-05-28T11:00:00", location:"Paris 5e" },
  { id:"e5",  title:"Déjeuner Pascal",           start:"2026-05-28T12:30:00", location:"Café du Monde" },
  { id:"e6",  title:"LIBRAIRIE COMME UN ROMAN",  start:"2026-05-28T15:30:00", location:"Paris 3e" },
  { id:"e7",  title:"LIBRAIRIE COMME UN ROMAN",  start:"2026-05-29T11:00:00", location:"Paris 3e" },
  { id:"e8",  title:"LIBRAIRIE EYROLLES",        start:"2026-05-29T12:30:00", location:"Paris 5e" },
  { id:"e9",  title:"LIBRAIRIE ICI",             start:"2026-05-29T15:00:00", location:"Paris 2e" },
  { id:"e10", title:"CULTURA L'ISLE ADAM",       start:"2026-06-01T11:00:00", location:"Mours" },
  { id:"e11", title:"LECLERC CHAMBLY",           start:"2026-06-01T14:00:00", location:"Chambly" },
  { id:"e12", title:"LECLERC FOSSES",            start:"2026-06-02T10:30:00", location:"La Chapelle-en-Serval" },
  { id:"e13", title:"LIBRAIRIE LE GRAND CERCLE", start:"2026-06-02T14:00:00", location:"Éragny" },
  { id:"e14", title:"E.C. OUTREAU",              start:"2026-06-03T10:00:00", location:"Saint-Léonard" },
  { id:"e15", title:"MdP LE TOUQUET",            start:"2026-06-03T15:30:00", location:"Le Touquet" },
  { id:"e16", title:"STUDIO LIVRE",              start:"2026-06-04T10:00:00", location:"Abbeville" },
  { id:"e17", title:"FURET COQUELLES",           start:"2026-06-04T14:00:00", location:"Coquelles" },
  { id:"e18", title:"LIBRAIRIE DELAMAIN",        start:"2026-06-05T10:00:00", location:"Paris 1er" },
  { id:"e19", title:"LIBRAIRIE GOURMANDE",       start:"2026-06-05T11:00:00", location:"Paris 6e" },
  { id:"e20", title:"FNAC FORUM",                start:"2026-06-05T15:00:00", location:"Paris 1er" },
  { id:"e21", title:"LECLERC TRIE CHATEAU",      start:"2026-06-08T14:00:00", location:"Trie-Château" },
  { id:"e22", title:"CROCOLIVRE",                start:"2026-06-09T10:30:00", location:"Enghien-les-Bains" },
  { id:"e23", title:"LECLERC MOISSELLES",        start:"2026-06-09T14:00:00", location:"Moisselles" },
  { id:"e24", title:"LECLERC OSNY",              start:"2026-06-10T10:00:00", location:"Osny" },
  { id:"e25", title:"PLESSIS BELLEVILLE",        start:"2026-06-10T14:00:00", location:"Le Plessis Belleville" },
  { id:"e26", title:"BHV",                       start:"2026-06-11T11:00:00", location:"Paris 4e" },
  { id:"e27", title:"VOYAGEURS DU MONDE",        start:"2026-06-11T15:00:00", location:"Paris 2e" },
  { id:"e28", title:"Musée de l'Orangerie",      start:"2026-06-12T11:00:00", location:"Paris" },
  { id:"e29", title:"LIBRAIRIE LES TRAVERSÉES",  start:"2026-06-12T15:00:00", location:"Paris 5e" },
  { id:"e30", title:"LIBRAIRIE LECUT",           start:"2026-06-15T14:00:00", location:"Ermont" },
  { id:"e31", title:"LECLERC PONT STE MAXENCE",  start:"2026-06-16T14:00:00", location:"Pont-Sainte-Maxence" },
  { id:"e32", title:"MARTELLE",                  start:"2026-06-17T10:30:00", location:"Amiens" },
  { id:"e33", title:"CULTURA",                   start:"2026-06-18T11:00:00", location:"Fouquières-lès-Béthune" },
  { id:"e34", title:"MdP BERCK/MER",             start:"2026-06-18T14:00:00", location:"Berck" },
  { id:"e35", title:"FURET LENS",                start:"2026-06-19T10:30:00", location:"Lens" },
  { id:"e36", title:"CULTURA",                   start:"2026-06-19T14:00:00", location:"Hénin-Beaumont" },
  { id:"e37", title:"FURET BETHUNE",             start:"2026-06-22T14:30:00", location:"Béthune" },
  { id:"e38", title:"MARTELLE",                  start:"2026-06-23T11:30:00", location:"Amiens" },
  { id:"e39", title:"LIBRAIRIE LE GRAND CERCLE", start:"2026-06-23T14:00:00", location:"Éragny" },
  { id:"e40", title:"LIBRAIRIE DES SIGNES",      start:"2026-06-24T14:00:00", location:"Compiègne" },
  { id:"e41", title:"LIBRAIRIE EYROLLES",        start:"2026-06-25T11:00:00", location:"Paris 5e" },
  { id:"e42", title:"BHV",                       start:"2026-06-25T14:30:00", location:"Paris 4e" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = d => new Date(d).toLocaleDateString("fr-FR",{day:"2-digit",month:"short"});
const fmtFull = d => new Date(d).toLocaleDateString("fr-FR",{weekday:"short",day:"2-digit",month:"short"});
const fmtTime = d => new Date(d).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
const daysLeft = d => Math.ceil((new Date(d)-new Date())/86400000);
const load = (k,def) => { try{ const v=localStorage.getItem(k); return v?JSON.parse(v):def; }catch{ return def; } };
const save = (k,v) => { try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} };

function getCurrentPeriod() {
  const now = new Date();
  return SYNTHESE_PERIODS.find(p => now >= new Date(p.start) && now < new Date(p.end)) || SYNTHESE_PERIODS[0];
}

function getNextPeriod() {
  const cur = getCurrentPeriod();
  const idx = SYNTHESE_PERIODS.findIndex(p=>p.id===cur.id);
  return SYNTHESE_PERIODS[idx+1]||null;
}

function urgencyStyle(days){
  if(days<0)  return {color:C.red,   bg:C.redLight,   label:"Dépassé"};
  if(days===0)return {color:C.red,   bg:C.redLight,   label:"Aujourd'hui"};
  if(days<=3) return {color:C.amber, bg:C.amberLight, label:`J-${days}`};
  if(days<=10)return {color:C.accent,bg:C.accentLight,label:`J-${days}`};
  return             {color:C.green, bg:C.greenLight,  label:`J-${days}`};
}

function chapterById(id){ return CHAPTERS.find(c=>c.id===id)||CHAPTERS[0]; }

// ── UI Components ─────────────────────────────────────────────────────────────
function Tag({chapter, size="sm"}){
  const ch = chapterById(chapter);
  const fs = size==="sm"?11:13;
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:fs,fontWeight:600,
      background:C.accentLight,color:C.accent,border:`1px solid ${C.accentBorder}`,
      padding:"2px 8px",borderRadius:20,whiteSpace:"nowrap"}}>
      {ch.emoji} {ch.label}
    </span>
  );
}

function Pill({children,color=C.accent,bg=C.accentLight}){
  return <span style={{fontSize:11,fontWeight:700,color,background:bg,padding:"2px 8px",borderRadius:20}}>{children}</span>;
}

function Btn({onClick,children,variant="ghost",style={},disabled=false}){
  const base={border:"none",cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",
    borderRadius:8,fontSize:13,fontWeight:600,padding:"8px 16px",transition:"all .15s",opacity:disabled?.5:1};
  const variants={
    ghost:{background:"transparent",color:C.muted},
    primary:{background:C.accent,color:"#fff",boxShadow:`0 2px 8px ${C.accent}44`},
    outline:{background:"transparent",color:C.accent,border:`1.5px solid ${C.accent}`},
    soft:{background:C.accentLight,color:C.accent,border:`1px solid ${C.accentBorder}`},
    danger:{background:C.redLight,color:C.red,border:`1px solid ${C.red}44`},
  };
  return <button onClick={disabled?undefined:onClick} style={{...base,...variants[variant],...style}}>{children}</button>;
}

function Modal({open,onClose,title,children,wide=false}){
  if(!open) return null;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(26,23,20,.55)",backdropFilter:"blur(4px)",
      zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}
      onClick={onClose}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:20,padding:28,
        width:"100%",maxWidth:wide?640:460,maxHeight:"88vh",overflowY:"auto",
        boxShadow:"0 24px 60px rgba(0,0,0,.18)"}}
        onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <span style={{fontWeight:700,fontSize:17,color:C.ink,letterSpacing:-.3}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",
            fontSize:18,color:C.subtle,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",
            borderRadius:8,transition:"background .15s"}}
            onMouseOver={e=>e.target.style.background=C.border}
            onMouseOut={e=>e.target.style.background="none"}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputStyle = {
  background:C.bg, border:`1.5px solid ${C.border}`, color:C.ink,
  padding:"10px 14px", borderRadius:10, fontSize:14, outline:"none",
  fontFamily:"inherit", width:"100%", boxSizing:"border-box",
  transition:"border-color .15s",
};

// ── Voice hook ────────────────────────────────────────────────────────────────
function useVoice(onConfirm){
  const rec=useRef(null);
  const [listening,setListening]=useState(false);
  const [transcript,setTranscript]=useState("");
  const start=()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){alert("Dictée vocale non supportée sur ce navigateur.");return;}
    const r=new SR(); r.lang="fr-FR"; r.continuous=false; r.interimResults=true;
    r.onresult=e=>{const t=Array.from(e.results).map(x=>x[0].transcript).join("");setTranscript(t);};
    r.onend=()=>setListening(false);
    r.start(); rec.current=r; setListening(true); setTranscript("");
  };
  const stop=()=>rec.current?.stop();
  const confirm=()=>{if(transcript.trim()){onConfirm(transcript.trim());setTranscript("");}};
  const discard=()=>setTranscript("");
  return {listening,transcript,start,stop,confirm,discard};
}

// ── AI Chat ───────────────────────────────────────────────────────────────────
function AIChat({period,notes}){
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [report,setReport]=useState("");
  const bottomRef=useRef();
  const initialized=useRef(false);

  useEffect(()=>{
    if(initialized.current) return;
    initialized.current=true;
    const byChapter={};
    notes.forEach(n=>{
      if(!byChapter[n.chapter]) byChapter[n.chapter]=[];
      byChapter[n.chapter].push(n.text);
    });
    const notesText=CHAPTERS.filter(c=>byChapter[c.id]).map(c=>
      `### ${c.emoji} ${c.label}\n${byChapter[c.id].map(t=>`- ${t}`).join("\n")}`
    ).join("\n\n");
    const intro=`Bonjour ! Je suis prêt pour le brainstorming de la **${period.label}** (compilation le ${fmt(period.end)}).\n\nJ'ai ${notes.length} note(s) réparties en ${Object.keys(byChapter).length} chapitre(s). Quelques questions pour affiner le rapport avant de le générer :`;
    setMessages([{role:"assistant",content:intro}]);
  },[]);

  useEffect(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),[messages]);

  async function send(){
    if(!input.trim()||loading) return;
    const userMsg={role:"user",content:input.trim()};
    const newMessages=[...messages,userMsg];
    setMessages(newMessages); setInput(""); setLoading(true);

    const byChapter={};
    notes.forEach(n=>{if(!byChapter[n.chapter])byChapter[n.chapter]=[];byChapter[n.chapter].push(n.text);});
    const notesText=CHAPTERS.filter(c=>byChapter[c.id]).map(c=>
      `### ${c.emoji} ${c.label}\n${byChapter[c.id].map(t=>`- ${t}`).join("\n")}`
    ).join("\n\n");

    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,
          system:`Tu es un assistant de terrain pour un commercial éditorial expérimenté. 
Période : ${period.label} (du ${fmt(period.start)} au ${fmt(period.end)}).
Notes terrain par chapitre :\n${notesText}

Aide à brainstormer et affiner le rapport. 
Quand l'utilisateur demande le rapport final, génère un rapport professionnel structuré par chapitres (uniquement ceux qui ont des notes), avec pour chaque chapitre : synthèse des points clés, actions recommandées. 
Termine par une section "Points prioritaires" avec les 3-5 actions urgentes.
Ton : professionnel, concis, orienté action. En français.`,
          messages:newMessages.map(m=>({role:m.role,content:m.content}))})});
      const data=await res.json();
      const reply=data.content?.map(b=>b.text||"").join("")||"Erreur.";
      setMessages(prev=>[...prev,{role:"assistant",content:reply}]);
      if(reply.length>600&&(reply.includes("##")||reply.includes("Points prioritaires"))) setReport(reply);
    }catch{
      setMessages(prev=>[...prev,{role:"assistant",content:"Erreur de connexion."}]);
    }
    setLoading(false);
  }

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {/* Messages */}
      <div style={{maxHeight:340,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,
        padding:"4px 0"}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"85%",padding:"10px 14px",borderRadius:14,fontSize:14,lineHeight:1.65,
              background:m.role==="user"?C.accent:C.bg,
              color:m.role==="user"?"#fff":C.ink,
              borderBottomRightRadius:m.role==="user"?3:14,
              borderBottomLeftRadius:m.role==="assistant"?3:14,
              border:m.role==="assistant"?`1px solid ${C.border}`:"none",
              whiteSpace:"pre-wrap"}}>
              {m.content}
            </div>
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",alignItems:"center",gap:8,color:C.muted,fontSize:13,padding:"4px 0"}}>
            <span style={{display:"flex",gap:4}}>
              {[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:C.subtle,
                animation:`bounce 1s ${i*.2}s infinite`}}/>)}
            </span>
            Claude rédige…
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{display:"flex",gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
          placeholder='Réponds ou dis "génère le rapport final"…'
          style={{...inputStyle,flex:1,fontSize:13}}/>
        <Btn onClick={send} variant="primary" disabled={loading} style={{padding:"10px 14px"}}>→</Btn>
      </div>

      {/* Rapport exportable */}
      {report&&(
        <div style={{background:C.greenLight,border:`1.5px solid ${C.green}44`,borderRadius:12,padding:14,marginTop:4}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{color:C.green,fontSize:13,fontWeight:700}}>✓ Rapport prêt à l'export</span>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={()=>navigator.clipboard.writeText(report)} variant="outline" style={{fontSize:12,padding:"5px 12px"}}>📋 Copier</Btn>
              <Btn onClick={()=>{
                const sub=encodeURIComponent(`${period.label} — Synthèse terrain`);
                const body=encodeURIComponent(report);
                window.location.href=`mailto:?subject=${sub}&body=${body}`;
              }} variant="outline" style={{fontSize:12,padding:"5px 12px"}}>📧 Envoyer</Btn>
            </div>
          </div>
          <div style={{fontSize:12,color:C.green}}>Le rapport sera structuré par chapitres selon vos notes terrain.</div>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function NotesFlow(){
  const [tab,setTab]=useState("notes");
  const [notes,setNotes]=useState(()=>{
    const saved=load("nf3_notes",[]);
    if(saved.length===0) return IMPORTED_NOTES;
    return saved;
  });

  const [captureOpen,setCaptureOpen]=useState(false);
  const [voiceOpen,setVoiceOpen]=useState(false);
  const [chatOpen,setChatOpen]=useState(false);
  const [filterChapter,setFilterChapter]=useState("all");
  const [selectMode,setSelectMode]=useState(false);
  const [selected,setSelected]=useState(new Set());
  const [confirmDelete,setConfirmDelete]=useState(null); // null | "single" | "multi"
  const [pendingDeleteId,setPendingDeleteId]=useState(null);

  const [noteText,setNoteText]=useState("");
  const [noteChapter,setNoteChapter]=useState("marche");

  const currentPeriod=getCurrentPeriod();
  const nextPeriod=getNextPeriod();
  const daysToCompile=daysLeft(currentPeriod.end);
  const urg=urgencyStyle(daysToCompile);

  useEffect(()=>save("nf3_notes",notes),[notes]);

  // Keyboard shortcut
  useEffect(()=>{
    const h=e=>{if(e.ctrlKey&&e.key===" "){e.preventDefault();setCaptureOpen(true);}};
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[]);

  const voice=useVoice(t=>{setNoteText(t);setVoiceOpen(false);setCaptureOpen(true);});

  function addNote(){
    if(!noteText.trim()) return;
    const note={
      id:Date.now(),text:noteText.trim(),chapter:noteChapter,
      createdAt:new Date().toISOString(),period:currentPeriod.id,imported:false,
    };
    setNotes(prev=>[note,...prev]);
    setNoteText(""); setCaptureOpen(false);
  }

  const periodNotes=notes.filter(n=>n.period===currentPeriod.id||n.imported);
  const filteredNotes=filterChapter==="all"?periodNotes:periodNotes.filter(n=>n.chapter===filterChapter);

  const chapterCounts={};
  periodNotes.forEach(n=>{chapterCounts[n.chapter]=(chapterCounts[n.chapter]||0)+1;});

  const upcomingEvents=CALENDAR_EVENTS.filter(e=>new Date(e.start)>=new Date()).slice(0,15);

  const tabs=[
    {key:"notes",   icon:"📝", label:"Notes"},
    {key:"planning",icon:"🗓", label:"Planning"},
    {key:"synthese",icon:"⚡", label:"Synthèse"},
  ];

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.ink,fontFamily:"'Phenomena'",
      position:"relative"}}>

      {/* ── Header ── */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:100}}>
        {/* Top bar */}
        <div style={{padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{display:"flex",alignItems:"baseline",gap:10}}>
              <span style={{fontSize:20,fontWeight:800,color:C.accent,letterSpacing:-1,fontFamily:"inherit"}}>NotesFlow</span>
              <span style={{fontSize:11,color:C.subtle,fontFamily:"'Phenomena'"}}>
                {periodNotes.filter(n=>!n.imported).length} note{periodNotes.filter(n=>!n.imported).length!==1?"s":""} · {currentPeriod.label}
              </span>
            </div>
            {/* Compilation countdown */}
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:urg.color}}/>
              <span style={{fontSize:11,color:urg.color,fontWeight:600}}>
                Compilation le {fmt(currentPeriod.end)} — {urg.label}
              </span>
            </div>
          </div>
          {/* Action buttons */}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setVoiceOpen(true);voice.start();}}
              title="Dicter une note"
              style={{width:38,height:38,borderRadius:10,background:C.bg,border:`1.5px solid ${C.border}`,
                color:voice.listening?C.red:C.muted,fontSize:17,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>
              🎙
            </button>
            <button onClick={()=>setCaptureOpen(true)}
              title="Nouvelle note (Ctrl+Espace)"
              style={{height:38,padding:"0 16px",borderRadius:10,background:C.accent,border:"none",
                color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",
                display:"flex",alignItems:"center",gap:6,
                boxShadow:`0 2px 12px ${C.accent}55`,fontFamily:"inherit"}}>
              + Note
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",paddingLeft:20,borderTop:`1px solid ${C.border}`}}>
          {tabs.map(({key,icon,label})=>(
            <button key={key} onClick={()=>setTab(key)} style={{
              padding:"10px 16px",border:"none",background:"transparent",cursor:"pointer",
              fontFamily:"inherit",fontSize:13,fontWeight:tab===key?700:400,
              color:tab===key?C.accent:C.muted,
              borderBottom:tab===key?`2px solid ${C.accent}`:"2px solid transparent",
              transition:"all .15s",display:"flex",alignItems:"center",gap:5,
            }}>{icon} {label}</button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{maxWidth:680,margin:"0 auto",padding:"20px 16px 80px"}}>

        {/* NOTES TAB */}
        {tab==="notes"&&(
          <div>
            {/* Chapter filter pills */}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
              <button onClick={()=>setFilterChapter("all")} style={{
                fontSize:12,fontWeight:600,padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",
                background:filterChapter==="all"?C.accent:C.bg,
                color:filterChapter==="all"?"#fff":C.muted,
                border:`1px solid ${filterChapter==="all"?C.accent:C.border}`,fontFamily:"inherit",
              }}>Tous ({periodNotes.length})</button>
              {CHAPTERS.filter(c=>chapterCounts[c.id]).map(c=>(
                <button key={c.id} onClick={()=>setFilterChapter(c.id)} style={{
                  fontSize:12,fontWeight:600,padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",
                  background:filterChapter===c.id?C.accent:C.bg,
                  color:filterChapter===c.id?"#fff":C.muted,
                  border:`1px solid ${filterChapter===c.id?C.accent:C.border}`,fontFamily:"inherit",
                }}>{c.emoji} {c.label} {chapterCounts[c.id]>1?`(${chapterCounts[c.id]})`:""}</button>
              ))}
            </div>

            {/* Selection toolbar */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <Btn onClick={()=>{setSelectMode(s=>!s);setSelected(new Set());}}
                variant={selectMode?"soft":"ghost"}
                style={{fontSize:12,padding:"5px 12px"}}>
                {selectMode?"✕ Annuler":"☑ Sélectionner"}
              </Btn>
              {selectMode&&selected.size>0&&(
                <Btn onClick={()=>setConfirmDelete("multi")} variant="danger"
                  style={{fontSize:12,padding:"5px 12px"}}>
                  🗑 Supprimer ({selected.size})
                </Btn>
              )}
              {selectMode&&filteredNotes.length>0&&(
                <Btn onClick={()=>setSelected(new Set(filteredNotes.map(n=>n.id)))}
                  variant="ghost" style={{fontSize:12,padding:"5px 12px"}}>
                  Tout sélectionner
                </Btn>
              )}
            </div>

            {filteredNotes.length===0
              ? <div style={{textAlign:"center",color:C.subtle,padding:"60px 0",fontSize:15}}>
                  Aucune note dans ce chapitre.<br/>
                  <span style={{fontSize:13}}>Appuie sur + Note ou Ctrl+Espace.</span>
                </div>
              : <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {filteredNotes.map(note=>{
                    const ch=chapterById(note.chapter);
                    const isSel=selected.has(note.id);
                    return(
                      <div key={note.id}
                        onClick={()=>{
                          if(!selectMode) return;
                          setSelected(prev=>{
                            const next=new Set(prev);
                            next.has(note.id)?next.delete(note.id):next.add(note.id);
                            return next;
                          });
                        }}
                        style={{background:isSel?C.accentLight:C.surface,borderRadius:12,padding:"14px 16px",
                          border:`1.5px solid ${isSel?C.accent:C.border}`,
                          display:"flex",gap:12,alignItems:"flex-start",
                          transition:"all .15s",cursor:selectMode?"pointer":"default",
                          opacity:note.imported?.85:1}}>
                        {/* Checkbox or emoji */}
                        {selectMode
                          ? <div style={{width:22,height:22,borderRadius:6,flexShrink:0,marginTop:1,
                              border:`2px solid ${isSel?C.accent:C.border}`,
                              background:isSel?C.accent:"transparent",
                              display:"flex",alignItems:"center",justifyContent:"center",
                              color:"#fff",fontSize:13,fontWeight:700}}>
                              {isSel?"✓":""}
                            </div>
                          : <div style={{fontSize:20,lineHeight:1,paddingTop:2}}>{ch.emoji}</div>
                        }
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{margin:"0 0 8px",fontSize:14,lineHeight:1.65,color:C.ink}}>{note.text}</p>
                          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                            <span style={{fontSize:11,color:C.subtle,fontFamily:"monospace"}}>
                              {new Date(note.createdAt).toLocaleDateString("fr-FR")}
                            </span>
                            <span style={{fontSize:11,color:C.subtle}}>·</span>
                            <span style={{fontSize:11,color:note.imported?C.subtle:C.accent,fontWeight:600}}>
                              {note.imported?"📥 Importé":currentPeriod.label}
                            </span>
                            {selectMode&&<span style={{fontSize:11,color:C.subtle}}>· {ch.emoji} {ch.label}</span>}
                          </div>
                        </div>
                        {!selectMode&&(
                          <button onClick={e=>{e.stopPropagation();setPendingDeleteId(note.id);setConfirmDelete("single");}}
                            style={{background:"none",border:"none",color:C.subtle,cursor:"pointer",
                              fontSize:16,padding:4,borderRadius:6,lineHeight:1,flexShrink:0,
                              transition:"color .15s"}}
                            onMouseOver={e=>e.currentTarget.style.color=C.red}
                            onMouseOut={e=>e.currentTarget.style.color=C.subtle}>✕</button>
                        )}
                      </div>
                    );
                  })}
                </div>
            }
          </div>
        )}

        {/* ── Confirm delete modal ── */}
        {confirmDelete&&(
          <Modal open={true} onClose={()=>{setConfirmDelete(null);setPendingDeleteId(null);}}
            title="🗑 Confirmer la suppression">
            <p style={{fontSize:14,color:C.muted,lineHeight:1.6,marginBottom:20}}>
              {confirmDelete==="single"
                ? "Supprimer cette note définitivement ?"
                : `Supprimer les ${selected.size} notes sélectionnées définitivement ?`}
              <br/><span style={{fontSize:12,color:C.subtle}}>Cette action est irréversible.</span>
            </p>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn onClick={()=>{setConfirmDelete(null);setPendingDeleteId(null);}}>Annuler</Btn>
              <Btn variant="danger" onClick={()=>{
                if(confirmDelete==="single"){
                  setNotes(p=>p.filter(n=>n.id!==pendingDeleteId));
                } else {
                  setNotes(p=>p.filter(n=>!selected.has(n.id)));
                  setSelected(new Set());
                  setSelectMode(false);
                }
                setConfirmDelete(null);
                setPendingDeleteId(null);
              }}>Supprimer</Btn>
            </div>
          </Modal>
        )}

        {/* PLANNING TAB */}
        {tab==="planning"&&(
          <div>
            <div style={{fontSize:12,color:C.muted,marginBottom:14,fontFamily:"monospace"}}>
              Calendrier Client important · {upcomingEvents.length} prochains RDV
            </div>

            {/* Période en cours */}
            <div style={{background:C.accentLight,border:`1.5px solid ${C.accentBorder}`,
              borderRadius:12,padding:"14px 16px",marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:700,color:C.accent,fontSize:14}}>⚡ {currentPeriod.label}</div>
                <div style={{fontSize:12,color:C.muted,marginTop:2}}>
                  Du {fmt(currentPeriod.start)} → compilation le <strong>{fmt(currentPeriod.end)}</strong>
                </div>
              </div>
              <Pill color={urg.color} bg={urg.bg}>{urg.label}</Pill>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {upcomingEvents.map(ev=>{
                const days=daysLeft(ev.start);
                const u=urgencyStyle(days);
                const isToday=days===0;
                return(
                  <div key={ev.id} style={{background:C.surface,borderRadius:10,padding:"12px 16px",
                    border:`1.5px solid ${isToday?C.accent:C.border}`,
                    display:"flex",gap:14,alignItems:"center"}}>
                    {/* Date block */}
                    <div style={{minWidth:40,textAlign:"center",background:isToday?C.accent:C.bg,
                      borderRadius:8,padding:"6px 4px",border:`1px solid ${isToday?C.accent:C.border}`}}>
                      <div style={{fontSize:9,fontWeight:700,color:isToday?"#fff":C.muted,letterSpacing:.5,
                        textTransform:"uppercase",fontFamily:"monospace"}}>
                        {new Date(ev.start).toLocaleDateString("fr-FR",{weekday:"short"})}
                      </div>
                      <div style={{fontSize:20,fontWeight:800,color:isToday?"#fff":C.ink,lineHeight:1.1}}>
                        {new Date(ev.start).getDate()}
                      </div>
                      <div style={{fontSize:9,color:isToday?"#fff":C.muted,fontFamily:"monospace"}}>
                        {new Date(ev.start).toLocaleDateString("fr-FR",{month:"short"})}
                      </div>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:2}}>{ev.title}</div>
                      <div style={{fontSize:12,color:C.muted}}>{fmtTime(ev.start)} · {ev.location}</div>
                    </div>
                    <Pill color={u.color} bg={u.bg}>{u.label}</Pill>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SYNTHESE TAB */}
        {tab==="synthese"&&(
          <div>
            {/* Période summary */}
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,
              padding:"18px 20px",marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{fontWeight:800,fontSize:17,color:C.ink,marginBottom:4}}>{currentPeriod.label}</div>
                  <div style={{fontSize:13,color:C.muted}}>
                    {fmt(currentPeriod.start)} → {fmt(currentPeriod.end)}
                  </div>
                </div>
                <Pill color={urg.color} bg={urg.bg}>{urg.label}</Pill>
              </div>

              {/* Chapters breakdown */}
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
                {CHAPTERS.filter(c=>chapterCounts[c.id]).map(c=>(
                  <div key={c.id} style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:14}}>{c.emoji}</span>
                    <span style={{fontSize:13,color:C.muted,flex:1}}>{c.label}</span>
                    <div style={{height:6,flex:2,background:C.border,borderRadius:4,overflow:"hidden"}}>
                      <div style={{height:"100%",background:C.accent,borderRadius:4,
                        width:`${(chapterCounts[c.id]/periodNotes.length)*100}%`,transition:"width .4s"}}/>
                    </div>
                    <span style={{fontSize:12,color:C.muted,minWidth:20,textAlign:"right"}}>{chapterCounts[c.id]}</span>
                  </div>
                ))}
              </div>

              <Btn onClick={()=>setChatOpen(true)} variant="primary" style={{width:"100%",justifyContent:"center",display:"flex"}}>
                💬 Lancer le brainstorming & générer le rapport
              </Btn>
            </div>

            {/* Toutes les périodes */}
            <div style={{fontSize:12,color:C.muted,marginBottom:10,fontWeight:600,letterSpacing:.5,textTransform:"uppercase"}}>
              Calendrier des synthèses
            </div>
            {SYNTHESE_PERIODS.map(p=>{
              const days=daysLeft(p.end);
              const u=urgencyStyle(days);
              const isCurrent=p.id===currentPeriod.id;
              return(
                <div key={p.id} style={{background:isCurrent?C.accentLight:C.surface,
                  border:`1.5px solid ${isCurrent?C.accentBorder:C.border}`,
                  borderRadius:10,padding:"12px 16px",marginBottom:8,
                  display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontWeight:isCurrent?700:500,fontSize:14,color:isCurrent?C.accent:C.ink}}>
                      {isCurrent?"▶ ":""}{p.label}
                    </div>
                    <div style={{fontSize:12,color:C.muted,marginTop:2}}>
                      {fmt(p.start)} → {fmt(p.end)}
                    </div>
                  </div>
                  <Pill color={u.color} bg={u.bg}>{u.label}</Pill>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Capture Modal ── */}
      <Modal open={captureOpen} onClose={()=>setCaptureOpen(false)} title="📝 Nouvelle note">
        {/* Auto-assigned period badge */}
        <div style={{background:C.accentLight,border:`1px solid ${C.accentBorder}`,borderRadius:8,
          padding:"8px 12px",marginBottom:16,fontSize:12,color:C.accent,fontWeight:600}}>
          ⚡ Rattachée automatiquement à : <strong>{currentPeriod.label}</strong> · compilation le {fmt(currentPeriod.end)}
        </div>

        {/* Chapter selector */}
        <div style={{marginBottom:12}}>
          <label style={{fontSize:12,color:C.muted,display:"block",marginBottom:6,fontWeight:600}}>Chapitre</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {CHAPTERS.map(c=>(
              <button key={c.id} onClick={()=>setNoteChapter(c.id)} style={{
                fontSize:12,fontWeight:600,padding:"6px 12px",borderRadius:20,
                border:`1.5px solid ${noteChapter===c.id?C.accent:C.border}`,
                background:noteChapter===c.id?C.accent:C.bg,
                color:noteChapter===c.id?"#fff":C.muted,
                cursor:"pointer",fontFamily:"inherit",transition:"all .15s",
              }}>{c.emoji} {c.label}</button>
            ))}
          </div>
        </div>

        {/* Text input */}
        <textarea value={noteText} onChange={e=>setNoteText(e.target.value)} rows={4}
          placeholder="Ta note terrain…"
          autoFocus
          onKeyDown={e=>{if(e.metaKey&&e.key==="Enter")addNote();}}
          style={{...inputStyle,resize:"vertical",marginBottom:16,lineHeight:1.6}}/>

        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn onClick={()=>setCaptureOpen(false)}>Annuler</Btn>
          <Btn onClick={addNote} variant="primary">Enregistrer ⌘↵</Btn>
        </div>
      </Modal>

      {/* ── Voice Modal ── */}
      <Modal open={voiceOpen} onClose={()=>{voice.stop();setVoiceOpen(false);}} title="🎙 Dictée vocale">
        <div style={{textAlign:"center",padding:"12px 0"}}>
          <div style={{width:72,height:72,borderRadius:"50%",margin:"0 auto 16px",
            background:voice.listening?C.redLight:C.bg,
            border:`2px solid ${voice.listening?C.red:C.border}`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,
            transition:"all .3s",animation:voice.listening?"ripple 1.5s infinite":undefined}}>
            🎙
          </div>
          <p style={{fontWeight:700,color:voice.listening?C.red:C.muted,marginBottom:12}}>
            {voice.listening?"Parle maintenant…":"Traitement en cours…"}
          </p>
          {voice.transcript&&(
            <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,
              padding:"12px 16px",textAlign:"left",fontSize:14,lineHeight:1.65,marginBottom:16}}>
              {voice.transcript}
            </div>
          )}
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            {voice.listening
              ? <Btn onClick={voice.stop} variant="danger">⏹ Arrêter</Btn>
              : voice.transcript&&<>
                  <Btn onClick={()=>{voice.discard();setVoiceOpen(false);}}>✕ Annuler</Btn>
                  <Btn onClick={voice.confirm} variant="primary">✓ Confirmer</Btn>
                </>
            }
          </div>
        </div>
      </Modal>

      {/* ── Brainstorming Modal ── */}
      <Modal open={chatOpen} onClose={()=>setChatOpen(false)}
        title={`💬 Brainstorming — ${currentPeriod.label}`} wide={true}>
        <AIChat period={currentPeriod} notes={periodNotes}/>
      </Modal>

      <style>{`
        * { box-sizing: border-box; }
        @keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
        @keyframes ripple { 0%{box-shadow:0 0 0 0 rgba(192,57,43,.3)} 70%{box-shadow:0 0 0 12px rgba(192,57,43,0)} 100%{box-shadow:0 0 0 0 rgba(192,57,43,0)} }
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        @import url('https://fonts.cdnfonts.com/css/phenomena');
        ::-webkit-scrollbar-thumb{background:#d4c9b8;border-radius:4px}
        textarea:focus, input:focus, select:focus { border-color: ${C.accent} !important; }
        button:active { transform: scale(.97); }
      `}</style>
    </div>
  );
}