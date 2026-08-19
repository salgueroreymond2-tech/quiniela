import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { TeamBadge } from './TeamBadge';
import { getTeamById } from '../data/teams';
import {
  Sparkles,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Flame,
  UserCheck,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenScorerModal: (matchId: string) => void;
  onOpenAdmin: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenScorerModal,
  onOpenAdmin,
}) => {
  const {
    matches,
    userPredictions,
    setUserPrediction,
    lockPrediction,
    selectedRound,
    setSelectedRound,
    simulateRound,
    fillRandomPredictionsForRound,
  } = useTournament();

  const [activeEditingMatchId, setActiveEditingMatchId] = useState<string | null>(null);

  // Filter matches for the selected round
  const roundMatches = matches.filter((m) => m.round === selectedRound);
  const featuredMatch = roundMatches.find((m) => m.isFeatured) || roundMatches[0];
  const restOfMatches = roundMatches.filter((m) => m.id !== featuredMatch?.id);

  // Round label generator
  const getRoundLabel = (r: number) => {
    if (r <= 18) return `Jornada ${r}`;
    if (r === 19) return 'Semifinales - Ida';
    if (r === 20) return 'Semifinales - Vuelta';
    if (r === 21) return 'Final Segunda Fase - Ida';
    if (r === 22) return 'Final Segunda Fase - Vuelta';
    if (r === 23) return 'Gran Final - Ida';
    return 'Gran Final - Vuelta';
  };

  // Helper to calculate comparison result and points
  const getPredictionComparison = (matchId: string) => {
    const match = matches.find((m) => m.id === matchId);
    const pred = userPredictions[matchId];

    if (!match || match.homeScore === null || match.awayScore === null) {
      return { status: 'pending', text: 'Partido pendiente', badgeColor: 'bg-zinc-800 text-zinc-400', pts: 0 };
    }

    if (!pred || pred.homeScore === null || pred.awayScore === null) {
      return { status: 'no_prediction', text: 'Sin pronóstico registrado', badgeColor: 'bg-zinc-800 text-zinc-400', pts: 0 };
    }

    const isExact = match.homeScore === pred.homeScore && match.awayScore === pred.awayScore;
    const realDiff = match.homeScore - match.awayScore;
    const predDiff = pred.homeScore - pred.awayScore;
    const isTendency = (realDiff > 0 && predDiff > 0) || (realDiff < 0 && predDiff < 0) || (realDiff === 0 && predDiff === 0);

    let pts = 0;
    if (isExact) pts = 300;
    else if (isTendency) pts = 100;

    let scorerBonus = false;
    if (pred.selectedScorer && match.scorers && match.scorers.includes(pred.selectedScorer)) {
      pts += 50;
      scorerBonus = true;
    }

    if (isExact) {
      return {
        status: 'exact',
        text: `¡Marcador Exacto! +${pts} pts${scorerBonus ? ' (+50 Goleador)' : ''}`,
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 glow-cyan-sm',
        pts,
      };
    }

    if (isTendency) {
      return {
        status: 'tendency',
        text: `¡Tendencia Acertada! +${pts} pts${scorerBonus ? ' (+50 Goleador)' : ''}`,
        badgeColor: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50',
        pts,
      };
    }

    return {
      status: 'miss',
      text: 'No acertó (0 pts)',
      badgeColor: 'bg-red-500/20 text-red-300 border border-red-500/40',
      pts: 0,
    };
  };

  return (
    <div className="space-y-5 pb-24 max-w-xl mx-auto px-4 pt-2">
      {/* Horizontal Round Selector Carousel */}
      <div className="flex items-center justify-between gap-2 bg-[#19101c]/80 p-1.5 rounded-xl border border-[#3c313e]/60">
        <button
          onClick={() => setSelectedRound(Math.max(1, selectedRound - 1))}
          disabled={selectedRound <= 1}
          className="p-1.5 rounded-lg bg-[#221824] hover:bg-[#312733] disabled:opacity-30 text-[#eeddee] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-[260px] sm:max-w-xs">
          {Array.from({ length: 18 }, (_, i) => i + 1).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRound(r)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono shrink-0 transition-all ${
                selectedRound === r
                  ? 'bg-[#bf00ff] text-white font-bold glow-purple-sm'
                  : 'bg-[#221824] text-[#d5c0d7] hover:bg-[#312733]'
              }`}
            >
              J{r}
            </button>
          ))}
          {/* Playoff stages shortcut */}
          <button
            onClick={() => setSelectedRound(19)}
            className={`px-2 py-1 rounded-md text-xs font-mono shrink-0 transition-all ${
              selectedRound >= 19 && selectedRound <= 20
                ? 'bg-[#00f0ff] text-black font-bold glow-cyan-sm'
                : 'bg-[#221824] text-[#00f0ff] hover:bg-[#312733]'
            }`}
          >
            SF
          </button>
          <button
            onClick={() => setSelectedRound(21)}
            className={`px-2 py-1 rounded-md text-xs font-mono shrink-0 transition-all ${
              selectedRound >= 21 && selectedRound <= 22
                ? 'bg-[#00f0ff] text-black font-bold glow-cyan-sm'
                : 'bg-[#221824] text-[#00f0ff] hover:bg-[#312733]'
            }`}
          >
            Final Fase
          </button>
          <button
            onClick={() => setSelectedRound(24)}
            className={`px-2 py-1 rounded-md text-xs font-mono shrink-0 transition-all ${
              selectedRound >= 23
                ? 'bg-amber-400 text-black font-bold'
                : 'bg-[#221824] text-amber-300 hover:bg-[#312733]'
            }`}
          >
            Gran Final
          </button>
        </div>

        <button
          onClick={() => setSelectedRound(Math.min(24, selectedRound + 1))}
          disabled={selectedRound >= 24}
          className="p-1.5 rounded-lg bg-[#221824] hover:bg-[#312733] disabled:opacity-30 text-[#eeddee] transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Header of Round */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3c313e]/60 pb-3">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>{getRoundLabel(selectedRound)}</span>
            {selectedRound === 15 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#bf00ff]/30 text-[#ecb1ff] border border-[#bf00ff]/60 font-mono">
                Jornada Activa
              </span>
            )}
          </h1>
          <p className="text-sm text-[#d5c0d7]">
            Ingresa tus predicciones antes del pitazo inicial.
          </p>
        </div>

        {/* Action buttons for current round */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fillRandomPredictionsForRound(selectedRound)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#261c28] hover:bg-[#3c313e] text-[#ecb1ff] text-xs font-mono border border-[#bf00ff]/40 transition-all"
            title="Autollenar pronósticos de esta jornada"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#bf00ff]" />
            <span>Autollenar</span>
          </button>

          <button
            onClick={() => simulateRound(selectedRound)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#bf00ff]/20 hover:bg-[#bf00ff]/40 text-white text-xs font-mono border border-[#bf00ff] transition-all glow-purple-sm"
            title="Simular resultados reales de esta jornada"
          >
            <Play className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>Simular J{selectedRound}</span>
          </button>
        </div>
      </div>

      {/* PARTIDO ESTELAR (Featured Match - Matching Screenshot 9) */}
      {featuredMatch && (
        <div className="relative rounded-2xl bg-gradient-to-b from-[#221824] to-[#19101c] border-2 border-[#bf00ff]/80 p-5 glow-purple shadow-2xl overflow-hidden">
          {/* Top badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#bf00ff]/25 border border-[#bf00ff]/60 text-[11px] font-mono font-bold text-[#ecb1ff]">
              <span className="w-2 h-2 rounded-full bg-[#bf00ff] animate-ping"></span>
              <span>PARTIDO ESTELAR</span>
            </div>

            {featuredMatch.status === 'live' ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-[#00f0ff] text-[11px] font-mono font-bold text-[#00f0ff]">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
                <span>EN VIVO ({featuredMatch.minute}')</span>
              </div>
            ) : featuredMatch.status === 'finished' ? (
              <div className="text-xs font-mono text-emerald-400 font-semibold">
                FINALIZADO
              </div>
            ) : (
              <div className="text-xs font-mono text-[#d5c0d7]">
                {featuredMatch.date} • {featuredMatch.time}
              </div>
            )}
          </div>

          {/* Teams and Score inputs */}
          {(() => {
            const homeTeam = getTeamById(featuredMatch.homeTeamId);
            const awayTeam = getTeamById(featuredMatch.awayTeamId);
            const pred = userPredictions[featuredMatch.id] || {
              matchId: featuredMatch.id,
              homeScore: null,
              awayScore: null,
            };
            const comparison = getPredictionComparison(featuredMatch.id);

            return (
              <div>
                <div className="grid grid-cols-5 items-center gap-2 py-2">
                  {/* Home Team */}
                  <div className="col-span-2 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#140b16] border border-[#3c313e] flex items-center justify-center p-2 mb-2 glow-purple-sm shadow-md">
                      <TeamBadge team={homeTeam} size="lg" />
                    </div>
                    <span className="font-heading font-bold text-lg text-white leading-tight">
                      {homeTeam.code}
                    </span>
                    <span className="text-xs text-[#d5c0d7] hidden sm:block">
                      {homeTeam.shortName}
                    </span>
                  </div>

                  {/* Prediction Boxes in center */}
                  <div className="col-span-1 flex flex-col items-center justify-center">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#d5c0d7] mb-1.5 text-center">
                      TU PRONÓSTICO
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="15"
                        disabled={pred.isLocked}
                        value={pred.homeScore !== null ? pred.homeScore : ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                          setUserPrediction(featuredMatch.id, val, pred.awayScore);
                        }}
                        placeholder="-"
                        className="w-12 h-14 bg-[#140b16] border-2 border-[#bf00ff] rounded-xl text-center font-heading font-black text-2xl text-white focus:outline-none focus:glow-purple focus:border-white transition-all disabled:opacity-60"
                      />
                      <span className="text-xl font-bold text-[#bf00ff]">-</span>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        disabled={pred.isLocked}
                        value={pred.awayScore !== null ? pred.awayScore : ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                          setUserPrediction(featuredMatch.id, pred.homeScore, val);
                        }}
                        placeholder="-"
                        className="w-12 h-14 bg-[#140b16] border-2 border-[#bf00ff] rounded-xl text-center font-heading font-black text-2xl text-white focus:outline-none focus:glow-purple focus:border-white transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="col-span-2 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#140b16] border border-[#3c313e] flex items-center justify-center p-2 mb-2 glow-purple-sm shadow-md">
                      <TeamBadge team={awayTeam} size="lg" />
                    </div>
                    <span className="font-heading font-bold text-lg text-white leading-tight">
                      {awayTeam.code}
                    </span>
                    <span className="text-xs text-[#d5c0d7] hidden sm:block">
                      {awayTeam.shortName}
                    </span>
                  </div>
                </div>

                {/* Real Match Score if live or finished */}
                {(featuredMatch.homeScore !== null || featuredMatch.status !== 'scheduled') && (
                  <div className="my-3 p-3 rounded-xl bg-[#140b16]/90 border border-[#3c313e] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#d5c0d7]">MARCADOR REAL:</span>
                      <span className="font-heading font-black text-lg text-white">
                        {featuredMatch.homeScore !== null ? featuredMatch.homeScore : 0} -{' '}
                        {featuredMatch.awayScore !== null ? featuredMatch.awayScore : 0}
                      </span>
                    </div>
                    <div className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${comparison.badgeColor}`}>
                      {comparison.text}
                    </div>
                  </div>
                )}

                {/* Selected Scorer badge if voted */}
                {pred.selectedScorer && (
                  <div className="mt-2 mb-3 flex items-center justify-center gap-2 p-2 rounded-lg bg-[#bf00ff]/10 border border-[#bf00ff]/30 text-xs text-[#ecb1ff]">
                    <span>⚽ Goleador elegido:</span>
                    <span className="font-bold text-white">{pred.selectedScorer}</span>
                    <span className="text-[10px] text-[#00f0ff] font-mono">(+50 pts si anota)</span>
                  </div>
                )}

                {/* Button VOTAR POR GOLEADOR (matching screenshot 9) */}
                <button
                  onClick={() => onOpenScorerModal(featuredMatch.id)}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#bf00ff] hover:bg-[#d033ff] text-black font-heading font-extrabold text-base tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg glow-purple transition-all duration-200 active:scale-[0.99]"
                >
                  <span>VOTAR POR GOLEADOR</span>
                  <span className="text-lg">⚽</span>
                </button>

                {/* Lock prediction footer */}
                <div className="mt-3 flex items-center justify-between text-xs font-mono text-[#d5c0d7]/80">
                  <span>Estadio: {featuredMatch.stadium}</span>
                  <button
                    onClick={() => lockPrediction(featuredMatch.id)}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    {pred.isLocked ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-300">Bloqueado</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Bloquear</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* RESTO DE LA JORNADA (Matching Screenshot 9 & 15) */}
      <div className="space-y-3 pt-2">
        <h2 className="text-xl font-heading font-bold text-white tracking-tight flex items-center gap-2">
          <span>Resto de la Jornada</span>
          <span className="text-xs font-mono font-normal text-[#d5c0d7]">
            ({restOfMatches.length} partidos)
          </span>
        </h2>

        <div className="space-y-3">
          {restOfMatches.map((match) => {
            const homeTeam = getTeamById(match.homeTeamId);
            const awayTeam = getTeamById(match.awayTeamId);
            const pred = userPredictions[match.id] || {
              matchId: match.id,
              homeScore: null,
              awayScore: null,
            };
            const comparison = getPredictionComparison(match.id);
            const isEditing = activeEditingMatchId === match.id;

            return (
              <div
                key={match.id}
                className="rounded-xl bg-[#221824] border border-[#3c313e]/80 hover:border-[#bf00ff]/60 p-4 transition-all duration-200 shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-mono text-[#d5c0d7]">
                    {match.time} • {match.date}
                  </div>
                  {match.status === 'live' && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#00f0ff]">
                      <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping"></span>
                      <span>EN VIVO ({match.minute}')</span>
                    </div>
                  )}
                  {match.status === 'finished' && (
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                      FINALIZADO
                    </span>
                  )}
                </div>

                {/* Match Row */}
                <div className="grid grid-cols-7 items-center gap-2 py-1">
                  {/* Home Team */}
                  <div className="col-span-2 flex items-center gap-2">
                    <TeamBadge team={homeTeam} size="sm" />
                    <div>
                      <span className="font-heading font-bold text-white text-base block leading-tight">
                        {homeTeam.code}
                      </span>
                      <span className="text-[10px] text-[#d5c0d7] hidden sm:block truncate max-w-[80px]">
                        {homeTeam.shortName}
                      </span>
                    </div>
                  </div>

                  {/* Center Scores / Inputs */}
                  <div className="col-span-3 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="15"
                        disabled={pred.isLocked}
                        value={pred.homeScore !== null ? pred.homeScore : ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                          setUserPrediction(match.id, val, pred.awayScore);
                        }}
                        placeholder="-"
                        className="w-10 h-10 bg-[#140b16] border border-[#bf00ff]/60 rounded-lg text-center font-heading font-bold text-lg text-white focus:outline-none focus:border-[#bf00ff] focus:glow-purple-sm disabled:opacity-50"
                      />
                      <span className="text-sm font-bold text-[#bf00ff]">-</span>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        disabled={pred.isLocked}
                        value={pred.awayScore !== null ? pred.awayScore : ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                          setUserPrediction(match.id, pred.homeScore, val);
                        }}
                        placeholder="-"
                        className="w-10 h-10 bg-[#140b16] border border-[#bf00ff]/60 rounded-lg text-center font-heading font-bold text-lg text-white focus:outline-none focus:border-[#bf00ff] focus:glow-purple-sm disabled:opacity-50"
                      />
                    </div>
                    <span className="text-[9px] font-mono text-[#d5c0d7]/70 mt-0.5">
                      Pronóstico
                    </span>
                  </div>

                  {/* Away Team */}
                  <div className="col-span-2 flex items-center justify-end gap-2 text-right">
                    <div>
                      <span className="font-heading font-bold text-white text-base block leading-tight">
                        {awayTeam.code}
                      </span>
                      <span className="text-[10px] text-[#d5c0d7] hidden sm:block truncate max-w-[80px]">
                        {awayTeam.shortName}
                      </span>
                    </div>
                    <TeamBadge team={awayTeam} size="sm" />
                  </div>
                </div>

                {/* Comparison banner if match has real score */}
                {match.homeScore !== null && (
                  <div className="mt-2 pt-2 border-t border-[#3c313e]/50 flex items-center justify-between text-xs">
                    <span className="font-mono text-[#d5c0d7]">
                      Real: <strong className="text-white">{match.homeScore} - {match.awayScore}</strong>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${comparison.badgeColor}`}>
                      {comparison.text}
                    </span>
                  </div>
                )}

                {/* Action Buttons: EDITAR / BLOQUEAR (matching screenshot 9) */}
                <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-[#3c313e]/40">
                  <button
                    onClick={() => {
                      if (isEditing) {
                        setActiveEditingMatchId(null);
                      } else {
                        setActiveEditingMatchId(match.id);
                      }
                    }}
                    className="py-1.5 px-3 rounded-lg bg-[#261c28] hover:bg-[#312733] text-xs font-mono font-semibold text-[#eeddee] uppercase tracking-wider transition-colors text-center border border-[#3c313e]"
                  >
                    {isEditing ? 'GUARDAR' : 'EDITAR'}
                  </button>

                  <button
                    onClick={() => lockPrediction(match.id)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1.5 border ${
                      pred.isLocked
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-[#bf00ff]/20 hover:bg-[#bf00ff]/30 text-[#ecb1ff] border-[#bf00ff]/40'
                    }`}
                  >
                    {pred.isLocked ? (
                      <>
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>BLOQUEADO</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3 text-[#bf00ff]" />
                        <span>BLOQUEAR</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
