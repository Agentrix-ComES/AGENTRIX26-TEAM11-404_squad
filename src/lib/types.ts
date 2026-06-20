export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'coordinator' | 'responder' | 'donor';
  organization?: string;
  created_at: string;
}

export interface Incident {
  id: string;
  sender_name: string;
  contact_number: string;
  location: string;
  district: string;
  coordinates?: { lat: number; lng: number };
  category: 'Rescue' | 'Food & Rations' | 'Medical Support' | 'Shelter' | 'Infrastructure' | 'Other';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  status: 'Open' | 'Dispatching' | 'In Progress' | 'Resolved';
  reported_at: string;
  assigned_to?: string;
  notes?: string;
}

export interface DonorSupply {
  id: string;
  donor_name: string;
  organization?: string;
  contact: string;
  location: string;
  district: string;
  item_name: string;
  category: string;
  quantity: number;
  unit: string;
  available_from: string;
  matched?: boolean;
  created_at: string;
}

export interface ResourceRequest {
  id: string;
  incident_id: string;
  resource_type: string;
  quantity_needed: number;
  urgency: 'Critical' | 'High' | 'Medium';
  status: 'Pending' | 'Partially Fulfilled' | 'Fulfilled';
}

export interface DashboardStats {
  activeEmergencies: number;
  familiesDisplaced: number;
  activeVolunteers: number;
  reliefPacksDistributed: number;
  reliefPacksTarget: number;
}

export interface DistrictData {
  district: string;
  incidents: number;
  displaced: number;
}

export interface ResourceData {
  category: string;
  supply: number;
  demand: number;
}

export type Language = 'en' | 'si';

export interface Translations {
  [key: string]: {
    en: string;
    si: string;
  };
}
