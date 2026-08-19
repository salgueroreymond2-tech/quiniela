import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { getTeamById } from '../data/teams';
import { TeamBadge } from './TeamBadge';
import { X, Save, Sliders, Play, RotateCcw } from 'lucide-react';

interface AdminMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminMatchModal: React.FC<AdminMatchModalProps> = ({ isOpen, onClose }) => {
  const { matches, updateRealMatchScore, selectedRound, setSelectedRound, simulateRound } = useTournament();

  if (!isOpen) return null;

  const currentMatches = matches.filter((m) => m.round === selectedRound);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#19101c] border-2 border-[#00f0ff] p-6 space-y-4 glow-cyan shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#261c28] text-[#d5c0d7] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-xl font-heading font-black text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#00f0ff]" />
            <span>Editar Marcadores Oficiales</span>
          </h2>
          <p className="text-xs text-[#d5c0d7]">
            Modifica los goles oficiales para probar cómo se actualiza la tabla de posiciones y el ranking.
          </p>
        </div>

        {/* Round selector */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {Array.from({ length: 18 }, (_, i) => i + 1).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRound(r)}
              className={`px-3 py-1 rounded-md text-xs font-mono shrink-0 transition-all ${
                selectedRound === r
                  ? 'bg-[#00f0ff] text-black font-bold'
                  : 'bg-[#221824] text-[#d5c0d7]'
              }`}
            >
              J{r}
            </button>
          ))}
        </div>

        {/* Matches list for selected round */}
        <div className="space-y-3">
          {currentMatches.map((m) => {
            const home = getTeamById(m.homeTeamId);
            const away = getTeamById(m.awayTeamId);

            return (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-[#221824] border border-[#3c313e] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 min-w-[120px]">
                  <TeamBadge team={home} size="xs" />
                  <span className="font-heading font-bold text-white text-xs">{home.code}</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={m.homeScore !== null ? m.homeScore : ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                      updateRealMatchScore(m.id, val, m.awayScore, val !== null ? 'finished' : 'scheduled');
                    }}
                    placeholder="0"
                    className="w-10 h-10 bg-[#140b16] border border-[#00f0ff] rounded-lg text-center font-bold text-white text-base focus:outline-none"
                  />
                  <span className="text-white font-bold">-</span>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={m.awayScore !== null ? m.awayScore : ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                      updateRealMatchScore(m.id, m.homeScore, val, val !== null ? 'finished' : 'scheduled');
                    }}
                    placeholder="0"
                    className="w-10 h-10 bg-[#140b16] border border-[#00f0ff] rounded-lg text-center font-bold text-white text-base focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 min-w-[120px]">
                  <span className="font-heading font-bold text-white text-xs">{away.code}</span>
                  <TeamBadge team={away} size="xs" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#3c313e]">
          <button
            onClick={() => simulateRound(selectedRound)}
            className="px-3 py-2 rounded-xl bg-[#bf00ff]/20 text-[#ecb1ff] border border-[#bf00ff] text-xs font-mono flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Simular J{selectedRound}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#00f0ff] text-black font-heading font-bold text-xs uppercase"
          >
            Cerrar & Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
