export interface HealthMarker { name: string; value: string; unit?: string; }
export interface Report { id: string; title: string; type: string; status: string; createdAt: string; riskScore?: number; }
