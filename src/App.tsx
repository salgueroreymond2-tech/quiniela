import React, { useState } from 'react';
import { TournamentProvider, useTournament } from './context/TournamentContext';
import { Navbar } from './components/Navbar';
import { BottomNav, NavTab } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { RankingView } from './components/RankingView';
import { PlayoffsView } from './components/PlayoffsView';
import { SocialView } from './components/SocialView';
import { ProfileView } from './components/ProfileView';
import { LoginView } from './components/LoginView';
import { ScorerVoteModal } from './components/ScorerVoteModal';
import { ChampionModal } from './components/ChampionModal';
import { AuthModal } from './components/AuthModal';
import { RulesModal } from './components/RulesModal';
import { AdminMatchModal } from './components/AdminMatchModal';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('login');
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const { setActiveScorerMatchId } = useTournament();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenScorerModal={(id) => setActiveScorerMatchId(id)}
            onOpenAdmin={() => setAdminModalOpen(true)}
          />
        );
      case 'ranking':
        return <RankingView />;
      case 'playoffs':
        return (
          <PlayoffsView
            onOpenScorerModal={(id) => setActiveScorerMatchId(id)}
          />
        );
      case 'social':
        return <SocialView />;
      case 'profile':
        return <ProfileView onOpenLogin={() => setActiveTab('login')} />;
      case 'login':
        return <LoginView onLoginSuccess={() => setActiveTab('dashboard')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#eeddee] flex flex-col selection:bg-[#bf00ff] selection:text-white">
      {/* Top Bar */}
      <Navbar
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto pt-3 px-2 sm:px-4">
        {renderActiveView()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals */}
      <ScorerVoteModal />
      <ChampionModal />
      <AuthModal />
      <RulesModal />
      <AdminMatchModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <TournamentProvider>
      <AppContent />
    </TournamentProvider>
  );
}
