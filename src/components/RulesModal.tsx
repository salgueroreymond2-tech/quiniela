import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { X, Trophy, Swords, ShieldAlert, Award } from 'lucide-react';

export const RulesModal: React.FC = () => {
  const { showRulesModal, setShowRulesModal } = useTournament();

  if (!showRulesModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[#19101c] border-2 border-[#bf00ff] p-6 space-y-4 glow-purple shadow-2xl">
        <button
          onClick={() => setShowRulesModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#261c28] text-[#d5c0d7] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#bf00ff]/20 border border-[#bf00ff] flex items-center justify-center text-xl">
            🏆
          </div>
          <div>
            <h2 className="text-xl font-heading font-black text-white">
              Reglamento Liga Promérica
            </h2>
            <p className="text-xs text-[#d5c0d7]">Torneo Apertura 2026/27 - Primera División CR</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-[#eeddee] leading-relaxed">
          <div className="p-3 rounded-xl bg-[#221824] border border-[#bf00ff]/40">
            <h4 className="font-heading font-bold text-sm text-[#bf00ff] mb-1">
              1. Fase Regular (18 Jornadas)
            </h4>
            <p className="text-[#d5c0d7]">
              10 clubes compiten todos contra todos a 2 vueltas (ida y vuelta). 90 partidos en total.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#221824] border border-[#00f0ff]/40">
            <h4 className="font-heading font-bold text-sm text-[#00f0ff] mb-1">
              2. El Líder General (1º Lugar)
            </h4>
            <p className="text-[#d5c0d7]">
              El equipo que finalice en el 1er lugar asegura directamente su cupo a la <strong>Gran Final</strong> del campeonato.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#221824] border border-[#3c313e]">
            <h4 className="font-heading font-bold text-sm text-white mb-1">
              3. Segunda Fase (Semifinales y Final de Fase)
            </h4>
            <p className="text-[#d5c0d7]">
              Clasifican los 4 mejores: <strong>1º vs 4º</strong> y <strong>2º vs 3º</strong> en series de ida y vuelta. Los ganadores disputan la Final de Segunda Fase.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#221824] border border-amber-400/40">
            <h4 className="font-heading font-bold text-sm text-amber-300 mb-1">
              4. Definición del Campeón & Gran Final
            </h4>
            <ul className="list-disc list-inside space-y-1 text-[#d5c0d7]">
              <li><strong>Caso A (Campeón sin Gran Final):</strong> Si el Líder General gana también la Final de Segunda Fase, ¡es proclamado Campeón Nacional de manera inmediata!</li>
              <li><strong>Caso B (Se juega Gran Final):</strong> Si la Segunda Fase la gana otro equipo (2º, 3º o 4º), se disputa una <strong>Gran Final</strong> (ida y vuelta) entre el Líder General y el ganador de la Segunda Fase.</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-[#140b16] border border-[#bf00ff]/30 text-[11px] font-mono">
            <span className="text-[#ecb1ff] font-bold block mb-1">SISTEMA DE PUNTOS EN LA QUINIELA:</span>
            <div className="grid grid-cols-2 gap-2 text-zinc-300">
              <div>🎯 Marcador exacto: <strong className="text-white">+300 pts</strong></div>
              <div>⚡ Ganador / Empate: <strong className="text-white">+100 pts</strong></div>
              <div>⚽ Goleador acertado: <strong className="text-white">+50 pts</strong></div>
              <div>🔥 Multiplicador racha: <strong className="text-[#00f0ff]">hasta 2.0x</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
