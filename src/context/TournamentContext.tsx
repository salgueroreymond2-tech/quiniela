import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Match,
  UserPrediction,
  TeamStanding,
  UserProfile,
  SocialPost,
  Achievement,
} from '../types';
import { TEAMS } from '../data/teams';
import { generateRegularSeason, generatePlayoffMatches } from '../data/fixture';
import {
  INITIAL_CURRENT_USER,
  LEADERBOARD_USERS,
  INITIAL_SOCIAL_POSTS,
  ALL_ACHIEVEMENTS,
} from '../data/mockUsers';

interface TournamentContextType {
  matches: Match[];
  userPredictions: Record<string, UserPrediction>;
  currentUser: UserProfile;
  leaderboard: UserProfile[];
  standings: TeamStanding[];
  selectedRound: number; // 1-18 for regular season, 19 for SF, 21 for Final Fase, 23 for Gran Final
  currentStageTab: 'regular' | 'playoffs';
  socialPosts: SocialPost[];
  achievements: Achievement[];
  isMuted: boolean;
  isLoggedIn: boolean;
  activeScorerMatchId: string | null;
  showChampionModal: boolean;
  showAuthModal: boolean;
  showRulesModal: boolean;
  
  // Actions
  setSelectedRound: (round: number) => void;
  setCurrentStageTab: (tab: 'regular' | 'playoffs') => void;
  setUserPrediction: (matchId: string, homeScore: number | null, awayScore: number | null) => void;
  setUserScorer: (matchId: string, scorer: string) => void;
  lockPrediction: (matchId: string) => void;
  updateRealMatchScore: (matchId: string, homeScore: number | null, awayScore: number | null, status: 'scheduled' | 'live' | 'finished', minute?: number) => void;
  simulateRound: (roundNumber: number) => void;
  simulateAllRemaining: () => void;
  fillRandomPredictionsForRound: (roundNumber: number) => void;
  fillRandomPredictionsAll: () => void;
  resetTournament: () => void;
  toggleMute: () => void;
  loginUser: (isAdmin?: boolean) => void;
  logoutUser: () => void;
  deleteUser: (userId: string) => void;
  setActiveScorerMatchId: (matchId: string | null) => void;
  setShowChampionModal: (show: boolean) => void;
  setShowAuthModal: (show: boolean) => void;
  setShowRulesModal: (show: boolean) => void;
  toggleLikePost: (postId: string) => void;
  addSocialPost: (content: string, matchId?: string) => void;
  updateUserProfile: (name: string, username: string, favoriteTeamId: string, avatar?: string) => void;
  
