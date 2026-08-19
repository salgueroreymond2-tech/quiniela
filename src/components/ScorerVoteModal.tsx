import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { getTeamById } from '../data/teams';
import { TeamBadge } from './TeamBadge';
import { X, Check } from 'lucide-react';

export const ScorerVoteModal: React.FC = () => {
  const {
    activeScorerMatchId,
    setActiveScorerMatchId,
    matches,
    userPredictions,
    setUserScorer,
  } = useTournament();

  if (!activeScorerMatchId) return null;

  const match = matches.find((m) => m.id === activeScorerMatchId);
  if (!match) return null;

  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);
  const pred = userPredictions[match.id];
  const currentScorer = pred?.selectedScorer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-[#19101c] border-2 border-[#bf00ff] p-5 space-y-4 glow-purple shadow-2xl">
        <button
          onClick={() => setActiveScorerMatchId(null)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#261c28] text-[#d5c0d7] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <span>Votar por Goleador</span>
            <span className="text-lg">⚽</span>
          </h3>
          <p className="text-xs text-[#d5c0d7]">
            Gana <strong className="text-[#00f0ff]">+50 pts extra</strong> si tu jugador seleccionado anota en el partido.
          </p>
        </div>

        <div className="space-y-3">
          {/* Home team players */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-[#ecb1ff]">
              <TeamBadge team={homeTeam} size="xs" />
              <span>{homeTeam.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {homeTeam.starPlayers.map((player) => {
                const isSelected = currentScorer === player;
                return (
                  <button
                    key={player}
                    onClick={() => {
                      setUserScorer(match.id, player);
                      setActiveScorerMatchId(null);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#bf00ff] text-black font-bold border-white glow-purple-sm'
                        : 'bg-[#221824] border-[#3c313e] text-[#eeddee] hover:border-[#bf00ff]/60'
                    }`}
                  >
                    <span className="truncate">{player}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Away team players */}
          <div className="space-y-1.5 pt-2 border-t border-[#3c313e]/60">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff]">
              <TeamBadge team={awayTeam} size="xs" />
              <span>{awayTeam.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {awayTeam.starPlayers.map((player) => {
                const isSelected = currentScorer === player;
                return (
                  <button
                    key={player}
                    onClick={() => {
                      setUserScorer(match.id, player);
                      setActiveScorerMatchId(null);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#bf00ff] text-black font-bold border-white glow-purple-sm'
                        : 'bg-[#221824] border-[#3c313e] text-[#eeddee] hover:border-[#bf00ff]/60'
                    }`}
                  >
                    <span className="truncate">{player}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
