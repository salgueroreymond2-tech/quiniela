export interface Team {
  id: string;
  name: string;
  shortName: string;
  code: string; // SAP, LDA, CSH, CSC, ADG, SCA, SPO, PFC, MPZ, LIB
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  stadium: string;
  city: string;
  founded: number;
  titles: number;
  starPlayers: string[];
  logoType: 'saprissa' | 'alajuelense' | 'herediano' | 'cartagines' | 'sancarlos' | 'puntarenas' | 'sporting' | 'perezzeledon' | 'escorpiones' | 'intersancarlos' | 'guanacasteca' | 'liberia';
  logoUrl?: string;
}

export type MatchStatus = 'scheduled' | 'live' | 'finished';

export type StageType = 'regular' | 'semifinal_ida' | 'semifinal_vuelta' | 'final_fase_ida' | 'final_fase_vuelta' | 'gran_final_ida' | 'gran_final_vuelta';

export interface Match {
  id: string;
  round: number; // 1-18 for regular season, 19+ for playoffs
  stage: StageType;
  stageName: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  minute?: number;
  date: string;
  time: string;
  stadium: string;
  isFeatured?: boolean;
  scorers?: string[];
}

export interface UserPrediction {
  matchId: string;
  homeScore: number | null;
  awayScore: number | null;
  selectedScorer?: string;
  isLocked?: boolean;
  pointsEarned?: number;
  hitType?: 'exact' | 'tendency' | 'scorer_bonus' | 'miss';
}

export interface TeamStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  favoriteTeamId: string;
  points: number;
  exactHits: number;
  tendencyHits: number;
  currentStreak: number;
  maxStreak: number;
  multiplier: number;
  accuracyRate: number;
  level: number;
  countryRankPercentile: number;
  unlockedAchievements: string[];
  isAdmin?: boolean;
}

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userBadge?: string;
  type: 'prediction' | 'streak' | 'achievement' | 'custom';
  content: string;
  matchInfo?: {
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    multiplier?: string;
  };
  achievementInfo?: {
    title: string;
    description: string;
    icon: string;
  };
  streakInfo?: {
    current: number;
    target: number;
    title: string;
  };
  timeAgo: string;
  likes: number;
  commentsCount: number;
  isLiked?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'hits' | 'streak' | 'participation' | 'special';
  unlocked: boolean;
  progress?: number;
  total?: number;
}
