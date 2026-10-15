export interface WasteItem {
  id: string;
  name: string;
  category: 'wet_organic' | 'dry_recyclable' | 'hazardous' | 'e_waste' | 'sanitary_residual';
  categoryLabel: string;
  binColor: string;
  binBgColor: string;
  aliases: string[];
  description: string;
  whyThisBin: string;
  preparationSteps: string[];
  canBeRecycled: boolean;
  canBeReused: boolean;
  reuseIdeas?: string[];
  safetyPrecautions: string[];
  decompositionTime: string;
  carbonImpact: string;
  localConfirmationRequired: boolean;
  localDisclaimer: string;
  sampleImageUrl?: string;
}

export const WASTE_CATEGORIES = {
  wet_organic: {
    label: 'Wet / Organic Waste',
    binName: 'Green Bin',
    color: '#15803d',
    bgColor: '#dcfce7',
    borderColor: '#86efac',
    icon: 'Apple',
    description: 'Biodegradable kitchen food scraps, plant cuttings, and organic matter that breaks down into rich compost.',
  },
  dry_recyclable: {
    label: 'Dry / Recyclable Waste',
    binName: 'Blue Bin',
    color: '#0284c7',
    bgColor: '#e0f2fe',
    borderColor: '#7dd3fc',
    icon: 'Recycle',
    description: 'Clean paper, cardboard, plastics, metals, and glass containers that can be processed into new materials.',
  },
  hazardous: {
    label: 'Hazardous Waste',
    binName: 'Red / Yellow Bin',
    color: '#dc2626',
    bgColor: '#fee2e2',
    borderColor: '#fca5a5',
    icon: 'AlertTriangle',
    description: 'Toxic, flammable, corrosive, or biohazard items requiring specialized disposal to prevent poison in water/soil.',
  },
  e_waste: {
    label: 'Electronic Waste (E-Waste)',
    binName: 'Grey / Orange Bin',
    color: '#475569',
    bgColor: '#f1f5f9',
    borderColor: '#cbd5e1',
    icon: 'Cpu',
    description: 'Discarded electronics, circuit boards, batteries, and cables containing recoverable precious metals and heavy toxins.',
  },
  sanitary_residual: {
    label: 'Sanitary / Residual Waste',
    binName: 'Black Bin',
    color: '#334155',
    bgColor: '#f8fafc',
    borderColor: '#e2e8f0',
    icon: 'Trash2',
    description: 'Non-recyclable, soiled, or contaminated items destined for scientific sanitary landfill or waste-to-energy incineration.',
  },
} as const;

