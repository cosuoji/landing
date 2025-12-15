import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import './App.css';
import LandingPage from './components/Homepage.jsx';
import Footer from './components/Footer.jsx';


const slides = [
  {
    caption: 'Mountain Pack',
    link: '/packs/mountain',
    center: 'https://picsum.photos/800/600?seed=mcenter',
    description: 'Explore the rugged mountain landscapes, perfect for adventure lovers.',
    features: ['High-resolution textures', 'Customizable layers', 'Optimized for web & mobile'],
    extraImage: 'https://picsum.photos/400/300?seed=extra1'
  },
  {
    caption: 'City Pack',
    link: '/packs/city',
    center: 'https://picsum.photos/800/600?seed=ccenter',
    description: 'Modern urban cityscapes with vibrant colors.',
    features: ['Night & day scenes', 'Editable files', 'Vector ready'],
    extraImage: 'https://picsum.photos/400/300?seed=extra2'
  },
  {
    caption: 'Ocean Pack',
    link: '/packs/ocean',
    center: 'https://picsum.photos/800/600?seed=ocenter',
    description: 'Peaceful ocean views for calm and creativity.',
    features: ['Waves & horizon', 'High-quality textures', 'Customizable layers'],
    extraImage: 'https://picsum.photos/400/300?seed=extra3'
  },
];



function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <main className="grow">
          <Routes>
            <Route path="/" element={<LandingPage slides={slides} />} />
            <Route path="/packs/:pack" element={<LandingPage slides={slides} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
