import { Play } from 'lucide-react';

interface PlaylistCardProps {
    title: string;
    description?: string;
    image?: string;
    badge?: string;
    gradient?: string;
}

const PlaylistCard = ({ title, description, image, badge, gradient }: PlaylistCardProps) => {
    return (
        <div className="group bg-gray-800/40 hover:bg-gray-800/60 rounded-lg p-4 transition-all duration-300 cursor-pointer relative hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5">
            {/* Cover Image */}
            <div className="relative mb-4 aspect-square">
                <div
                    className={`w-full h-full rounded-lg ${gradient || 'bg-gradient-to-br from-blue-600 to-red-600'} flex items-center justify-center overflow-hidden`}
                    style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                    {!image && (
                        <span className="text-4xl font-bold text-white">
                            {title.substring(0, 2).toUpperCase()}
                        </span>
                    )}
                </div>

                {/* Play Button */}
                <button className="absolute bottom-2 right-2 w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:scale-110">
                    <Play size={20} fill="black" className="text-black ml-1" />
                </button>

                {/* Badge */}
                {badge && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        {badge}
                    </div>
                )}
            </div>

            {/* Info */}
            <div>
                <h3 className="text-white font-semibold mb-2 truncate">{title}</h3>
                {description && (
                    <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
                )}
            </div>
        </div>
    );
};

export default PlaylistCard;
