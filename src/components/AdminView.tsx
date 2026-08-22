import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { getTeamById } from '../data/teams';
import { ShieldCheck, Users, Trophy, CalendarDays, Trash2, Save } from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    currentUser,
    matches,
    leaderboard,
    socialPosts,
    selectedRound,
    setSelectedRound,
    updateRealMatchScore,
    deleteUser,
    setUserEnabled,
    calculateAllPoints,
  } = useTournament();
  const [activeSection, setActiveSection] = useState<'overview' | 'matches' | 'users'>('overview');

  if (currentUser.role !== 'admin' && !currentUser.isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-3">
        <ShieldCheck className="w-12 h-12 mx-auto text-red-400" />
        <h1 className="text-2xl font-heading font-black text-white">Acceso restringido</h1>
        <p className="text-sm text-[#d5c0d7]">Esta sección solo está disponible para administradores.</p>
      </div>
    );
  }

  const roundMatches = matches.filter((match) => match.round === selectedRound);
  const finishedMatches = matches.filter((match) => match.status === 'finished').length;

  const handleDelete = (userId: string, userName: string) => {
    if (userId === currentUser.id) return;
    if (confirm(`¿Eliminar a ${userName} de la plataforma?`)) deleteUser(userId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#3c313e] pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-300 text-xs font-mono uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Panel protegido
          </div>
          <h1 className="text-3xl font-heading font-black text-white mt-1">Centro de Administración</h1>
          <p className="text-sm text-[#d5c0d7]">Control general de usuarios, resultados y actividad.</p>
        </div>
        <span className="text-xs font-mono text-[#00f0ff]">Sesión: {currentUser.username}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<Users />} label="Usuarios" value={leaderboard.length} />
        <StatCard icon={<CalendarDays />} label="Partidos" value={matches.length} />
        <StatCard icon={<Trophy />} label="Finalizados" value={finishedMatches} />
        <StatCard icon={<Save />} label="Publicaciones" value={socialPosts.length} />
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-[#3c313e] pb-2">
        {[
          ['overview', 'Resumen'],
          ['matches', 'Marcadores'],
          ['users', 'Usuarios'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveSection(id as typeof activeSection)}
            className={`px-4 py-2 rounded-lg text-xs font-mono shrink-0 ${
              activeSection === id ? 'bg-[#bf00ff] text-white' : 'bg-[#221824] text-[#d5c0d7]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-500/10 border border-amber-400/30 rounded-xl p-3">
        <div>
          <p className="text-sm font-bold text-amber-200">Cálculo de puntos</p>
          <p className="text-xs text-[#d5c0d7]">Compara los pronósticos guardados con los resultados finalizados.</p>
        </div>
        <button
          onClick={calculateAllPoints}
          className="px-3 py-2 rounded-lg bg-amber-400 text-black text-xs font-bold shrink-0"
        >
          Ejecutar cálculo
        </button>
      </div>

      {activeSection === 'overview' && (
        <div className="grid md:grid-cols-2 gap-4">
          <section className="bg-[#19101c] border border-[#3c313e] rounded-2xl p-4 space-y-3">
            <h2 className="font-heading font-bold text-white">Actividad reciente</h2>
            {socialPosts.slice(0, 5).map((post) => (
              <div key={post.id} className="flex items-center gap-3 border-b border-[#3c313e]/60 pb-2 last:border-0">
                <img src={post.userAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="text-xs text-white truncate">{post.userName}</p>
                  <p className="text-[11px] text-[#d5c0d7] truncate">{post.content}</p>
                </div>
              </div>
            ))}
          </section>
          <section className="bg-[#19101c] border border-[#3c313e] rounded-2xl p-4 space-y-3">
            <h2 className="font-heading font-bold text-white">Top del ranking</h2>
            {leaderboard.slice(0, 5).map((user, index) => (
              <div key={user.id} className="flex items-center justify-between border-b border-[#3c313e]/60 pb-2 last:border-0">
                <span className="text-xs font-mono text-[#00f0ff]">#{index + 1}</span>
                <span className="text-xs text-white flex-1 px-3 truncate">{user.username}</span>
                <span className="text-xs font-mono text-amber-300">{user.points.toLocaleString()} pts</span>
              </div>
            ))}
          </section>
        </div>
      )}

      {activeSection === 'matches' && (
        <section className="bg-[#19101c] border border-[#00f0ff]/50 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-bold text-white">Editar marcadores oficiales</h2>
              <p className="text-xs text-[#d5c0d7]">Los cambios actualizan tabla y ranking.</p>
            </div>
            <select
              value={selectedRound}
              onChange={(event) => setSelectedRound(Number(event.target.value))}
              className="bg-[#140b16] border border-[#00f0ff]/60 rounded-lg px-2 py-2 text-xs text-white"
            >
              {Array.from({ length: 24 }, (_, index) => index + 1).map((round) => (
                <option key={round} value={round}>Jornada {round}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            {roundMatches.map((match) => {
              const home = getTeamById(match.homeTeamId);
              const away = getTeamById(match.awayTeamId);
              return (
                <div key={match.id} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 bg-[#221824] rounded-xl p-3">
                  <span className="text-xs text-white text-right">{home.name}</span>
                  <div className="flex items-center gap-1">
                    <ScoreInput value={match.homeScore} onChange={(value) => updateRealMatchScore(match.id, value, match.awayScore, value === null ? 'scheduled' : 'finished')} />
                    <span className="text-white">-</span>
                    <ScoreInput value={match.awayScore} onChange={(value) => updateRealMatchScore(match.id, match.homeScore, value, value === null ? 'scheduled' : 'finished')} />
                  </div>
                  <span className="text-xs text-white">{away.name}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeSection === 'users' && (
        <section className="bg-[#19101c] border border-red-400/40 rounded-2xl p-4 space-y-3">
          <div>
            <h2 className="font-heading font-bold text-white">Administrar usuarios</h2>
            <p className="text-xs text-[#d5c0d7]">El administrador no puede eliminarse a sí mismo.</p>
          </div>
          {leaderboard.map((user) => (
            <div key={user.id} className="flex items-center gap-3 bg-[#221824] rounded-xl p-3">
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-[11px] font-mono text-[#d5c0d7] truncate">{user.username} · {user.points.toLocaleString()} pts</p>
              </div>
              {user.isAdmin ? (
                <span className="text-[10px] font-mono text-amber-300">ADMIN</span>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUserEnabled(user.id, !(user.isEnabled ?? true))}
                    className={`px-2 py-1 rounded-md text-[10px] font-mono ${
                      user.isEnabled === false ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {user.isEnabled === false ? 'Habilitar' : 'Deshabilitar'}
                  </button>
                  <button onClick={() => handleDelete(user.id, user.name)} className="p-2 text-red-400 hover:bg-red-950/50 rounded-lg" title="Eliminar usuario">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => (
  <div className="bg-[#221824] border border-[#3c313e] rounded-xl p-3">
    <div className="text-[#00f0ff] w-5 h-5">{icon}</div>
    <div className="text-2xl font-heading font-black text-white mt-1">{value}</div>
    <div className="text-[10px] font-mono text-[#d5c0d7] uppercase">{label}</div>
  </div>
);

const ScoreInput: React.FC<{ value: number | null; onChange: (value: number | null) => void }> = ({ value, onChange }) => (
  <input
    type="number"
    min="0"
    max="15"
    value={value ?? ''}
    onChange={(event) => onChange(event.target.value === '' ? null : Number(event.target.value))}
    className="w-10 h-9 bg-[#140b16] border border-[#00f0ff] rounded-lg text-center font-bold text-white"
  />
);
