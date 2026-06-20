import { Incident, DonorSupply, DashboardStats, DistrictData, ResourceData } from './types';

export const mockIncidents: Incident[] = [
  {
    id: 'INC-2024-001',
    sender_name: 'Kumara Perera',
    contact_number: '077-1234567',
    location: 'Meepagama Junction, Badulla',
    district: 'Badulla',
    coordinates: { lat: 6.9932, lng: 81.0555 },
    category: 'Rescue',
    priority: 'Critical',
    description: 'Landslide near Meepagama. 3 families trapped. Water level rising. Need immediate rescue. නායයෑමක් සිදු වුණා. පවුල් 3ක් ගොඩගැසිලා.',
    status: 'Open',
    reported_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'INC-2024-002',
    sender_name: 'Nimal Fernando',
    contact_number: '071-2345678',
    location: 'Nuwara Eliya Town Center',
    district: 'Nuwara Eliya',
    coordinates: { lat: 6.9497, lng: 80.7891 },
    category: 'Food & Rations',
    priority: 'High',
    description: '150 families in temporary camp need food supplies. No dry rations for 2 days. Children crying from hunger. දවස් 2ක් කෑමක් නැත.',
    status: 'Dispatching',
    reported_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'INC-2024-003',
    sender_name: 'Pushpa Jayawardena',
    contact_number: '076-3456789',
    location: 'Gampola Road, Kandy',
    district: 'Kandy',
    coordinates: { lat: 7.2964, lng: 80.6350 },
    category: 'Medical Support',
    priority: 'High',
    description: 'Pregnant woman in labor at flooded area. Cannot reach hospital. Road blocked by fallen trees. Need ambulance immediately. ගැබිනියක් දරුවෙක් බලාගන්න ඕනේ.',
    status: 'In Progress',
    reported_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'INC-2024-004',
    sender_name: 'Sunil Rathnayake',
    contact_number: '072-4567890',
    location: 'Polonnaruwa New Town',
    district: 'Polonnaruwa',
    coordinates: { lat: 7.9333, lng: 81.0167 },
    category: 'Shelter',
    priority: 'High',
    description: '200 families displaced from Parakrama Samudra area. Houses submerged. Need temporary shelters and dry clothes. නිවස් යටවෙලා.',
    status: 'Open',
    reported_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'INC-2024-005',
    sender_name: 'Kamala Devika',
    contact_number: '078-5678901',
    location: 'Matale Town',
    district: 'Matale',
    coordinates: { lat: 7.4675, lng: 80.6234 },
    category: 'Rescue',
    priority: 'Critical',
    description: 'Elderly couple trapped on roof due to flash flood. Water rising fast. They have been there for 6 hours. ගෙවල් වහළේ ඉන්නවා. වතුර නැගීගෙන එනවා.',
    status: 'Dispatching',
    reported_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'INC-2024-006',
    sender_name: 'Ruwan Priyadarshana',
    contact_number: '075-6789012',
    location: 'Kurunegala Junction',
    district: 'Kurunegala',
    coordinates: { lat: 7.4863, lng: 80.3647 },
    category: 'Infrastructure',
    priority: 'Medium',
    description: 'Main road to Colombo blocked by fallen electricity poles. Multiple villages cut off. Need urgent clearing. ප්‍රධාන මාර්ගය වසා ඇත.',
    status: 'In Progress',
    reported_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'INC-2024-007',
    sender_name: 'Lalith Bandara',
    contact_number: '072-7890123',
    location: 'Ratnapura Town',
    district: 'Ratnapura',
    coordinates: { lat: 6.7056, lng: 80.3847 },
    category: 'Rescue',
    priority: 'Critical',
    description: 'Gem mine collapsed. 8 workers trapped inside. Rescue operation needed. රත්නපුර පතලක් කඩා වැටුණා.',
    status: 'Open',
    reported_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'INC-2024-008',
    sender_name: 'Shanthi Kumari',
    contact_number: '077-8901234',
    location: 'Kegalle Hospital Road',
    district: 'Kegalle',
    coordinates: { lat: 7.2514, lng: 80.3467 },
    category: 'Medical Support',
    priority: 'High',
    description: 'Diabetic patient without insulin for 3 days. Insulin stock destroyed in flood. Urgent medicine needed. ඉන්සියුලින් බේත් නැත.',
    status: 'Dispatching',
    reported_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'INC-2024-009',
    sender_name: 'Mahinda Silva',
    contact_number: '076-9012345',
    location: 'Anuradhapura New Town',
    district: 'Anuradhapura',
    coordinates: { lat: 8.3114, lng: 80.4037 },
    category: 'Food & Rations',
    priority: 'High',
    description: 'Drought affected farmers need food assistance. 300 families without income for 2 months. Children malnourished. ගොවියෝ ආහාර අසාදා නැත.',
    status: 'Open',
    reported_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'INC-2024-010',
    sender_name: 'Thilini Lakmali',
    contact_number: '071-0123456',
    location: 'Galle Face, Colombo',
    district: 'Colombo',
    coordinates: { lat: 6.9271, lng: 79.8612 },
    category: 'Infrastructure',
    priority: 'Low',
    description: 'Water logging in several areas. Drains need clearing. Minor inconvenience to public transport.',
    status: 'Resolved',
    reported_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  }
];

