
/* ─── TIME HELPER ─── */
function now(){const d=new Date();const h=d.getHours();const m=String(d.getMinutes()).padStart(2,'0');return (h>12?h-12:h||12)+':'+m+' '+(h>=12?'PM':'AM')}

/* ─── MESSAGE HELPERS ─── */
function addMsg(html,isUser=false){
  const row=document.createElement('div');
  row.className='msg-row '+(isUser?'user':'bot');
  const av=document.createElement('div');
  av.className='avatar '+(isUser?'user-av':'bot-av');
  av.innerHTML=isUser?'<i class="fas fa-user"></i>':'<i class="fas fa-plane"></i>';
  const bw=document.createElement('div');
  bw.className='bubble-wrap';
  const b=document.createElement('div');
  b.className='bubble';b.innerHTML=html;
  const ts=document.createElement('div');
  ts.className='ts';ts.textContent=now();
  bw.appendChild(b);bw.appendChild(ts);
  row.appendChild(av);row.appendChild(bw);
  document.getElementById('messages').appendChild(row);
  document.getElementById('messages').scrollTop=99999;
}

function showTyping(){
  const row=document.createElement('div');
  row.className='msg-row bot';row.id='typing-ind';
  row.innerHTML='<div class="avatar bot-av"><i class="fas fa-plane"></i></div><div class="bubble-wrap"><div class="bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div></div>';
  document.getElementById('messages').appendChild(row);
  document.getElementById('messages').scrollTop=99999;
}
function removeTyping(){const e=document.getElementById('typing-ind');if(e)e.remove();}

