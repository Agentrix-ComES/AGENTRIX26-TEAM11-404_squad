const rescueKeywords = [
  'trapped', 'landslide', 'flood', 'water rising', 'roof', 'rescue', 'danger',
  'swept away', 'collapsed', 'buried', 'stuck', 'help', 'emergency',
  'නායයෑමක්', 'ගිලිලා', 'ගංවතුර', 'ගොඩගැසිලා', 'වතුර නැගීගෙන එම', 'සීවිලි බිමක', 'උදව්', 'ගලවා ගන්න'
];

const foodKeywords = [
  'hungry', 'food', 'rations', 'water bottle', 'milk powder', 'rice', 'bread',
  'dry rations', 'groceries', 'meals', 'starving', 'no food', 'කන්න',
  'හාල්', 'කෑම', 'බත්', 'පාන්', 'ජලය', 'කිරි පවුල', 'බඩගිනි'
];

const medicalKeywords = [
  'injury', 'injured', 'medicine', 'hospital', 'doctor', 'fever', 'sick',
  'pregnant', 'elderly', 'chronic', 'dialysis', 'diabetes', 'asthma',
  'urgent medical', 'ambulance', 'බේත්', 'තනාල', 'තුවාල', 'වෛද්‍ය',
  'රෝහල්', 'ප්‍රතිකාර', 'අසනීප', 'උණ'
];

const shelterKeywords = [
  'shelter', 'homeless', 'house destroyed', 'roof blown', 'displaced',
  'camp', 'temporary shelter', 'tent', 'නිවසක් නැත', 'නිවාස', 'කූඩාරම',
  'විනාශ වුණු නිවස', 'සැලැස්ම'
];

const infrastructureKeywords = [
  'road blocked', 'bridge collapsed', 'electricity', 'power line', 'telecommunication',
  'water supply', 'පාලම කඩා වැටුණු', 'විදුලි', 'මාර්ග වසා ඇත', 'ජල සැපයුම'
];

export interface ParsedIncident {
  category: 'Rescue' | 'Food & Rations' | 'Medical Support' | 'Shelter' | 'Infrastructure' | 'Other';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

export function parseSituationText(text: string): ParsedIncident {
  const lowerText = text.toLowerCase();

  // Check for rescue/urgent situations first
  const isRescue = rescueKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
  const isFood = foodKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
  const isMedical = medicalKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
  const isShelter = shelterKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
  const isInfrastructure = infrastructureKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));

  // Determine category
  let category: ParsedIncident['category'] = 'Other';
  if (isRescue) {
    category = 'Rescue';
  } else if (isMedical) {
    category = 'Medical Support';
  } else if (isFood) {
    category = 'Food & Rations';
  } else if (isShelter) {
    category = 'Shelter';
  } else if (isInfrastructure) {
    category = 'Infrastructure';
  }

  // Determine priority based on urgency indicators
  let priority: ParsedIncident['priority'] = 'Medium';

  const criticalIndicators = [
    'trapped', 'buried', 'swept away', 'collapsed', 'sinking', 'immediate danger',
    'dying', 'critical condition', 'unconscious', ' childbirth', 'baby',
    'ගිලෙමින්', 'වළලා ඇත', 'මියගිය', 'අවදානම', 'හදිසියි'
  ];

  const highIndicators = [
    'urgent', 'emergency', 'injured', 'pregnant', 'elderly', 'children',
    'chronic', 'diabetes', 'no food', 'starving', 'severe',
    'කඩිනම්', 'තුවාල', 'ගැබිනිය', 'වයස්ගත', 'ළමයි', 'හිඟ'
  ];

  const isCritical = criticalIndicators.some(ind => lowerText.includes(ind.toLowerCase()));
  const isHigh = highIndicators.some(ind => lowerText.includes(ind.toLowerCase()));

  if (isCritical || (isRescue && !isHigh)) {
    priority = 'Critical';
  } else if (isHigh || isMedical) {
    priority = 'High';
  } else if (isFood || isShelter) {
    priority = 'High';
  } else if (isInfrastructure) {
    priority = 'Medium';
  }

  return { category, priority };
}
