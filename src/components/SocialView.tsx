import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { TeamBadge } from './TeamBadge';
import { getTeamById } from '../data/teams';
import {
  Heart,
  MessageCircle,
  Share2,
  Flame,
  Target,
  Send,
  Sparkles,
  Zap,
} from 'lucide-react';

export const SocialView: React.FC = () => {
  const { socialPosts, toggleLikePost, addSocialPost, currentUser } = useTournament();
  const [newPostText, setNewPostText] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    addSocialPost(newPostText.trim());
    setNewPostText('');
  };

  return (
    <div className="space-y-5 pb-24 max-w-xl mx-auto px-4 pt-2">
      {/* Header Matching Screenshot 7 */}
      <div>
        <h1 className="text-3xl font-heading font-black text-white tracking-tight leading-none mb-1">
          Muro de Momentos
        </h1>
        <p className="text-sm text-[#d5c0d7]">
          Actualizaciones en vivo de tu equipo y de los mejores pronosticadores.
        </p>
      </div>

      {/* Quick Post Creator */}
      <form onSubmit={handleCreatePost} className="p-3.5 rounded-2xl bg-[#221824] border border-[#3c313e] space-y-2">
        <div className="flex items-center gap-2.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-[#bf00ff]"
          />
          <input
            type="text"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Comparte tu pronóstico o análisis de la fecha..."
            className="flex-1 bg-[#140b16] border border-[#3c313e] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#bf00ff]"
          />
          <button
            type="submit"
            disabled={!newPostText.trim()}
            className="p-2 rounded-xl bg-[#bf00ff] hover:bg-[#d033ff] disabled:opacity-40 text-black transition-all glow-purple-sm shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Posts Feed (Matching Screenshot 7) */}
      <div className="space-y-4">
        {socialPosts.map((post) => {
          return (
            <div
              key={post.id}
              className="p-4 rounded-2xl bg-[#221824] border border-[#3c313e] space-y-3.5 shadow-xl transition-all hover:border-[#bf00ff]/50"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.userAvatar}
                    alt={post.userName}
                    className="w-10 h-10 rounded-xl object-cover border border-[#bf00ff]/60"
                  />
                  <div>
                    <span className="font-heading font-bold text-white text-base block leading-tight">
                      {post.userName}
                    </span>
                    <span className="text-[11px] font-mono text-[#d5c0d7]">
                      {post.timeAgo}
                    </span>
                  </div>
                </div>

                {post.userBadge && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#bf00ff]/20 border border-[#bf00ff]/50 text-[10px] font-mono font-bold text-[#ecb1ff]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#bf00ff] animate-pulse"></span>
                    <span>{post.userBadge}</span>
                  </div>
                )}
              </div>

              {/* Main Text Content */}
              <p className="text-sm text-[#eeddee] leading-relaxed">
                {post.content}
              </p>

              {/* TYPE 1: PREDICTION MATCH CARD (Matching Screenshot 7) */}
              {post.matchInfo && (
                <div className="p-4 rounded-xl bg-[#19101c] border border-[#bf00ff]/30 glow-purple-sm space-y-3">
                  <div className="flex items-center justify-between px-4">
                    <div className="flex flex-col items-center">
                      <TeamBadge teamId="sap" size="md" className="mb-1" />
                      <span className="text-xs font-heading font-bold text-white">
                        {post.matchInfo.homeTeam}
                      </span>
                      <span className="text-xl font-heading font-black text-[#bf00ff] text-glow-purple">
                        {post.matchInfo.homeScore}
                      </span>
                    </div>

                    <span className="font-heading font-bold text-xs text-[#d5c0d7]">
                      VS
                    </span>

                    <div className="flex flex-col items-center">
                      <TeamBadge teamId="lda" size="md" className="mb-1" />
                      <span className="text-xs font-heading font-bold text-white">
                        {post.matchInfo.awayTeam}
                      </span>
                      <span className="text-xl font-heading font-black text-[#00f0ff]">
                        {post.matchInfo.awayScore}
                      </span>
                    </div>
                  </div>

                  {post.matchInfo.multiplier && (
                    <div className="text-center text-[11px] font-mono text-[#d5c0d7] border-t border-[#3c313e]/40 pt-2">
                      Multiplicador Potencial: <strong className="text-[#ecb1ff]">{post.matchInfo.multiplier}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* TYPE 2: STREAK / EN RACHA (Matching Screenshot 7) */}
              {post.streakInfo && (
                <div className="p-4 rounded-xl bg-gradient-to-b from-[#2a1333] to-[#19101c] border border-[#bf00ff]/50 space-y-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-lg font-heading font-black text-[#bf00ff] italic text-glow-purple uppercase">
                    <Flame className="w-5 h-5 text-[#bf00ff] animate-bounce" />
                    <span>¡EN RACHA!</span>
                  </div>

                  <p className="text-xs text-[#d5c0d7]">
                    {post.streakInfo.title}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-[#ecb1ff]">
                      <span>Progreso de Racha</span>
                      <span>{post.streakInfo.current}/{post.streakInfo.target} para el Estado Leyenda</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#140b16] rounded-full overflow-hidden p-0.5 border border-[#3c313e]">
                      <div
                        className="h-full bg-gradient-to-r from-[#bf00ff] to-[#00f0ff] rounded-full glow-purple-sm transition-all duration-500"
                        style={{ width: `${(post.streakInfo.current / post.streakInfo.target) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* TYPE 3: ACHIEVEMENT SNIPER (Matching Screenshot 7) */}
              {post.achievementInfo && (
                <div className="p-4 rounded-xl bg-[#19101c] border border-[#bf00ff]/40 text-center space-y-2">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#bf00ff] flex items-center justify-center glow-purple text-2xl shadow-lg">
                    <Target className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-[#d5c0d7] uppercase block">
                      {post.achievementInfo.description}
                    </span>
                    <span className="text-xl font-heading font-black text-[#bf00ff] italic text-glow-purple tracking-wider">
                      {post.achievementInfo.title}
                    </span>
                  </div>
                </div>
              )}

              {/* Post Footer (Likes & Comments matching screenshot 7) */}
              <div className="flex items-center gap-5 text-xs font-mono text-[#d5c0d7] pt-2 border-t border-[#3c313e]/40">
                <button
                  onClick={() => toggleLikePost(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    post.isLiked ? 'text-[#bf00ff] font-bold' : 'hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-[#bf00ff] text-[#bf00ff]' : ''}`} />
                  <span>{post.likes}</span>
                </button>

                <div className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.commentsCount}</span>
                </div>

                <div className="ml-auto flex items-center gap-1 text-[11px] text-[#bf00ff] hover:underline cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
