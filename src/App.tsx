import React, { useEffect, useState } from 'react';
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
import { AdminView } from './components/AdminView';
import { getTeamById } from './data/teams';

const AppContent: React.FC = () => {
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const { setActiveScorerMatchId, currentUser, isLoggedIn } = useTournament();
  const [previewTeamId, setPreviewTeamId] = useState(currentUser.favoriteTeamId);
  const themeTeamId = isLoggedIn ? currentUser.favoriteTeamId : previewTeamId;
  const favoriteTeam = getTeamById(themeTeamId);
  const loginThemeTeam = themeTeamId === 'csh' ? getTeamById('esc') : favoriteTeam;
  const usesTeamTheme = themeTeamId !== 'sap';
  const usesLoginTeamTheme = !isLoggedIn;
  const isAdmin = isLoggedIn && (
    currentUser.role === 'admin' ||
    currentUser.isAdmin === true
  );
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    if (!isLoggedIn) return 'login';
    return isAdmin ? 'admin' : 'dashboard';
  });

  useEffect(() => {
    if (isAdmin && activeTab !== 'admin') setActiveTab('admin');
    if (!isAdmin && activeTab === 'admin') setActiveTab(isLoggedIn ? 'dashboard' : 'login');
  }, [activeTab, isAdmin, isLoggedIn]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        if (isAdmin) return <AdminView />;
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
      case 'admin':
        return <AdminView />;
      case 'login':
        return (
          <LoginView
            onLoginSuccess={() => setActiveTab(isAdmin ? 'admin' : 'dashboard')}
            onFavoriteTeamPreview={setPreviewTeamId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      data-team-theme={usesTeamTheme ? themeTeamId : undefined}
      data-login-theme={usesLoginTeamTheme ? themeTeamId : undefined}
      className="min-h-screen bg-[#050505] text-[#eeddee] flex flex-col selection:bg-[#bf00ff] selection:text-white"
      style={usesTeamTheme || usesLoginTeamTheme ? {
        '--theme-primary': (usesLoginTeamTheme ? loginThemeTeam : favoriteTeam)?.primaryColor || '#bf00ff',
        '--theme-secondary': (usesLoginTeamTheme ? loginThemeTeam : favoriteTeam)?.accentColor || '#00f0ff',
      } as React.CSSProperties : undefined}
    >
      {/* Top Bar */}
      <Navbar
        onOpenAdmin={() => setAdminModalOpen(true)}
        onNavigateToLogin={() => setActiveTab('login')}
        onNavigateToProfile={() => setActiveTab('profile')}
        onNavigateToAdmin={() => setActiveTab('admin')}
        showUserProfile={activeTab !== 'login'}
        showSimulator={isLoggedIn && !isAdmin && activeTab !== 'login'}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto pt-3 px-2 sm:px-4">
        {renderActiveView()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} />

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