export const WASTE_DATASET: WasteItem[] = [
  {
    id: 'banana-peel',
    name: 'Banana Peel',
    category: 'wet_organic',
    categoryLabel: 'Wet / Organic Waste',
    binColor: '#15803d',
    binBgColor: '#dcfce7',
    aliases: ['banana skin', 'kela chilka', 'fruit peel', 'fruit skin'],
    description: 'Organic fruit residue high in potassium, phosphorus, and moisture.',
    whyThisBin: 'Decomposes rapidly in aerobic composting conditions into nutrient-dense organic humus without producing methane when properly aerated. If trapped in anaerobic landfills, organic matter emits potent methane gas.',
    preparationSteps: [
      'Remove any non-biodegradable price stickers or tags.',
      'Chop into smaller pieces to accelerate microbial decomposition in compost pits.',
      'Do not wrap in plastic polybags before putting in the organic bin.'
    ],
    canBeRecycled: false,
    canBeReused: true,
    reuseIdeas: [
      'Steep in water for 48 hours to create potassium-rich organic fertilizer tea for houseplants.',
      'Rub interior peel on leather shoes or houseplant leaves to restore shine naturally.'
    ],
    safetyPrecautions: ['Slip hazard if dropped on walkways.'],
    decompositionTime: '2 to 4 weeks (compost)',
    carbonImpact: 'Prevents 0.8 kg CO2e methane emissions per kg diverted from landfill',
    localConfirmationRequired: false,
    localDisclaimer: 'Universally accepted in municipal green bins and campus vermicompost units.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'used-battery',
    name: 'Used Alkaline / Lithium Battery',
    category: 'hazardous',
    categoryLabel: 'Hazardous Waste',
    binColor: '#dc2626',
    binBgColor: '#fee2e2',
    aliases: ['aa battery', 'aaa battery', 'lithium ion', 'phone battery', 'torch cell', 'duracell', 'dry cell'],
    description: 'Chemical electrochemical cell containing heavy metals, electrolytes, and corrosive active compounds.',
    whyThisBin: 'Never place in regular trash or standard recycling! When compressed or punctured in garbage compactor trucks or sorting conveyor belts, lithium batteries rupture and ignite catastrophic facility fires. Heavy metals like lead, cadmium, and nickel can also leach into groundwater.',
    preparationSteps: [
      'Tape both positive (+) and negative (-) terminals with clear cellophane or electrical tape to prevent short-circuit sparks.',
      'Store in a non-conductive dry container (cardboard or plastic box) away from heat.',
      'Do not attempt to puncture, crush, or open battery casing.'
    ],
    canBeRecycled: true,
    canBeReused: false,
    reuseIdeas: ['Rechargeable batteries should be tested with a digital multimeter before discarding; many hold charge.'],
    safetyPrecautions: [
      'Severe fire and explosion hazard if terminals bridge metal objects.',
      'Corrosive liquid hazard if cell is swollen or leaking.'
    ],
    decompositionTime: '100+ years (never fully degrades, leaches toxins)',
    carbonImpact: 'Recycling 1 ton of lithium batteries recovers 200 kg of critical lithium, cobalt, and nickel.',
    localConfirmationRequired: true,
    localDisclaimer: 'Check your campus e-waste collection kiosk or authorized municipal drop-off depot.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'plastic-water-bottle',
    name: 'PET Plastic Water Bottle',
    category: 'dry_recyclable',
    categoryLabel: 'Dry / Recyclable Waste',
    binColor: '#0284c7',
    binBgColor: '#e0f2fe',
    aliases: ['pet bottle', 'bisleri', 'soda bottle', 'mineral water bottle', 'cold drink bottle'],
    description: 'Polyethylene Terephthalate (Resin Identification Code #1) transparent container.',
    whyThisBin: 'PET plastic is highly recyclable and in high demand for re-spinning into recycled polyester (rPET) textile fibers, strapping, and food-grade rPET bottles, reducing virgin crude petroleum extraction.',
    preparationSteps: [
      'Empty all residual liquid completely.',
      'Quick rinse with greywater if sticky with juice or soda.',
      'Crush flat to conserve bin volume and collection truck space.',
      'Screw cap back on (caps are typically HDPE #2 and are separated in flotation tanks at the MRF).'
    ],
    canBeRecycled: true,
    canBeReused: true,
    reuseIdeas: [
      'Cut in half to create seedling starter pots or self-watering drip irrigators for balcony gardens.',
      'Make a fun DIY bird feeder.'
    ],
    safetyPrecautions: ['Do not burn plastic; burning releases toxic dioxins, furans, and black carbon.'],
    decompositionTime: '450 years in landfill',
    carbonImpact: 'Saves 1.5 kg CO2e and 70% energy compared to manufacturing virgin PET plastic.',
    localConfirmationRequired: false,
    localDisclaimer: 'Accepted in all municipal blue bins and campus plastic recovery stations.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'corrugated-cardboard',
    name: 'Corrugated Cardboard Box',
    category: 'dry_recyclable',
    categoryLabel: 'Dry / Recyclable Waste',
    binColor: '#0284c7',
    binBgColor: '#e0f2fe',
    aliases: ['amazon box', 'shipping box', 'carton', 'packaging box', 'brown box'],
    description: 'Multi-layer fluted cellulose fiber packaging.',
    whyThisBin: 'Cardboard fibers can be re-pulped and remanufactured up to 5 to 7 times before the cellulose strands become too short, significantly reducing deforestation and water consumption.',
    preparationSteps: [
      'Remove excess packing tape, shipping pouches, plastic bubble wrap, and thermocol peanuts.',
      'Flatten all boxes completely to maximize bin and transport capacity.',
      'Keep dry! Soiled or wet cardboard weakens fibers and can trigger mold in recycling bales.'
    ],
    canBeRecycled: true,
    canBeReused: true,
    reuseIdeas: [
      'Use for moving, campus storage, or sheet mulch weed barriers in permaculture gardening.',
      'Use as pet scratchers or craft prototyping.'
    ],
    safetyPrecautions: ['Ensure no metal staples or sharp staples are exposed.'],
    decompositionTime: '2 to 3 months (if unlaminated and kept moist)',
    carbonImpact: 'Recycling 1 ton of cardboard saves 17 trees, 7,000 gallons of water, and 4,000 kWh of electricity.',
    localConfirmationRequired: false,
    localDisclaimer: 'Clean, dry cardboard is accepted everywhere in dry recycling streams.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'broken-smartphone',
    name: 'Broken Smartphone / Mobile Device',
    category: 'e_waste',
    categoryLabel: 'Electronic Waste (E-Waste)',
    binColor: '#475569',
    binBgColor: '#f1f5f9',
    aliases: ['old phone', 'cell phone', 'iphone', 'android phone', 'cracked phone', 'dead mobile'],
    description: 'Complex electronics containing semiconductors, display, rare earth magnets, and circuit boards.',
    whyThisBin: 'Electronics harbor valuable recoverable elements including gold, silver, copper, palladium, and neodymium, alongside toxic flame retardants, arsenic, and lead. Certified e-waste recyclers shred and refine these in controlled closed-loop smelters.',
    preparationSteps: [
      'Perform a factory reset to wipe all personal data and remove SIM/SD cards.',
      'If the screen or battery is cracked/swollen, seal inside a zip-lock pouch.',
      'Hand over directly to an authorized e-waste recycler or campus collection drive.'
    ],
    canBeRecycled: true,
    canBeReused: true,
    reuseIdeas: [
      'Repurpose as a dedicated security camera (using apps like Alfred), smart alarm clock, or audio streaming hub.',
      'Trade in at refurbishing centers for cash back or store credit.'
    ],
    safetyPrecautions: ['Damaged lithium pouch batteries can catch fire if bent.'],
    decompositionTime: '1,000+ years for composite glass and metals',
    carbonImpact: 'Urban mining: 1 ton of smartphones contains 100x more gold than 1 ton of raw gold ore.',
    localConfirmationRequired: true,
    localDisclaimer: 'Requires certified R2 or e-Stewards authorized e-waste dismantler; do not give to informal burn yards.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'vegetable-scraps',
    name: 'Vegetable Scraps & Trimmings',
    category: 'wet_organic',
    categoryLabel: 'Wet / Organic Waste',
    binColor: '#15803d',
    binBgColor: '#dcfce7',
    aliases: ['potato peel', 'carrot tops', 'onion skins', 'sabzi waste', 'kitchen scraps'],
    description: 'Raw kitchen vegetable cut-offs, stems, and peelings.',
    whyThisBin: 'Vegetables have high nitrogen ("greens") and water content, acting as essential fuel for compost micro-organisms and earthworms in vermiculture.',
    preparationSteps: [
      'Drain excess liquid before dropping into indoor bin.',
      'Keep free from plastic twist-ties, rubber bands, and stickers.'
    ],
    canBeRecycled: false,
    canBeReused: true,
    reuseIdeas: [
      'Store onion, celery, and carrot trimmings in a freezer bag; boil when full to make rich homemade vegetable broth!',
      'Regrow celery bases, green onions, and romaine hearts in a dish of water.'
    ],
    safetyPrecautions: ['Store in closed bin with carbon filter to deter fruit flies.'],
    decompositionTime: '1 to 3 weeks in compost',
    carbonImpact: 'Diverting organic waste prevents anaerobic methane generation in landfills.',
    localConfirmationRequired: false,
    localDisclaimer: 'Accepted across all residential green bins and compost initiatives.'
  },
  {
    id: 'greasy-pizza-box',
    name: 'Greasy Pizza Box (Food Soiled)',
    category: 'wet_organic',
    categoryLabel: 'Wet / Organic Waste (or Residual)',
    binColor: '#15803d',
    binBgColor: '#dcfce7',
    aliases: ['pizza carton', 'oily cardboard', 'food stained box'],
    description: 'Cardboard carton soaked with cheese oils, tomato sauce, and food grease.',
    whyThisBin: 'THE #1 RECYCLING TRAP! Food oil and melted cheese coat cellulose paper fibers with grease. In paper recycling, fibers are mixed with water; oil cannot separate from the pulp, causing oil spots that ruin an entire batch of new paper. Tainted portions must be composted (if facilities permit) or placed in residual trash.',
    preparationSteps: [
      'Tear off the clean cardboard lid: put the CLEAN LID in the Blue Recyclable Bin.',
      'Put the heavily GREASY BOTTOM in the Green Organic Bin (if municipal composting accepts food-soiled paper) or Black Residual Bin.',
      'Never put grease-soaked cardboard in dry paper recycling.'
    ],
    canBeRecycled: false,
    canBeReused: false,
    safetyPrecautions: ['Do not leave unclosed indoors; attracts rodents and pests.'],
    decompositionTime: '2 to 3 months (in commercial composting)',
    carbonImpact: 'Prevents batch contamination: 1 greasy box can ruin an entire 500 kg bale of clean recyclable paper.',
    localConfirmationRequired: true,
    localDisclaimer: 'Check if your municipality/campus accepts food-soiled paper in green bins. If not, dispose in residual bin.'
  },
  {
    id: 'aluminum-can',
    name: 'Aluminum Beverage Can',
    category: 'dry_recyclable',
    categoryLabel: 'Dry / Recyclable Waste',
    binColor: '#0284c7',
    binBgColor: '#e0f2fe',
    aliases: ['soda can', 'coke can', 'tin can', 'beer can', 'aluminium can'],
    description: 'High-purity aluminum alloy beverage container.',
    whyThisBin: 'Aluminum is an infinitely recyclable material. Melting existing cans requires 95% less energy than refining virgin bauxite ore, and a recycled can returns to store shelves as a new can in as little as 60 days.',
    preparationSteps: [
      'Empty all beverage contents.',
      'Rinse lightly with a splash of water.',
      'Crush horizontally or vertically to save bin volume.',
      'Leave the pull-tab attached to the can.'
    ],
    canBeRecycled: true,
    canBeReused: true,
    reuseIdeas: ['Use for desk pen organizers, emergency candle holders, or herb plant tins.'],
    safetyPrecautions: ['Watch out for sharp metal edges if the can is ripped or cut open.'],
    decompositionTime: '80 to 200 years in nature',
    carbonImpact: 'Recycling 1 single aluminum can saves enough energy to power a TV for 3 hours!',
    localConfirmationRequired: false,
    localDisclaimer: 'Universally accepted in all dry recycling programs worldwide.'
  },
  {
    id: 'glass-bottle',
    name: 'Glass Beverage Bottle / Jar',
    category: 'dry_recyclable',
    categoryLabel: 'Dry / Recyclable Waste',
    binColor: '#0284c7',
    binBgColor: '#e0f2fe',
    aliases: ['jam jar', 'beer bottle', 'pickle jar', 'glass container', 'sauce bottle'],
    description: 'Silica soda-lime glass container.',
    whyThisBin: 'Glass is 100% infinitely recyclable without any loss in purity, quality, or structural strength. Crushed cullet glass melts at lower furnace temperatures than raw sand and soda ash, lowering kiln fuel emissions.',
    preparationSteps: [
      'Rinse out food residue or sticky liquids.',
      'Remove metal or plastic caps and lids (recycle them separately).',
      'Do not break deliberately (broken glass creates severe cut hazards for sanitation workers).'
    ],
    canBeRecycled: true,
    canBeReused: true,
    reuseIdeas: [
      'Clean jars make great pantry storage for grains, spices, lentils, or stationery items.',
      'Upcycle into candle holders or flower vases.'
    ],
    safetyPrecautions: [
      'Handle with care. If broken, wrap in newspaper and label "BROKEN GLASS" before handling.',
      'Do not mix with Pyrex, window panes, or drinking glasses (they have different melting temperatures).'
    ],
    decompositionTime: 'Over 1,000,000 years (practically forever)',
    carbonImpact: 'Every ton of glass recycled saves 1,300 lbs of sand and 315 kg of carbon dioxide.',
    localConfirmationRequired: false,
    localDisclaimer: 'Accepted in blue bins or specialized glass bottle collection banks.'
  },
  {
    id: 'cfl-fluorescent-bulb',
    name: 'CFL / Fluorescent Tube Bulb',
    category: 'hazardous',
    categoryLabel: 'Hazardous Waste',
    binColor: '#dc2626',
    binBgColor: '#fee2e2',
    aliases: ['tube light', 'mercury bulb', 'spiral bulb', 'fluorescent light', 'cfl'],
    description: 'Gas-discharge lamp containing vaporized toxic elemental mercury and phosphor coating.',
    whyThisBin: 'CRITICAL HAZARD! Each CFL contains 3 to 5 milligrams of toxic mercury vapor. When crushed in standard waste trucks or incinerators, mercury vapors disperse into air and soil, bioaccumulating in fish and groundwater as neurotoxic methylmercury.',
    preparationSteps: [
      'Do not crush or break the bulb glass.',
      'Place inside original packaging box or wrap gently in bubble wrap / newspaper.',
      'Take directly to campus electrical maintenance or designated municipal hazardous depot.'
    ],
    canBeRecycled: true,
    canBeReused: false,
    safetyPrecautions: [
      'If broken indoors: evacuate the room immediately for 15 minutes, ventilate by opening windows, scoop up glass with cardboard (do NOT vacuum, as vacuuming spreads mercury vapor), and place in a sealed jar.'
    ],
    decompositionTime: 'Glass lasts forever; mercury toxins never neutralize naturally.',
    carbonImpact: 'Specialized distillers recover 99% of elemental mercury and clean glass cullet.',
    localConfirmationRequired: true,
    localDisclaimer: 'Strictly prohibited from general landfill bins by environmental regulations worldwide.'
  },
  {
    id: 'laptop-charger-cable',
    name: 'Laptop Charger & USB Cables',
    category: 'e_waste',
    categoryLabel: 'Electronic Waste (E-Waste)',
    binColor: '#475569',
    binBgColor: '#f1f5f9',
    aliases: ['wire', 'charging cord', 'power brick', 'usb cord', 'adapter', 'hdmi cable'],
    description: 'Copper wire insulated with PVC and transformer power bricks with copper coils.',
    whyThisBin: 'Contains high-purity electrical copper conductors and ferrite cores. If thrown into municipal garbage, copper is lost and the PVC jacket releases toxic hydrochloric fumes if burned in illegal open dumps.',
    preparationSteps: [
      'Neatly coil the cable and secure with a twist-tie or rubber band.',
      'Check if it still functions; donate to campus loaner libraries if operational.',
      'Deposit in dedicated e-waste cable bins.'
    ],
    canBeRecycled: true,
    canBeReused: true,
    reuseIdeas: ['Use still-working cables as spares for car, hostel desk, or college maker labs.'],
    safetyPrecautions: ['Do not strip plastic insulation with open fire or blades.'],
    decompositionTime: '500+ years for PVC insulation jacket',
    carbonImpact: 'Recycled copper requires 85% less energy than virgin mining.',
    localConfirmationRequired: true,
    localDisclaimer: 'Hand over to authorized campus e-waste drives or certified scrap recyclers.'
  },
  {
    id: 'coffee-grounds',
    name: 'Used Coffee Grounds & Tea Leaves',
    category: 'wet_organic',
    categoryLabel: 'Wet / Organic Waste',
    binColor: '#15803d',
    binBgColor: '#dcfce7',
    aliases: ['tea bags', 'filter coffee residue', 'espresso pucks', 'chai patti', 'tea leaves'],
    description: 'Brewed coffee grounds and natural tea leaf residue.',
    whyThisBin: 'Rich in organic nitrogen, potassium, and magnesium. Acts as an extraordinary soil conditioner that enriches compost microbiota and repels slugs and garden pests.',
    preparationSteps: [
      'Check tea bags: remove metal staples and nylon/synthetic tea pyramids (only unbleached paper tea bags compost naturally).',
      'Scatter grounds directly around outdoor plants or mix into compost pile.'
    ],
    canBeRecycled: false,
    canBeReused: true,
    reuseIdeas: [
      'Dry in sunlight and place in a small open bowl inside the refrigerator as a natural odor absorber.',
      'Mix with coconut oil to make an exfoliating natural body scrub.'
    ],
    safetyPrecautions: ['Caffeine can be harmful to dogs and cats; keep away from household pets.'],
    decompositionTime: '2 to 3 weeks in compost',
    carbonImpact: 'Sequester carbon in healthy garden topsoil.',
    localConfirmationRequired: false,
    localDisclaimer: 'Ideal for home composters, hostel kitchen bins, and campus community gardens.'
  },
  {
    id: 'expired-medicine',
    name: 'Expired Medicine & Blister Packs',
    category: 'hazardous',
    categoryLabel: 'Hazardous Waste',
    binColor: '#dc2626',
    binBgColor: '#fee2e2',
    aliases: ['tablets', 'capsules', 'cough syrup', 'pharmaceutical waste', 'pills', 'dawa'],
    description: 'Active pharmaceutical ingredients (APIs) and composite aluminum-PVC foil packaging.',
    whyThisBin: 'NEVER flush pills down the sink or toilet! Wastewater treatment facilities cannot filter modern pharmaceuticals, leading to antibiotic resistance in bacteria and endocrine disruption in river aquatic wildlife. Unused pills in open trash also risk accidental ingestion.',
    preparationSteps: [
      'Do not flush down toilets or sinks.',
      'Keep tablets inside their foil packaging to prevent accidental poisoning.',
      'Take to a designated pharmacy medicine take-back box or hospital biohazard kiosk.'
    ],
    canBeRecycled: false,
    canBeReused: false,
    safetyPrecautions: [
      'Keep out of reach of children and stray animals.',
      'Do not crush into powder without respiratory protection.'
    ],
    decompositionTime: 'Chemicals persist indefinitely in aquifers and food chains',
    carbonImpact: 'High-temperature industrial incineration destroys harmful pharmaceutical compounds safely.',
    localConfirmationRequired: true,
    localDisclaimer: 'Many hospitals and licensed pharmacies offer safe drop-off return boxes.'
  },
  {
    id: 'eggshells',
    name: 'Eggshells',
    category: 'wet_organic',
    categoryLabel: 'Wet / Organic Waste',
    binColor: '#15803d',
    binBgColor: '#dcfce7',
    aliases: ['ande ka chilka', 'cracked eggshell', 'egg shell'],
    description: 'Natural calcium carbonate (95%) crystalline matrix.',
    whyThisBin: 'Provides essential calcium to balance acidic compost components and prevents blossom end rot in tomatoes and peppers when compost is applied to soil.',
    preparationSteps: [
      'Rinse lightly to remove leftover albumen.',
      'Crush by hand or with a pestle to accelerate breakdown.',
      'Add directly to compost bin.'
    ],
    canBeRecycled: false,
    canBeReused: true,
    reuseIdeas: [
      'Scatter coarsely crushed eggshells around garden plants to deter soft-bodied slugs and snails.',
      'Feed crushed shells back to backyard chickens as a natural calcium booster.'
    ],
    safetyPrecautions: ['Wash hands after handling raw egg remnants to prevent salmonella.'],
    decompositionTime: '1 to 2 months if crushed finely',
    carbonImpact: 'Natural calcium supplement that eliminates synthetic agricultural lime.',
    localConfirmationRequired: false,
    localDisclaimer: 'Completely safe for all compost and vermicompost systems.'
  },
  {
    id: 'paint-can',
    name: 'Leftover Paint Can & Solvents',
    category: 'hazardous',
    categoryLabel: 'Hazardous Waste',
    binColor: '#dc2626',
    binBgColor: '#fee2e2',
    aliases: ['emulsion paint', 'oil paint', 'varnish', 'thinner', 'primer'],
    description: 'Chemical formulations with VOCs (volatile organic compounds), resins, and solvents.',
    whyThisBin: 'Liquid paint can seep through landfill barriers, while oil-based paints are highly flammable and release harmful volatile fumes. Solvents contaminate groundwater supplies.',
    preparationSteps: [
      'If nearly empty with water-based latex paint: leave lid off outdoors until paint hardens solid before disposal.',
      'For oil-based paints, varnishes, or thinners: keep tightly sealed in original container and hand to hazardous drop-off centers.',
      'Never pour down storm drains or sinks.'
    ],
    canBeRecycled: true,
    canBeReused: true,
    reuseIdeas: ['Donate usable leftover paint to campus theater clubs, art departments, or community mural projects.'],
    safetyPrecautions: ['Flammable vapors. Store away from open flames, sparks, and direct sunlight.'],
    decompositionTime: 'Decades; synthetic binders persist in soil',
    carbonImpact: 'Recycled paint programs re-blend leftover batches into secondary industrial coatings.',
    localConfirmationRequired: true,
    localDisclaimer: 'Check municipal hazardous collection dates and campus facility collection yards.'
  },
  {
    id: 'aerosol-spray-can',
    name: 'Aerosol Spray Can (Deodorant / Cleaner)',
    category: 'hazardous',
    categoryLabel: 'Hazardous Waste (or Recyclable when 100% empty)',
    binColor: '#dc2626',
    binBgColor: '#fee2e2',
    aliases: ['deodorant can', 'spray paint', 'insect killer spray', 'hairspray', 'axe can'],
    description: 'Pressurized steel or aluminum canister containing hydrocarbon propellants and active agents.',
    whyThisBin: 'Even when seemingly empty, aerosol cans retain residual propellant gas under pressure. If compacted in standard garbage trucks or heated, they can violently explode, injuring sanitation crews.',
    preparationSteps: [
      'Discharge until completely empty (no hissing sound heard when button is pressed).',
      'Remove the plastic spray nozzle cap (recycle cap with plastics).',
      'DO NOT puncture or flatten aerosol cans yourself.',
      'If any liquid remains, take to household hazardous waste.'
    ],
    canBeRecycled: true,
    canBeReused: false,
    safetyPrecautions: ['Extreme blast and shrapnel risk if pierced, crushed, or incinerated.'],
    decompositionTime: '50 to 100 years for metal body',
    carbonImpact: 'Metal is 100% recyclable once safely depressurized and punctured by industrial MRFs.',
    localConfirmationRequired: true,
    localDisclaimer: 'Some cities accept 100% empty cans in metal recycling; otherwise treat as hazardous.'
  },
  {
    id: 'used-cooking-oil',
    name: 'Used Cooking Oil & Grease',
    category: 'hazardous',
    categoryLabel: 'Hazardous / Special Organic Waste',
    binColor: '#dc2626',
    binBgColor: '#fee2e2',
    aliases: ['fryer oil', 'kitchen grease', 'fat', 'ghee residue', 'tallow'],
    description: 'Thermally degraded triglycerides and vegetable cooking fats.',
    whyThisBin: 'NEVER POUR DOWN THE DRAIN! Cooking grease congeals with wet wipes and sanitary items in sewer lines to form monstrous "fatbergs" that block city sewage systems, causing raw sewage backflows and multi-million dollar repair costs.',
    preparationSteps: [
      'Let hot oil cool completely to room temperature.',
      'Strain food crumbs using a mesh sieve.',
      'Pour into a clean sealable glass jar or plastic jug with screw cap.',
      'Take to a biofuel collection point or hostel grease-trap collector.'
    ],
    canBeRecycled: true,
    canBeReused: true,
    reuseIdeas: [
      'Can be refined commercially into clean-burning B100 Biodiesel fuel or industrial soap.',
      'Can be reused for deep frying 1 to 2 times if not burnt or smoking.'
    ],
    safetyPrecautions: ['Hot oil causes severe skin burns. Never handle until cooled.'],
    decompositionTime: 'Can suffocate aquatic life if washed into rivers',
    carbonImpact: 'Biodiesel from used cooking oil reduces lifecycle greenhouse gas emissions by up to 86%.',
    localConfirmationRequired: true,
    localDisclaimer: 'Deposit at biodiesel drop-off stations or campus dining hall grease collection.'
  },
  {
    id: 'styrofoam-packaging',
    name: 'Styrofoam / Expanded Polystyrene (EPS)',
    category: 'sanitary_residual',
    categoryLabel: 'Sanitary / Residual (Non-Recyclable)',
    binColor: '#334155',
    binBgColor: '#f8fafc',
    aliases: ['thermocol', 'polystyrene', 'foam cups', 'packaging peanuts', 'foam tray'],
    description: 'Expanded polystyrene foam consisting of 95-98% air trapped in brittle plastic polymer.',
    whyThisBin: 'Most municipal blue bins reject Styrofoam because it is bulky, light, breaks into millions of static microplastic beads that contaminate other recycling streams, and is uneconomical to transport unless specialized foam densifiers exist.',
    preparationSteps: [
      'Keep contained in a bag so crumbs do not blow away into waterways.',
      'Check if local shipping stores accept foam peanuts for reuse.',
      'If dirty with food or takeout curry, dispose in the black residual bin.'
    ],
    canBeRecycled: false,
    canBeReused: true,
    reuseIdeas: [
      'Break into chunks and place at the bottom of plant pots to improve drainage without adding heavy weight.',
      'Save clean packaging blocks for shipping delicate gifts.'
    ],
    safetyPrecautions: ['Choking hazard for wildlife and marine animals; microplastic danger.'],
    decompositionTime: '500+ years (does not biodegrade, only photo-fragments into microplastics)',
    carbonImpact: 'Minimizing single-use foam containers prevents persistent plastic pollution.',
    localConfirmationRequired: true,
    localDisclaimer: 'Unless your campus has a specialized EPS densifier, it belongs in residual trash.'
  },
  {
    id: 'printer-ink-cartridge',
    name: 'Printer Ink & Toner Cartridge',
    category: 'e_waste',
    categoryLabel: 'Electronic Waste (E-Waste)',
    binColor: '#475569',
    binBgColor: '#f1f5f9',
    aliases: ['toner', 'hp cartridge', 'canon ink', 'laser toner', 'printer ink'],
    description: 'Complex composite housing with electronic chip, printhead, and ultra-fine chemical toner powder.',
    whyThisBin: 'Toner dust contains fine carbon black, iron oxide, and polymer resins that can irritate lungs. Cartridges take hundreds of years to decompose and can easily be remanufactured and refilled up to 4 to 6 times.',
    preparationSteps: [
      'Seal inside the original plastic protective wrapper or a zip-lock bag to prevent powdery toner leaks.',
      'Drop off at an office supply store, campus library drop-box, or brand mail-back kiosk (HP, Canon, Brother).'
    ],
    canBeRecycled: true,
    canBeReused: true,
    reuseIdeas: ['Send to certified cartridge refill refillers for 60% lower cost than buying new OEM.'],
    safetyPrecautions: ['Do not inhale toner powder. Wash skin immediately with cold water if toner spills.'],
    decompositionTime: '450 to 1,000 years for engineered engineering-grade polymers',
    carbonImpact: 'Remanufacturing one toner cartridge saves 2.5 kg of raw plastic and 2.5 kg of oil.',
    localConfirmationRequired: true,
    localDisclaimer: 'Accepted at university IT desks, office supply centers, and authorized e-waste points.'
  },
  {
    id: 'fallen-dry-leaves',
    name: 'Dry Garden Leaves & Lawn Clippings',
    category: 'wet_organic',
    categoryLabel: 'Wet / Organic Waste',
    binColor: '#15803d',
    binBgColor: '#dcfce7',
    aliases: ['sukhe patte', 'dead leaves', 'grass clippings', 'yard waste', 'garden pruning'],
    description: 'Carbon-rich ("browns") organic cellulose matter from campus landscaping and trees.',
    whyThisBin: 'Dry leaves provide the essential carbon structure and aeration pockets needed to prevent compost piles from turning smelly, slimy, and anaerobic. Burning them causes severe air smog and PM2.5 respiratory pollution.',
    preparationSteps: [
      'NEVER BURN! Burning leaves releases carcinogenic particulate matter, carbon monoxide, and smoke.',
      'Collect in paper bags or unlined bins.',
      'Shred with a lawnmower or shears to speed breakdown.'
    ],
    canBeRecycled: false,
    canBeReused: true,
    reuseIdeas: [
      'Spread a 2-3 inch layer directly over flowerbeds and tree bases as natural organic mulch to suppress weeds and retain soil moisture.',
      'Layer 2 parts dry leaves to 1 part green kitchen scraps in compost bins.'
    ],
    safetyPrecautions: ['Check for thorny branches or stinging caterpillars.'],
    decompositionTime: '3 to 6 months',
    carbonImpact: 'Stops open-burning smog; restores organic carbon back to soil.',
    localConfirmationRequired: false,
    localDisclaimer: 'Accepted in campus compost pits and municipal horticultural waste collection.'
  },
  {
    id: 'tetra-pak-carton',
    name: 'Tetra Pak Beverage Carton (Juice / Milk)',
    category: 'dry_recyclable',
    categoryLabel: 'Dry / Recyclable Waste (Aseptic Composite)',
    binColor: '#0284c7',
    binBgColor: '#e0f2fe',
    aliases: ['frooti pack', 'milk carton', 'juice box', 'tetra pack', 'soya milk carton'],
    description: 'Multi-layer composite: 75% paperboard, 20% polyethylene, 5% microscopic aluminum foil barrier.',
    whyThisBin: 'Specialized hydro-pulper paper mills can separate the virgin wood paper fibers from the polyethylene-aluminum (PolyAl). The pulp becomes corrugated paper, and PolyAl is pressed into durable eco-roofing sheets and school benches.',
    preparationSteps: [
      'Unfold the top and bottom flaps of the carton.',
      'Rinse inside with water to prevent foul milk/juice odors.',
      'Flatten completely (flattening saves 80% storage space).',
      'Push the plastic straw inside the carton or re-screw the plastic cap.'
    ],
    canBeRecycled: true,
    canBeReused: true,
    reuseIdeas: ['Cut in half to make waterproof seed starter pots or seedling trays for gardening.'],
    safetyPrecautions: ['Must be rinsed; rotting dairy creates intense odor and pest attraction.'],
    decompositionTime: '5 years for paper layer; 300+ years for aluminum-plastic film',
    carbonImpact: 'Recycled PolyAl is pressed into roofing tiles used in sustainable rural housing.',
    localConfirmationRequired: true,
    localDisclaimer: 'Most modern recycling programs accept flattened Tetra Paks in the blue bin; check local MRF.'
  },
  {
    id: 'used-napkin-tissue',
    name: 'Used Sanitary Napkin / Facial Tissue',
    category: 'sanitary_residual',
    categoryLabel: 'Sanitary / Residual Waste',
    binColor: '#334155',
    binBgColor: '#f8fafc',
    aliases: ['tissue paper', 'wet tissue', 'toilet paper', 'diaper', 'pampers', 'sanitary pad'],
    description: 'Cellulose fibers soiled with biological bodily fluids, oils, mucus, and superabsorbent polymers.',
    whyThisBin: 'Cannot be recycled! Biological fluids carry bacteria and pathogens that pose infectious biohazard risks to manual waste sorters. The paper fibers are also too short to be re-pulped.',
    preparationSteps: [
      'Wrap securely in multiple layers of old newspaper or disposal pouches.',
      'Mark with a red cross or "Sanitary Waste" symbol so manual waste workers do not touch contents directly.',
      'Dispose exclusively in covered sanitary/residual bins for high-temperature incineration.'
    ],
    canBeRecycled: false,
    canBeReused: false,
    safetyPrecautions: ['Biohazard hazard. Protect sanitation workers from direct exposure to pathogens.'],
    decompositionTime: 'Sanitary pads take 500-800 years due to plastic backing; tissues 2-4 weeks',
    carbonImpact: 'Proper disposal prevents open water contamination and cholera/hepatitis vectors.',
    localConfirmationRequired: false,
    localDisclaimer: 'Universal health standard: Sanitary waste must be incinerated at high temperatures (850°C+).'
  },
  {
    id: 'steel-food-can',
    name: 'Steel / Tin Food Can',
    category: 'dry_recyclable',
    categoryLabel: 'Dry / Recyclable Waste',
    binColor: '#0284c7',
    binBgColor: '#e0f2fe',
    aliases: ['tin can', 'canned beans', 'canned tomato', 'tinned fruit', 'condensed milk tin'],
    description: 'Tin-coated magnetic steel container.',
    whyThisBin: 'Steel is the most recycled material on Earth! It is easily separated in sorting facilities using massive overhead electro-magnets, melted down, and reformed without degradation.',
    preparationSteps: [
      'Scrape out remaining food.',
      'Quick rinse with dishwater.',
      'If the lid is cut off, tuck it inside the can and pinch the top shut so sharp edges do not cut workers.'
    ],
    canBeRecycled: true,
    canBeReused: true,
    reuseIdeas: ['Paint the can and punch holes in decorative patterns to create beautiful candle lanterns or cutlery caddies.'],
    safetyPrecautions: ['Sharp inner edges from can openers can inflict deep cuts.'],
    decompositionTime: '50 to 100 years',
    carbonImpact: 'Every ton of recycled steel saves 2,500 lbs of iron ore and 1,400 lbs of coal.',
    localConfirmationRequired: false,
    localDisclaimer: 'Accepted in all municipal blue bins and scrap metal collection.'
  },
  {
    id: 'newspaper-magazine',
    name: 'Newspaper & Glossy Magazine',
    category: 'dry_recyclable',
    categoryLabel: 'Dry / Recyclable Waste',
    binColor: '#0284c7',
    binBgColor: '#e0f2fe',
    aliases: ['akhbar', 'paper', 'newsprint', 'journal', 'catalog', 'flyers'],
    description: 'Clean mechanical and chemical wood pulp newsprint.',
    whyThisBin: 'High fiber recovery yield. Once de-inked in water flotation tanks, old newsprint quickly transforms into fresh newsprint, tissue rolls, or egg carton packaging.',
    preparationSteps: [
      'Keep clean and dry (rain or spilled tea ruins paper recyclability).',
      'Bundle newspapers with twine or store flat in a paper bag.',
      'Remove plastic polybag outer wrap from delivered magazines.'
    ],
    canBeRecycled: true,
    canBeReused: true,
    reuseIdeas: [
      'Use for streak-free window cleaning using white vinegar.',
      'Use as eco-friendly gift wrapping paper decorated with sprigs of rosemary.',
      'Line vegetable drawers to absorb humidity.'
    ],
    safetyPrecautions: ['Store away from heat sources to prevent fire hazards.'],
    decompositionTime: '2 to 6 weeks if moist and unlaminated',
    carbonImpact: 'Recycling 1 ton of newspaper saves 15 mature trees and 3 cubic yards of landfill capacity.',
    localConfirmationRequired: false,
    localDisclaimer: 'Accepted by all paper recycling mills, school paper drives, and scrap dealers (kabadiwalas).'
  },
  {
    id: 'broken-led-bulb',
    name: 'Broken / Burned Out LED Bulb',
    category: 'e_waste',
    categoryLabel: 'Electronic Waste (E-Waste)',
    binColor: '#475569',
    binBgColor: '#f1f5f9',
    aliases: ['led light', 'led lamp', 'philips led', 'burned bulb', 'diode bulb'],
    description: 'Solid-state lighting consisting of surface-mount diodes (SMDs), aluminum heatsink, and electronic driver circuit.',
    whyThisBin: 'Unlike CFLs, LEDs do not contain mercury vapor, but they contain electronic circuit boards, small capacitors, and valuable aluminum heat sinks. They belong in e-waste, not regular trash or glass recycling.',
    preparationSteps: [
      'Allow bulb to cool before handling.',
      'Place in a small box or padded envelope so the plastic/glass diffuser doesn’t shatter.',
      'Drop off at an e-waste collection bin or home improvement store recycling station.'
    ],
    canBeRecycled: true,
    canBeReused: false,
    safetyPrecautions: ['Beware of broken glass or exposed driver pins if cracked.'],
    decompositionTime: 'Aluminium heatsink: 200+ years; plastic body: 400+ years',
    carbonImpact: 'Recovers high-grade aluminum and circuitry components safely.',
    localConfirmationRequired: true,
    localDisclaimer: 'Separate from mercury-containing CFLs; hand over to e-waste streams.'
  }
];

