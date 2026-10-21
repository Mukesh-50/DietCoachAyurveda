// Meal database. Nutrition values are approximate per serving, based on
// Indian Food Composition Tables (IFCT 2017, NIN Hyderabad).
// doshas: which constitutions the meal balances (V = Vata, P = Pitta, K = Kapha).

const DOSHA_INFO = {
  Vata: {
    elements: "Air + Space",
    traits: "Light, dry, cold, mobile. Creative and quick, but prone to anxiety, dry skin, gas and irregular appetite.",
    favour: "Warm, moist, grounding foods — ghee, cooked grains, root vegetables, sweet fruits, warming spices (ginger, cumin, hing).",
    avoid: "Cold, raw, dry and very light foods — salads in excess, cold drinks, puffed snacks, skipping meals.",
  },
  Pitta: {
    elements: "Fire + Water",
    traits: "Hot, sharp, intense. Strong digestion and focus, but prone to acidity, inflammation, skin rashes and irritability.",
    favour: "Cooling, sweet, bitter and astringent foods — cucumber, coconut, coriander, fennel, moong, milk, sweet fruits.",
    avoid: "Very spicy, sour, salty, fried and fermented foods; excess chilli, tomato, pickle, alcohol and coffee.",
  },
  Kapha: {
    elements: "Earth + Water",
    traits: "Heavy, stable, cool. Calm and enduring, but prone to weight gain, sluggishness, congestion and slow metabolism.",
    favour: "Light, warm, dry and spicy foods — millets, barley, legumes, leafy greens, ginger, black pepper, honey (unheated).",
    avoid: "Heavy, oily, cold and sweet foods — excess dairy, fried items, white rice in excess, sweets, daytime sleep after meals.",
  },
};

const QUIZ = [
  { q: "Body frame", a: ["Thin, light, hard to gain weight", "Medium, muscular", "Broad, solid, gains weight easily"] },
  { q: "Skin", a: ["Dry, rough, cool", "Warm, oily, prone to rashes/acne", "Thick, smooth, cool, moist"] },
  { q: "Appetite", a: ["Irregular — sometimes hungry, sometimes not", "Strong — irritable if a meal is missed", "Steady but low — can skip meals easily"] },
  { q: "Digestion", a: ["Gas, bloating, constipation", "Acidity, loose stools, burning", "Slow, heavy feeling after meals"] },
  { q: "Sleep", a: ["Light, interrupted", "Moderate, sound", "Deep, long, hard to wake up"] },
  { q: "Under stress you become", a: ["Anxious, worried", "Angry, irritable", "Withdrawn, lethargic"] },
  { q: "Weather you dislike most", a: ["Cold and windy", "Hot and humid", "Cold and damp"] },
  { q: "Energy pattern", a: ["Bursts of energy, tires fast", "Intense and focused", "Slow to start, great stamina"] },
];

const SLOTS = [
  { id: "early", label: "Early Morning", time: "6:30 AM" },
  { id: "breakfast", label: "Breakfast", time: "8:00 AM" },
  { id: "midmorning", label: "Mid-Morning", time: "11:00 AM" },
  { id: "lunch", label: "Lunch (main meal)", time: "1:00 PM" },
  { id: "snack", label: "Evening Snack", time: "4:30 PM" },
  { id: "dinner", label: "Dinner", time: "7:30 PM" },
];

