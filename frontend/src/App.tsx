import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CostAnalysis from './pages/CostAnalysis';
import RIOptimization from './pages/RIOptimization';
import TagGovernance from './pages/TagGovernance';
import Anomalies from './pages/Anomalies';
import Automation from './pages/Automation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cost-analysis" element={<CostAnalysis />} />
        <Route path="/ri-optimization" element={<RIOptimization />} />
        <Route path="/tag-governance" element={<TagGovernance />} />
        <Route path="/anomalies" element={<Anomalies />} />
        <Route path="/automation" element={<Automation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