export const mockDonorSupplies: DonorSupply[] = [
  {
    id: 'DON-001',
    donor_name: 'Keells Super',
    organization: 'John Keells Holdings',
    contact: 'info@keells.com',
    location: 'Colombo Distribution Center',
    district: 'Colombo',
    item_name: 'Dry Rations Pack',
    category: 'Food & Rations',
    quantity: 500,
    unit: 'packs',
    available_from: new Date().toISOString(),
    matched: false,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'DON-002',
    donor_name: 'Cargills Food City',
    organization: 'Cargills (Ceylon) PLC',
    contact: 'supplies@cargills.com',
    location: 'Kandy Warehouse',
    district: 'Kandy',
    item_name: 'Water Bottles',
    category: 'Food & Rations',
    quantity: 1000,
    unit: 'bottles',
    available_from: new Date().toISOString(),
    matched: false,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'DON-003',
    donor_name: 'Hemas Hospitals',
    organization: 'Hemas Holdings',
    contact: 'medical@hemas.com',
    location: 'Colombo Medical Hub',
    district: 'Colombo',
    item_name: 'First Aid Kits',
    category: 'Medical Support',
    quantity: 200,
    unit: 'kits',
    available_from: new Date().toISOString(),
    matched: true,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'DON-004',
    donor_name: 'Sri Lanka Army',
    organization: 'Sri Lanka Army - Volunteer Corps',
    contact: 'relief@army.lk',
    location: 'Panagoda Camp',
    district: 'Colombo',
    item_name: 'Emergency Tents',
    category: 'Shelter',
    quantity: 150,
    unit: 'units',
    available_from: new Date().toISOString(),
    matched: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'DON-005',
    donor_name: 'DFCC Bank',
    organization: 'DFCC Bank PLC',
    contact: 'csr@dfccbank.com',
    location: 'Rajagiriya Branch',
    district: 'Colombo',
    item_name: 'Milk Powder',
    category: 'Food & Rations',
    quantity: 300,
    unit: 'packs',
    available_from: new Date().toISOString(),
    matched: true,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'DON-006',
    donor_name: 'Dilmah Tea',
    organization: 'MJF Holdings',
    contact: 'foundation@dilmah.com',
    location: 'Peliyagoda',
    district: 'Gampaha',
    item_name: 'Bed Sheets & Towels',
    category: 'Shelter',
    quantity: 500,
    unit: 'sets',
    available_from: new Date().toISOString(),
    matched: false,
    created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'DON-007',
    donor_name: 'Sampath Bank',
    organization: 'Sampath Bank PLC',
    contact: 'community@sampathbank.lk',
    location: 'Kurunegala Branch',
    district: 'Kurunegala',
    item_name: 'Rice & Dhal',
    category: 'Food & Rations',
    quantity: 2000,
    unit: 'kg',
    available_from: new Date().toISOString(),
    matched: false,
    created_at: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'DON-008',
    donor_name: 'State Pharmaceutical Corp',
    organization: 'SPC',
    contact: 'supply@spc.gov.lk',
    location: 'Ratmalana',
    district: 'Colombo',
    item_name: 'Insulin Vials',
    category: 'Medical Support',
    quantity: 500,
    unit: 'vials',
    available_from: new Date().toISOString(),
    matched: true,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
];

export const mockDashboardStats: DashboardStats = {
  activeEmergencies: 12,
  familiesDisplaced: 4567,
  activeVolunteers: 342,
  reliefPacksDistributed: 2840,
  reliefPacksTarget: 5000
};

export const mockDistrictData: DistrictData[] = [
  { district: 'Badulla', incidents: 23, displaced: 456 },
  { district: 'Nuwara Eliya', incidents: 18, displaced: 380 },
  { district: 'Kandy', incidents: 15, displaced: 290 },
  { district: 'Polonnaruwa', incidents: 12, displaced: 245 },
  { district: 'Matale', incidents: 10, displaced: 198 },
  { district: 'Kurunegala', incidents: 8, displaced: 167 },
  { district: 'Ratnapura', incidents: 14, displaced: 312 },
  { district: 'Kegalle', incidents: 9, displaced: 178 },
  { district: 'Colombo', incidents: 5, displaced: 89 },
  { district: 'Gampaha', incidents: 7, displaced: 145 }
];

export const mockResourceData: ResourceData[] = [
  { category: 'Food', supply: 850, demand: 1200 },
  { category: 'Water', supply: 600, demand: 800 },
  { category: 'Medical', supply: 300, demand: 450 },
  { category: 'Shelter', supply: 200, demand: 500 },
  { category: 'Clothing', supply: 400, demand: 600 }
];
