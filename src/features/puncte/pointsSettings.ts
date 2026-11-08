export const POINTS_SETTINGS_KEY = 'focsani.setari-puncte';

export interface PointsSettings {
  sesizare: number;
  anuntBazar: number;
  ajutor: number;
  comentariu: number;
  evidentiere3Zile: number;
  evidentiere7Zile: number;
  sesizarePrioritara: number;
}

export const DEFAULT_POINTS_SETTINGS: PointsSettings = {
  sesizare: 10,
  anuntBazar: 5,
  ajutor: 5,
  comentariu: 2,
  evidentiere3Zile: 50,
  evidentiere7Zile: 100,
  sesizarePrioritara: 30,
};

export function getPointsSettings(): PointsSettings {
  try {
    const raw = window.localStorage.getItem(POINTS_SETTINGS_KEY);
    return raw ? { ...DEFAULT_POINTS_SETTINGS, ...(JSON.parse(raw) as Partial<PointsSettings>) } : DEFAULT_POINTS_SETTINGS;
  } catch {
    return DEFAULT_POINTS_SETTINGS;
  }
}

export function savePointsSettings(settings: PointsSettings): void {
  window.localStorage.setItem(POINTS_SETTINGS_KEY, JSON.stringify(settings));
}

export interface PointsLevel {
  name: string;
  min: number;
  max: number | null;
}

export function getPointsLevel(points: number): PointsLevel {
  if (points >= 151) return { name: 'Super Vecin', min: 151, max: null };
  if (points >= 51) return { name: 'Vecin Activ', min: 51, max: 150 };
  return { name: 'Vecin Nou', min: 0, max: 50 };
}
