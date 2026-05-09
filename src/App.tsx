import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import Landing from './pages/Landing';
import { DashboardLayout } from './components/layout/DashboardLayout';
import Overview from './pages/Overview.tsx';
import RiskEngine from './pages/RiskEngine.tsx';
import Exposure from './pages/Exposure';
import Protocols from './pages/Protocols';
import Activity from './pages/Activity';

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<DashboardLayout />}>
            <Route path="/overview" element={<Overview />} />
            <Route path="/risk-engine" element={<RiskEngine />} />
            <Route path="/exposure" element={<Exposure />} />
            <Route path="/protocols" element={<Protocols />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