/* ─── REPLY LOGIC ─── */
function getReply(raw){
  const q=raw.toLowerCase();

  /* VISA */
  if(q.includes('visa')){
    for(const[country,info] of Object.entries(VISA)){
      if(q.includes(country)){
        return `<div class="section-title"><i class="fas fa-passport"></i> Visa Info – ${country.charAt(0).toUpperCase()+country.slice(1)}</div>
        <div class="mini-card" style="margin-bottom:8px">
          <div class="mc-title">${info.required?'✅ Visa Required':'🟢 Visa on Arrival / Free'}</div>
          <div class="mc-sub">${info.note}</div>
        </div>
        <div class="section-title" style="font-size:12px;margin-top:10px">Documents Needed</div>
        <ul class="bullet-list">${info.docs.map(d=>`<li>${d}</li>`).join('')}</ul>
        <div class="badge badge-amber" style="margin-top:8px"><i class="fas fa-clock"></i> Processing: ${info.time}</div>`;
      }
    }
    return `<div class="section-title"><i class="fas fa-passport"></i> Visa Information</div>I can help with visa info for Thailand, Dubai, Singapore, USA, and Europe. Try: <em>"Do Indians need visa for Thailand?"</em>`;
  }

  /* BUDGET */
  const isBudget=q.includes('budget')||q.includes('cost')||q.includes('cheap')||q.includes('expensive')||q.includes('price')||q.includes('spend');
  if(isBudget){
    const dest=detectDest(q);
    const d=dest?DB[dest]:DB.goa;
    const name=dest?dest.charAt(0).toUpperCase()+dest.slice(1):'Goa';
    const b=d.budget||{low:'₹6K–₹12K',mid:'₹12K–₹25K',lux:'₹25K+'};
    return `<div class="section-title"><i class="fas fa-rupee-sign"></i> Budget Guide – ${d.emoji||''} ${name}</div>
    <div class="card-grid">
      <div class="mini-card"><div class="mc-title">🎒 Budget Trip</div><div class="mc-price-low">${b.low}</div><div class="mc-sub">Hostels, street food, local transport</div></div>
      <div class="mini-card"><div class="mc-title">🏨 Mid-Range</div><div class="mc-price-mid">${b.mid}</div><div class="mc-sub">3-star hotel, restaurants, cabs</div></div>
      <div class="mini-card"><div class="mc-title">✨ Luxury</div><div class="mc-price-lux">${b.lux}</div><div class="mc-sub">Resorts, fine dining, private transfers</div></div>
      <div class="mini-card"><div class="mc-title">📋 Includes</div><div class="mc-sub">Stay · Food · Transport · Activities · Sightseeing</div></div>
    </div>`;
  }

  /* TRIP PLAN / ITINERARY */
  if(q.includes('plan')||q.includes('itinerary')||q.includes('day')){
    if(q.includes('goa')||(!q.includes('manali')&&!q.includes('kashmir')&&!q.includes('jaipur'))){
      return `<div class="section-title"><i class="fas fa-calendar-alt"></i> 4-Day Goa Itinerary</div>
      <div class="day-grid">
        <div class="day-card"><div class="day-label">Day 1</div><div class="day-detail">Arrive → Baga Beach → Sunset at Vagator → Tito's Lane nightlife</div></div>
        <div class="day-card"><div class="day-label">Day 2</div><div class="day-detail">Fort Aguada → Basilica of Bom Jesus → Old Goa churches → Panjim market</div></div>
        <div class="day-card"><div class="day-label">Day 3</div><div class="day-detail">Water sports at Calangute → Scuba at Grand Island → Shack dinner at Palolem</div></div>
        <div class="day-card"><div class="day-label">Day 4</div><div class="day-detail">Mapusa Flea Market → Spice Plantation tour → Local Feni tasting → Depart</div></div>
      </div>`;
    }
    if(q.includes('manali')){
      return `<div class="section-title"><i class="fas fa-calendar-alt"></i> 4-Day Manali Itinerary</div>
      <div class="day-grid">
        <div class="day-card"><div class="day-label">Day 1</div><div class="day-detail">Arrive → Mall Road → Hadimba Temple → Old Manali cafes</div></div>
        <div class="day-card"><div class="day-label">Day 2</div><div class="day-detail">Solang Valley → Atal Tunnel → Sissu waterfall</div></div>
        <div class="day-card"><div class="day-label">Day 3</div><div class="day-detail">Rohtang Pass excursion (permit needed) → snow activities</div></div>
        <div class="day-card"><div class="day-label">Day 4</div><div class="day-detail">Beas Kund trek / Jogini Waterfall → local Siddu breakfast → Depart</div></div>
      </div>`;
    }
  }

  /* HOTEL */
  if(q.includes('hotel')||q.includes('stay')||q.includes('resort')||q.includes('accommodation')){
    const dest=detectDest(q)||'goa';
    const d=DB[dest];
    const name=dest.charAt(0).toUpperCase()+dest.slice(1);
    if(d?.hotels){
      return `<div class="section-title"><i class="fas fa-hotel"></i> Hotels in ${d.emoji} ${name}</div>
      <div class="card-grid">
        <div class="mini-card"><div class="mc-title">🎒 Budget</div>${d.hotels.budget.map(h=>`<div class="mc-sub">• ${h}</div>`).join('')}</div>
        <div class="mini-card"><div class="mc-title">🏨 Mid-Range</div>${d.hotels.mid.map(h=>`<div class="mc-sub">• ${h}</div>`).join('')}</div>
        <div class="mini-card" style="grid-column:span 2"><div class="mc-title">✨ Luxury</div>${d.hotels.lux.map(h=>`<div class="mc-sub">• ${h}</div>`).join('')}</div>
      </div>`;
    }
    return `<div class="section-title"><i class="fas fa-hotel"></i> Hotels in ${name}</div>You'll find options from budget guesthouses to luxury resorts. For ${name}, mid-range hotels typically cost ₹2,000–₹6,000/night, while luxury can go ₹10,000+. Platforms like MakeMyTrip or Booking.com offer real-time rates and reviews.`;
  }

  /* TRANSPORT */
  if(q.includes('reach')||q.includes('how to go')||q.includes('transport')||q.includes('flight')||q.includes('train')||q.includes('bus')){
    const dest=detectDest(q)||'goa';
    const d=DB[dest];
    const name=dest.charAt(0).toUpperCase()+dest.slice(1);
    if(d?.transport){
      return `<div class="section-title"><i class="fas fa-route"></i> How to Reach ${d.emoji} ${name}</div>
      <div class="card-grid">
        <div class="mini-card"><div class="mc-title">✈️ By Air</div><div class="mc-sub">${d.transport.air}</div></div>
        <div class="mini-card"><div class="mc-title">🚂 By Train</div><div class="mc-sub">${d.transport.train}</div></div>
        <div class="mini-card" style="grid-column:span 2"><div class="mc-title">🚌 By Road</div><div class="mc-sub">${d.transport.road}</div></div>
      </div>`;
    }
    return `I can give transport info for Goa and Manali in detail. Which destination are you planning to travel to?`;
  }

  /* PACKING */
  if(q.includes('pack')||q.includes('carry')||q.includes('bring')){
    const isWinter=q.includes('winter')||q.includes('cold')||q.includes('snow');
    const isBeach=q.includes('beach')||q.includes('goa');
    if(isWinter||q.includes('manali')||q.includes('kashmir')){
      return `<div class="section-title"><i class="fas fa-backpack"></i> Packing List – Winter / Mountains</div>
      <ul class="bullet-list">
        <li>Heavy winter jacket & thermal inner wear</li><li>Gloves, woollen socks & monkey cap</li>
        <li>Waterproof trekking boots</li><li>Sunglasses (UV protection)</li>
        <li>Sunscreen SPF 50+ (high altitude burns)</li><li>Personal medicines & first-aid kit</li>
        <li>Power bank & extra camera batteries (cold drains fast)</li>
        <li>Rain cover for backpack & poncho</li><li>Govt. ID cards (mandatory in certain areas)</li>
      </ul>`;
    }
    if(isBeach){
      return `<div class="section-title"><i class="fas fa-backpack"></i> Packing List – Beach / Goa</div>
      <ul class="bullet-list">
        <li>Light cottons, shorts & flip-flops</li><li>Swimwear & beach cover-up</li>
        <li>Sunscreen SPF 50+, after-sun lotion</li><li>Sunglasses & wide-brim hat</li>
        <li>Waterproof bag / dry bag for the beach</li><li>Insect repellent</li>
        <li>Camera / GoPro for water shots</li><li>Medications & basic first aid</li>
      </ul>`;
    }
    return `<div class="section-title"><i class="fas fa-backpack"></i> General Travel Packing List</div>
    <ul class="bullet-list">
      <li>Valid ID proof & photocopies</li><li>Cash + card (ATM cards mostly work)</li>
      <li>Medicines & basic first aid</li><li>Phone charger & power bank</li>
      <li>Change of clothes for all weather</li><li>Toiletries & personal hygiene items</li>
    </ul>`;
  }

  /* EMERGENCY */
  if(q.includes('passport')||q.includes('lost')||q.includes('emergency')||q.includes('stolen')){
    return `<div class="section-title" style="color:#e74c3c"><i class="fas fa-exclamation-triangle"></i> Emergency Travel Tips</div>
    <div class="alert-card">
      <div class="alert-title"><i class="fas fa-id-card"></i> If You Lose Your Passport</div>
      <ol class="ol-list">
        <li>Stay calm — go to the nearest police station</li>
        <li>File an FIR immediately & get a copy</li>
        <li>Contact your country's embassy / consulate</li>
        <li>Apply for an Emergency Travel Certificate (ETC)</li>
        <li>Inform your hotel & travel insurance company</li>
      </ol>
    </div>
    <div style="margin-top:10px"><strong style="font-size:12px">Prevention Tips:</strong>
    <ul class="bullet-list">
      <li>Always carry digital copies of your passport</li>
      <li>Store backup photos on Google Drive / email</li>
      <li>Keep photocopies in a separate bag</li>
    </ul></div>`;
  }

  /* FOOD */
  if(q.includes('food')||q.includes('eat')||q.includes('cuisine')||q.includes('dish')){
    const dest=detectDest(q);
    if(dest&&DB[dest]){
      const d=DB[dest];
      const name=dest.charAt(0).toUpperCase()+dest.slice(1);
      const foods=d.food;
      if(!foods)return `I don't have a specific food guide for ${name} yet, but I can tell you about Goa, Manali, Kashmir, Jaipur, and Hyderabad food!`;
      if(Array.isArray(foods)&&typeof foods[0]==='object'){
        return `<div class="section-title"><i class="fas fa-utensils"></i> Famous Food in ${d.emoji} ${name}</div>
        <div class="card-grid">${foods.map(f=>`<div class="mini-card"><div class="mc-title">${f.name}</div><div class="mc-sub">${f.desc}</div></div>`).join('')}</div>`;
      }
      return `<div class="section-title"><i class="fas fa-utensils"></i> Famous Food in ${d.emoji} ${name}</div>
      <ul class="bullet-list">${foods.map(f=>`<li>${f}</li>`).join('')}</ul>`;
    }
  }

  /* ATTRACTIONS */
  if(q.includes('attract')||q.includes('places')||q.includes('sightseeing')||q.includes('visit')||q.includes('top')){
    const dest=detectDest(q);
    if(dest&&DB[dest]?.attractions){
      const d=DB[dest];const name=dest.charAt(0).toUpperCase()+dest.slice(1);
      return `<div class="section-title"><i class="fas fa-map-pin"></i> Top Attractions – ${d.emoji} ${name}</div>
      <div class="card-grid">${d.attractions.map(a=>`<div class="mini-card"><div class="mc-title">${a.split(' – ')[0]}</div><div class="mc-sub">${a.split(' – ')[1]||''}</div></div>`).join('')}</div>`;
    }
  }

  /* NEARBY */
  if(q.includes('nearby')||q.includes('near')||q.includes('around')){
    const dest=detectDest(q);
    if(dest&&DB[dest]?.nearby){
      const d=DB[dest];const name=dest.charAt(0).toUpperCase()+dest.slice(1);
      return `<div class="section-title"><i class="fas fa-compass"></i> Places Near ${d.emoji} ${name}</div>
      <ul class="bullet-list">${d.nearby.map(n=>`<li>${n}</li>`).join('')}</ul>`;
    }
  }

  /* WHEN TO VISIT / BEST TIME */
  if(q.includes('when')||q.includes('best time')||q.includes('season')){
    const dest=detectDest(q);
    if(dest==='kashmir'){
      return `<div class="section-title"><i class="fas fa-calendar-check"></i> Best Time to Visit Kashmir 🌷</div>
      <div class="card-grid">${DB.kashmir.seasons.map(s=>`<div class="mini-card"><div class="mc-title">${s.name} (${s.months})</div><div class="mc-sub">${s.desc}</div></div>`).join('')}</div>`;
    }
    if(dest&&DB[dest]){
      const d=DB[dest];const name=dest.charAt(0).toUpperCase()+dest.slice(1);
      return `<div class="section-title"><i class="fas fa-calendar-check"></i> Best Time to Visit ${d.emoji} ${name}</div>
      <div class="mini-card">
        <div class="mc-title">Recommended Season</div>
        <div class="mc-sub" style="color:var(--blue);font-weight:600">${d.best_time}</div>
        <div class="mc-sub" style="margin-top:6px">${d.weather}</div>
      </div>`;
    }
  }

  /* CATEGORY: BEACH */
  if(q.includes('beach')){
    return `<div class="section-title"><i class="fas fa-umbrella-beach"></i> Top Beach Destinations in India</div>
    <div class="card-grid">
      <div class="mini-card"><div class="mc-title">🏖️ Goa</div><div class="mc-sub">Baga, Palolem, Anjuna — party & serenity</div></div>
      <div class="mini-card"><div class="mc-title">🌊 Andaman</div><div class="mc-sub">Radhanagar Beach, coral reefs, pristine water</div></div>
      <div class="mini-card"><div class="mc-title">🌿 Gokarna</div><div class="mc-sub">Peaceful, offbeat — Om Beach & Kudle Beach</div></div>
      <div class="mini-card"><div class="mc-title">🥐 Pondicherry</div><div class="mc-sub">French colonial charm + Promenade Beach</div></div>
      <div class="mini-card" style="grid-column:span 2"><div class="mc-title">🌴 Varkala (Kerala)</div><div class="mc-sub">Stunning cliffside beaches + Ayurvedic retreats</div></div>
    </div>`;
  }

  /* CATEGORY: SNOW */
  if(q.includes('snow')||q.includes('skiing')||q.includes('ski')){
    return `<div class="section-title"><i class="fas fa-snowflake"></i> Top Snow Destinations in India</div>
    <div class="card-grid">
      <div class="mini-card"><div class="mc-title">⛷️ Gulmarg</div><div class="mc-sub">Best ski resort, gondola ride, 3–4 m snow</div></div>
      <div class="mini-card"><div class="mc-title">🏔️ Manali</div><div class="mc-sub">Solang Valley, Rohtang Pass, snow sports</div></div>
      <div class="mini-card"><div class="mc-title">🎿 Auli</div><div class="mc-sub">Uttarakhand's skiing paradise, Himalayan views</div></div>
      <div class="mini-card"><div class="mc-title">⛰️ Shimla</div><div class="mc-sub">Colonial hill station, snowfall in Jan–Feb</div></div>
      <div class="mini-card" style="grid-column:span 2"><div class="mc-title">🌨️ Tawang (Arunachal)</div><div class="mc-sub">Remote, breathtaking, pristine snowscapes</div></div>
    </div>`;
  }

  /* CATEGORY: SUMMER */
  if(q.includes('summer')){
    return `<div class="section-title"><i class="fas fa-sun"></i> Best Places to Visit in Summer</div>
    <ul class="bullet-list">
      <li>Manali – escape heat in the Himalayas (15–25°C)</li>
      <li>Shimla – colonial charm at 2,200 m altitude</li>
      <li>Ooty (Tamil Nadu) – Nilgiris hills & tea gardens</li>
      <li>Munnar (Kerala) – lush green tea estates</li>
      <li>Coorg (Karnataka) – coffee estates & waterfalls</li>
      <li>Spiti Valley – high-altitude cold desert</li>
    </ul>`;
  }

  /* CATEGORY: WINTER */
  if(q.includes('winter')){
    return `<div class="section-title"><i class="fas fa-snowflake"></i> Best Places in Winter</div>
    <ul class="bullet-list">
      <li>Gulmarg – snowfall & skiing (Dec–Feb)</li>
      <li>Auli – Himalayan ski slopes, Uttarakhand</li>
      <li>Goa – peak tourist season, perfect weather</li>
      <li>Rajasthan – Jaipur, Udaipur, Jaisalmer desert</li>
      <li>Andaman – clear skies, perfect for beaches & diving</li>
    </ul>`;
  }

  /* DESTINATION OVERVIEW */
  for(const [key,d] of Object.entries(DB)){
    if(q.includes(key)){
      const name=key.charAt(0).toUpperCase()+key.slice(1);
      const foods=d.food?`<div style="margin-top:8px"><strong style="font-size:12px;color:var(--text-muted)">Famous Food</strong><br/>${(Array.isArray(d.food)?d.food.map(f=>typeof f==='object'?f.name:f):[]).map(f=>`<span class="badge badge-amber">${f}</span>`).join('')}</div>`:'';
      const att=d.attractions?`<div style="margin-top:8px"><strong style="font-size:12px;color:var(--text-muted)">Top Attractions</strong><br/>${d.attractions.slice(0,4).map(a=>`<span class="badge badge-blue">${a.split(' – ')[0]}</span>`).join('')}</div>`:'';
      return `<div class="section-title"><i class="fas fa-map-marked-alt"></i> ${d.emoji||''} ${name} Overview</div>
      <p style="font-size:13.5px;line-height:1.65;margin-bottom:10px">${d.overview}</p>
      <span class="badge badge-green"><i class="fas fa-calendar-check"></i> Best time: ${d.best_time||'Oct–Mar'}</span>
      ${att}${foods}`;
    }
  }

  /* GREET */
  if(q.includes('hello')||q.includes('hi')||q.includes('hey')||q.includes('namaste')){
    return `Namaste! 🙏 I'm TravelEase, your AI travel companion for India. I can help you with:<br/><br/>
    🗺️ Destination guides · 💰 Budget estimates · 🗓️ Trip itineraries<br/>
    🍛 Food guides · 🏨 Hotel recommendations · ❄️ Packing lists<br/><br/>
    Where would you like to explore today?`;
  }

  return `I'd love to help you plan your trip! 😊 Try asking me about:<br/><br/>
  • A specific destination (Goa, Manali, Kashmir, Jaipur, Hyderabad…)<br/>
  • Budget for a trip<br/>
  • Best time to visit a place<br/>
  • Top attractions or food guide<br/>
  • Visa requirements for a country<br/><br/>
  <em>Tip: Use the quick chips below or click a category in the sidebar!</em>`;
}

