
/* ─── KNOWLEDGE BASE ─── */
const DB = {
  goa:{
    emoji:'🏖️',
    overview:"Goa is India's smallest state and its most popular beach destination. Blessed with golden sands, turquoise waters, and Portuguese colonial heritage, it offers a unique mix of relaxation and nightlife.",
    best_time:"October – March",weather:"Warm & sunny (Oct–Mar). Monsoon (Jun–Sep) sees heavy rains.",
    beaches:["Baga","Calangute","Palolem","Anjuna","Arambol","Vagator"],
    food:["Fish Curry Rice","Prawn Balchão","Goan Chorizo","Bebinca","Feni","Xacuti"],
    nearby:["Hampi (5 hrs)","Gokarna (3 hrs)","Pondicherry (8 hrs)","Mumbai (9 hrs)"],
    budget:{low:"₹8,000–₹15,000",mid:"₹15,000–₹30,000",lux:"₹30,000+"},
    transport:{air:"Dabolim / Mopa Airport — flights from all major cities",train:"Madgaon & Thivim stations on Konkan Railway",road:"NH-66 connects Goa to Mumbai & Mangalore. Buses available from Pune, Mumbai, Bengaluru"},
    hotels:{budget:["Zostel Goa (Palolem)","Jungle Inn","Agonda Beach Resort"],mid:["The Leela Cottages","Alila Diwa","Park Inn by Radisson"],lux:["Taj Exotica","The Leela Goa","Grand Hyatt Goa"]}
  },
  manali:{
    emoji:'🏔️',
    overview:"Manali is a high-altitude Himalayan resort in Himachal Pradesh, popular for adventure sports, snow-capped peaks, and verdant valleys along the Beas River.",
    best_time:"October–June (avoid monsoon Jul–Sep)",weather:"Cold winters (−15°C), pleasant summers (15–25°C)",
    attractions:["Solang Valley – snow & skiing","Rohtang Pass – scenic high-altitude pass","Hadimba Temple – ancient wood temple","Mall Road – shopping & cafes","Manu Temple","Jogini Waterfall","Beas Kund Trek"],
    food:["Siddu (local bread)","Dham (festive meal)","Trout Fish","Babru","Aktori"],
    nearby:["Kasol (80 km)","Kaza (202 km)","Dharamshala (248 km)","Shimla (270 km)"],
    budget:{low:"₹5,000–₹10,000",mid:"₹10,000–₹22,000",lux:"₹22,000+"},
    transport:{air:"Bhuntar Airport (50 km) – limited flights",train:"Chandigarh (310 km) or Kalka station, then bus/taxi",road:"Volvo buses from Delhi (14 hrs) via NH-3; drive via Shimla or Mandi"}
  },
  kashmir:{
    emoji:'🌷',
    overview:"Often called 'Paradise on Earth', Kashmir enchants with its shikara-dotted Dal Lake, Mughal gardens, saffron fields, and dramatic Himalayan scenery.",
    best_time:"March–October for sightseeing; December–February for snow",weather:"Spring (10–20°C), Summer (25°C), Autumn (5–20°C), Winter (−10°C)",
    attractions:["Dal Lake & Shikara ride","Gulmarg (ski resort)","Pahalgam (valley & trekking)","Sonamarg","Mughal Gardens (Shalimar Bagh)","Betaab Valley"],
    food:["Wazwan feast","Rogan Josh","Yakhni","Kahwa tea","Kashmiri Pulao","Phirni"],
    seasons:[{name:"Spring",months:"Mar–May",desc:"Tulip bloom, mild weather, Mughal Gardens"},{name:"Summer",months:"Jun–Aug",desc:"Trekking, Pahalgam, Betaab Valley"},{name:"Autumn",months:"Sep–Nov",desc:"Chinar gold, Saffron harvest in Pampore"},{name:"Winter",months:"Dec–Feb",desc:"Skiing at Gulmarg, snowfall in Srinagar"}]
  },
  jaipur:{
    emoji:'🏰',
    overview:"The Pink City of Rajasthan dazzles visitors with its magnificent Rajput palaces, mighty forts, vibrant bazaars, and warm desert hospitality.",
    best_time:"October–March",weather:"Hot summers (45°C), cool winters (5–25°C)",
    attractions:["Amber Fort","Hawa Mahal","City Palace","Jantar Mantar (UNESCO)","Nahargarh Fort","Birla Temple","Johari Bazaar"],
    food:["Dal Baati Churma","Ghewar","Laal Maas","Kachori","Mawa Kachori","Lassi"],
    nearby:["Pushkar (150 km)","Ajmer (135 km)","Ranthambore Tiger Reserve (180 km)","Udaipur (395 km)","Sariska (107 km)"]
  },
  hyderabad:{
    emoji:'🍛',
    overview:"City of Pearls and Nizams — Hyderabad blends a rich Deccan heritage with modern IT culture, famous worldwide for its biryani and Charminar.",
    best_time:"October–March",
    food:[{name:"Hyderabadi Biryani",desc:"Aromatic long-grain rice with spiced meat, slow-cooked (dum style)"},{name:"Haleem",desc:"Slow-cooked meat & lentil stew, especially popular during Ramadan"},{name:"Double Ka Meetha",desc:"Bread pudding soaked in saffron milk & rabri"},{name:"Qubani Ka Meetha",desc:"Sweet apricot dessert with cream"},{name:"Irani Chai",desc:"Strong tea served in traditional Irani cafes"},{name:"Lukhmi",desc:"Savoury fried pastry filled with minced meat"}],
    attractions:["Charminar","Golconda Fort","Ramoji Film City","Hussain Sagar Lake","Birla Mandir","Chowmahalla Palace"]
  },
  shimla:{
    emoji:'⛰️',
    overview:"India's former summer capital offers colonial architecture, toy train rides, pine forests, and panoramic Himalayan views.",
    best_time:"March–June & October–November",
    attractions:["The Ridge","Mall Road","Jakhu Temple","Kufri","Christ Church","Viceregal Lodge","Chadwick Falls"]
  },
  udaipur:{
    emoji:'🏛️',
    overview:"The City of Lakes — Udaipur's shimmering palaces, romantic lake views, and royal heritage make it one of India's most beautiful cities.",
    best_time:"September–March",
    attractions:["City Palace","Lake Pichola","Udai Sagar","Jag Mandir","Fateh Sagar","Saheliyon Ki Bari","Monsoon Palace"]
  },
  andaman:{
    emoji:'🌊',
    overview:"The Andaman Islands offer pristine coral reefs, crystal-clear waters, and untouched tropical beaches far from the mainland.",
    best_time:"October–May",
    attractions:["Radhanagar Beach (Havelock)","Neil Island","Cellular Jail","Elephant Beach","Barren Island Volcano","Scuba diving at North Bay"]
  }
};

const VISA = {
  thailand:{required:false,note:"Indians get Visa on Arrival (30 days) or e-Visa",docs:["Valid passport (6 months validity)","Return ticket","Proof of accommodation","USD 10,000 equivalent in cash"],time:"Visa on Arrival – instant; e-Visa – 3–5 working days"},
  dubai:{required:true,note:"Indians need a pre-approved visa",docs:["Passport copy","Photographs","Bank statement","Return ticket","Employer letter"],time:"3–5 working days; express in 24 hrs"},
  singapore:{required:true,note:"Indians must obtain a Singapore Tourist Visa",docs:["Passport","Photo","Bank statement","Travel itinerary","Hotel booking"],time:"3–5 working days"},
  usa:{required:true,note:"B1/B2 Tourist Visa required. Wait times are high.",docs:["DS-160 form","Appointment","Bank statements","Ties to India","Photo"],time:"Varies – interview required; can take months"},
  europe:{required:true,note:"Schengen Visa required for most European countries",docs:["Passport","Travel insurance","Accommodation proof","Bank statements","Itinerary"],time:"15 working days"}
};
