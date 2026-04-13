import { FaFire, FaMoon, FaBolt, FaGuitar, FaGlassCheers } from 'react-icons/fa';

export const MOCK_MOODS = [
  { id: '1', name: 'Chill Space', color: 'from-blue-400 to-indigo-600', icon: FaMoon },
  { id: '2', name: 'Hyper Focus', color: 'from-emerald-400 to-teal-600', icon: FaBolt },
  { id: '3', name: 'Night Drive', color: 'from-cyan-400 to-blue-600', icon: FaFire },
  { id: '4', name: 'Pure Energy', color: 'from-orange-500 to-red-600', icon: FaFire },
  { id: '5', name: 'Soul Acoustic', color: 'from-yellow-400 to-amber-600', icon: FaGuitar },
  { id: '6', name: 'Euphoria', color: 'from-pink-500 to-fuchsia-600', icon: FaGlassCheers },
];

export const MOCK_SONGS = [
  { 
    id: '1', 
    title: 'Midnight City', 
    artist: 'M83', 
    duration: 243, 
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80' 
  },
  { 
    id: '2', 
    title: 'Starboy', 
    artist: 'The Weeknd', 
    duration: 230, 
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f458?auto=format&fit=crop&w=300&q=80' 
  },
  {
    id: '3',
    title: 'Lofi Study',
    artist: 'Chillhop Music',
    duration: 180,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80'
  }
];
