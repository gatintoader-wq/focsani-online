export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  active: boolean;
}

export interface Redemption {
  id: string;
  user_id: string;
  reward_id: string;
  code: string;
  created_at: string;
}

export interface NeighborhoodStanding {
  neighborhood: string;
  total_points: number;
  members: number;
}
