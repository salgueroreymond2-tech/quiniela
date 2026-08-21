import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { TeamBadge } from './TeamBadge';
import { TEAMS, getTeamById } from '../data/teams';
import {
  Trophy,
  Flame,
  Target,
  Eye,
  Heart,
  Lock,
  Edit3,
  Award,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

interface ProfileViewProps {
  onOpenLogin?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenLogin }) => {
  const {
    currentUser,
    achievements,
    setShowAuthModal,
    setShowChampionModal,
    logoutUser,
  } = useTournament();

  const favTeam = getTeamById(currentUser.favoriteTeamId);

  return (
    <div className="space-y-5 pb-24 max-w-xl mx-auto px-4 pt-2">
      {/* Top Profile Header Matching Screenshot 8 */}
      <div className="flex flex-col items-center text-center space-y-3 pt-2">
        {/* Glowing Avatar with Level */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl p-1 bg-gradient-to-tr from-[#6e112d] via-[#bf00ff] to-[#00f0ff] glow-purple shadow-2xl">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full rounded-[22px] object-cover bg-black"
            />
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#bf00ff] text-black font-mono font-black text-xs uppercase tracking-wider shadow-lg">
            Lvl {currentUser.level}
          </span>
        </div>

        {/* Name & Username */}
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-heading font-black text-white flex items-center justify-center gap-1.5">
            <span>{currentUser.name}</span>
            <TeamBadge team={favTeam} size="xs" />
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs font-mono text-[#d5c0d7]">
              {currentUser.username}
            </p>
            {currentUser.isAdmin && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                ADMIN
              </span>
            )}
          </div>
        </div>

        {/* STATS ROW (Matching Screenshot 8: PUNTOS TOTALES | RANKING COSTA RICA) */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm pt-2">
          <div className="text-center border-r border-[#3c313e]/70 pr-2">
            <span className="font-heading font-black text-2xl text-[#bf00ff] text-glow-purple block leading-tight">
              {currentUser.points.toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-[#d5c0d7] uppercase tracking-wider">
              PUNTOS TOTALES
            </span>
          </div>

          <div className="text-center pl-2">
            <span className="font-heading font-black text-2xl text-[#00f0ff] text-glow-cyan block leading-tight">
              Top {currentUser.countryRankPercentile}%
            </span>
            <span className="text-[10px] font-mono text-[#d5c0d7] uppercase tracking-wider">
              RANKING COSTA RICA
            </span>
          </div>
        </div>
      </div>

      {/* RACHA ACTUAL CARD (Matching Screenshot 8) */}
      <div className="p-4 rounded-2xl bg-[#221824] border border-[#3c313e] flex items-center justify-between shadow-xl">
        <div className="space-y-1">
          <span className="text-[11px] font-mono text-[#d5c0d7] uppercase tracking-wider block">
            Racha Actual
          </span>
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-3xl text-[#00f0ff] leading-none">
              {currentUser.currentStreak}
            </span>
            <span className="font-heading font-bold text-base text-white">
              Aciertos
            </span>
          </div>
        </div>

        <div className="text-right space-y-1">
          <span className="text-[11px] font-mono text-[#d5c0d7] uppercase tracking-wider block">
            Multiplicador
          </span>
          <span className="font-heading font-black text-2xl text-[#bf00ff] text-glow-purple block leading-none">
            {currentUser.multiplier}x
          </span>
        </div>
      </div>

      {/* TASA DE ACIERTO (Matching Screenshot 8) */}
      <div className="p-5 rounded-2xl bg-[#221824] border border-[#3c313e] flex flex-col items-center justify-center text-center space-y-2 shadow-xl">
        <span className="text-xs font-mono text-[#d5c0d7] uppercase tracking-wider">
          Tasa de Acierto
        </span>

        {/* Circular Progress Gauge */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-[#140b16]"
              strokeWidth="8"
              fill="none"
            />
            {/* Value circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-[#bf00ff]"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - currentUser.accuracyRate / 100)}
              strokeLinecap="round"
              fill="none"
              style={{ filter: 'drop-shadow(0 0 8px #bf00ff)' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading font-black text-2xl text-white text-glow-purple">
              {currentUser.accuracyRate}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-[#d5c0d7] pt-1">
          <span>🎯 {currentUser.exactHits} Exactos</span>
          <span>•</span>
          <span>⚡ {currentUser.tendencyHits} Tendencias</span>
        </div>
      </div>

      {/* INSIGNIAS & LOGROS (Matching Screenshot 8) */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono text-[#d5c0d7] uppercase tracking-wider font-bold">
            Logros & Insignias
          </h2>
          <span className="text-[11px] font-mono text-[#bf00ff] hover:underline cursor-pointer">
            VER TODOS
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Badge 1: Oráculo Tico */}
          <div className="p-3.5 rounded-xl bg-[#221824] border border-[#3c313e] flex flex-col items-center text-center space-y-1.5 shadow-md hover:border-[#bf00ff]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00f0ff] to-[#bf00ff] flex items-center justify-center glow-cyan-sm text-black">
              <Eye className="w-6 h-6 text-black" />
            </div>
            <span className="font-heading font-bold text-white text-xs block leading-tight">
              Oráculo Tico
            </span>
            <span className="text-[10px] text-[#d5c0d7] font-mono">
              5 aciertos exactos
            </span>
          </div>

          {/* Badge 2: Experto Promerica */}
          <div className="p-3.5 rounded-xl bg-[#221824] border border-[#3c313e] flex flex-col items-center text-center space-y-1.5 shadow-md hover:border-[#bf00ff]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#bf00ff] to-[#ecb1ff] flex items-center justify-center glow-purple-sm text-black">
              <Trophy className="w-6 h-6 text-black" />
            </div>
            <span className="font-heading font-bold text-white text-xs block leading-tight">
              Experto Promérica
            </span>
            <span className="text-[10px] text-[#d5c0d7] font-mono">
              10 predicciones
            </span>
          </div>

          {/* Badge 3: Fiel Seguidor */}
          <div className="p-3.5 rounded-xl bg-[#221824] border border-[#3c313e] flex flex-col items-center text-center space-y-1.5 shadow-md hover:border-[#bf00ff]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#6e112d] to-[#bf00ff] flex items-center justify-center glow-purple-sm text-white">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <span className="font-heading font-bold text-white text-xs block leading-tight">
              Fiel Seguidor
            </span>
            <span className="text-[10px] text-[#d5c0d7] font-mono">
              10 partidos Saprissa
            </span>
          </div>

          {/* Badge 4: Leyenda (Locked) */}
          <div className="p-3.5 rounded-xl bg-[#19101c] border border-[#3c313e]/60 opacity-60 flex flex-col items-center text-center space-y-1.5 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#261c28] border border-[#3c313e] flex items-center justify-center text-zinc-500">
              <Lock className="w-5 h-5 text-zinc-500" />
            </div>
            <span className="font-heading font-bold text-zinc-400 text-xs block leading-tight">
              Leyenda
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              Racha de 20
            </span>
          </div>
        </div>
      </div>

      {/* User Actions */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => setShowAuthModal(true)}
          className="w-full py-3 px-4 rounded-xl bg-[#261c28] hover:bg-[#312733] border border-[#bf00ff]/40 text-[#ecb1ff] font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <Edit3 className="w-4 h-4" />
          <span>Editar Perfil & Equipo Favorito</span>
        </button>

        <button
          onClick={() => setShowChampionModal(true)}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <Award className="w-4 h-4" />
          <span>Ver Pantalla de Campeón</span>
        </button>

        <button
          onClick={() => {
            logoutUser();
            if (onOpenLogin) onOpenLogin();
          }}
          className="w-full py-3 px-4 rounded-xl bg-[#1e1015] hover:bg-[#2c131d] border border-red-500/40 text-red-400 font-heading font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-3 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};