function detectDest(q){
  const dests=Object.keys(DB);
  for(const d of dests){if(q.includes(d))return d;}
  return null;
}

/* ─── SEND ─── */
function handleSend(){
  const v=document.getElementById('inp').value.trim();
  if(!v)return;
  if(quizState!==null){handleQuizInput(v);return;}
  addMsg(v,true);
  document.getElementById('inp').value='';
  showTyping();
  setTimeout(()=>{removeTyping();addMsg(getReply(v));},700+Math.random()*400);
}

function sendChip(text){
  if(quizState!==null){quizState=null;}
  addMsg(text,true);showTyping();
  setTimeout(()=>{removeTyping();addMsg(getReply(text));},700+Math.random()*300);
}

document.getElementById('inp').addEventListener('keydown',e=>{if(e.key==='Enter')handleSend();});

/* ─── QUIZ ─── */
function startQuiz(){
  quizState={step:0,answers:{}};
  addMsg('Sure! Let me ask you a few quick questions to find your perfect destination. 🎯',false);
  setTimeout(()=>showQuizQuestion(),400);
}

function showQuizQuestion(){
  const step=quizFlow[quizState.step];
  const html=`<div class="quiz-card">
    <div class="quiz-q">Q${quizState.step+1}/4: ${step.q}</div>
    <div class="quiz-opts">${step.opts.map(o=>`<button class="quiz-opt" onclick="pickQuizOpt(this,'${o}')">${o}</button>`).join('')}</div>
  </div>`;
  addMsg(html,false);
}

