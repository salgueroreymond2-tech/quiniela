import { Match, StageType } from '../types';
import { TEAMS } from './teams';

// Generates 18 rounds for the 10 teams (Berger table / round robin)
export function generateRegularSeason(): Match[] {
  const teams = TEAMS.map((t) => t.id); // 10 team IDs
  const n = teams.length;
  const matches: Match[] = [];

  // Standard Round-Robin 9 rounds for 10 teams
  const roundRobinPairings: [number, number][][] = [
    // Round 1
    [[0, 9], [1, 8], [2, 7], [3, 6], [4, 5]],
    // Round 2
    [[9, 5], [6, 4], [7, 3], [8, 2], [0, 1]],
    // Round 3
    [[1, 9], [2, 0], [3, 8], [4, 7], [5, 6]],
    // Round 4
    [[9, 6], [7, 5], [8, 4], [0, 3], [1, 2]],
    // Round 5
    [[2, 9], [3, 1], [4, 0], [5, 8], [6, 7]],
    // Round 6
    [[9, 7], [8, 6], [0, 5], [1, 4], [2, 3]],
    // Round 7
    [[3, 9], [4, 2], [5, 1], [6, 0], [7, 8]],
    // Round 8
    [[9, 8], [0, 7], [1, 6], [2, 5], [3, 4]],
    // Round 9
    [[4, 9], [5, 3], [6, 2], [7, 1], [8, 0]],
  ];

  const startDate = new Date(2026, 6, 25); // July 25, 2026

  // Generate 18 rounds (Round 1-9: First leg, Round 10-18: Second leg with reversed venues)
  for (let r = 0; r < 18; r++) {
    const isSecondLeg = r >= 9;
    const pairings = roundRobinPairings[r % 9];
    const roundNumber = r + 1;
    const roundDate = new Date(startDate.getTime() + r * 7 * 24 * 60 * 60 * 1000);
    const dateStr = roundDate.toLocaleDateString('es-CR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const times = ['3:00 PM', '5:00 PM', '6:00 PM', '7:30 PM', '8:00 PM'];

    pairings.forEach((pair, matchIdx) => {
      const homeIdx = isSecondLeg ? pair[1] : pair[0];
      const awayIdx = isSecondLeg ? pair[0] : pair[1];
      const homeTeam = TEAMS[homeIdx];
      const awayTeam = TEAMS[awayIdx];

      // Identify marquee games like Clásicos as featured
      const isClasico =
        (homeTeam.id === 'sap' && awayTeam.id === 'lda') ||
        (homeTeam.id === 'lda' && awayTeam.id === 'sap') ||
        (homeTeam.id === 'csh' && awayTeam.id === 'sap') ||
        (homeTeam.id === 'lda' && awayTeam.id === 'csh');

      const isFeatured = isClasico || matchIdx === 0;

      // Realistic mock results for already played rounds (e.g., Rounds 1 to 14)
      // Round 15 is current (live/scheduled), Rounds 16-18 are upcoming
      let status: 'scheduled' | 'live' | 'finished' = 'scheduled';
      let homeScore: number | null = null;
      let awayScore: number | null = null;
      let minute: number | undefined = undefined;

      if (roundNumber <= 14) {
        status = 'finished';
        // Deterministic realistic scores based on seeded formula
        const seed = (r * 13 + homeIdx * 7 + awayIdx * 11) % 100;
        homeScore = seed % 4; // 0, 1, 2, 3
        awayScore = (seed + homeIdx + 2) % 3; // 0, 1, 2
        // Slight advantage to historical top teams
        if (['sap', 'lda', 'csh', 'csc'].includes(homeTeam.id) && homeScore < awayScore && seed > 40) {
          homeScore += 1;
        }
      } else if (roundNumber === 15) {
        // Round 15 is active (matching screenshot!)
        if (isFeatured) {
          status = 'live';
          minute = 64;
          homeScore = 2;
          awayScore = 1;
        } else if (matchIdx === 1) {
          status = 'live';
          minute = 42;
          homeScore = 0;
          awayScore = 0;
        } else {
          status = 'scheduled';
          homeScore = null;
          awayScore = null;
        }
      }

      matches.push({
        id: `m-r${roundNumber}-${matchIdx + 1}`,
        round: roundNumber,
        stage: 'regular',
        stageName: `Jornada ${roundNumber}`,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeScore,
        awayScore,
        status,
        minute,
        date: dateStr,
        time: times[matchIdx],
        stadium: homeTeam.stadium,
        isFeatured,
        scorers:
          homeScore !== null && awayScore !== null
            ? [
                ...(homeScore > 0 ? [homeTeam.starPlayers[0]] : []),
                ...(homeScore > 1 ? [homeTeam.starPlayers[1] || homeTeam.starPlayers[0]] : []),
                ...(awayScore > 0 ? [awayTeam.starPlayers[0]] : []),
              ]
            : undefined,
      });
    });
  }

  return matches;
}

export function generatePlayoffMatches(
  top4TeamIds: string[],
  existingMatches: Match[] = []
): Match[] {
  if (top4TeamIds.length < 4) return [];

  const [t1, t2, t3, t4] = top4TeamIds;
  const team1 = TEAMS.find((t) => t.id === t1) || TEAMS[0];
  const team2 = TEAMS.find((t) => t.id === t2) || TEAMS[1];
  const team3 = TEAMS.find((t) => t.id === t3) || TEAMS[2];
  const team4 = TEAMS.find((t) => t.id === t4) || TEAMS[3];

  const existingPlayoffs = existingMatches.filter((m) => m.stage !== 'regular');
  if (existingPlayoffs.length > 0) {
    return existingPlayoffs;
  }

  const playoffMatches: Match[] = [
    // SEMIFINAL 1: 1º vs 4º
    // Ida (4º local)
    {
      id: 'sf1-ida',
      round: 19,
      stage: 'semifinal_ida',
      stageName: 'Semifinales - Ida',
      homeTeamId: team4.id,
      awayTeamId: team1.id,
      homeScore: 1,
      awayScore: 2,
      status: 'finished',
      date: '28 Nov 2026',
      time: '8:00 PM',
      stadium: team4.stadium,
      isFeatured: true,
      scorers: [team4.starPlayers[0], team1.starPlayers[0], team1.starPlayers[1]],
    },
    // Vuelta (1º local)
    {
      id: 'sf1-vuelta',
      round: 20,
      stage: 'semifinal_vuelta',
      stageName: 'Semifinales - Vuelta',
      homeTeamId: team1.id,
      awayTeamId: team4.id,
      homeScore: 3,
      awayScore: 1,
      status: 'finished',
      date: '5 Dic 2026',
      time: '8:00 PM',
      stadium: team1.stadium,
      isFeatured: false,
      scorers: [team1.starPlayers[0], team1.starPlayers[2], team4.starPlayers[0]],
    },
    // SEMIFINAL 2: 2º vs 3º
    // Ida (3º local)
    {
      id: 'sf2-ida',
      round: 19,
      stage: 'semifinal_ida',
      stageName: 'Semifinales - Ida',
      homeTeamId: team3.id,
      awayTeamId: team2.id,
      homeScore: 2,
      awayScore: 1,
      status: 'finished',
      date: '29 Nov 2026',
      time: '5:00 PM',
      stadium: team3.stadium,
      isFeatured: false,
      scorers: [team3.starPlayers[0], team2.starPlayers[0]],
    },
    // Vuelta (2º local)
    {
      id: 'sf2-vuelta',
      round: 20,
      stage: 'semifinal_vuelta',
      stageName: 'Semifinales - Vuelta',
      homeTeamId: team2.id,
      awayTeamId: team3.id,
      homeScore: 1,
      awayScore: 1,
      status: 'finished',
      date: '6 Dic 2026',
      time: '6:00 PM',
      stadium: team2.stadium,
      isFeatured: false,
      scorers: [team2.starPlayers[0], team3.starPlayers[1]],
    },

    // FINAL DE SEGUNDA FASE (Ganador SF1 = team1 vs Ganador SF2 = team3)
    // Ida
    {
      id: 'final-fase-ida',
      round: 21,
      stage: 'final_fase_ida',
      stageName: 'Final Segunda Fase - Ida',
      homeTeamId: team3.id,
      awayTeamId: team1.id,
      homeScore: 2,
      awayScore: 1,
      status: 'finished',
      date: '10 Dic 2026',
      time: '8:00 PM',
      stadium: team3.stadium,
      isFeatured: true,
      scorers: [team3.starPlayers[0], team1.starPlayers[0]],
    },
    // Vuelta
    {
      id: 'final-fase-vuelta',
      round: 22,
      stage: 'final_fase_vuelta',
      stageName: 'Final Segunda Fase - Vuelta',
      homeTeamId: team1.id,
      awayTeamId: team3.id,
      homeScore: 1,
      awayScore: 1,
      status: 'finished',
      date: '13 Dic 2026',
      time: '8:00 PM',
      stadium: team1.stadium,
      isFeatured: true,
      scorers: [team1.starPlayers[0], team3.starPlayers[0]],
    },

    // GRAN FINAL (Porque team3 ganó la Segunda Fase en el global 3-2 sobre el Líder General team1!)
    // Ida
    {
      id: 'gran-final-ida',
      round: 23,
      stage: 'gran_final_ida',
      stageName: 'Gran Final - Ida',
      homeTeamId: team3.id,
      awayTeamId: team1.id,
      homeScore: 1,
      awayScore: 1,
      status: 'finished',
      date: '17 Dic 2026',
      time: '8:00 PM',
      stadium: team3.stadium,
      isFeatured: true,
      scorers: [team3.starPlayers[0], team1.starPlayers[0]],
    },
    // Vuelta (Cierre en casa del Líder General team1)
    {
      id: 'gran-final-vuelta',
      round: 24,
      stage: 'gran_final_vuelta',
      stageName: 'Gran Final - Vuelta (Decisivo)',
      homeTeamId: team1.id,
      awayTeamId: team3.id,
      homeScore: 2,
      awayScore: 0,
      status: 'live',
      minute: 78,
      date: '20 Dic 2026',
      time: '8:00 PM',
      stadium: team1.stadium,
      isFeatured: true,
      scorers: [team1.starPlayers[0], team1.starPlayers[1]],
    },
  ];

  return playoffMatches;
}