export const INITIAL_BIN_REPORTS = [
  {
    id: 'rep-1',
    location: 'Central Library - East Entrance',
    campusArea: 'Academic Zone',
    coordinates: { lat: 27.1819, lng: 88.5138 },
    wasteType: 'dry_recyclable',
    severity: 'Overflowing',
    status: 'Pending',
    description: 'Blue recycling bin is overflowing with coffee cups and cardboard boxes after study week.',
    reportedBy: 'Aarav Sharma (Student ID: 22BCS104)',
    timestamp: '2026-10-14T02:15:00Z',
    upvotes: 7,
    assignedStaff: 'Unassigned',
  },
  {
    id: 'rep-2',
    location: 'Hostel Block C - Cafeteria Corridor',
    campusArea: 'Residential Zone',
    coordinates: { lat: 27.1806, lng: 88.5131 },
    wasteType: 'wet_organic',
    severity: 'Contaminated / Spilling',
    status: 'In Progress',
    description: 'Food waste bin has plastic wrappers thrown inside and fruit flies gathering near water cooler.',
    reportedBy: 'Pooja Nair (Hostel Prefect)',
    timestamp: '2026-10-14T01:45:00Z',
    upvotes: 14,
    assignedStaff: 'Ramesh K. (Groundskeeping)',
  },
  {
    id: 'rep-3',
    location: 'Engineering Workshop 2 - E-Waste Station',
    campusArea: 'Lab Zone',
    coordinates: { lat: 27.1822, lng: 88.5155 },
    wasteType: 'e_waste',
    severity: 'Full',
    status: 'Resolved',
    description: 'Battery drop box reached maximum capacity after robotics lab cleanup.',
    reportedBy: 'Prof. S. Sengupta (Faculty Advisor)',
    timestamp: '2026-10-13T18:30:00Z',
    upvotes: 5,
    assignedStaff: 'Suresh Verma (Facility Manager)',
  }
];