// type: "veg" | "egg" | "nonveg" — veg meals are allowed for every diet preference.
const MEALS = [
  // ---------- EARLY MORNING ----------
  {
    id: "jeera-water", slot: "early", name: "Warm Jeera-Ajwain Water + 5 Soaked Almonds", type: "veg", doshas: ["V", "K"],
    ingredients: ["1 glass water", "1 tsp cumin seeds", "1/4 tsp ajwain", "5 almonds soaked overnight"],
    recipe: "Boil water with cumin and ajwain for 5 minutes, strain and sip warm. Peel the soaked almonds and chew slowly.",
    macros: { kcal: 45, protein: 1.5, carbs: 2, fat: 3.5, fiber: 1 },
    micros: { "Vitamin E": "1.8 mg", Magnesium: "20 mg", Iron: "0.9 mg", Calcium: "15 mg" },
    science: "Cuminaldehyde in jeera stimulates pancreatic enzymes and bile secretion, while thymol in ajwain relaxes gut smooth muscle — reducing gas. Soaking almonds lowers phytic acid and tannins, improving absorption of magnesium and vitamin E. In Ayurveda this kindles Agni (digestive fire) before the first meal.",
    benefits: ["Reduces bloating and gas", "Improves morning bowel movement", "Vitamin E supports skin and brain health", "Kick-starts metabolism"],
    risks: ["Sluggish digestion and morning constipation", "Gas and bloating through the day", "Low vitamin E can contribute to dull skin and oxidative stress"],
  },
  {
    id: "coriander-fennel", slot: "early", name: "Dhaniya-Saunf Cooling Water + 2 Soaked Figs", type: "veg", doshas: ["P", "V"],
    ingredients: ["1 tsp coriander seeds", "1 tsp fennel seeds", "1 glass water (soaked overnight)", "2 dried figs (anjeer), soaked"],
    recipe: "Soak coriander and fennel seeds in water overnight. In the morning strain and drink at room temperature. Eat the soaked figs.",
    macros: { kcal: 60, protein: 0.8, carbs: 14, fat: 0.3, fiber: 3 },
    micros: { Calcium: "40 mg", Potassium: "170 mg", Iron: "0.5 mg", Magnesium: "17 mg" },
    science: "Coriander seed contains linalool and anethole (in fennel) which have antispasmodic and mild antacid effects, shown to reduce IBS symptoms. Figs supply soluble fibre (pectin) which feeds gut bacteria and softens stools. Ayurveda classes both seeds as Sheeta (cooling) — ideal for Pitta.",
    benefits: ["Relieves acidity and burning", "Natural laxative effect", "Cools the body in summer", "Supports urinary tract health"],
    risks: ["Morning acidity and heartburn", "Constipation", "Heat-related irritability and skin breakouts (Pitta aggravation)"],
  },
  {
    id: "ginger-honey", slot: "early", name: "Ginger-Lemon Water with Honey", type: "veg", doshas: ["K", "V"],
    ingredients: ["1 inch ginger, grated", "1/2 lemon", "1 tsp raw honey", "1 glass warm (not hot) water"],
    recipe: "Steep grated ginger in hot water 5 min, let it cool to lukewarm, then add lemon juice and honey. Never add honey to boiling water.",
    macros: { kcal: 30, protein: 0.2, carbs: 8, fat: 0, fiber: 0.2 },
    micros: { "Vitamin C": "15 mg", Potassium: "60 mg", Manganese: "0.1 mg" },
    science: "Gingerols and shogaols in ginger increase gastric motility and thermogenesis. Vitamin C from lemon boosts non-heme iron absorption from later meals. Ayurveda warns that heated honey forms 'Ama' (toxins); modern studies show heating honey above 60°C produces HMF and destroys enzymes.",
    benefits: ["Clears mucus and congestion", "Supports weight management", "Boosts immunity with vitamin C", "Reduces nausea"],
    risks: ["Morning heaviness and lethargy", "Frequent colds and congestion (Kapha build-up)", "Slower metabolism"],
  },

  // ---------- BREAKFAST ----------
  {
    id: "moong-chilla", slot: "breakfast", name: "Moong Dal Chilla with Mint Chutney", type: "veg", doshas: ["V", "P", "K"],
    ingredients: ["1/2 cup yellow moong dal (soaked 4 hrs)", "1 tsp grated ginger", "Coriander leaves", "1 tsp ghee", "Mint, coriander, lemon for chutney"],
    recipe: "Grind soaked moong with ginger and salt into a batter. Spread thin on a hot tawa, cook with ghee on both sides. Blend mint, coriander, lemon and a pinch of salt for chutney.",
    macros: { kcal: 280, protein: 15, carbs: 36, fat: 7, fiber: 6 },
    micros: { Iron: "2.8 mg", Folate: "180 mcg", Potassium: "480 mg", Magnesium: "75 mg", "Vitamin B1": "0.3 mg" },
    science: "Moong is the only legume Ayurveda calls Tridoshic — easy to digest for all body types. It has a low glycaemic index (~38) and 24% protein by dry weight. Soaking activates phytase which breaks down anti-nutrients, increasing mineral bioavailability by up to 50%. Folate supports red blood cell formation.",
    benefits: ["High protein keeps you full till lunch", "Stable blood sugar", "Supports muscle repair", "Gentle on the gut — no gas"],
    risks: ["Mid-morning hunger and sugar cravings", "Protein deficiency — muscle loss, hair fall, weak immunity", "Folate deficiency can cause fatigue and anaemia"],
  },
  {
    id: "vegetable-poha", slot: "breakfast", name: "Vegetable Poha with Peanuts", type: "veg", doshas: ["V", "P"],
    ingredients: ["1 cup thick poha", "1/4 cup peas, carrot, onion", "1 tbsp roasted peanuts", "Curry leaves, mustard seeds, turmeric", "1 tsp oil", "Lemon"],
    recipe: "Rinse poha and drain. Temper mustard seeds and curry leaves in oil, sauté onion and vegetables, add turmeric and salt. Mix in poha and peanuts, steam 2 min. Finish with lemon and coriander.",
    macros: { kcal: 310, protein: 8, carbs: 50, fat: 9, fiber: 4 },
    micros: { Iron: "4.5 mg", "Vitamin A": "320 mcg", "Vitamin C": "18 mg", Niacin: "3 mg" },
    science: "Poha (flattened rice) is made by parboiling and pounding rice in iron rollers, making it a surprisingly good iron source. Lemon juice's vitamin C converts non-heme iron into an absorbable form. Turmeric's curcumin is anti-inflammatory, and peanuts add healthy MUFA fats that slow carbohydrate absorption.",
    benefits: ["Light yet energising", "Good iron source for women", "Probiotic-like — poha is lightly fermented during processing", "Quick 15-minute meal"],
    risks: ["Iron-deficiency anaemia — fatigue, breathlessness, pale skin", "Low energy in the first half of the day", "Poor concentration"],
  },
  {
    id: "ragi-porridge", slot: "breakfast", name: "Ragi Porridge with Jaggery & Cardamom", type: "veg", doshas: ["P", "V"],
    ingredients: ["3 tbsp ragi (finger millet) flour", "1 cup milk or water", "1 tsp jaggery", "Pinch of cardamom", "4 chopped dates (optional)"],
    recipe: "Mix ragi flour in 1/4 cup cold water to avoid lumps. Boil the rest of the milk/water, add ragi paste and stir 6–7 min until thick. Add jaggery and cardamom off the flame.",
    macros: { kcal: 260, protein: 9, carbs: 42, fat: 5, fiber: 4 },
    micros: { Calcium: "390 mg", Iron: "2.5 mg", Magnesium: "60 mg", "Vitamin B12": "0.5 mcg" },
    science: "Ragi has the highest calcium of any cereal — about 344 mg per 100 g (10× rice). Its polyphenols and fibre slow glucose release, and it contains tryptophan which helps serotonin production. Ayurveda considers it cooling and nourishing for Pitta.",
    benefits: ["Builds strong bones and teeth", "Diabetic-friendly slow energy", "Good for growing children and post-menopausal women", "Gluten-free"],
    risks: ["Calcium deficiency — weak bones, osteoporosis, muscle cramps", "Brittle nails and dental problems", "Higher fracture risk with age"],
  },
  {
    id: "besan-veg-upma", slot: "breakfast", name: "Vegetable Daliya (Broken Wheat) Upma", type: "veg", doshas: ["K", "V"],
    ingredients: ["1/2 cup daliya", "1/2 cup mixed vegetables (beans, carrot, capsicum)", "Mustard seeds, ginger, green chilli", "1 tsp oil", "Black pepper"],
    recipe: "Dry roast daliya till aromatic. Temper mustard, ginger and chilli, sauté vegetables, add daliya and 1.5 cups hot water with salt. Pressure cook for 2 whistles. Finish with black pepper.",
    macros: { kcal: 270, protein: 8, carbs: 48, fat: 5, fiber: 8 },
    micros: { Iron: "2.2 mg", Magnesium: "80 mg", "Vitamin A": "250 mcg", Zinc: "1.5 mg", Selenium: "20 mcg" },
    science: "Daliya is whole wheat with the bran intact, giving 3× the fibre of white rava. Insoluble fibre increases stool bulk and satiety, aiding weight loss. Piperine in black pepper boosts thermogenesis and nutrient absorption — Ayurveda uses pepper to 'scrape' (Lekhana) excess Kapha.",
    benefits: ["High fibre for weight management", "Prevents constipation", "Lowers LDL cholesterol", "Long-lasting energy"],
    risks: ["Constipation and piles", "Weight gain from refined-carb breakfasts", "Higher cholesterol and heart disease risk"],
  },
  {
    id: "egg-bhurji", slot: "breakfast", name: "Masala Egg Bhurji with 1 Multigrain Roti", type: "egg", doshas: ["V", "K"],
    ingredients: ["2 eggs", "1 onion, 1 tomato chopped", "Turmeric, black pepper, coriander", "1 tsp ghee", "1 multigrain roti"],
    recipe: "Sauté onion in ghee, add tomato, turmeric and salt. Pour in beaten eggs and scramble on low heat till just set. Finish with pepper and coriander. Serve with a roti.",
    macros: { kcal: 330, protein: 17, carbs: 24, fat: 18, fiber: 4 },
    micros: { "Vitamin B12": "1.1 mcg", "Vitamin D": "2 mcg", Choline: "290 mg", Selenium: "30 mcg", Iron: "2.5 mg" },
    science: "Eggs provide complete protein with all 9 essential amino acids and a biological value of ~100. Choline is vital for memory (acetylcholine) and liver function. Eggs are one of the few natural food sources of vitamin D and B12 — nutrients many Indians are deficient in.",
    benefits: ["Complete protein for muscle building", "B12 for nerves and energy", "Choline supports memory", "Very filling"],
    risks: ["B12 deficiency — numbness, fatigue, memory issues", "Vitamin D deficiency — weak bones, low immunity", "Muscle loss"],
  },

  // ---------- MID MORNING ----------
  {
    id: "seasonal-fruit", slot: "midmorning", name: "Seasonal Fruit Bowl (Papaya / Guava / Apple)", type: "veg", doshas: ["P", "K"],
    ingredients: ["1 cup seasonal fruit — papaya, guava, apple or pomegranate", "Pinch of chaat masala (optional)"],
    recipe: "Cut fresh fruit and eat on its own — Ayurveda advises not mixing fruit with milk or meals.",
    macros: { kcal: 80, protein: 1, carbs: 19, fat: 0.4, fiber: 4 },
    micros: { "Vitamin C": "120 mg", "Vitamin A": "70 mcg", Potassium: "260 mg", Folate: "40 mcg" },
    science: "Guava and papaya are among the richest vitamin C sources (guava ~228 mg/100 g, 4× an orange). Papain enzyme in papaya aids protein digestion. Eating fruit alone avoids fermentation in the stomach — Ayurveda's 'Viruddha Ahara' (incompatible food) principle.",
    benefits: ["Boosts immunity", "Collagen formation for skin", "Natural antioxidants", "Healthy sweet craving fix"],
    risks: ["Low immunity and frequent infections", "Slow wound healing, bleeding gums", "Dull, ageing skin"],
  },
  {
    id: "buttermilk", slot: "midmorning", name: "Spiced Buttermilk (Masala Chaas)", type: "veg", doshas: ["V", "P", "K"],
    ingredients: ["1/2 cup fresh curd", "1 cup water", "Roasted cumin powder", "Pinch of rock salt", "Mint / curry leaves"],
    recipe: "Whisk curd with water until smooth. Add roasted cumin, rock salt and crushed mint. Drink fresh at room temperature.",
    macros: { kcal: 60, protein: 3.5, carbs: 5, fat: 2.5, fiber: 0.2 },
    micros: { Calcium: "150 mg", "Vitamin B2": "0.2 mg", Potassium: "200 mg", Probiotics: "Live Lactobacillus" },
    science: "Takra (buttermilk) is praised in Ayurveda as 'nectar for the gut'. Diluting curd removes its heaviness while retaining live Lactobacillus that improve gut microbiome diversity. Studies link regular probiotic intake to reduced IBS symptoms and better immunity.",
    benefits: ["Improves gut flora", "Hydrates and cools", "Aids digestion of heavy lunch", "Calcium for bones"],
    risks: ["Poor gut health — gas, IBS, irregular stools", "Dehydration", "Weakened immunity (70% of immune cells are in the gut)"],
  },
  {
    id: "roasted-chana", slot: "midmorning", name: "Roasted Chana + Green Tea", type: "veg", doshas: ["K", "P"],
    ingredients: ["1/4 cup roasted chana (with skin)", "1 cup green tea or tulsi tea"],
    recipe: "Simply snack on roasted chana. Brew green/tulsi tea for 2–3 minutes in hot (not boiling) water.",
    macros: { kcal: 130, protein: 7, carbs: 18, fat: 2.5, fiber: 5 },
    micros: { Iron: "2 mg", Magnesium: "50 mg", Zinc: "1.2 mg", Folate: "90 mcg" },
    science: "Roasted chana is low-GI and high in resistant starch which feeds good gut bacteria. Green tea catechins (EGCG) mildly increase fat oxidation. Tulsi is an adaptogen shown to reduce cortisol. Light, dry and astringent — exactly what balances Kapha.",
    benefits: ["Curbs hunger without heaviness", "Supports fat loss", "Reduces stress", "Plant protein boost"],
    risks: ["Unhealthy snacking — biscuits, namkeen", "Weight gain and insulin resistance", "Energy crash before lunch"],
  },

  // ---------- LUNCH ----------
  {
    id: "dal-rice-sabzi", slot: "lunch", name: "Moong Dal Tadka, Brown Rice, Lauki Sabzi & Salad", type: "veg", doshas: ["V", "P", "K"],
    ingredients: ["1/2 cup moong/toor dal", "1/2 cup brown rice (cooked 1 cup)", "1 cup lauki (bottle gourd)", "Cucumber-carrot salad", "1 tsp ghee, jeera, hing, turmeric"],
    recipe: "Pressure cook dal with turmeric. Temper ghee with jeera, hing, garlic and pour over dal. Cook lauki with jeera, turmeric and coriander powder. Serve with brown rice and fresh salad.",
    macros: { kcal: 520, protein: 20, carbs: 82, fat: 11, fiber: 11 },
    micros: { Iron: "4 mg", Magnesium: "140 mg", Folate: "200 mcg", Potassium: "900 mg", "Vitamin B1": "0.4 mg", Zinc: "3 mg" },
    science: "Dal + rice forms a complete protein: rice lacks lysine, dal lacks methionine — together they cover all essential amino acids. Lunch is the main meal because Ayurveda says Agni (digestion) peaks at noon, matching our circadian peak in digestive enzyme secretion. Hing reduces dal-induced gas; ghee helps absorb fat-soluble vitamins.",
    benefits: ["Balanced complete protein", "Steady energy all afternoon", "Lauki is hydrating and heart-friendly", "Fibre for gut health"],
    risks: ["Incomplete protein and nutrient gaps", "Afternoon energy slump", "Over-eating at dinner, causing poor sleep and weight gain"],
  },
  {
    id: "rajma-roti", slot: "lunch", name: "Rajma, 2 Jowar Rotis, Palak Raita", type: "veg", doshas: ["P", "K"],
    ingredients: ["1/2 cup rajma (soaked overnight)", "2 jowar rotis", "1 cup curd + blanched spinach", "Onion, tomato, ginger-garlic, garam masala"],
    recipe: "Pressure cook soaked rajma. Make masala with onion, tomato, ginger-garlic and spices, add rajma and simmer 10 min. Make jowar rotis. Mix chopped blanched spinach into curd with roasted cumin.",
    macros: { kcal: 560, protein: 24, carbs: 85, fat: 12, fiber: 18 },
    micros: { Iron: "6 mg", Calcium: "320 mg", Folate: "260 mcg", Potassium: "1100 mg", Magnesium: "160 mg" },
    science: "Rajma has ~22% protein and very high soluble fibre that lowers LDL cholesterol. Jowar (sorghum) is gluten-free with polyphenols that improve insulin sensitivity. Soaking overnight and pressure cooking deactivates lectins and reduces flatulence-causing oligosaccharides.",
    benefits: ["Very high fibre — great for diabetes", "Heart health", "Rich in iron and folate", "Keeps you full for 4–5 hours"],
    risks: ["High blood sugar spikes from refined wheat", "Elevated cholesterol", "Iron and folate deficiency"],
  },
  {
    id: "khichdi", slot: "lunch", name: "Vegetable Khichdi with Ghee & Kadhi", type: "veg", doshas: ["V", "P", "K"],
    ingredients: ["1/4 cup rice + 1/4 cup moong dal", "1 cup vegetables (carrot, peas, beans)", "1 tsp ghee", "Jeera, hing, turmeric, ginger", "Besan kadhi (curd + gram flour)"],
    recipe: "Wash rice and dal. Temper ghee with jeera, hing and ginger, add vegetables, rice, dal, turmeric, salt and 3 cups water. Pressure cook 3 whistles. Serve with light kadhi.",
    macros: { kcal: 480, protein: 18, carbs: 72, fat: 13, fiber: 8 },
    micros: { Iron: "3.2 mg", Calcium: "180 mg", "Vitamin A": "400 mcg", Folate: "150 mcg", Potassium: "700 mg" },
    science: "Khichdi is Ayurveda's classic detox meal — it gives the gut a rest while fully nourishing. Thoroughly cooked starch and protein are pre-broken, so digestion demands less energy. Curcumin with ghee (fat) is up to 7× better absorbed than curcumin alone.",
    benefits: ["Gut reset and easy digestion", "Anti-inflammatory", "Ideal during illness or recovery", "Complete protein"],
    risks: ["Gut inflammation from heavy, processed foods", "Poor recovery after illness", "Chronic indigestion"],
  },
  {
    id: "fish-curry", slot: "lunch", name: "Coastal Fish Curry with Red Rice & Beans Poriyal", type: "nonveg", doshas: ["V", "K"],
    ingredients: ["150 g fish (rohu, pomfret or mackerel)", "1/2 cup red/brown rice", "Coconut, kokum/tamarind, turmeric, chilli", "1 cup beans poriyal"],
    recipe: "Marinate fish in turmeric and salt. Grind coconut with spices, simmer with kokum, add fish and cook 8 minutes. Stir-fry beans with mustard and grated coconut. Serve with red rice.",
    macros: { kcal: 560, protein: 34, carbs: 58, fat: 20, fiber: 7 },
    micros: { "Omega-3 (EPA+DHA)": "1.2 g", "Vitamin D": "8 mcg", "Vitamin B12": "3 mcg", Selenium: "45 mcg", Iodine: "60 mcg" },
    science: "Oily fish like mackerel supply EPA and DHA omega-3 fats which lower triglycerides, reduce inflammation and support brain function. Fish is one of the best natural vitamin D sources. Kokum contains garcinol and hydroxycitric acid which aid digestion and fat metabolism.",
    benefits: ["Heart and brain health", "Lean high-quality protein", "Vitamin D and B12", "Reduces joint inflammation"],
    risks: ["Omega-3 deficiency — dry skin, joint pain, poor focus", "Higher heart disease risk", "B12 and vitamin D deficiency"],
  },
  {
    id: "chicken-curry", slot: "lunch", name: "Home-style Chicken Curry, 2 Rotis & Cucumber Raita", type: "nonveg", doshas: ["V"],
    ingredients: ["150 g chicken (skinless)", "2 whole wheat rotis", "Onion, tomato, ginger-garlic, spices", "1 tsp oil", "Curd + cucumber"],
    recipe: "Sauté onion, ginger-garlic and tomato with spices in oil. Add chicken and cook covered 20 min with minimal water. Serve with rotis and cucumber raita.",
    macros: { kcal: 580, protein: 42, carbs: 52, fat: 20, fiber: 7 },
    micros: { "Vitamin B12": "0.6 mcg", Niacin: "14 mg", Zinc: "3 mg", Selenium: "35 mcg", Iron: "3.5 mg" },
    science: "Chicken breast is ~31% protein with leucine that triggers muscle protein synthesis. Niacin (B3) is key for energy metabolism. Cucumber raita (cooling) balances the heat of meat — an Ayurvedic pairing that also supplies probiotics.",
    benefits: ["Muscle building and repair", "Boosts metabolism", "Zinc for immunity", "Very satiating"],
    risks: ["Muscle loss especially after 30", "Low immunity", "Slow recovery from exercise"],
  },

  // ---------- EVENING SNACK ----------
  {
    id: "makhana", slot: "snack", name: "Roasted Makhana + Masala Chai (less sugar)", type: "veg", doshas: ["V", "P", "K"],
    ingredients: ["1 cup makhana (fox nuts)", "1/2 tsp ghee", "Pinch of turmeric, pepper, salt", "1 cup chai with ginger & cardamom"],
    recipe: "Roast makhana in ghee on low flame for 6–8 min till crunchy. Season with turmeric, pepper and salt.",
    macros: { kcal: 150, protein: 4, carbs: 22, fat: 4.5, fiber: 2 },
    micros: { Magnesium: "60 mg", Potassium: "200 mg", Calcium: "60 mg", Kaempferol: "Flavonoid present" },
    science: "Makhana is low-GI, low in sodium and high in magnesium, which supports blood pressure regulation. It contains kaempferol, an anti-inflammatory flavonoid. Ayurveda considers it tridoshic and calming for the nervous system.",
    benefits: ["Healthy crunchy snack", "Supports blood pressure", "Good for sleep and nerves", "Weight-loss friendly"],
    risks: ["Fried snack habit — trans fats and weight gain", "High blood pressure from salty namkeen", "Evening energy crash"],
  },
  {
    id: "sprouts-chaat", slot: "snack", name: "Sprouts Chaat", type: "veg", doshas: ["K", "P"],
    ingredients: ["1 cup moong sprouts (lightly steamed)", "Onion, tomato, cucumber", "Lemon, chaat masala, coriander"],
    recipe: "Steam sprouts 3–4 minutes (easier to digest). Toss with chopped vegetables, lemon, chaat masala and coriander.",
    macros: { kcal: 140, protein: 9, carbs: 22, fat: 1, fiber: 6 },
    micros: { "Vitamin C": "25 mg", Folate: "120 mcg", Iron: "1.8 mg", "Vitamin K": "40 mcg" },
    science: "Sprouting increases vitamin C, B-vitamins and protein digestibility while reducing anti-nutrients. Light steaming reduces raw, gas-forming properties — important for Vata, which Ayurveda warns is aggravated by raw sprouts.",
    benefits: ["Living enzymes and vitamins", "Plant protein", "Very low fat", "Great for weight loss"],
    risks: ["Missed protein & vitamin intake", "Junk-food snacking", "Fatigue in the evening"],
  },
  {
    id: "dates-nuts", slot: "snack", name: "2 Dates + Walnuts + Warm Haldi Milk", type: "veg", doshas: ["V", "P"],
    ingredients: ["2 dates", "3 walnut halves", "1 cup milk", "1/4 tsp turmeric, pinch of pepper and cinnamon"],
    recipe: "Warm milk with turmeric, pepper and cinnamon for 3 minutes. Enjoy with dates and walnuts.",
    macros: { kcal: 260, protein: 9, carbs: 30, fat: 12, fiber: 3 },
    micros: { Calcium: "300 mg", "Omega-3 (ALA)": "1.2 g", Potassium: "500 mg", "Vitamin B12": "1 mcg" },
    science: "Walnuts are the richest plant source of ALA omega-3. Piperine in pepper increases curcumin absorption by up to 2000%. Dates provide quick natural sugars plus potassium, ideal for Vata's tendency to low energy and nervousness.",
    benefits: ["Brain health", "Strong bones", "Anti-inflammatory", "Grounds anxious energy"],
    risks: ["Evening fatigue and anxiety (Vata)", "Weak bones", "Inflammation and joint pain"],
  },
  {
    id: "boiled-egg-snack", slot: "snack", name: "2 Boiled Eggs with Pepper + Tulsi Tea", type: "egg", doshas: ["V", "K"],
    ingredients: ["2 eggs", "Black pepper, rock salt", "Tulsi tea"],
    recipe: "Boil eggs for 9 minutes, cool, peel and season with pepper and salt.",
    macros: { kcal: 150, protein: 12, carbs: 1, fat: 10, fiber: 0 },
    micros: { "Vitamin B12": "1.1 mcg", "Vitamin D": "2 mcg", Choline: "290 mg", Lutein: "0.5 mg" },
    science: "Eggs are nutrient-dense with lutein and zeaxanthin that protect the eyes from screen-related strain. Protein at snack time reduces dinner overeating by improving satiety hormones (PYY, GLP-1).",
    benefits: ["Protein boost", "Eye health", "Prevents overeating at dinner", "Zero sugar"],
    risks: ["Overeating at dinner", "Eye strain and poor nutrition", "Muscle loss"],
  },

  // ---------- DINNER ----------
  {
    id: "millet-khichdi", slot: "dinner", name: "Foxtail Millet Khichdi with Sautéed Greens", type: "veg", doshas: ["K", "P"],
    ingredients: ["1/3 cup foxtail millet", "2 tbsp moong dal", "1 cup spinach/methi", "Jeera, ginger, garlic", "1 tsp ghee"],
    recipe: "Soak millet 30 min. Cook with moong dal, turmeric and salt (3 whistles). Sauté greens with garlic and jeera in ghee, serve alongside.",
    macros: { kcal: 360, protein: 13, carbs: 56, fat: 8, fiber: 9 },
    micros: { Iron: "4 mg", Calcium: "150 mg", Magnesium: "110 mg", "Vitamin K": "300 mcg", Folate: "180 mcg" },
    science: "Foxtail millet has a glycaemic index around 50, lower than white rice (~73). Leafy greens supply nitrates and magnesium that relax blood vessels. Ayurveda advises a light dinner since Agni weakens after sunset — matching research showing poorer glucose tolerance at night.",
    benefits: ["Light dinner for better sleep", "Blood sugar control", "Iron and vitamin K", "Supports weight loss"],
    risks: ["Poor sleep from heavy dinners", "Night-time blood sugar spikes and weight gain", "Acid reflux"],
  },
  {
    id: "veg-soup-roti", slot: "dinner", name: "Mixed Vegetable Soup + Paneer Bhurji + 1 Roti", type: "veg", doshas: ["V", "P"],
    ingredients: ["1 bowl soup (pumpkin, carrot, tomato, beans)", "75 g paneer", "1 whole wheat roti", "Ginger, pepper, jeera"],
    recipe: "Boil vegetables with ginger, blend lightly and season with pepper. Crumble paneer and sauté with onion, capsicum and turmeric. Serve with a roti.",
    macros: { kcal: 400, protein: 19, carbs: 38, fat: 18, fiber: 7 },
    micros: { Calcium: "350 mg", "Vitamin A": "600 mcg", "Vitamin C": "30 mg", Phosphorus: "250 mg" },
    science: "Paneer is rich in casein — a slow-digesting protein that supplies amino acids through the night for muscle repair. Warm soups are easy on night-time digestion; beta-carotene from pumpkin and carrot supports eyes and skin.",
    benefits: ["Overnight muscle recovery", "Calcium for bones", "Eye and skin health", "Warm and comforting"],
    risks: ["Overnight muscle breakdown", "Weak bones", "Bloating from heavy, oily dinners"],
  },
  {
    id: "barley-soup", slot: "dinner", name: "Barley-Vegetable Soup with Moong Sprouts", type: "veg", doshas: ["K", "P"],
    ingredients: ["3 tbsp barley (jau)", "1 cup vegetables", "1/2 cup moong sprouts", "Ginger, garlic, pepper"],
    recipe: "Soak barley 1 hour. Pressure cook with vegetables, sprouts, ginger and garlic (4 whistles). Season with pepper and lemon.",
    macros: { kcal: 300, protein: 12, carbs: 52, fat: 3, fiber: 12 },
    micros: { "Beta-glucan": "3 g", Magnesium: "80 mg", Selenium: "15 mcg", Iron: "2.5 mg" },
    science: "Barley's beta-glucan fibre is proven (FDA-approved claim) to lower LDL cholesterol. Ayurveda (Charaka) lists Yava (barley) as the best grain for reducing Kapha and Medas (fat tissue).",
    benefits: ["Lowers cholesterol", "Excellent for weight loss", "Diabetes-friendly", "Reduces water retention"],
    risks: ["High cholesterol", "Obesity and fatty liver", "Water retention and swelling"],
  },
  {
    id: "grilled-chicken-dinner", slot: "dinner", name: "Tandoori Grilled Chicken + Sautéed Vegetables", type: "nonveg", doshas: ["K", "V"],
    ingredients: ["120 g chicken", "Curd, ginger-garlic, tandoori spices", "1 cup broccoli, capsicum, zucchini/beans", "1 tsp oil"],
    recipe: "Marinate chicken in curd and spices for 1 hour. Grill or pan-roast 15 min. Toss vegetables in hot oil with garlic and pepper.",
    macros: { kcal: 340, protein: 36, carbs: 14, fat: 15, fiber: 5 },
    micros: { "Vitamin C": "80 mg", Niacin: "12 mg", Selenium: "30 mcg", Potassium: "650 mg" },
    science: "A high-protein, low-carb dinner improves overnight fat oxidation and next-morning blood sugar. Curd marinade tenderises meat and reduces carcinogen formation during grilling.",
    benefits: ["Lean muscle and fat loss", "Low carb for evenings", "Vitamin C from vegetables", "No heaviness at bedtime"],
    risks: ["Weight gain from late carb-heavy meals", "Muscle loss", "Poor sleep quality"],
  },
  {
    id: "egg-curry-dinner", slot: "dinner", name: "Light Egg Curry with Millet Roti", type: "egg", doshas: ["V", "K"],
    ingredients: ["2 boiled eggs", "Onion-tomato gravy (light)", "1 bajra or jowar roti"],
    recipe: "Make a light gravy with onion, tomato, ginger and spices. Add halved boiled eggs and simmer 5 min. Serve with millet roti.",
    macros: { kcal: 360, protein: 17, carbs: 32, fat: 17, fiber: 5 },
    micros: { "Vitamin B12": "1.1 mcg", Iron: "3.5 mg", Magnesium: "70 mg", Choline: "290 mg" },
    science: "Bajra is warming (Ushna) in Ayurveda and rich in magnesium and iron — ideal in winter. Combined with egg protein it keeps blood sugar stable overnight.",
    benefits: ["Warming winter dinner", "Complete protein", "Iron for energy", "Gluten-free option"],
    risks: ["Feeling cold and low energy in winter", "Iron deficiency", "Night hunger"],
  },
];

