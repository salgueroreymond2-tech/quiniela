import React, { useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import confetti from 'canvas-confetti';
import { Trophy, Share2, X, Sparkles } from 'lucide-react';

export const ChampionModal: React.FC = () => {
  const { showChampionModal, setShowChampionModal, currentUser } = useTournament();

  useEffect(() => {
    if (showChampionModal) {
      // Fire celebratory confetti bursts
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        colors: ['#bf00ff', '#00f0ff', '#ffffff', '#ffd700', '#ecb1ff'],
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [showChampionModal]);

  if (!showChampionModal) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '¡Campeón de la Quiniela Liga Promérica!',
        text: `¡Gané el 1er lugar en la Quiniela Apertura 2026/27 con ${currentUser.points.toLocaleString()} PTS! 🏆⚽`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`¡Gané el 1er lugar en la Quiniela Apertura 2026/27 con ${currentUser.points.toLocaleString()} PTS! 🏆⚽ ${window.location.href}`);
      alert('¡Enlace de victoria copiado al portapapeles!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#19101c] border-2 border-[#bf00ff] p-6 text-center space-y-5 glow-purple shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setShowChampionModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#261c28] text-[#d5c0d7] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Glowing Trophy Icon */}
        <div className="flex justify-center pt-2">
          <div className="w-16 h-16 rounded-2xl bg-[#bf00ff]/20 border border-[#bf00ff] flex items-center justify-center glow-purple">
            <Trophy className="w-10 h-10 text-[#bf00ff] animate-pulse" />
          </div>
        </div>

        {/* Headline matching Screenshot 11 */}
        <div>
          <h2 className="text-2xl font-serif font-black text-white uppercase tracking-tight leading-tight">
            ¡CAMPEÓN DE LA QUINIELA!
          </h2>
        </div>

        {/* Champion Avatar Card */}
        <div className="flex justify-center">
          <div className="relative w-44 h-44 rounded-2xl p-1 bg-gradient-to-tr from-[#00f0ff] via-[#bf00ff] to-[#ecb1ff] glow-purple shadow-xl">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover rounded-[14px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-[14px] flex items-end justify-center pb-2">
              <span className="font-heading font-black text-sm text-white drop-shadow">
                {currentUser.name}
              </span>
            </div>
          </div>
        </div>

        {/* Points Box in Electric Cyan (Matching Screenshot 11) */}
        <div className="py-2.5 px-6 rounded-xl bg-[#140b16] border border-[#00f0ff]/50 inline-block shadow-inner">
          <span className="font-heading font-black text-3xl text-[#00f0ff] text-glow-cyan block leading-none">
            {currentUser.points.toLocaleString()}
          </span>
          <span className="font-heading font-bold text-sm text-[#00f0ff] tracking-widest uppercase">
            PTS
          </span>
        </div>

        {/* Share Button (Matching Screenshot 11) */}
        <button
          onClick={handleShare}
          className="w-full py-4 px-6 rounded-2xl bg-[#bf00ff] hover:bg-[#d033ff] text-black font-heading font-extrabold text-lg uppercase tracking-wider flex items-center justify-center gap-3 glow-purple shadow-xl transition-all duration-200 active:scale-[0.98]"
        >
          <span>Compartir Victoria</span>
          <Share2 className="w-5 h-5 text-black stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
