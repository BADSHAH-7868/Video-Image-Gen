import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import ImageGenerator from './pages/ImageGenerator';
import VideoGenerator from './pages/VideoGenerator';

type Page = 'landing' | 'image' | 'video';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'image':
        return <ImageGenerator onBack={() => setCurrentPage('landing')} />;
      case 'video':
        return <VideoGenerator onBack={() => setCurrentPage('landing')} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return <>{renderPage()}</>;
}

export default App;