// Daily habits (Dinacharya) shown with every chart.
const HABITS = [
  { title: "Wake up before sunrise (Brahma Muhurta)", why: "Aligns cortisol rhythm with daylight; studies link early rising to better mood and lower depression risk." },
  { title: "Eat lunch as your biggest meal", why: "Digestive enzymes and insulin sensitivity peak around midday (circadian nutrition research)." },
  { title: "Dinner 2–3 hours before bed", why: "Reduces acid reflux and allows melatonin to rise without digestive interference." },
  { title: "Sip warm water through the day", why: "Ayurveda says warm water keeps Agni strong; warm fluids improve gut motility." },
  { title: "Eat mindfully, sitting down, without screens", why: "Slower eating increases satiety hormones and reduces calorie intake by ~10–15%." },
  { title: "Avoid incompatible foods (Viruddha Ahara)", why: "e.g., milk with fish or sour fruit, heated honey — may cause indigestion and inflammation." },
];

// Rotating motivation quotes, shown as a toast every few seconds.
const QUOTES = [
  "“When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need.” — Ayurvedic proverb",
  "Every home-cooked meal is a vote for the body you want.",
  "Small steps daily beat big steps occasionally. 🌱",
  "Your gut rebuilds its lining every 3–5 days — today's meal is tomorrow's body.",
  "“Let food be thy medicine.” — Hippocrates",
  "It takes about 66 days to form a habit. Keep going — you're building one now.",
  "Discipline is choosing what you want most over what you want now.",
  "Strong Agni, strong life. Feed your digestive fire with care. 🔥",
  "You don't have to be perfect, just consistent.",
  "Health is the real wealth — invest in it three meals at a time.",
  "Progress, not perfection. One good meal at a time.",
  "Your future self will thank you for the choice you make today. 💚",
];

