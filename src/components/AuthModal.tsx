import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { TEAMS } from '../data/teams';
import { TeamBadge } from './TeamBadge';
import { Mail, Lock, ArrowRight, X, User } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, currentUser, updateUserProfile } = useTournament();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('carlos@promerica.cr');
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [favoriteTeamId, setFavoriteTeamId] = useState(currentUser.favoriteTeamId);

  if (!showAuthModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(name, username, favoriteTeamId);
    setShowAuthModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#19101c] border-2 border-[#bf00ff]/80 p-6 space-y-4 glow-purple shadow-2xl">
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#261c28] text-[#d5c0d7] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo Icon */}
        <div className="flex flex-col items-center text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#bf00ff]/20 border border-[#bf00ff] flex items-center justify-center glow-purple text-2xl">
            ⚽
          </div>
          <h2 className="text-2xl font-heading font-black text-[#bf00ff] text-glow-purple uppercase tracking-wider">
            PASIÓN
          </h2>
          <p className="text-xs text-[#d5c0d7]">
            {isRegister ? 'Crea tu cuenta de pronósticos' : 'Inicia sesión para competir en Costa Rica'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          {/* Name if register */}
          {isRegister && (
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-[#d5c0d7] uppercase">Nombre Completo</label>
              <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 text-black">
                <User className="w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full bg-transparent text-black text-sm focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Email (Matching screenshot 9) */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#d5c0d7] uppercase">Correo Electrónico</label>
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 text-black">
              <Mail className="w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full bg-transparent text-black text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Password (Matching screenshot 9) */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#d5c0d7] uppercase">Contraseña</label>
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 text-black">
              <Lock className="w-4 h-4 text-zinc-500" />
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full bg-transparent text-black text-sm focus:outline-none"
              />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-[#bf00ff] hover:underline cursor-pointer">
                ¿Olvidaste tu contraseña?
              </span>
            </div>
          </div>

          {/* Favorite Team Selector */}
          <div className="space-y-1 pt-1">
            <label className="text-[11px] font-mono text-[#d5c0d7] uppercase">Tu Equipo de Liga Promérica</label>
            <div className="grid grid-cols-5 gap-1.5 p-2 bg-[#140b16] rounded-xl border border-[#3c313e]">
              {TEAMS.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setFavoriteTeamId(t.id)}
                  className={`p-1.5 rounded-lg flex flex-col items-center justify-center transition-all ${
                    favoriteTeamId === t.id
                      ? 'bg-[#bf00ff] text-black ring-2 ring-white scale-110'
                      : 'hover:bg-[#261c28]'
                  }`}
                  title={t.name}
                >
                  <TeamBadge team={t} size="xs" />
                </button>
              ))}
            </div>
          </div>

          {/* Iniciar Sesión Button (Matching screenshot 9) */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#261c28] hover:bg-[#3c313e] border border-[#bf00ff] text-white font-heading font-bold text-sm flex items-center justify-center gap-2 glow-purple-sm transition-all"
          >
            <span>{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</span>
            <ArrowRight className="w-4 h-4 text-[#bf00ff]" />
          </button>

          {/* Google Button (Matching screenshot 9) */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-2.5 rounded-xl bg-[#140b16] hover:bg-[#261c28] border border-[#3c313e] text-[#eeddee] text-xs font-mono flex items-center justify-center gap-2 transition-all"
          >
            <span>➜] Continuar con Google</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#3c313e]/40">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-[#d5c0d7]"
          >
            {isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
            <strong className="text-[#bf00ff]">{isRegister ? 'Inicia Sesión' : 'Regístrate'}</strong>
          </button>
        </div>
      </div>
    </div>
  );
};
