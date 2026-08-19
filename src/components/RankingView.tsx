import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { TeamBadge } from './TeamBadge';
import { getTeamById } from '../data/teams';
import { Trophy, Medal, Flame, Users, ShieldCheck, ChevronRight, Info } from 'lucide-react';

export const RankingView: React.FC = () => {
  const { standings, leaderboard, currentUser, setShowRulesModal } = useTournament();
  const [activeTab, setActiveTab] = useState<'standings' | 'users'>('standings');

  return (
    <div className="space-y-5 pb-24 max-w-xl mx-auto px-4 pt-2">
      {/* View Switcher Tabs (Tabla de Posiciones vs Ranking Quiniela) */}
      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#19101c] border border-[#3c313e]">
        <button
          onClick={() => setActiveTab('standings')}
          className={`py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'standings'
              ? 'bg-[#bf00ff] text-black glow-purple-sm shadow'
              : 'text-[#d5c0d7] hover:text-white hover:bg-[#261c28]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Liga Promérica</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-[#bf00ff] text-black glow-purple-sm shadow'
              : 'text-[#d5c0d7] hover:text-white hover:bg-[#261c28]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Ranking Quiniela</span>
        </button>
      </div>

      {/* TAB 1: TABLA DE POSICIONES (Matching Screenshot 3) */}
      {activeTab === 'standings' && (
        <div className="space-y-4">
          <div>
            <span className="text-xs font-mono text-[#bf00ff] uppercase tracking-widest block font-bold">
              Tabla de Posiciones
            </span>
            <h1 className="text-2xl font-heading font-extrabold text-white tracking-tight">
              Liga Promérica - Apertura 2026/27
            </h1>
            <p className="text-xs text-[#d5c0d7]">
              Fase Regular de 18 jornadas. Los primeros 4 avanzan a la Segunda Fase.
            </p>
          </div>

          {/* Standings Table Card (Matching Screenshot 3) */}
          <div className="rounded-2xl bg-[#221824] border border-[#3c313e] overflow-hidden shadow-2xl">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-4 py-3 bg-[#19101c] text-[11px] font-mono font-bold text-[#d5c0d7] tracking-wider border-b border-[#3c313e]">
              <div className="col-span-2">POS</div>
              <div className="col-span-6">EQUIPO</div>
              <div className="col-span-1 text-center">PJ</div>
              <div className="col-span-1 text-center">DG</div>
              <div className="col-span-2 text-right">PTS</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-[#3c313e]/40">
              {standings.map((row, index) => {
                const team = getTeamById(row.teamId);
                const pos = index + 1;
                const isLeader = pos === 1;
                const isTop4 = pos >= 2 && pos <= 4;

                return (
                  <div
                    key={row.teamId}
                    className={`grid grid-cols-12 items-center px-4 py-3 transition-colors relative hover:bg-[#261c28] ${
                      isLeader ? 'bg-[#bf00ff]/5' : isTop4 ? 'bg-[#00f0ff]/5' : ''
                    }`}
                  >
                    {/* Left Indicator Stripe matching screenshot 3 */}
                    {isLeader && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#bf00ff] glow-purple shadow-sm"></div>
                    )}
                    {isTop4 && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00f0ff] glow-cyan shadow-sm"></div>
                    )}

                    {/* POS */}
                    <div className="col-span-2 flex items-center gap-1">
                      <span
                        className={`font-mono text-sm font-bold ${
                          isLeader
                            ? 'text-[#bf00ff] font-extrabold'
                            : isTop4
                            ? 'text-[#00f0ff]'
                            : 'text-[#d5c0d7]'
                        }`}
                      >
                        {pos}
                      </span>
                    </div>

                    {/* TEAM BADGE & NAME */}
                    <div className="col-span-6 flex items-center gap-2.5 min-w-0">
                      <TeamBadge team={team} size="sm" />
                      <div className="truncate">
                        <span className="font-heading font-bold text-white text-sm block truncate leading-tight">
                          {team.shortName}
                        </span>
                        <span className="text-[10px] text-[#d5c0d7] font-mono block">
                          {team.city}
                        </span>
                      </div>
                    </div>

                    {/* STATS */}
                    <div className="col-span-1 text-center font-mono text-xs text-[#d5c0d7]">
                      {row.played}
                    </div>
                    <div
                      className={`col-span-1 text-center font-mono text-xs font-semibold ${
                        row.goalDifference > 0
                          ? 'text-emerald-400'
                          : row.goalDifference < 0
                          ? 'text-red-400'
                          : 'text-[#d5c0d7]'
                      }`}
                    >
                      {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                    </div>
                    <div className="col-span-2 text-right font-heading font-black text-base text-white">
                      {row.points}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Classification Legend */}
          <div className="p-3.5 rounded-xl bg-[#19101c] border border-[#3c313e] space-y-2 text-xs">
            <div className="flex items-center justify-between font-mono font-bold text-[#eeddee] border-b border-[#3c313e]/60 pb-1.5">
              <span>ZONAS DE CLASIFICACIÓN</span>
              <button
                onClick={() => setShowRulesModal(true)}
                className="text-[#bf00ff] hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>Ver reglas completas</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#bf00ff] shrink-0 glow-purple-sm"></span>
              <span className="text-[#ecb1ff]">
                <strong>1º Lugar (Líder General):</strong> Asegura pase directo a la Gran Final y cierra Semifinal de local.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#00f0ff] shrink-0 glow-cyan-sm"></span>
              <span className="text-[#00f0ff]">
                <strong>2º al 4º Lugar:</strong> Clasifican a Semifinales de la Segunda Fase.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RANKING DE USUARIOS DE LA QUINIELA (Matching Screenshot 8) */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-[#bf00ff] uppercase tracking-widest block font-bold">
                Ranking Global
              </span>
              <h1 className="text-2xl font-heading font-extrabold text-white tracking-tight">
                Temporada Apertura 2026/27
              </h1>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#bf00ff]/20 border border-[#bf00ff]/50 text-xs font-mono text-[#ecb1ff]">
              Top 5% CR
            </div>
          </div>

          {/* Current User Sticky Highlight Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#221824] via-[#2a1b2d] to-[#221824] border-2 border-[#bf00ff] glow-purple shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-[#bf00ff]"
                />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-[#bf00ff] text-black text-[9px] font-black font-mono">
                  TÚ
                </span>
              </div>
              <div>
                <span className="font-heading font-bold text-base text-white block">
                  {currentUser.name}
                </span>
                <span className="text-xs font-mono text-[#ecb1ff]">
                  {currentUser.username} • Lvl {currentUser.level}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono text-[#00f0ff]">
                {currentUser.exactHits} Aciertos
              </div>
              <div className="font-heading font-black text-xl text-white text-glow-purple">
                {currentUser.points.toLocaleString()} PTS
              </div>
            </div>
          </div>

          {/* Community Leaderboard List (Matching Screenshot 8) */}
          <div className="rounded-2xl bg-[#221824] border border-[#3c313e] overflow-hidden shadow-2xl">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-4 py-3 bg-[#19101c] text-[11px] font-mono font-bold text-[#d5c0d7] tracking-wider border-b border-[#3c313e]">
              <div className="col-span-2">POS</div>
              <div className="col-span-5">USUARIO</div>
              <div className="col-span-2 text-center">ACIERTOS</div>
              <div className="col-span-3 text-right">PUNTOS</div>
            </div>

            {/* List */}
            <div className="divide-y divide-[#3c313e]/40">
              {leaderboard.map((user, idx) => {
                const pos = idx + 1;
                const isMe = user.id === currentUser.id;

                return (
                  <div
                    key={user.id}
                    className={`grid grid-cols-12 items-center px-4 py-3.5 transition-colors ${
                      isMe ? 'bg-[#bf00ff]/10 border-l-2 border-[#bf00ff]' : 'hover:bg-[#261c28]'
                    }`}
                  >
                    {/* Position */}
                    <div className="col-span-2 flex items-center gap-1.5">
                      {pos === 1 && <span className="text-amber-400 font-bold">🥇</span>}
                      {pos === 2 && <span className="text-slate-300 font-bold">🥈</span>}
                      {pos === 3 && <span className="text-amber-600 font-bold">🥉</span>}
                      <span className={`font-mono text-sm font-bold ${pos <= 3 ? 'text-white' : 'text-[#d5c0d7]'}`}>
                        {pos}
                      </span>
                    </div>

                    {/* User */}
                    <div className="col-span-5 flex items-center gap-2 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className={`w-9 h-9 rounded-xl object-cover border ${
                            pos === 1 ? 'border-amber-400' : isMe ? 'border-[#bf00ff]' : 'border-[#3c313e]'
                          }`}
                        />
                        {user.currentStreak >= 5 && (
                          <span className="absolute -top-1 -right-1 text-[10px]" title="En Racha">
                            🔥
                          </span>
                        )}
                      </div>
                      <div className="truncate">
                        <span className="font-heading font-bold text-white text-sm block truncate">
                          {user.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#d5c0d7] block truncate">
                          {user.username}
                        </span>
                      </div>
                    </div>

                    {/* Exact Hits */}
                    <div className="col-span-2 text-center font-mono font-bold text-sm text-[#ecb1ff]">
                      {user.exactHits + user.tendencyHits}
                    </div>

                    {/* Points (electric cyan / purple) */}
                    <div className="col-span-3 text-right">
                      <span className="font-heading font-black text-base text-[#00f0ff] block leading-tight">
                        {user.points.toLocaleString()}
                      </span>
                      {user.multiplier > 1.0 && (
                        <span className="text-[9px] font-mono text-[#ecb1ff]">
                          {user.multiplier}x boost
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
