import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
    const [view, setView] = useState<'landing' | 'dashboard'>('landing');

    const navigateToDashboard = () => setView('dashboard');
    const navigateToHome = () => setView('landing');

    switch (view) {
        case 'dashboard':
            return <Dashboard onNavigateHome={navigateToHome} />;
        case 'landing':
        default:
            return <LandingPage onGetStarted={navigateToDashboard} />;
    }
};

export default App;