export const RECYCLING_CENTRES = [
  {
    id: 'rc-1',
    name: 'Sikkim Manipal Central Campus MRF & Compost Unit',
    type: 'Campus Material Recovery Facility',
    isVerified: true,
    distanceKm: 0.3,
    address: 'East Campus Utility Gate, Majitar, Rangpo',
    acceptedMaterials: ['wet_organic', 'dry_recyclable', 'cardboard', 'pet_plastic'],
    timings: '08:00 AM - 05:00 PM (Mon-Sat)',
    phone: '+91 3592 246465 (Ext 112)',
    coordinates: { lat: 27.1812, lng: 88.5142 },
    instructions: 'Free drop-off for students & faculty. Segregated bags only.',
    badge: 'Campus Facility'
  },
  {
    id: 'rc-2',
    name: 'Rangpo Municipal Green Zone & E-Waste Depot',
    type: 'Authorized Municipal Collection',
    isVerified: true,
    distanceKm: 2.1,
    address: 'NH10 Highway Junction, Rangpo Bazaar',
    acceptedMaterials: ['e_waste', 'hazardous', 'batteries', 'cfl_bulbs', 'dry_recyclable'],
    timings: '09:00 AM - 04:30 PM (Daily except Sunday)',
    phone: '+91 3592 240212',
    coordinates: { lat: 27.1764, lng: 88.5298 },
    instructions: 'Authorized battery recycling drop counter with receipt voucher for eco-points.',
    badge: 'Government Certified'
  },
  {
    id: 'rc-3',
    name: 'Himalayan Scrap & Metal Recyclers (Certified Kabadiwala)',
    type: 'Authorized Informal Scrap Partner',
    isVerified: true,
    distanceKm: 3.4,
    address: 'Plot 4, Singtam Industrial Bypass',
    acceptedMaterials: ['dry_recyclable', 'cardboard', 'aluminum_can', 'steel_food_can', 'glass_bottle'],
    timings: '07:30 AM - 07:00 PM (Daily)',
    phone: '+91 98320 44921',
    coordinates: { lat: 27.2341, lng: 88.4982 },
    instructions: 'Buys clean cardboard (₹14/kg), newspapers (₹16/kg), and aluminum cans (₹95/kg).',
    badge: 'Cash Back Partner'
  },
  {
    id: 'rc-4',
    name: 'Apex Bio-Medical & Pharmacy Return Kiosk',
    type: 'Hospital Hazardous Collection',
    isVerified: false,
    distanceKm: 4.8,
    address: 'Central Referral Hospital, 5th Mile Tadong',
    acceptedMaterials: ['hazardous', 'expired_medicine', 'syringes'],
    timings: '24/7 Drop Box (Near Pharmacy counter)',
    phone: '+91 3592 231122',
    coordinates: { lat: 27.3114, lng: 88.5981 },
    instructions: 'Clearly labeled biohazard safe drop box for old tablets and expired liquids.',
    badge: 'Demonstration Entry'
  }
];

