import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { Product } from '../types';
import { getNutriScoreColor, getNutriScoreDescription, formatNutrient, getNovaDescription, getNovaGroupColor } from '../services/openFoodFactsApi';

// Nutri-Score Info Modal Component
const NutriScoreInfoModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const nutriScoreData = [
    { score: 'A', color: '#038141', meaning: 'Best nutritional quality' },
    { score: 'B', color: '#85BB2F', meaning: 'Good quality' },
    { score: 'C', color: '#FECB02', meaning: 'Moderate quality' },
    { score: 'D', color: '#EE8100', meaning: 'Poor quality' },
    { score: 'E', color: '#dc2626', meaning: 'Worst nutritional quality' },
  ];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={modalStyles.overlay} onPress={onClose}>
        <View style={modalStyles.content} onStartShouldSetResponder={() => true}>
          <Text style={modalStyles.title}>Nutritional Quality</Text>
          <Text style={modalStyles.description}>
            Nutritional Quality is a nutrition label that rates food quality from A to E using a color-coded system.
          </Text>
          
          <View style={modalStyles.table}>
            <View style={modalStyles.tableHeader}>
              <Text style={[modalStyles.headerText, { width: 60 }]}>Score</Text>
              <Text style={[modalStyles.headerText, { flex: 1 }]}>Meaning</Text>
            </View>
            {nutriScoreData.map((item) => (
              <View key={item.score} style={modalStyles.tableRow}>
                <View style={{ width: 60, alignItems: 'center' }}>
                  <View style={[modalStyles.scoreBadge, { backgroundColor: item.color }]}>
                    <Text style={modalStyles.scoreBadgeText}>{item.score}</Text>
                  </View>
                </View>
                <Text style={[modalStyles.cellText, { flex: 1 }]}>
                  {item.meaning}
                </Text>
              </View>
            ))}
          </View>

          <Text style={modalStyles.tip}>
            Choose A or B for everyday foods. Limit D and E products.
          </Text>

          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
            <Text style={modalStyles.closeButtonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

// Additives Guide Modal Component
const AdditivesGuideModal = ({ visible, onClose, initialSearchQuery = '' }: { visible: boolean; onClose: () => void; initialSearchQuery?: string }) => {
  const additivesData = [
    {
      category: 'Safe (E300-E399, E500-E599)',
      color: '#038141',
      emoji: '🟢',
      description: 'Antioxidants, vitamins, acids, salts & minerals. Generally safe at permitted levels.',
      items: [
        // E300-E399: Antioxidants & Acids
        { code: 'E300', name: 'Ascorbic acid (Vitamin C)' },
        { code: 'E301', name: 'Sodium ascorbate (Vitamin C)' },
        { code: 'E302', name: 'Calcium ascorbate (Vitamin C)' },
        { code: 'E304', name: 'Ascorbyl palmitate (antioxidant)' },
        { code: 'E306', name: 'Tocopherols (Vitamin E)' },
        { code: 'E307', name: 'Alpha-tocopherol (Vitamin E)' },
        { code: 'E308', name: 'Gamma-tocopherol (Vitamin E)' },
        { code: 'E309', name: 'Delta-tocopherol (Vitamin E)' },
        { code: 'E322', name: 'Lecithin (natural emulsifier)' },
        { code: 'E325', name: 'Sodium lactate (humectant)' },
        { code: 'E326', name: 'Potassium lactate (antioxidant)' },
        { code: 'E327', name: 'Calcium lactate (firming agent)' },
        { code: 'E330', name: 'Citric acid (natural preservative)' },
        { code: 'E331', name: 'Sodium citrate (acidity regulator)' },
        { code: 'E332', name: 'Potassium citrate (stabilizer)' },
        { code: 'E333', name: 'Calcium citrate (firming agent)' },
        { code: 'E334', name: 'Tartaric acid (natural acid)' },
        { code: 'E335', name: 'Sodium tartrate (stabilizer)' },
        { code: 'E336', name: 'Potassium tartrate (cream of tartar)' },
        { code: 'E337', name: 'Sodium potassium tartrate' },
        { code: 'E338', name: 'Phosphoric acid (acidity regulator)' },
        { code: 'E339', name: 'Sodium phosphates (emulsifier)' },
        { code: 'E340', name: 'Potassium phosphates (stabilizer)' },
        { code: 'E341', name: 'Calcium phosphates (anti-caking)' },
        { code: 'E350', name: 'Sodium malate (acidity regulator)' },
        { code: 'E351', name: 'Potassium malate' },
        { code: 'E352', name: 'Calcium malate' },
        { code: 'E353', name: 'Metatartaric acid' },
        { code: 'E354', name: 'Calcium tartrate' },
        { code: 'E355', name: 'Adipic acid' },
        { code: 'E356', name: 'Sodium adipate' },
        { code: 'E357', name: 'Potassium adipate' },
        { code: 'E363', name: 'Succinic acid' },
        { code: 'E380', name: 'Triammonium citrate' },
        { code: 'E385', name: 'Calcium disodium EDTA' },
        { code: 'E392', name: 'Rosemary extract (antioxidant)' },
        // E500-E599: Salts & Minerals
        { code: 'E500', name: 'Sodium bicarbonate (baking soda)' },
        { code: 'E501', name: 'Potassium carbonates (leavening)' },
        { code: 'E503', name: 'Ammonium carbonates (leavening)' },
        { code: 'E504', name: 'Magnesium carbonates (anti-caking)' },
        { code: 'E507', name: 'Hydrochloric acid (acidity regulator)' },
        { code: 'E508', name: 'Potassium chloride (salt substitute)' },
        { code: 'E509', name: 'Calcium chloride (firming agent)' },
        { code: 'E510', name: 'Ammonium chloride (flour treatment)' },
        { code: 'E511', name: 'Magnesium chloride (firming agent)' },
        { code: 'E514', name: 'Sodium sulfates (diluent)' },
        { code: 'E515', name: 'Potassium sulfates (salt substitute)' },
        { code: 'E516', name: 'Calcium sulfate (mineral)' },
        { code: 'E517', name: 'Ammonium sulfate (flour treatment)' },
        { code: 'E524', name: 'Sodium hydroxide (acidity regulator)' },
        { code: 'E525', name: 'Potassium hydroxide (acidity regulator)' },
        { code: 'E526', name: 'Calcium hydroxide (firming agent)' },
        { code: 'E529', name: 'Calcium oxide (flour treatment)' },
        { code: 'E530', name: 'Magnesium oxide (anti-caking)' },
        { code: 'E535', name: 'Sodium ferrocyanide (anti-caking)' },
        { code: 'E536', name: 'Potassium ferrocyanide (anti-caking)' },
        { code: 'E551', name: 'Silicon dioxide (anti-caking)' },
        { code: 'E552', name: 'Calcium silicate (anti-caking)' },
        { code: 'E553a', name: 'Magnesium silicate (anti-caking)' },
        { code: 'E553b', name: 'Talc (anti-caking)' },
        { code: 'E570', name: 'Fatty acids (glazing agent)' },
        { code: 'E574', name: 'Gluconic acid (acidity regulator)' },
        { code: 'E575', name: 'Glucono delta-lactone (acidifier)' },
        { code: 'E576', name: 'Sodium gluconate (sequestrant)' },
        { code: 'E577', name: 'Potassium gluconate (sequestrant)' },
        { code: 'E578', name: 'Calcium gluconate (firming agent)' },
        { code: 'E579', name: 'Ferrous gluconate (color retention)' },
        { code: 'E585', name: 'Ferrous lactate (color retention)' },
      ],
    },
    {
      category: 'Caution - Colors (E100-E199)',
      color: '#FECB02',
      emoji: '🟡',
      description: 'Food colorings. Natural ones are fine; synthetic "Southampton Six" (E102, E104, E110, E122, E124, E129) require warning labels for effects on children.',
      items: [
        // Natural colors (generally fine)
        { code: 'E100', name: 'Curcumin (natural yellow - turmeric)' },
        { code: 'E101', name: 'Riboflavin (Vitamin B2)' },
        { code: 'E120', name: 'Cochineal/Carmine (insect-derived red)' },
        { code: 'E140', name: 'Chlorophyll (natural green)' },
        { code: 'E141', name: 'Copper chlorophyll (green)' },
        { code: 'E150a', name: 'Caramel color (plain - OK)' },
        { code: 'E150b', name: 'Caustic sulfite caramel' },
        { code: 'E150c', name: 'Ammonia caramel' },
        { code: 'E150d', name: 'Sulfite ammonia caramel' },
        { code: 'E153', name: 'Vegetable carbon (black)' },
        { code: 'E160a', name: 'Carotenes (natural orange)' },
        { code: 'E160b', name: 'Annatto (natural orange-red)' },
        { code: 'E160c', name: 'Paprika extract (natural)' },
        { code: 'E160d', name: 'Lycopene (natural red - tomato)' },
        { code: 'E161b', name: 'Lutein (natural yellow)' },
        { code: 'E162', name: 'Beetroot red (natural)' },
        { code: 'E163', name: 'Anthocyanins (natural - berries)' },
        { code: 'E170', name: 'Calcium carbonate (white)' },
        { code: 'E171', name: 'Titanium dioxide (white - restricted)' },
        { code: 'E172', name: 'Iron oxides (natural colors)' },
        // Southampton Six - synthetic, require warning
        { code: 'E102', name: '⚠️ Tartrazine (synthetic yellow)' },
        { code: 'E104', name: '⚠️ Quinoline Yellow (synthetic)' },
        { code: 'E110', name: '⚠️ Sunset Yellow (synthetic)' },
        { code: 'E122', name: '⚠️ Carmoisine/Azorubine (synthetic red)' },
        { code: 'E124', name: '⚠️ Ponceau 4R (synthetic red)' },
        { code: 'E129', name: '⚠️ Allura Red (synthetic)' },
        // Other synthetic colors
        { code: 'E123', name: 'Amaranth (synthetic red - restricted)' },
        { code: 'E127', name: 'Erythrosine (synthetic red)' },
        { code: 'E131', name: 'Patent Blue V (synthetic)' },
        { code: 'E132', name: 'Indigo Carmine (synthetic blue)' },
        { code: 'E133', name: 'Brilliant Blue FCF (synthetic)' },
        { code: 'E142', name: 'Green S (synthetic green)' },
        { code: 'E151', name: 'Brilliant Black BN (synthetic)' },
        { code: 'E154', name: 'Brown FK (synthetic)' },
        { code: 'E155', name: 'Brown HT (synthetic)' },
        { code: 'E180', name: 'Litholrubine BK (synthetic)' },
      ],
    },
    {
      category: 'Caution - Emulsifiers (E400-E499)',
      color: '#FECB02',
      emoji: '🟡',
      description: 'Thickeners, stabilizers & emulsifiers. Generally safe, but many indicate ultra-processed food. Some studied for potential gut microbiome effects.',
      items: [
        // Natural thickeners (generally fine)
        { code: 'E400', name: 'Alginic acid (seaweed)' },
        { code: 'E401', name: 'Sodium alginate (seaweed)' },
        { code: 'E402', name: 'Potassium alginate (seaweed)' },
        { code: 'E406', name: 'Agar (natural - seaweed)' },
        { code: 'E407', name: 'Carrageenan (seaweed - debated)' },
        { code: 'E410', name: 'Locust bean gum (natural)' },
        { code: 'E412', name: 'Guar gum (natural)' },
        { code: 'E413', name: 'Tragacanth (natural)' },
        { code: 'E414', name: 'Acacia gum (natural)' },
        { code: 'E415', name: 'Xanthan gum (fermented)' },
        { code: 'E416', name: 'Karaya gum (natural)' },
        { code: 'E417', name: 'Tara gum (natural)' },
        { code: 'E418', name: 'Gellan gum (fermented)' },
        { code: 'E420', name: 'Sorbitol (sweetener - laxative effect)' },
        { code: 'E421', name: 'Mannitol (sweetener - laxative effect)' },
        { code: 'E422', name: 'Glycerol (humectant)' },
        { code: 'E440', name: 'Pectin (natural - fruit)' },
        // Emulsifiers (ultra-processed markers)
        { code: 'E432', name: 'Polysorbate 20' },
        { code: 'E433', name: 'Polysorbate 80' },
        { code: 'E434', name: 'Polysorbate 40' },
        { code: 'E435', name: 'Polysorbate 60' },
        { code: 'E436', name: 'Polysorbate 65' },
        { code: 'E442', name: 'Ammonium phosphatides' },
        { code: 'E450', name: 'Diphosphates (emulsifier)' },
        { code: 'E451', name: 'Triphosphates (emulsifier)' },
        { code: 'E452', name: 'Polyphosphates (emulsifier)' },
        { code: 'E460', name: 'Cellulose (plant fiber)' },
        { code: 'E461', name: 'Methyl cellulose' },
        { code: 'E464', name: 'Hydroxypropyl methyl cellulose' },
        { code: 'E466', name: 'Carboxymethyl cellulose' },
        { code: 'E471', name: 'Mono/diglycerides (common)' },
        { code: 'E472a', name: 'Acetic acid esters of mono/diglycerides' },
        { code: 'E472b', name: 'Lactic acid esters' },
        { code: 'E472c', name: 'Citric acid esters' },
        { code: 'E472e', name: 'DATEM (bread improver)' },
        { code: 'E473', name: 'Sucrose esters of fatty acids' },
        { code: 'E475', name: 'Polyglycerol esters' },
        { code: 'E476', name: 'PGPR (chocolate emulsifier)' },
        { code: 'E481', name: 'Sodium stearoyl-2-lactylate' },
        { code: 'E482', name: 'Calcium stearoyl-2-lactylate' },
        { code: 'E491', name: 'Sorbitan monostearate' },
        { code: 'E492', name: 'Sorbitan tristearate' },
      ],
    },
    {
      category: 'Caution - Flavor Enhancers (E600-E699)',
      color: '#FECB02',
      emoji: '🟡',
      description: 'Flavor enhancers including MSG. Safe for most but some people report sensitivity. Often indicates highly processed food.',
      items: [
        { code: 'E620', name: 'Glutamic acid' },
        { code: 'E621', name: 'MSG (monosodium glutamate)' },
        { code: 'E622', name: 'Monopotassium glutamate' },
        { code: 'E623', name: 'Calcium diglutamate' },
        { code: 'E624', name: 'Monoammonium glutamate' },
        { code: 'E625', name: 'Magnesium diglutamate' },
        { code: 'E626', name: 'Guanylic acid' },
        { code: 'E627', name: 'Disodium guanylate' },
        { code: 'E628', name: 'Dipotassium guanylate' },
        { code: 'E629', name: 'Calcium guanylate' },
        { code: 'E630', name: 'Inosinic acid' },
        { code: 'E631', name: 'Disodium inosinate' },
        { code: 'E632', name: 'Dipotassium inosinate' },
        { code: 'E633', name: 'Calcium inosinate' },
        { code: 'E634', name: 'Calcium 5-ribonucleotides' },
        { code: 'E635', name: 'Disodium 5-ribonucleotides' },
        { code: 'E636', name: 'Maltol' },
        { code: 'E637', name: 'Ethyl maltol' },
        { code: 'E640', name: 'Glycine' },
        { code: 'E641', name: 'L-leucine' },
        { code: 'E650', name: 'Zinc acetate' },
      ],
    },
    {
      category: 'Caution - Misc/Sweeteners (E900-E1599)',
      color: '#FECB02',
      emoji: '🟡',
      description: 'Mixed category: glazing agents, sweeteners, gases, modified starches. Sweeteners debated for daily intake, especially in children.',
      items: [
        // Glazing agents
        { code: 'E900', name: 'Dimethylpolysiloxane (anti-foaming)' },
        { code: 'E901', name: 'Beeswax (natural coating)' },
        { code: 'E902', name: 'Candelilla wax' },
        { code: 'E903', name: 'Carnauba wax (natural)' },
        { code: 'E904', name: 'Shellac (glazing)' },
        // Flour treatment
        { code: 'E920', name: 'L-cysteine (flour treatment)' },
        // Gases
        { code: 'E938', name: 'Argon (packaging gas)' },
        { code: 'E941', name: 'Nitrogen (packaging gas)' },
        { code: 'E942', name: 'Nitrous oxide (propellant)' },
        { code: 'E948', name: 'Oxygen (packaging gas)' },
        // Sweeteners
        { code: 'E950', name: 'Acesulfame K (artificial sweetener)' },
        { code: 'E951', name: 'Aspartame (artificial sweetener)' },
        { code: 'E952', name: 'Cyclamate (restricted in some countries)' },
        { code: 'E953', name: 'Isomalt (sugar alcohol)' },
        { code: 'E954', name: 'Saccharin (artificial sweetener)' },
        { code: 'E955', name: 'Sucralose (artificial sweetener)' },
        { code: 'E957', name: 'Thaumatin (natural sweetener)' },
        { code: 'E959', name: 'Neohesperidine DC' },
        { code: 'E960', name: 'Steviol glycosides (stevia - natural)' },
        { code: 'E961', name: 'Neotame (artificial sweetener)' },
        { code: 'E962', name: 'Aspartame-acesulfame salt' },
        { code: 'E965', name: 'Maltitol (sugar alcohol)' },
        { code: 'E966', name: 'Lactitol (sugar alcohol)' },
        { code: 'E967', name: 'Xylitol (sugar alcohol)' },
        { code: 'E968', name: 'Erythritol (natural sugar alcohol)' },
        // Modified starches (E1400+)
        { code: 'E1400', name: 'Dextrins (modified starch)' },
        { code: 'E1404', name: 'Oxidized starch' },
        { code: 'E1410', name: 'Monostarch phosphate' },
        { code: 'E1412', name: 'Distarch phosphate' },
        { code: 'E1414', name: 'Acetylated distarch phosphate' },
        { code: 'E1420', name: 'Acetylated starch' },
        { code: 'E1422', name: 'Acetylated distarch adipate' },
        { code: 'E1440', name: 'Hydroxypropyl starch' },
        { code: 'E1442', name: 'Hydroxypropyl distarch phosphate' },
        { code: 'E1450', name: 'Starch sodium octenyl succinate' },
        { code: 'E1520', name: 'Propylene glycol' },
      ],
    },
    {
      category: 'Avoid - Preservatives (E200-E299)',
      color: '#dc2626',
      emoji: '🔴',
      description: 'Preservatives including sulfites (E220-E228) which trigger sensitivities, and nitrites/nitrates (E249-E252) linked to nitrosamine concerns in processed meats.',
      items: [
        // Sorbates (generally OK but watchlist)
        { code: 'E200', name: 'Sorbic acid (preservative)' },
        { code: 'E201', name: 'Sodium sorbate' },
        { code: 'E202', name: 'Potassium sorbate (common)' },
        { code: 'E203', name: 'Calcium sorbate' },
        // Benzoates (can trigger sensitivities)
        { code: 'E210', name: 'Benzoic acid (preservative)' },
        { code: 'E211', name: 'Sodium benzoate (common - sensitivity trigger)' },
        { code: 'E212', name: 'Potassium benzoate' },
        { code: 'E213', name: 'Calcium benzoate' },
        // Parabens
        { code: 'E214', name: 'Ethylparaben' },
        { code: 'E215', name: 'Sodium ethyl p-hydroxybenzoate' },
        { code: 'E216', name: 'Propylparaben' },
        { code: 'E217', name: 'Sodium propyl p-hydroxybenzoate' },
        { code: 'E218', name: 'Methylparaben' },
        { code: 'E219', name: 'Sodium methyl p-hydroxybenzoate' },
        // SULFITES - common allergen/sensitivity trigger
        { code: 'E220', name: '⚠️ Sulfur dioxide (sulfite - allergen)' },
        { code: 'E221', name: '⚠️ Sodium sulfite' },
        { code: 'E222', name: '⚠️ Sodium bisulfite' },
        { code: 'E223', name: '⚠️ Sodium metabisulfite' },
        { code: 'E224', name: '⚠️ Potassium metabisulfite' },
        { code: 'E225', name: '⚠️ Potassium sulfite' },
        { code: 'E226', name: '⚠️ Calcium sulfite' },
        { code: 'E227', name: '⚠️ Calcium bisulfite' },
        { code: 'E228', name: '⚠️ Potassium bisulfite' },
        // Biphenyl/fungicides
        { code: 'E230', name: 'Biphenyl (citrus fungicide)' },
        { code: 'E231', name: 'Orthophenyl phenol' },
        { code: 'E232', name: 'Sodium orthophenyl phenol' },
        { code: 'E233', name: 'Thiabendazole (fungicide)' },
        // Nisin
        { code: 'E234', name: 'Nisin (preservative)' },
        { code: 'E235', name: 'Natamycin (antifungal)' },
        { code: 'E239', name: 'Hexamethylene tetramine' },
        { code: 'E242', name: 'Dimethyl dicarbonate' },
        // NITRITES/NITRATES - nitrosamine concern
        { code: 'E249', name: '⚠️ Potassium nitrite (processed meat)' },
        { code: 'E250', name: '⚠️ Sodium nitrite (bacon, ham - nitrosamine risk)' },
        { code: 'E251', name: '⚠️ Sodium nitrate (cured meats)' },
        { code: 'E252', name: '⚠️ Potassium nitrate (cured meats)' },
        // Acetates, propionates
        { code: 'E260', name: 'Acetic acid (vinegar - actually safe)' },
        { code: 'E261', name: 'Potassium acetate' },
        { code: 'E262', name: 'Sodium acetate' },
        { code: 'E263', name: 'Calcium acetate' },
        { code: 'E270', name: 'Lactic acid (natural - actually safe)' },
        { code: 'E280', name: 'Propionic acid' },
        { code: 'E281', name: 'Sodium propionate' },
        { code: 'E282', name: 'Calcium propionate (bread)' },
        { code: 'E283', name: 'Potassium propionate' },
        { code: 'E284', name: 'Boric acid (restricted)' },
        { code: 'E285', name: 'Sodium tetraborate (restricted)' },
        { code: 'E290', name: 'Carbon dioxide (carbonation - safe)' },
        { code: 'E296', name: 'Malic acid (natural - safe)' },
        { code: 'E297', name: 'Fumaric acid' },
      ],
    },
  ];

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  // Update search query when modal opens with a pre-selected additive
  React.useEffect(() => {
    if (visible) {
      setSearchQuery(initialSearchQuery);
    }
  }, [visible, initialSearchQuery]);

  const filteredData = searchQuery.trim() === ''
    ? additivesData
    : additivesData.map(category => ({
        ...category,
        items: category.items.filter(item =>
          item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(category => category.items.length > 0);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <SafeAreaView style={additiveStyles.fullScreenContainer}>
        <View style={additiveStyles.header}>
          <Text style={additiveStyles.headerTitle}>Additives Guide</Text>
        </View>
          
        <TextInput
          style={additiveStyles.searchInput}
          placeholder="Search E-number or name..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
          
        <ScrollView style={{ flex: 1 }} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
          {filteredData.length === 0 ? (
            <Text style={additiveStyles.noResults}>No additives found</Text>
          ) : (
            filteredData.map((category) => (
              <View key={category.category} style={additiveStyles.categorySection}>
                <View style={[additiveStyles.categoryHeader, { backgroundColor: category.color }]}>
                  <Text style={additiveStyles.categoryTitle}>
                    {category.emoji} {category.category}
                  </Text>
                </View>
                {category.items.map((item) => {
                  return (
                    <View key={item.code} style={additiveStyles.additiveRow}>
                      <Text style={additiveStyles.additiveCode}>{item.code}</Text>
                      <Text style={additiveStyles.additiveName}>{item.name}</Text>
                    </View>
                  );
                })}
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity style={additiveStyles.closeButton} onPress={onClose}>
          <Text style={additiveStyles.closeButtonText}>Got it!</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

const additiveStyles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 40,
  },
  header: {
    marginBottom: 15,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#4ade80',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 30,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  noResults: {
    color: '#64748b',
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
  },
  categorySection: {
    marginBottom: 15,
  },
  categoryHeader: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  additiveRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  additiveCode: {
    width: 50,
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  additiveName: {
    flex: 1,
    color: '#cbd5e1',
    fontSize: 12,
  },
});

// Food Analysis Modal Component
const FoodAnalysisModal = ({ visible, onClose, nutriments }: { visible: boolean; onClose: () => void; nutriments: any }) => {
  const fat = nutriments?.fat_100g || 0;
  const carbs = nutriments?.carbohydrates_100g || 0;
  const proteins = nutriments?.proteins_100g || 0;
  const fiber = nutriments?.fiber_100g || 0;
  const salt = nutriments?.salt_100g;
  const sugars = nutriments?.sugars_100g;
  const total = fat + carbs + proteins;
  
  const fatPercent = total > 0 ? ((fat / total) * 100).toFixed(1) : '0';
  const carbsPercent = total > 0 ? ((carbs / total) * 100).toFixed(1) : '0';
  const proteinsPercent = total > 0 ? ((proteins / total) * 100).toFixed(1) : '0';

  // Salt level classification (medium avg: 0.9g)
  const getSaltLevel = (value: number | undefined) => {
    if (value === undefined || value === null) return { level: 'Not Available', color: '#64748b', emoji: '❓' };
    if (value <= 0.3) return { level: 'Low', color: '#10b981', emoji: '🟢' };
    if (value <= 0.9) return { level: 'Medium', color: '#f59e0b', emoji: '🟡' };
    return { level: 'High', color: '#ef4444', emoji: '🔴' };
  };

  // Sugar level classification (medium avg: 13.75g)
  const getSugarLevel = (value: number | undefined) => {
    if (value === undefined || value === null) return { level: 'Not Available', color: '#64748b', emoji: '❓' };
    if (value <= 5) return { level: 'Low', color: '#10b981', emoji: '🟢' };
    if (value <= 13.75) return { level: 'Medium', color: '#f59e0b', emoji: '🟡' };
    return { level: 'High', color: '#ef4444', emoji: '🔴' };
  };

  const saltInfo = getSaltLevel(salt);
  const sugarInfo = getSugarLevel(sugars);

  // Saturated fat level classification
  const saturatedFat = nutriments?.['saturated-fat_100g'];
  const getSaturatedFatLevel = (value: number | undefined) => {
    if (value === undefined || value === null) return { level: 'Not Available', color: '#64748b', emoji: '❓' };
    if (value <= 1.5) return { level: 'Low', color: '#10b981', emoji: '🟢' };
    if (value <= 5) return { level: 'Medium', color: '#f59e0b', emoji: '🟡' };
    return { level: 'High', color: '#ef4444', emoji: '🔴' };
  };
  const saturatedFatInfo = getSaturatedFatLevel(saturatedFat);

  // Food analysis based on macronutrient percentages
  const getFoodAnalysis = () => {
    const fatPct = parseFloat(fatPercent);
    const carbsPct = parseFloat(carbsPercent);
    const proteinsPct = parseFloat(proteinsPercent);

    let analysis = '';
    let emoji = '';

    // High protein foods (>30%)
    if (proteinsPct >= 30) {
      if (fatPct < 30) {
        analysis = 'High-protein, lean food. Great for muscle building and satiety.';
        emoji = '💪';
      } else {
        analysis = 'High-protein but also high in fat. Good protein source, consume in moderation.';
        emoji = '🥩';
      }
    }
    // High carb foods (>60%)
    else if (carbsPct >= 60) {
      if (proteinsPct < 10) {
        analysis = 'High-carb, low-protein food. Quick energy source, but may spike blood sugar.';
        emoji = '⚡';
      } else {
        analysis = 'Carb-rich with moderate protein. Good for energy and recovery.';
        emoji = '🍞';
      }
    }
    // High fat foods (>50%)
    else if (fatPct >= 50) {
      analysis = 'High-fat food. Calorie-dense, best consumed in small portions.';
      emoji = '🧈';
    }
    // Balanced (no macro >50%)
    else if (fatPct >= 20 && carbsPct >= 20 && proteinsPct >= 20) {
      analysis = 'Balanced macronutrient profile. Good mix of nutrients.';
      emoji = '✅';
    }
    // Moderate carb + fat
    else if (carbsPct >= 40 && fatPct >= 30) {
      analysis = 'Carb and fat-heavy. Tasty but calorie-dense, enjoy occasionally.';
      emoji = '🍰';
    }
    // Default
    else {
      analysis = 'Moderate macronutrient distribution.';
      emoji = 'ℹ️';
    }

    return { analysis, emoji };
  };

  const foodAnalysis = getFoodAnalysis();

  const macros = [
    { name: 'Fat', value: fat, percent: fatPercent, color: '#f59e0b' },
    { name: 'Carbohydrates', value: carbs, percent: carbsPercent, color: '#3b82f6' },
    { name: 'Proteins', value: proteins, percent: proteinsPercent, color: '#10b981' },
  ];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={modalStyles.overlay} onPress={onClose}>
        <View style={modalStyles.content} onStartShouldSetResponder={() => true}>
          <Text style={modalStyles.title}>Food Analysis</Text>
          <Text style={modalStyles.description}>
            Macronutrient breakdown per 100g
          </Text>
          
          {/* Visual Bar */}
          <View style={analysisStyles.barContainer}>
            {macros.map((macro) => (
              <View
                key={macro.name}
                style={[
                  analysisStyles.barSegment,
                  { flex: parseFloat(macro.percent) || 0.1, backgroundColor: macro.color }
                ]}
              />
            ))}
          </View>

          {/* Legend */}
          <View style={analysisStyles.legendContainer}>
            {macros.map((macro) => (
              <View key={macro.name} style={analysisStyles.legendItem}>
                <View style={[analysisStyles.legendDot, { backgroundColor: macro.color }]} />
                <Text style={analysisStyles.legendText}>
                  {macro.name}: {macro.percent}%
                </Text>
              </View>
            ))}
          </View>

          {/* Saturated Fat Section */}
          <View style={analysisStyles.infoSection}>
            <Text style={analysisStyles.infoTitle}>Saturated Fat (per 100g)</Text>
            <View style={analysisStyles.levelRow}>
              <Text style={analysisStyles.infoText}>{saturatedFat !== undefined ? saturatedFat.toFixed(1) + 'g' : 'N/A'}</Text>
              <Text style={[analysisStyles.levelBadge, { backgroundColor: saturatedFatInfo.color }]}>
                {saturatedFatInfo.level}
              </Text>
            </View>
            <Text style={analysisStyles.levelHint}>Low: ≤1.5g • Medium: 1.5–5g • High: &gt;5g</Text>
          </View>

          {/* Health Indicators */}
          <View style={[analysisStyles.infoSection, { marginTop: 12 }]}>
            <Text style={analysisStyles.infoTitle}>Health Indicators (per 100g)</Text>
            
            <View style={analysisStyles.levelRow}>
              <Text style={analysisStyles.infoText}>Salt: {salt !== undefined ? salt.toFixed(2) + 'g' : 'N/A'}</Text>
              <Text style={[analysisStyles.levelBadge, { backgroundColor: saltInfo.color }]}>
                {saltInfo.level}
              </Text>
            </View>
            <Text style={analysisStyles.levelHint}>Low: ≤0.3g • Medium: 0.3–0.9g • High: &gt;0.9g</Text>
            
            <View style={[analysisStyles.levelRow, { marginTop: 10 }]}>
              <Text style={analysisStyles.infoText}>Sugar: {sugars !== undefined ? sugars.toFixed(1) + 'g' : 'N/A'}</Text>
              <Text style={[analysisStyles.levelBadge, { backgroundColor: sugarInfo.color }]}>
                {sugarInfo.level}
              </Text>
            </View>
            <Text style={analysisStyles.levelHint}>Low: ≤5g • Medium: 5–13.75g • High: &gt;13.75g</Text>
          </View>

          <TouchableOpacity style={[modalStyles.closeButton, { marginTop: 16 }]} onPress={onClose}>
            <Text style={modalStyles.closeButtonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const analysisStyles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 16,
  },
  barSegment: {
    height: '100%',
  },
  legendContainer: {
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: '#e2e8f0',
    fontSize: 14,
  },
  infoSection: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
  },
  infoTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    color: '#cbd5e1',
    fontSize: 13,
    marginBottom: 4,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  levelHint: {
    color: '#64748b',
    fontSize: 10,
    marginBottom: 4,
  },
  analysisBox: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  analysisEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  analysisText: {
    color: '#e2e8f0',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
});

// NOVA Group Info Modal Component
const NovaGroupInfoModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const novaData = [
    { group: 1, color: '#038141', meaning: 'Unprocessed or minimally processed', examples: 'Fresh fruits, vegetables, eggs, meat, milk' },
    { group: 2, color: '#85BB2F', meaning: 'Processed culinary ingredients', examples: 'Oils, butter, sugar, salt, flour' },
    { group: 3, color: '#FECB02', meaning: 'Processed foods', examples: 'Canned vegetables, cheese, bread, cured meats' },
    { group: 4, color: '#dc2626', meaning: 'Ultra-processed foods', examples: 'Soft drinks, chips, instant noodles, frozen pizza, candy' },
  ];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={modalStyles.overlay} onPress={onClose}>
        <View style={modalStyles.content} onStartShouldSetResponder={() => true}>
          <Text style={modalStyles.title}>Processing Level</Text>
          <Text style={modalStyles.description}>
            Processing Level classifies foods by their level of processing, not nutritional content.
          </Text>
          
          <View style={modalStyles.table}>
            {novaData.map((item) => (
              <View key={item.group} style={modalStyles.novaTableRow}>
                <View style={{ width: 50, alignItems: 'center' }}>
                  <View style={[modalStyles.scoreBadge, { backgroundColor: item.color }]}>
                    <Text style={modalStyles.scoreBadgeText}>{item.group}</Text>
                  </View>
                </View>
                <View style={{ flex: 1, paddingLeft: 10 }}>
                  <Text style={modalStyles.novaMeaning}>
                    {item.meaning}
                  </Text>
                  <Text style={modalStyles.novaExamples}>
                    {item.examples}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={modalStyles.tip}>
            Choose Level 1-2 for most of your diet. Limit Level 4 products.
          </Text>

          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
            <Text style={modalStyles.closeButtonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 380,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
  },
  table: {
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#334155',
    marginBottom: 5,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#94a3b8',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  scoreBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreBadgeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cellText: {
    fontSize: 13,
    color: '#cbd5e1',
  },
  tip: {
    fontSize: 13,
    color: '#4ade80',
    backgroundColor: '#0f2a1a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#4ade80',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  novaTableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  novaMeaning: {
    fontSize: 13,
    color: '#f8fafc',
    fontWeight: '600',
    marginBottom: 4,
  },
  novaExamples: {
    fontSize: 11,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
});

interface ProductDetailsScreenProps {
  product: Product;
  onScanAgain: () => void;
}

export default function ProductDetailsScreen({ product, onScanAgain }: ProductDetailsScreenProps) {
  const [nutriScoreModalVisible, setNutriScoreModalVisible] = useState(false);
  const [novaGroupModalVisible, setNovaGroupModalVisible] = useState(false);
  const [additivesModalVisible, setAdditivesModalVisible] = useState(false);
  const [selectedAdditive, setSelectedAdditive] = useState('');
  const [foodAnalysisModalVisible, setFoodAnalysisModalVisible] = useState(false);
  const nutriments = product.nutriments;
  const nutriScoreColor = getNutriScoreColor(product.nutriscore_grade);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Product Image */}
        {product.image_front_url && (
          <Image
            source={{ uri: product.image_front_url }}
            style={styles.productImage}
            resizeMode="contain"
          />
        )}

        {/* Product Name & Brand */}
        <View style={styles.headerSection}>
          <Text style={styles.productName}>
            {product.product_name || 'Unknown Product'}
          </Text>
          {product.brands && (
            <Text style={styles.brandName}>{product.brands}</Text>
          )}
          {product.quantity && (
            <Text style={styles.quantity}>{product.quantity}</Text>
          )}
        </View>

        {/* Guide Buttons Row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
          <TouchableOpacity 
            style={[styles.additivesButtonSmall, { flex: 1, alignItems: 'center' }]} 
            onPress={() => setFoodAnalysisModalVisible(true)}
          >
            <Text style={styles.additivesButtonSmallText}>Food Analysis</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.additivesButtonSmall, { flex: 1, alignItems: 'center' }]} 
            onPress={() => {
              setSelectedAdditive('');
              setAdditivesModalVisible(true);
            }}
          >
            <Text style={styles.additivesButtonSmallText}>Additives Guide</Text>
          </TouchableOpacity>
        </View>

        {/* Scores Section */}
        <View style={styles.scoresContainer}>
          {/* Nutri-Score */}
          {product.nutriscore_grade && ['a', 'b', 'c', 'd', 'e'].includes(product.nutriscore_grade.toLowerCase()) ? (
            <TouchableOpacity 
              style={styles.scoreCard} 
              onPress={() => setNutriScoreModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.scoreLabel}>Nutritional Quality ⓘ</Text>
              <View style={[styles.scoreBadge, { backgroundColor: nutriScoreColor }]}>
                <Text style={styles.scoreValue}>
                  {product.nutriscore_grade.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.novaDescription}>
                {getNutriScoreDescription(product.nutriscore_grade)}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.scoreCard} 
              onPress={() => setFoodAnalysisModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.scoreLabel}>Nutritional Quality</Text>
              <View style={[styles.scoreBadge, { backgroundColor: '#6B7280' }]}>
                <Text style={styles.scoreValue}>?</Text>
              </View>
              <Text style={styles.novaDescription}>Check Food Analysis</Text>
            </TouchableOpacity>
          )}

          {/* NOVA Group */}
          {product.nova_group ? (
            <TouchableOpacity 
              style={styles.scoreCard}
              onPress={() => setNovaGroupModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.scoreLabel}>Processing Level ⓘ</Text>
              <View style={[styles.scoreBadge, { backgroundColor: getNovaGroupColor(product.nova_group) }]}>
                <Text style={styles.scoreValue}>{product.nova_group}</Text>
              </View>
              <Text style={styles.novaDescription}>
                {getNovaDescription(product.nova_group)}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.scoreCard}
              onPress={() => setFoodAnalysisModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.scoreLabel}>Processing Level</Text>
              <View style={[styles.scoreBadge, { backgroundColor: '#6B7280' }]}>
                <Text style={styles.scoreValue}>?</Text>
              </View>
              <Text style={styles.novaDescription}>Check Food Analysis</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Nutrition Facts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition Facts</Text>
          <Text style={styles.servingInfo}>Per 100g</Text>
          
          <View style={styles.nutritionTable}>
            <NutrientRow label="Energy" value={formatNutrient(nutriments?.energy_kcal_100g, 'kcal')} />
            <NutrientRow label="Fat" value={formatNutrient(nutriments?.fat_100g)} highlight={product.nutrient_levels?.fat} />
            <NutrientRow label="  Saturated Fat" value={formatNutrient(nutriments?.['saturated-fat_100g'])} highlight={product.nutrient_levels?.saturated_fat} indent />
            <NutrientRow label="Carbohydrates" value={formatNutrient(nutriments?.carbohydrates_100g)} />
            <NutrientRow label="  Sugars" value={formatNutrient(nutriments?.sugars_100g)} highlight={product.nutrient_levels?.sugars} indent />
            <NutrientRow label="Fiber" value={formatNutrient(nutriments?.fiber_100g)} />
            <NutrientRow label="Proteins" value={formatNutrient(nutriments?.proteins_100g)} />
            <NutrientRow label="Salt" value={formatNutrient(nutriments?.salt_100g)} highlight={product.nutrient_levels?.salt} />
          </View>
        </View>

        {/* Ingredients */}
        {product.ingredients_text && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.ingredientsText}>{product.ingredients_text}</Text>
          </View>
        )}

        {/* Additives Found */}
        {product.additives_tags && product.additives_tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additives Found</Text>
            <View style={styles.additivesContainer}>
              {product.additives_tags.map((tag, index) => {
                const match = tag.match(/e(\d+[a-z]?)/i);
                const eNumber = match ? `E${match[1].toUpperCase()}` : tag;
                
                // Determine category color based on E-number ranges (matching Additives Guide)
                const num = parseInt(eNumber.replace(/[^\d]/g, ''));
                let badgeColor = '#FECB02'; // Default: Caution (yellow) - E100-199, E400-499, E600-699, E900+
                let textColor = '#1e293b';
                
                if ((num >= 300 && num <= 399) || (num >= 500 && num <= 599)) {
                  // Safe: Antioxidants/acids (E300-399) and Salts/minerals (E500-599)
                  badgeColor = '#038141'; // Green
                  textColor = '#fff';
                } else if (num >= 200 && num <= 299) {
                  // Avoid: Preservatives including sulfites, nitrates (E200-299)
                  badgeColor = '#dc2626'; // Red
                  textColor = '#fff';
                }
                
                return (
                  <TouchableOpacity 
                    key={index} 
                    style={[styles.additiveBadge, { backgroundColor: badgeColor }]}
                    onPress={() => {
                      setSelectedAdditive(eNumber);
                      setAdditivesModalVisible(true);
                    }}
                  >
                    <Text style={[styles.additiveText, { color: textColor }]}>{eNumber}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity onPress={() => {
              setSelectedAdditive('');
              setAdditivesModalVisible(true);
            }}>
              <Text style={styles.additivesLink}>View Additives Guide →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Allergens */}
        {product.allergens && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Allergens</Text>
            <Text style={styles.allergensText}>{product.allergens}</Text>
          </View>
        )}

        {/* Scan Again Button */}
        <TouchableOpacity style={styles.scanAgainButton} onPress={onScanAgain}>
          <Text style={styles.scanAgainText}>Scan Another Product</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>✦ Developed by Edgar1001 ✦</Text>
      </ScrollView>

      {/* Nutri-Score Info Modal */}
      <NutriScoreInfoModal
        visible={nutriScoreModalVisible}
        onClose={() => setNutriScoreModalVisible(false)}
      />

      {/* NOVA Group Info Modal */}
      <NovaGroupInfoModal
        visible={novaGroupModalVisible}
        onClose={() => setNovaGroupModalVisible(false)}
      />

      {/* Additives Guide Modal */}
      <AdditivesGuideModal
        visible={additivesModalVisible}
        onClose={() => {
          setAdditivesModalVisible(false);
          setSelectedAdditive('');
        }}
        initialSearchQuery={selectedAdditive}
      />

      {/* Food Analysis Modal */}
      <FoodAnalysisModal
        visible={foodAnalysisModalVisible}
        onClose={() => setFoodAnalysisModalVisible(false)}
        nutriments={nutriments}
      />
    </SafeAreaView>
  );
}

interface NutrientRowProps {
  label: string;
  value: string;
  highlight?: 'low' | 'moderate' | 'high';
  indent?: boolean;
}

function NutrientRow({ label, value, highlight, indent }: NutrientRowProps) {
  const getHighlightColor = () => {
    switch (highlight) {
      case 'low':
        return '#4ade80';
      case 'moderate':
        return '#fbbf24';
      case 'high':
        return '#ef4444';
      default:
        return undefined;
    }
  };

  return (
    <View style={styles.nutrientRow}>
      <Text style={[styles.nutrientLabel, indent && styles.indentLabel]}>{label}</Text>
      <View style={styles.nutrientValueContainer}>
        {highlight && (
          <View style={[styles.highlightDot, { backgroundColor: getHighlightColor() }]} />
        )}
        <Text style={styles.nutrientValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 20,
  },
  productImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 20,
  },
  headerSection: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  brandName: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 2,
  },
  quantity: {
    fontSize: 14,
    color: '#64748b',
  },
  scoresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  scoreCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 100,
    flex: 1,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  scoreBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  novaDescription: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 6,
  },
  section: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 12,
  },
  servingInfo: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  nutritionTable: {
    gap: 8,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  nutrientLabel: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  indentLabel: {
    color: '#94a3b8',
  },
  nutrientValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nutrientValue: {
    fontSize: 14,
    color: '#f8fafc',
    fontWeight: '500',
  },
  highlightDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  ingredientsText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  allergensText: {
    fontSize: 14,
    color: '#ef4444',
    lineHeight: 20,
  },
  additivesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  additiveBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  additiveText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  additivesLink: {
    color: '#60a5fa',
    fontSize: 14,
    marginTop: 5,
  },
  additivesButtonSmall: {
    backgroundColor: '#6366f1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  additivesButtonSmallText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  scanAgainButton: {
    backgroundColor: '#4ade80',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  scanAgainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  footer: {
    textAlign: 'center',
    color: '#6366f1',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 60,
  },
});
