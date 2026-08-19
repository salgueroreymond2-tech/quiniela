import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { TeamBadge } from './TeamBadge';
import { getTeamById } from '../data/teams';
import {
  Trophy,
  GitCommit,
  Medal,
  ChevronRight,
  Sparkles,
  Award,
  Crown,
  Share2,
} from 'lucide-react';

interface PlayoffsViewProps {
  onOpenScorerModal: (matchId: string) => void;
}

export const PlayoffsView: React.FC<PlayoffsViewProps> = ({ onOpenScorerModal }) => {
  const {
    matches,
    userPredictions,
    setUserPrediction,
    top4TeamIds,
    regularLeaderId,
    secondPhaseWinnerId,
    absoluteChampionId,
    hasGranFinal,
    setShowChampionModal,
  } = useTournament();

  const [championPick, setChampionPick] = useState<string>('sap');

  const team1 = getTeamById(top4TeamIds[0] || 'sap');
  const team2 = getTeamById(top4TeamIds[1] || 'lda');
  const team3 = getTeamById(top4TeamIds[2] || 'csh');
  const team4 = getTeamById(top4TeamIds[3] || 'csc');

  // Playoff matches
  const sf1Ida = matches.find((m) => m.id === 'sf1-ida');
  const sf1Vuelta = matches.find((m) => m.id === 'sf1-vuelta');
  const sf2Ida = matches.find((m) => m.id === 'sf2-ida');
  const sf2Vuelta = matches.find((m) => m.id === 'sf2-vuelta');
  const finalFaseIda = matches.find((m) => m.id === 'final-fase-ida');
  const finalFaseVuelta = matches.find((m) => m.id === 'final-fase-vuelta');
  const granFinalIda = matches.find((m) => m.id === 'gran-final-ida');
  const granFinalVuelta = matches.find((m) => m.id === 'gran-final-vuelta');

  return (
    <div className="space-y-6 pb-28 max-w-xl mx-auto px-4 pt-2">
      {/* Header matching Screenshot 1 */}
      <div>
        <h1 className="text-3xl font-heading font-black text-white tracking-tight leading-none mb-1">
          Formato de Clasificación
        </h1>
        <p className="text-sm text-[#d5c0d7]">
          Reglas del Torneo tras las 18 jornadas regulares de la Liga Promérica.
        </p>
      </div>

      {/* 4 EXPLANATORY CARDS MATCHING SCREENSHOT 1 */}
      <div className="space-y-4">
        {/* Card 1: Líder General */}
        <div className="p-5 rounded-2xl bg-[#221824] border border-[#bf00ff]/60 glow-purple-sm shadow-xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="font-heading font-bold text-base text-white">
              1. Líder General
            </span>
            <Trophy className="w-5 h-5 text-[#bf00ff]" />
          </div>
          <p className="text-sm text-[#eeddee]/90 mb-4 leading-relaxed">
            El equipo en el 1er lugar asegura directamente su pase a la <strong className="text-white">Gran Final</strong>.
          </p>
          <div className="flex justify-center pt-1">
            <div className="flex items-center gap-3 p-2 px-4 rounded-xl bg-[#140b16] border border-[#bf00ff]/50 glow-purple-sm">
              <TeamBadge team={team1} size="md" />
              <div className="text-left">
                <span className="text-xs font-mono text-[#ecb1ff] uppercase">Líder Actual:</span>
                <span className="font-heading font-bold text-white block text-sm">{team1.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Semifinales */}
        <div className="p-5 rounded-2xl bg-[#221824] border border-[#3c313e] shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="font-heading font-bold text-base text-white">
              2. Semifinales
            </span>
            <div className="text-[#00f0ff] font-bold text-sm">⤹⤸</div>
          </div>
          <p className="text-sm text-[#eeddee]/90 mb-4 leading-relaxed">
            Los 4 mejores equipos se enfrentan en series de ida y vuelta. El <strong className="text-white">1º y 2º lugar</strong> cierran la serie como locales.
          </p>
          <div className="flex justify-center items-center gap-3 py-1">
            {[team1, team2, team3, team4].map((t, idx) => (
              <div
                key={t.id}
                className="w-11 h-11 rounded-xl bg-[#140b16] border border-[#3c313e] flex flex-col items-center justify-center p-1"
                title={`${idx + 1}º: ${t.name}`}
              >
                <span className="text-[10px] font-mono font-bold text-[#00f0ff] leading-none mb-0.5">
                  [{idx + 1}]
                </span>
                <TeamBadge team={t} size="xs" />
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Segunda Fase */}
        <div className="p-5 rounded-2xl bg-[#221824] border border-[#3c313e] shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="font-heading font-bold text-base text-white">
              3. Segunda Fase
            </span>
            <div className="text-[#bf00ff] text-base">📣</div>
          </div>
          <p className="text-sm text-[#eeddee]/90 mb-4 leading-relaxed">
            Los ganadores de semifinales se enfrentan por el título de fase. El <strong className="text-white">mejor clasificado</strong> cierra la serie en casa.
          </p>
          <div className="flex justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#140b16] border border-[#3c313e]">
              <TeamBadge team={team2} size="sm" />
              <span className="text-xs font-mono text-[#d5c0d7]">Ganador Semifinales</span>
            </div>
          </div>
        </div>

        {/* Card 4: Gran Final */}
        <div className="p-5 rounded-2xl bg-[#221824] border border-[#bf00ff]/60 glow-purple-sm shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="font-heading font-bold text-base text-white">
              4. Gran Final
            </span>
            <Medal className="w-5 h-5 text-[#00f0ff]" />
          </div>
          <p className="text-sm text-[#eeddee]/90 leading-relaxed">
            Si el <strong className="text-[#bf00ff]">Líder General</strong> gana la 'Final de Segunda Fase', es declarado <strong className="text-emerald-400">campeón automáticamente</strong>. Si no, se disputa una <strong className="text-[#bf00ff]">Gran Final</strong> entre el Líder General y el ganador de la Segunda Fase para definir al monarca absoluto.
          </p>
        </div>
      </div>

      {/* INTERACTIVE PLAYOFF BRACKET & MATCHES (Matching Screenshot 5 & 13) */}
      <div className="space-y-4 pt-4 border-t border-[#3c313e]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-black text-white tracking-tight">
            Llaves de Fase Final
          </h2>
          <button
            onClick={() => setShowChampionModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-heading font-bold shadow-md transition-all"
          >
            <Crown className="w-4 h-4" />
            <span>Ver Campeón</span>
          </button>
        </div>

        {/* GRAN FINAL HIGHLIGHT (Matching Screenshot 5) */}
        {granFinalVuelta && (
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#221824] to-[#140b16] border-2 border-[#bf00ff] glow-purple shadow-2xl space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 text-xs font-mono font-bold mb-1">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
                <span>EN VIVO (Min {granFinalVuelta.minute || 78}')</span>
              </div>
              <h3 className="text-3xl font-heading font-black text-white uppercase tracking-tight">
                Gran Final
              </h3>
              <span className="text-xs font-mono text-[#d5c0d7]">LIGA PROMERICA - PARTIDO DE VUELTA</span>
            </div>

            {/* Matchup SAP vs CSH */}
            {(() => {
              const home = getTeamById(granFinalVuelta.homeTeamId);
              const away = getTeamById(granFinalVuelta.awayTeamId);
              const pred = userPredictions[granFinalVuelta.id] || { matchId: granFinalVuelta.id, homeScore: 2, awayScore: 0 };

              return (
                <div className="space-y-3">
                  <div className="grid grid-cols-5 items-center gap-2">
                    <div className="col-span-2 flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-[#140b16] border-2 border-[#bf00ff] flex items-center justify-center p-2 mb-1 glow-purple-sm">
                        <TeamBadge team={home} size="lg" />
                      </div>
                      <span className="font-heading font-bold text-white text-base">{home.shortName}</span>
                    </div>

                    <div className="col-span-1 text-center">
                      <span className="text-2xl font-heading font-black text-[#bf00ff] text-glow-purple">VS</span>
                    </div>

                    <div className="col-span-2 flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-[#140b16] border-2 border-[#bf00ff] flex items-center justify-center p-2 mb-1 glow-purple-sm">
                        <TeamBadge team={away} size="lg" />
                      </div>
                      <span className="font-heading font-bold text-white text-base">{away.shortName}</span>
                    </div>
                  </div>

                  {/* Input Score Boxes */}
                  <div className="flex items-center justify-center gap-3">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={pred.homeScore !== null ? pred.homeScore : ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                        setUserPrediction(granFinalVuelta.id, val, pred.awayScore);
                      }}
                      placeholder="-"
                      className="w-16 h-16 bg-[#140b16] border-2 border-[#bf00ff] rounded-xl text-center font-heading font-black text-3xl text-white focus:outline-none focus:glow-purple"
                    />
                    <span className="text-2xl font-bold text-[#bf00ff]">-</span>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={pred.awayScore !== null ? pred.awayScore : ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                        setUserPrediction(granFinalVuelta.id, pred.homeScore, val);
                      }}
                      placeholder="-"
                      className="w-16 h-16 bg-[#140b16] border-2 border-[#bf00ff] rounded-xl text-center font-heading font-black text-3xl text-white focus:outline-none focus:glow-purple"
                    />
                  </div>
                  <p className="text-[10px] font-mono text-[#d5c0d7] text-center tracking-widest uppercase">
                    INGRESA TU PRONÓSTICO (90 MIN)
                  </p>
                </div>
              );
            })()}

            {/* PREDICCIÓN DE CAMPEÓN (Matching Screenshot 5) */}
            <div className="p-4 rounded-xl bg-[#19101c] border border-[#bf00ff]/40 space-y-3">
              <div className="text-center">
                <Trophy className="w-6 h-6 text-[#bf00ff] mx-auto mb-1 animate-bounce" />
                <h4 className="font-heading font-bold text-white text-base">
                  Predicción de Campeón
                </h4>
                <p className="text-xs text-[#d5c0d7]">¿Quién levantará la copa?</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[team3, team1].map((t) => {
                  const isSelected = championPick === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setChampionPick(t.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#bf00ff]/20 border-[#bf00ff] glow-purple-sm text-white scale-105'
                          : 'bg-[#221824] border-[#3c313e] text-[#d5c0d7] hover:border-white/40'
                      }`}
                    >
                      <TeamBadge team={t} size="md" className="mb-1" />
                      <span className="font-heading font-bold text-sm">{t.shortName}</span>
                      {isSelected && (
                        <span className="text-[9px] font-mono text-[#00f0ff] mt-0.5">
                          ✓ Tu Elección
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SEMIFINALES LIST */}
        <div className="space-y-3">
          <h3 className="text-lg font-heading font-bold text-white">
            Detalle de Semifinales (Ida y Vuelta)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* SF1 */}
            <div className="p-3.5 rounded-xl bg-[#221824] border border-[#3c313e] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#00f0ff]">
                <span>SEMIFINAL 1 (1º vs 4º)</span>
                <span>Global: 5 - 2</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TeamBadge team={team1} size="sm" />
                  <span className="font-heading font-bold text-white text-sm">{team1.code}</span>
                </div>
                <span className="font-heading font-black text-white text-base">3 - 1 (V)</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#d5c0d7]">
                <div className="flex items-center gap-2">
                  <TeamBadge team={team4} size="sm" />
                  <span className="font-heading font-bold text-white text-sm">{team4.code}</span>
                </div>
                <span className="font-mono">1 - 2 (I)</span>
              </div>
            </div>

            {/* SF2 */}
            <div className="p-3.5 rounded-xl bg-[#221824] border border-[#3c313e] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#00f0ff]">
                <span>SEMIFINAL 2 (2º vs 3º)</span>
                <span>Global: 2 - 3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TeamBadge team={team2} size="sm" />
                  <span className="font-heading font-bold text-white text-sm">{team2.code}</span>
                </div>
                <span className="font-heading font-black text-white text-base">1 - 1 (V)</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#d5c0d7]">
                <div className="flex items-center gap-2">
                  <TeamBadge team={team3} size="sm" />
                  <span className="font-heading font-bold text-white text-sm">{team3.code}</span>
                </div>
                <span className="font-mono">2 - 1 (I)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