function pickQuizOpt(btn,val){
  document.querySelectorAll('.quiz-opt').forEach(b=>b.disabled=true);
  btn.classList.add('selected');
  quizState.answers[quizFlow[quizState.step].key]=val;
  quizState.step++;
  if(quizState.step<quizFlow.length){setTimeout(()=>showQuizQuestion(),500);}
  else{setTimeout(()=>showQuizResult(),600);}
}

function handleQuizInput(v){quizState=null;addMsg(v,true);showTyping();setTimeout(()=>{removeTyping();addMsg(getReply(v));},700);}

function showQuizResult(){
  const a=quizState.answers;quizState=null;
  let dest='Goa',reason='A perfect blend of beaches, budget-friendliness, and vibrant culture.';
  if(a.type==='Mountains'){dest='Manali';reason='Himalayan mountains, adventure sports & scenic valleys match your preferences.';}
  else if(a.type==='Heritage / Culture'){dest='Jaipur';reason='The Pink City\'s rich Rajput heritage, forts & cuisine suits a cultural traveller.';}
  else if(a.type==='Wildlife'){dest='Ranthambore';reason='Jim Corbett or Ranthambore Tiger Reserve for wildlife enthusiasts!';}
  if(a.budget==='Luxury (₹30K+)'&&a.type==='Beaches'){dest='Andaman';reason='Pristine luxury beach experience with crystal waters & coral reefs.';}
  if(a.mood==='Romantic'){dest='Udaipur';reason='The City of Lakes — romance, palaces & candle-lit lake dinners await.';}
  addMsg(`<div class="dest-result-card">
    <div style="font-size:12px;opacity:.8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">🎯 Your Perfect Destination</div>
    <div class="dest-name">${dest.toUpperCase()}</div>
    <div class="dest-reason">${reason}</div>
    <button class="quick-btn" style="margin-top:12px;font-size:12px" onclick="sendChip('Tell me about ${dest}')">Tell me more about ${dest} →</button>
  </div>`,false);
}

