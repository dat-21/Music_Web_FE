import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Shuffle,
    Repeat,
    Volume2,
    Maximize2,
    Heart,
    ListMusic
} from 'lucide-react';
import { useState } from 'react';

const Player = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [volume, setVolume] = useState(80);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [progress, setProgress] = useState(42);

    return (
        <div className="bg-black border-t px-4 py-3 flex items-center justify-between">
            {/* Current Track Info */}
            <div className="flex items-center gap-4 w-1/4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded shrink-0"></div>
                <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">Shouldn't Be</p>
                    <p className="text-gray-400 text-xs truncate">Luke Chiang</p>
                </div>
                <button className="text-green-500 hover:text-green-400 transition-colors ml-2">
                    <Heart size={18} />
                </button>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center w-2/4 max-w-2xl">
                {/* Control Buttons */}
                <div className="flex items-center gap-4 mb-2">
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <Shuffle size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <SkipBack size={20} fill="currentColor" />
                    </button>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        {isPlaying ? (
                            <Pause size={20} fill="black" className="text-black" />
                        ) : (
                            <Play size={20} fill="black" className="text-black ml-0.5" />
                        )}
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <SkipForward size={20} fill="currentColor" />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <Repeat size={18} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-2 w-full">
                    <span className="text-gray-400 text-xs">2:06</span>
                    <div className="flex-1 h-1 bg-gray-600 rounded-full group cursor-pointer">
                        <div
                            className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>
                    <span className="text-gray-400 text-xs">3:30</span>
                </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3 w-1/4 justify-end">
                <button className="text-gray-400 hover:text-white transition-colors">
                    <ListMusic size={20} />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <Volume2 size={20} />
                </button>
                <div className="w-24 h-1 bg-gray-600 rounded-full group cursor-pointer">
                    <div
                        className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
                        style={{ width: `${volume}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <Maximize2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default Player;