// Yoga + workout routine. "all" items suit everyone; dosha keys add tailored practices.
const WORKOUTS = {
  all: [
    { name: "Surya Namaskar", detail: "6–12 rounds", why: "A full-body flow that raises heart rate, improves flexibility and is shown to improve insulin sensitivity." },
    { name: "Anulom Vilom (alternate nostril breathing)", detail: "5 minutes", why: "Lowers resting heart rate and blood pressure by activating the parasympathetic nervous system." },
    { name: "Brisk walk after lunch/dinner", detail: "10–15 minutes", why: "A post-meal walk lowers blood sugar spikes by up to 30% (Shatapavali in Ayurveda)." },
    { name: "Shavasana / Yoga Nidra", detail: "5–10 minutes", why: "Reduces cortisol and improves sleep quality." },
  ],
  Vata: [
    { name: "Grounding poses: Tadasana, Vrikshasana, Balasana", detail: "Hold 30–60 sec each", why: "Slow, steady holds calm an overactive nervous system and improve balance." },
    { name: "Bodyweight strength: squats, wall push-ups, glute bridges", detail: "3 × 10, 3 days/week", why: "Builds muscle and bone density — Vata types tend to be light-framed." },
    { name: "Bhramari pranayama (humming bee)", detail: "7 rounds", why: "Humming stimulates the vagus nerve and reduces anxiety." },
  ],
  Pitta: [
    { name: "Cooling poses: Bhujangasana, Paschimottanasana, Matsyasana", detail: "Hold 30 sec each", why: "Forward bends and gentle backbends release heat and tension in the abdomen." },
    { name: "Swimming or cycling (moderate)", detail: "30 min, 3 days/week", why: "Cardio without overheating; avoid competitive, midday workouts." },
    { name: "Sheetali pranayama (cooling breath)", detail: "10 rounds", why: "Inhaling through a curled tongue cools the body and calms irritability." },
  ],
  Kapha: [
    { name: "Energising poses: Virabhadrasana, Utkatasana, Navasana", detail: "Hold 30–45 sec each", why: "Strong standing poses build heat and stimulate metabolism." },
    { name: "HIIT or brisk jogging", detail: "20–30 min, 4–5 days/week", why: "Vigorous exercise counters Kapha's sluggishness and burns fat efficiently." },
    { name: "Kapalbhati pranayama", detail: "3 rounds × 30 strokes", why: "Rapid exhalations activate abdominal muscles and digestion (avoid if pregnant or hypertensive)." },
  ],
};