/* ─── CLEAR ─── */
function clearChat(){
  document.getElementById('messages').innerHTML='';quizState=null;
  showWelcome();
}

/* ─── SIDEBAR ─── */
function sbClick(el,prompt){
  document.querySelectorAll('.sb-item').forEach(x=>x.classList.remove('active'));
  el.classList.add('active');closeSidebar();sendChip(prompt);
}
function openSidebar(){document.getElementById('sidebar').classList.add('open');document.getElementById('overlay').classList.remove('hidden');}
function closeSidebar(){document.getElementById('sidebar').classList.remove('open');document.getElementById('overlay').classList.add('hidden');}

/* ─── WELCOME ─── */
function showWelcome(){
  const html=`<div class="welcome-banner">
    <div class="welcome-title">✈️ Welcome to TravelEase!</div>
    <div class="welcome-sub">Your intelligent AI travel companion for incredible India. Ask me about destinations, budgets, itineraries, food, hotels, visas, packing tips, and more.</div>
    <div class="quick-btns">
      <button class="quick-btn" onclick="sendChip('Tell me about Goa')">🏖️ Goa</button>
      <button class="quick-btn" onclick="sendChip('Tell me about Manali')">🏔️ Manali</button>
      <button class="quick-btn" onclick="sendChip('Tell me about Kashmir')">🌷 Kashmir</button>
      <button class="quick-btn" onclick="sendChip('Tell me about Jaipur')">🏰 Jaipur</button>
      <button class="quick-btn" onclick="startQuiz()">🎯 Take Travel Quiz</button>
    </div>
  </div>`;
  addMsg(html,false);
}

showWelcome();
