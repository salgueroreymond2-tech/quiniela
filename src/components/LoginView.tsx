import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { TEAMS } from '../data/teams';
import { TeamBadge } from './TeamBadge';
import { Mail, Lock, ArrowRight, User, Sparkles, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { currentUser, updateUserProfile, loginUser } = useTournament();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('carlos@promerica.cr');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [favoriteTeamId, setFavoriteTeamId] = useState(currentUser.favoriteTeamId);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isAdminLogin = email.trim().toLowerCase() === 'admin@pasion.cr' && password === 'admin2026';
    updateUserProfile(
      isAdminLogin ? 'Administrador Quiniela' : name,
      isAdminLogin ? '@admin_master' : username,
      favoriteTeamId,
    );
    loginUser(isAdminLogin);
    setIsSubmitted(true);
    setTimeout(() => {
      if (onLoginSuccess) {
        setIsSubmitted(false);
        onLoginSuccess();
      }
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-6 px-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl p-1 bg-gradient-to-tr from-[#6e112d] via-[#bf00ff] to-[#00f0ff] glow-purple shadow-2xl overflow-hidden flex items-center justify-center">
              <img
                src="/logo.jpg"
                alt="Quiniela Pasión Logo"
                className="w-full h-full object-cover rounded-[22px]"
              />
            </div>
          </div>

          <h1 className="text-3xl font-heading font-black text-[#bf00ff] text-glow-purple uppercase tracking-wider pt-2">
            PASIÓN QUINIELA
          </h1>
          <p className="text-xs text-[#d5c0d7] max-w-xs font-mono">
            {isRegister 
              ? 'Únete a la mejor comunidad de pronósticos de la Liga Promérica' 
              : 'Demuestra tus conocimientos del fútbol tico y escala en el Ranking Nacional'}
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-[#19101c] border-2 border-[#bf00ff]/80 rounded-3xl p-6 sm:p-8 space-y-5 glow-purple shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Background Gradient inside card */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#bf00ff]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none"></div>

          {isSubmitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-[#00f0ff] animate-bounce" />
              <h3 className="text-xl font-heading font-bold text-white">
                ¡Bienvenido a la Pasión!
              </h3>
              <p className="text-xs font-mono text-[#d5c0d7]">
                Sesión iniciada como <span className="text-[#bf00ff] font-bold">{username}</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              
              {/* Tab Selector inside Card */}
              <div className="flex bg-[#140b16] p-1 rounded-2xl border border-[#3c313e]">
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className={`flex-1 py-2 text-xs font-heading font-bold uppercase rounded-xl transition-all ${
                    !isRegister
                      ? 'bg-[#bf00ff] text-white glow-purple-sm'
                      : 'text-[#d5c0d7]/70 hover:text-white'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className={`flex-1 py-2 text-xs font-heading font-bold uppercase rounded-xl transition-all ${
                    isRegister
                      ? 'bg-[#bf00ff] text-white glow-purple-sm'
                      : 'text-[#d5c0d7]/70 hover:text-white'
                  }`}
                >
                  Registrarse
                </button>
              </div>

              {/* Form Fields */}
              {isRegister && (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#d5c0d7] uppercase">Nombre Completo</label>
                    <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 text-black">
                      <User className="w-4 h-4 text-zinc-500 shrink-0" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Carlos Alvarado"
                        className="w-full bg-transparent text-black text-sm focus:outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#d5c0d7] uppercase">Nombre de Usuario</label>
                    <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 text-black">
                      <span className="text-zinc-500 font-mono text-sm font-bold">@</span>
                      <input
                        type="text"
                        required
                        value={username.replace(/^@/, '')}
                        onChange={(e) => setUsername(`@${e.target.value}`)}
                        placeholder="carlos_tico"
                        className="w-full bg-transparent text-black text-sm focus:outline-none font-medium"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#d5c0d7] uppercase">Correo Electrónico</label>
                <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 text-black">
                  <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="carlos@promerica.cr"
                    className="w-full bg-transparent text-black text-sm focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-[#d5c0d7] uppercase">Contraseña</label>
                  {!isRegister && (
                    <span className="text-[10px] font-mono text-[#bf00ff] hover:underline cursor-pointer">
                      ¿Olvidaste tu contraseña?
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 text-black">
                  <Lock className="w-4 h-4 text-zinc-500 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-black text-sm focus:outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="text-zinc-500 hover:text-[#bf00ff] transition-colors"
                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Favorite Team Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-mono text-[#d5c0d7] uppercase flex items-center justify-between">
                  <span>Tu Equipo Favorito</span>
                  <span className="text-[#00f0ff] font-normal">Liga Promérica</span>
                </label>
                <div className="grid grid-cols-6 gap-1.5 p-2 bg-[#140b16] rounded-2xl border border-[#3c313e]">
                  {TEAMS.map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setFavoriteTeamId(t.id)}
                      className={`p-1.5 rounded-xl flex flex-col items-center justify-center transition-all ${
                        favoriteTeamId === t.id
                          ? 'bg-[#bf00ff] text-black ring-2 ring-white scale-110 glow-purple-sm'
                          : 'hover:bg-[#261c28] opacity-80 hover:opacity-100'
                      }`}
                      title={t.name}
                    >
                      <TeamBadge team={t} size="xs" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#261c28] hover:bg-[#3c313e] border border-[#bf00ff] text-white font-heading font-bold text-base uppercase tracking-wider flex items-center justify-center gap-2 glow-purple-sm transition-all mt-2 cursor-pointer"
              >
                <span>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</span>
                <ArrowRight className="w-5 h-5 text-[#bf00ff]" />
              </button>

              {/* Google Social Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 rounded-xl bg-[#140b16] hover:bg-[#261c28] border border-[#3c313e] text-[#eeddee] text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span className="text-[#00f0ff]">➜]</span>
                <span>Continuar con Google</span>
              </button>

            </form>
          )}

        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#d5c0d7]/70 font-mono">
          <ShieldCheck className="w-4 h-4 text-[#bf00ff]" />
          <span>Pronósticos seguros y oficiales Liga Promérica</span>
        </div>

      </div>
    </div>
  );
};