// level: "urgent" = see a doctor before starting; "consult" = check with doctor; "ok" = safe with care.
const CONDITIONS = [
  { id: "diabetes", label: "Diabetes / high blood sugar", level: "consult", advice: "Consult your doctor — portion sizes of grains and fruits may need adjusting with your medication to avoid low sugar. Prefer millets, avoid jaggery/dates." },
  { id: "bp", label: "High blood pressure", level: "consult", advice: "Consult your doctor. Keep salt under 5 g/day, avoid pickles and papad. Skip Kapalbhati and intense HIIT until cleared." },
  { id: "thyroid", label: "Thyroid disorder", level: "consult", advice: "Consult your doctor. Take thyroid medicine 30–60 min before food; limit raw cruciferous vegetables and soy close to the dose." },
  { id: "heart", label: "Heart disease", level: "urgent", advice: "See a doctor before starting any workout or diet change. Avoid HIIT and strong breathing practices without cardiologist approval." },
  { id: "kidney", label: "Kidney disease", level: "urgent", advice: "See a doctor/nephrologist first — this plan's protein, potassium and phosphorus levels may not be safe for you." },
  { id: "pregnant", label: "Pregnant or breastfeeding", level: "urgent", advice: "See your gynaecologist before following this plan. Avoid Kapalbhati, twists and intense workouts; calorie needs are higher." },
  { id: "pcos", label: "PCOS / PCOD", level: "consult", advice: "Consult your doctor. The low-GI millets, legumes and regular exercise in this plan generally help — pair them with medical follow-up." },
  { id: "acidity", label: "Acidity / GERD", level: "ok", advice: "Generally safe. Prefer Pitta-cooling meals, avoid lying down after meals. See a doctor if symptoms last over 2 weeks." },
  { id: "joint", label: "Joint pain / arthritis", level: "consult", advice: "Consult your doctor or physiotherapist about high-impact exercise. Swap jogging/HIIT for walking, swimming and gentle yoga." },
  { id: "allergy", label: "Food allergy (nuts, dairy, gluten…)", level: "ok", advice: "Swap out any meal containing your allergen. See a doctor if you're unsure what triggers your reactions." },
];