  // Computed helpers
  top4TeamIds: string[];
  regularLeaderId: string;
  secondPhaseWinnerId: string | null;
  absoluteChampionId: string | null;
  hasGranFinal: boolean;
  getMatchById: (id: string) => Match | undefined;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREDICTIONS = 'pasion_cr_predictions_v1';
const LOCAL_STORAGE_KEY_MATCHES = 'pasion_cr_matches_v2_unafut';
const LOCAL_STORAGE_KEY_USER = 'pasion_cr_user_v1';
const LOCAL_STORAGE_KEY_DELETED_USERS = 'pasion_cr_deleted_users_v1';

export const TournamentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize Matches
  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_MATCHES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved matches', e);
      }
    }
    const regular = generateRegularSeason();
    const top4 = ['sap', 'lda', 'csh', 'csc'];
    const playoffs = generatePlayoffMatches(top4);
    return [...regular, ...playoffs];
  });

  // Initialize Predictions
  const [userPredictions, setUserPredictions] = useState<Record<string, UserPrediction>>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREDICTIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved predictions', e);
      }
    }
    // Seed initial realistic predictions for Carlos
    const initialPreds: Record<string, UserPrediction> = {
      'm-r15-1': { matchId: 'm-r15-1', homeScore: 2, awayScore: 1, selectedScorer: 'Mariano Torres', isLocked: true },
      'm-r15-2': { matchId: 'm-r15-2', homeScore: 0, awayScore: 0, isLocked: false },
      'm-r15-3': { matchId: 'm-r15-3', homeScore: 1, awayScore: 0, isLocked: false },
      'm-r15-4': { matchId: 'm-r15-4', homeScore: 2, awayScore: 2, isLocked: false },
      'm-r15-5': { matchId: 'm-r15-5', homeScore: 0, awayScore: 1, isLocked: false },
      'sf1-ida': { matchId: 'sf1-ida', homeScore: 1, awayScore: 2, selectedScorer: 'Mariano Torres', isLocked: true },
      'sf2-ida': { matchId: 'sf2-ida', homeScore: 2, awayScore: 1, selectedScorer: 'Marcel Hernández', isLocked: true },
      'final-fase-ida': { matchId: 'final-fase-ida', homeScore: 2, awayScore: 1, selectedScorer: 'Marcel Hernández', isLocked: true },
      'gran-final-ida': { matchId: 'gran-final-ida', homeScore: 1, awayScore: 1, selectedScorer: 'Marcel Hernández', isLocked: true },
      'gran-final-vuelta': { matchId: 'gran-final-vuelta', homeScore: 2, awayScore: 0, selectedScorer: 'Mariano Torres', isLocked: false },
    };
    return initialPreds;
  });

  // Active round view aligned with the current UNAFUT calendar date.
  const [selectedRound, setSelectedRound] = useState<number>(5);
  const [currentStageTab, setCurrentStageTab] = useState<'regular' | 'playoffs'>('regular');
  
  // User profile & leaderboard
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return INITIAL_CURRENT_USER;
  });

  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  const [achievements, setAchievements] = useState<Achievement[]>(ALL_ACHIEVEMENTS);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [deletedUserIds, setDeletedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_DELETED_USERS);
    return saved ? JSON.parse(saved) : [];
  });
  const [activeScorerMatchId, setActiveScorerMatchId] = useState<string | null>(null);
  const [showChampionModal, setShowChampionModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  const loginUser = (isAdmin = false) => {
    setIsLoggedIn(true);
    setCurrentUser((prev) => ({ ...prev, isAdmin }));
    playSound('click');
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    playSound('click');
  };

  const deleteUser = (userId: string) => {
    if (userId === currentUser.id) return;
    setDeletedUserIds((prev) => [...new Set([...prev, userId])]);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_MATCHES, JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREDICTIONS, JSON.stringify(userPredictions));
  }, [userPredictions]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_DELETED_USERS, JSON.stringify(deletedUserIds));
  }, [deletedUserIds]);

  // Dynamic Standings calculation from regular season matches (18 rounds)
  const standings: TeamStanding[] = useMemo(() => {
    const table: Record<string, TeamStanding> = {};

    TEAMS.forEach((t) => {
      table[t.id] = {
        teamId: t.id,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: [],
      };
    });

    const regularMatches = matches.filter((m) => m.stage === 'regular');

    regularMatches.forEach((m) => {
      if (m.homeScore !== null && m.awayScore !== null && (m.status === 'finished' || m.status === 'live')) {
        const home = table[m.homeTeamId];
        const away = table[m.awayTeamId];

        if (home && away) {
          home.played += 1;
          away.played += 1;
          home.goalsFor += m.homeScore;
          home.goalsAgainst += m.awayScore;
          away.goalsFor += m.awayScore;
          away.goalsAgainst += m.homeScore;

          if (m.homeScore > m.awayScore) {
            home.won += 1;
            home.points += 3;
            away.lost += 1;
            home.form.push('W');
            away.form.push('L');
          } else if (m.homeScore < m.awayScore) {
            away.won += 1;
            away.points += 3;
            home.lost += 1;
            away.form.push('W');
            home.form.push('L');
          } else {
            home.drawn += 1;
            away.drawn += 1;
            home.points += 1;
            away.points += 1;
            home.form.push('D');
            away.form.push('D');
          }
        }
      }
    });

    return Object.values(table)
      .map((t) => ({
        ...t,
        goalDifference: t.goalsFor - t.goalsAgainst,
        form: t.form.slice(-5), // last 5
      }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return a.teamId.localeCompare(b.teamId);
      });
  }, [matches]);

  // Top 4 classification
  const top4TeamIds = useMemo(() => {
    return standings.slice(0, 4).map((s) => s.teamId);
  }, [standings]);

  // Líder General (1º de la Fase Regular)
  const regularLeaderId = useMemo(() => {
    return standings[0]?.teamId || 'sap';
  }, [standings]);

  // Determine second phase winner & Gran Final necessity
  const { secondPhaseWinnerId, absoluteChampionId, hasGranFinal } = useMemo(() => {
    // Check Semifinal 1 (1º vs 4º)
    const sf1Ida = matches.find((m) => m.id === 'sf1-ida');
    const sf1Vuelta = matches.find((m) => m.id === 'sf1-vuelta');
    let sf1Winner = top4TeamIds[0]; // default 1st
    if (sf1Ida && sf1Vuelta && sf1Ida.homeScore !== null && sf1Vuelta.homeScore !== null) {
      // sf1Ida: team4 (home) vs team1 (away)
      // sf1Vuelta: team1 (home) vs team4 (away)
      const aggTeam1 = (sf1Ida.awayScore || 0) + (sf1Vuelta.homeScore || 0);
      const aggTeam4 = (sf1Ida.homeScore || 0) + (sf1Vuelta.awayScore || 0);
      sf1Winner = aggTeam1 >= aggTeam4 ? top4TeamIds[0] : top4TeamIds[3];
    }

    // Check Semifinal 2 (2º vs 3º)
    const sf2Ida = matches.find((m) => m.id === 'sf2-ida');
    const sf2Vuelta = matches.find((m) => m.id === 'sf2-vuelta');
    let sf2Winner = top4TeamIds[2]; // default 3rd
    if (sf2Ida && sf2Vuelta && sf2Ida.homeScore !== null && sf2Vuelta.homeScore !== null) {
      // sf2Ida: team3 (home) vs team2 (away)
      // sf2Vuelta: team2 (home) vs team3 (away)
      const aggTeam2 = (sf2Ida.awayScore || 0) + (sf2Vuelta.homeScore || 0);
      const aggTeam3 = (sf2Ida.homeScore || 0) + (sf2Vuelta.awayScore || 0);
      sf2Winner = aggTeam3 >= aggTeam2 ? top4TeamIds[2] : top4TeamIds[1];
    }

    // Check Final Segunda Fase
    const ffIda = matches.find((m) => m.id === 'final-fase-ida');
    const ffVuelta = matches.find((m) => m.id === 'final-fase-vuelta');
    let spWinner: string | null = null;
    if (ffIda && ffVuelta && ffIda.homeScore !== null && ffVuelta.homeScore !== null) {
      const aggSf1 = (ffIda.awayScore || 0) + (ffVuelta.homeScore || 0);
      const aggSf2 = (ffIda.homeScore || 0) + (ffVuelta.awayScore || 0);
      spWinner = aggSf1 > aggSf2 ? sf1Winner : sf2Winner;
    }

    // Gran Final logic:
    // If Líder General won Segunda Fase -> Automatic Champion! No Gran Final needed.
    // If someone else won Segunda Fase -> Gran Final is required!
    let needsGranFinal = true;
    let champ: string | null = null;

    if (spWinner) {
      if (spWinner === regularLeaderId) {
        needsGranFinal = false;
        champ = regularLeaderId;
      } else {
        needsGranFinal = true;
        const gfIda = matches.find((m) => m.id === 'gran-final-ida');
        const gfVuelta = matches.find((m) => m.id === 'gran-final-vuelta');
        if (gfIda && gfVuelta && gfIda.homeScore !== null && gfVuelta.homeScore !== null && gfVuelta.status === 'finished') {
          const aggLeader = (gfIda.awayScore || 0) + (gfVuelta.homeScore || 0);
          const aggChallenger = (gfIda.homeScore || 0) + (gfVuelta.awayScore || 0);
          champ = aggLeader >= aggChallenger ? regularLeaderId : spWinner;
        }
      }
    }

    return {
      secondPhaseWinnerId: spWinner,
      absoluteChampionId: champ,
      hasGranFinal: needsGranFinal,
    };
  }, [matches, top4TeamIds, regularLeaderId]);

  // Calculate user points and hit statistics dynamically
  const { calculatedPoints, exactHitsCount, tendencyHitsCount, accuracyPct } = useMemo(() => {
    let pts = 0;
    let exact = 0;
    let tendency = 0;
    let finishedEvaluated = 0;

    matches.forEach((m) => {
      if (m.homeScore !== null && m.awayScore !== null && (m.status === 'finished' || m.status === 'live')) {
        const pred = userPredictions[m.id];
        if (pred && pred.homeScore !== null && pred.awayScore !== null) {
          finishedEvaluated += 1;
          const realDiff = m.homeScore - m.awayScore;
          const predDiff = pred.homeScore - pred.awayScore;

          const isExact = pred.homeScore === m.homeScore && pred.awayScore === m.awayScore;
          const isTendency = (realDiff > 0 && predDiff > 0) || (realDiff < 0 && predDiff < 0) || (realDiff === 0 && predDiff === 0);

          if (isExact) {
            pts += 300;
            exact += 1;
          } else if (isTendency) {
            pts += 100;
            tendency += 1;
          }

          // Bonus for scorer prediction
          if (pred.selectedScorer && m.scorers && m.scorers.includes(pred.selectedScorer)) {
            pts += 50;
          }
        }
      }
    });

    const totalHits = exact + tendency;
    const rate = finishedEvaluated > 0 ? Math.round((totalHits / finishedEvaluated) * 100) : 68;

    return {
      calculatedPoints: Math.max(pts, 12450), // base points from previous weeks
      exactHitsCount: exact + 45,
      tendencyHitsCount: tendency + 80,
      accuracyPct: rate,
    };
  }, [matches, userPredictions]);

  // Update current user stats
  useEffect(() => {
    setCurrentUser((prev) => ({
      ...prev,
      points: calculatedPoints,
      exactHits: exactHitsCount,
      tendencyHits: tendencyHitsCount,
      accuracyRate: accuracyPct,
    }));
  }, [calculatedPoints, exactHitsCount, tendencyHitsCount, accuracyPct]);

  // Leaderboard ranking with current user integrated
  const leaderboard = useMemo(() => {
    const list = LEADERBOARD_USERS.filter((user) => !deletedUserIds.includes(user.id));
    const userIndex = list.findIndex((u) => u.id === currentUser.id);
    if (userIndex >= 0) {
      list[userIndex] = currentUser;
    } else {
      list.push(currentUser);
    }
    return list.sort((a, b) => b.points - a.points);
  }, [currentUser, deletedUserIds]);

  // Helper to play sound effects using Web Audio API (so no external audio assets are broken)
  const playSound = (type: 'goal' | 'click' | 'lock' | 'win') => {
    if (isMuted || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'lock') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'goal' || type === 'win') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.3); // C6
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (err) {
      console.warn('Audio play failed', err);
    }
  };

  // Prediction actions
  const setUserPrediction = (matchId: string, homeScore: number | null, awayScore: number | null) => {
    setUserPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || { matchId }),
        homeScore,
        awayScore,
      },
    }));
    playSound('click');
  };

  const setUserScorer = (matchId: string, scorer: string) => {
    setUserPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || { matchId, homeScore: null, awayScore: null }),
        selectedScorer: scorer,
      },
    }));
    playSound('click');
  };

  const lockPrediction = (matchId: string) => {
    setUserPredictions((prev) => {
      const current = prev[matchId];
      const isCurrentlyLocked = current?.isLocked;
      return {
        ...prev,
        [matchId]: {
          ...(current || { matchId, homeScore: null, awayScore: null }),
          isLocked: !isCurrentlyLocked,
        },
      };
    });
    playSound('lock');
  };

  // Match Simulation & Edit Actions
  const updateRealMatchScore = (
    matchId: string,
    homeScore: number | null,
    awayScore: number | null,
    status: 'scheduled' | 'live' | 'finished',
    minute?: number
  ) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              homeScore,
              awayScore,
              status,
              minute: minute !== undefined ? minute : m.minute,
            }
          : m
      )
    );
    playSound('goal');
  };

  const simulateRound = (roundNumber: number) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.round === roundNumber) {
          const homeRnd = Math.floor(Math.random() * 4);
          const awayRnd = Math.floor(Math.random() * 3);
          const homeTeam = TEAMS.find((t) => t.id === m.homeTeamId);
          const awayTeam = TEAMS.find((t) => t.id === m.awayTeamId);

          const scorers: string[] = [];
          if (homeRnd > 0 && homeTeam) scorers.push(homeTeam.starPlayers[0]);
          if (homeRnd > 1 && homeTeam) scorers.push(homeTeam.starPlayers[1] || homeTeam.starPlayers[0]);
          if (awayRnd > 0 && awayTeam) scorers.push(awayTeam.starPlayers[0]);

          return {
            ...m,
            homeScore: homeRnd,
            awayScore: awayRnd,
            status: 'finished',
            minute: 90,
            scorers,
          };
        }
        return m;
      })
    );
    playSound('goal');
  };

  const simulateAllRemaining = () => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.status !== 'finished') {
          const homeRnd = Math.floor(Math.random() * 4);
          const awayRnd = Math.floor(Math.random() * 3);
          const homeTeam = TEAMS.find((t) => t.id === m.homeTeamId);
          const awayTeam = TEAMS.find((t) => t.id === m.awayTeamId);
          const scorers: string[] = [];
          if (homeRnd > 0 && homeTeam) scorers.push(homeTeam.starPlayers[0]);
          if (awayRnd > 0 && awayTeam) scorers.push(awayTeam.starPlayers[0]);

          return {
            ...m,
            homeScore: homeRnd,
            awayScore: awayRnd,
            status: 'finished',
            minute: 90,
            scorers,
          };
        }
        return m;
      })
    );
    setShowChampionModal(true);
    playSound('win');
  };

  const fillRandomPredictionsForRound = (roundNumber: number) => {
    const roundMatches = matches.filter((m) => m.round === roundNumber);
    const newPreds: Record<string, UserPrediction> = { ...userPredictions };

    roundMatches.forEach((m) => {
      const h = Math.floor(Math.random() * 4);
      const a = Math.floor(Math.random() * 3);
      const homeTeam = TEAMS.find((t) => t.id === m.homeTeamId);
      newPreds[m.id] = {
        matchId: m.id,
        homeScore: h,
        awayScore: a,
        selectedScorer: homeTeam ? homeTeam.starPlayers[0] : undefined,
        isLocked: false,
      };
    });

    setUserPredictions(newPreds);
    playSound('click');
  };

  const fillRandomPredictionsAll = () => {
    const newPreds: Record<string, UserPrediction> = { ...userPredictions };
    matches.forEach((m) => {
      if (!newPreds[m.id] || newPreds[m.id].homeScore === null) {
        const h = Math.floor(Math.random() * 4);
        const a = Math.floor(Math.random() * 3);
        const homeTeam = TEAMS.find((t) => t.id === m.homeTeamId);
        newPreds[m.id] = {
          matchId: m.id,
          homeScore: h,
          awayScore: a,
          selectedScorer: homeTeam ? homeTeam.starPlayers[0] : undefined,
          isLocked: false,
        };
      }
    });
    setUserPredictions(newPreds);
    playSound('click');
  };

  const resetTournament = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY_MATCHES);
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREDICTIONS);
    const regular = generateRegularSeason();
    const top4 = ['sap', 'lda', 'csh', 'csc'];
    const playoffs = generatePlayoffMatches(top4);
    setMatches([...regular, ...playoffs]);
    setUserPredictions({});
    setSelectedRound(5);
    setCurrentStageTab('regular');
    playSound('click');
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleLikePost = (postId: string) => {
    setSocialPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
    playSound('click');
  };

  const addSocialPost = (content: string, matchId?: string) => {
    const matched = matchId ? matches.find((m) => m.id === matchId) : undefined;
    const homeTeam = matched ? TEAMS.find((t) => t.id === matched.homeTeamId)?.shortName : undefined;
    const awayTeam = matched ? TEAMS.find((t) => t.id === matched.awayTeamId)?.shortName : undefined;
    const pred = matchId ? userPredictions[matchId] : undefined;

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userBadge: 'PRONÓSTICO TICO',
      type: 'custom',
      content,
      matchInfo:
        homeTeam && awayTeam && pred && pred.homeScore !== null && pred.awayScore !== null
          ? {
              homeTeam,
              awayTeam,
              homeScore: pred.homeScore,
              awayScore: pred.awayScore,
              multiplier: '2.5x',
            }
          : undefined,
      timeAgo: 'ahora mismo',
      likes: 1,
      commentsCount: 0,
      isLiked: true,
    };

    setSocialPosts([newPost, ...socialPosts]);
    playSound('click');
  };

  const updateUserProfile = (name: string, username: string, favoriteTeamId: string, avatar?: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      name,
      username: username.startsWith('@') ? username : `@${username}`,
      favoriteTeamId,
      ...(avatar ? { avatar } : {}),
    }));
  };

  const getMatchById = (id: string) => matches.find((m) => m.id === id);

  return (
    <TournamentContext.Provider
      value={{
        matches,
        userPredictions,
        currentUser,
        leaderboard,
        standings,
        selectedRound,
        currentStageTab,
        socialPosts,
        achievements,
        isMuted,
        isLoggedIn,
        activeScorerMatchId,
        showChampionModal,
        showAuthModal,
        showRulesModal,
        setSelectedRound,
        setCurrentStageTab,
        setUserPrediction,
        setUserScorer,
        lockPrediction,
        updateRealMatchScore,
        simulateRound,
        simulateAllRemaining,
        fillRandomPredictionsForRound,
        fillRandomPredictionsAll,
        resetTournament,
        toggleMute,
        loginUser,
        logoutUser,
        deleteUser,
        setActiveScorerMatchId,
        setShowChampionModal,
        setShowAuthModal,
        setShowRulesModal,
        toggleLikePost,
        addSocialPost,
        updateUserProfile,
        top4TeamIds,
        regularLeaderId,
        secondPhaseWinnerId,
        absoluteChampionId,
        hasGranFinal,
        getMatchById,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
