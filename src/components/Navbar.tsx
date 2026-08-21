import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  Bell,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  SlidersHorizontal,
  Edit3,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToAdmin?: () => void;
  showUserProfile?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  onNavigateToLogin,
  onNavigateToProfile,
  onNavigateToAdmin,
  showUserProfile = true,
}) => {
  const {
    isMuted,
    toggleMute,
    currentUser,
    isLoggedIn,
    setShowAuthModal,
    setShowRulesModal,
    simulateAllRemaining,
    resetTournament,
    fillRandomPredictionsAll,
    logoutUser,
  } = useTournament();

  const [showSimMenu, setShowSimMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#140b16]/95 backdrop-blur-md border-b border-[#3c313e]/60 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.jpg"
            alt="Quiniela Pasión"
            className="w-10 h-10 rounded-xl object-cover border border-[#bf00ff] glow-purple-sm shadow-md"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-2xl tracking-tighter text-[#bf00ff] text-glow-purple uppercase">
                PASIÓN
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Simulation / Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSimMenu(!showSimMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#261c28] hover:bg-[#3c313e] border border-[#bf00ff]/40 text-[#eeddee] text-xs font-mono transition-all"
              title="Simulador y Herramientas"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span className="hidden sm:inline">Simulador</span>
            </button>

            {showSimMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#1e1321] border border-[#bf00ff]/50 rounded-lg shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-mono text-[#d5c0d7] px-2 py-1 border-b border-[#3c313e] mb-1 font-bold">
                  HERRAMIENTAS DE QUINIELA
                </div>

                <button
                  onClick={() => {
                    fillRandomPredictionsAll();
                    setShowSimMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-2 text-xs text-left rounded hover:bg-[#3c313e] text-[#ecb1ff]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#bf00ff]" />
                  <span>Autollenar mis pronósticos</span>
                </button>

                <button
                  onClick={() => {
                    simulateAllRemaining();
                    setShowSimMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-2 text-xs text-left rounded hover:bg-[#3c313e] text-[#00f0ff]"
                >
                  <Play className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>Simular todo el torneo</span>
                </button>

                <button
                  onClick={() => {
                    onOpenAdmin();
                    setShowSimMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-2 text-xs text-left rounded hover:bg-[#3c313e] text-yellow-300"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Editar marcadores reales</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('¿Deseas reiniciar el torneo y los pronósticos?')) {
                      resetTournament();
                      setShowSimMenu(false);
                    }
                  }}
                  className="w-full flex items-center gap-2 px-2 py-2 text-xs text-left rounded hover:bg-red-950 text-red-300 border-t border-[#3c313e] mt-1 pt-2"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                  <span>Reiniciar datos</span>
                </button>
              </div>
            )}
          </div>

          {/* Rules info */}
          <button
            onClick={() => setShowRulesModal(true)}
            className="p-2 rounded-full hover:bg-[#312733] text-[#eeddee]/80 hover:text-white transition-colors"
            title="Formato de Clasificación"
          >
            <Info className="w-4 h-4 text-[#ecb1ff]" />
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-[#312733] text-[#eeddee]/80 hover:text-white transition-colors"
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-gray-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#00f0ff]" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-full hover:bg-[#312733] text-[#eeddee]/80 hover:text-white transition-colors relative"
              title="Notificaciones"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#bf00ff] ring-2 ring-[#140b16] animate-pulse"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#1e1321] border border-[#bf00ff]/40 rounded-lg shadow-2xl p-3 z-50 text-xs">
                <div className="font-heading font-bold text-sm text-[#eeddee] mb-2 flex items-center justify-between">
                  <span>Notificaciones</span>
                  <span className="text-[10px] text-[#bf00ff]">3 nuevas</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded bg-[#261c28] border-l-2 border-[#bf00ff]">
                    <p className="font-semibold text-white">¡Racha de 7 aciertos!</p>
                    <p className="text-[11px] text-[#d5c0d7]">Tu multiplicador aumentó a 1.5x.</p>
                  </div>
                  <div className="p-2 rounded bg-[#261c28] border-l-2 border-[#00f0ff]">
                    <p className="font-semibold text-white">El Clásico Nacional en vivo</p>
                    <p className="text-[11px] text-[#d5c0d7]">Saprissa 2 - 1 Alajuelense (Min 64)</p>
                  </div>
                  <div className="p-2 rounded bg-[#261c28] border-l-2 border-emerald-400">
                    <p className="font-semibold text-white">Top 5% Alcanzado</p>
                    <p className="text-[11px] text-[#d5c0d7]">¡Estás en la 3ª posición de Costa Rica!</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isLoggedIn && showUserProfile && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full bg-[#261c28] hover:bg-[#3c313e] border border-[#bf00ff]/40 transition-all cursor-pointer"
                title="Mi Cuenta"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-[#bf00ff]"
                />
                <span className="text-xs font-mono text-[#ecb1ff] hidden sm:inline">
                  {currentUser.username}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1e1321] border border-[#bf00ff]/50 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-[#3c313e] mb-1">
                    <div className="text-xs font-heading font-bold text-white truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] font-mono text-[#d5c0d7] truncate">
                      {currentUser.username}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      if (onNavigateToProfile) {
                        onNavigateToProfile();
                      } else {
                        setShowAuthModal(true);
                      }
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono text-left rounded-lg hover:bg-[#3c313e] text-[#ecb1ff] transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-[#bf00ff]" />
                    <span>Editar Perfil</span>
                  </button>

                  {(currentUser.role === 'admin' || currentUser.isAdmin || currentUser.username === '@admin_master') && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigateToAdmin?.();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono text-left rounded-lg hover:bg-[#3c313e] text-amber-300 transition-colors cursor-pointer"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-amber-300" />
                      <span>Panel de Administrador</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      logoutUser();
                      setUserMenuOpen(false);
                      if (onNavigateToLogin) {
                        onNavigateToLogin();
                      }
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono text-left rounded-lg hover:bg-red-950/60 text-red-400 transition-colors cursor-pointer border-t border-[#3c313e] mt-1 pt-2"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