export const QUIZ_MODULES = [
  {
    id: 'quiz-segregation-101',
    title: 'Waste Segregation 101: Master the Bins',
    description: 'Test your grasp of the fundamental 4-bin segregation system and prevent contamination.',
    pointsAward: 50,
    difficulty: 'Beginner',
    questions: [
      {
        id: 'q1',
        question: 'Which bin should a banana peel or vegetable scrap go into?',
        options: [
          'Blue Bin (Dry Recyclable)',
          'Green Bin (Wet Organic)',
          'Grey Bin (E-Waste)',
          'Black Bin (Sanitary Residual)'
        ],
        correctIndex: 1,
        explanation: 'Banana peels and food scraps are biodegradable organic waste that decompose into nutrient-rich compost in the Green Bin.'
      },
      {
        id: 'q2',
        question: 'Why can you NOT put a greasy, cheese-soaked pizza box in the blue paper recycling bin?',
        options: [
          'Because cardboard cannot ever be recycled',
          'Because the grease soaks into paper fibers and ruins the water-pulping process for entire batches',
          'Because pizza boxes are too heavy for sorting conveyor belts',
          'Because paper mills only accept white paper'
        ],
        correctIndex: 1,
        explanation: 'Grease and melted oils cannot separate from paper fibers during water pulping. Greasy boxes contaminate entire bales of clean paper, forcing them into landfills.'
      },
      {
        id: 'q3',
        question: 'Before throwing a plastic beverage bottle into the recycling bin, what should you do?',
        options: [
          'Fill it with stones so it doesn’t blow away',
          'Empty liquids, rinse if sticky, crush flat to save space, and screw the cap back on',
          'Cut the plastic bottle into 50 tiny shreds',
          'Wrap it in 3 plastic grocery bags'
        ],
        correctIndex: 1,
        explanation: 'Emptying, quick rinsing, and crushing flat saves bin volume and transport emissions while protecting paper from liquid contamination.'
      }
    ]
  },
  {
    id: 'quiz-hazards-batteries',
    title: 'Hazardous Waste & Battery Safety',
    description: 'Learn the critical fire risks of lithium-ion cells and toxic chemicals.',
    pointsAward: 75,
    difficulty: 'Intermediate',
    questions: [
      {
        id: 'q4',
        question: 'What is the biggest danger of throwing used lithium-ion phone or laptop batteries in regular garbage?',
        options: [
          'They turn into fertilizer too fast',
          'They can short-circuit when crushed in garbage trucks or sorting machines and ignite catastrophic facility fires',
          'They attract raccoons and rodents',
          'They dissolve trash bags'
        ],
        correctIndex: 1,
        explanation: 'Damaged or punctured lithium-ion cells suffer thermal runaway and ignite severe landfill and truck fires that are difficult to extinguish.'
      },
      {
        id: 'q5',
        question: 'What simple precaution should you take before depositing used batteries into a drop box?',
        options: [
          'Freeze them overnight',
          'Tape the exposed positive and negative terminals with non-conductive electrical or scotch tape',
          'Wash them in soapy water',
          'Hammer them flat'
        ],
        correctIndex: 1,
        explanation: 'Taping the terminals stops metal-to-metal friction contact from causing short-circuit sparks in transport containers.'
      },
      {
        id: 'q6',
        question: 'If an old CFL tube bulb burns out, why is it strictly forbidden in regular household trash?',
        options: [
          'It contains elemental mercury vapor which is a dangerous neurotoxin that poisons groundwater',
          'It makes trash too heavy',
          'The glass is too shiny for waste workers',
          'It drains electricity from other garbage'
        ],
        correctIndex: 0,
        explanation: 'CFLs contain hazardous mercury vapor. When crushed in trash trucks, mercury releases into air and water systems, bioaccumulating in wildlife.'
      }
    ]
  },
  {
    id: 'quiz-composting-impact',
    title: 'Composting & Environmental Impact',
    description: 'Discover how diverting food waste directly fights climate change.',
    pointsAward: 60,
    difficulty: 'Advanced',
    questions: [
      {
        id: 'q7',
        question: 'What potent greenhouse gas is produced when organic food waste is buried under anaerobic landfills instead of composted?',
        options: [
          'Pure Oxygen (O2)',
          'Methane (CH4), which is ~28 times more potent at trapping atmospheric heat than CO2',
          'Helium (He)',
          'Argon (Ar)'
        ],
        correctIndex: 1,
        explanation: 'Without oxygen, anaerobic bacteria digest organic waste and release methane (CH4), a greenhouse gas with 28 times the global warming potential of carbon dioxide.'
      },
      {
        id: 'q8',
        question: 'In a healthy aerobic compost pile, what constitutes "Browns"?',
        options: [
          'Fresh green grass clippings and raw vegetable peels',
          'Dry leaves, cardboard shreds, sawdust, and straw (rich in carbon)',
          'Plastic bottles and aluminum foil',
          'Meat and dairy bones'
        ],
        correctIndex: 1,
        explanation: 'Browns are dry, carbon-rich plant materials like fallen leaves and straw. They provide aeration and balance the nitrogen from wet kitchen greens.'
      }
    ]
  }
];
