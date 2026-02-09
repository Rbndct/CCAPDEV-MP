import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
        </Routes>
        <ThemeToggle />
      </div>
    </BrowserRouter>
  );
}

export default App;
