import { Link } from 'react-router-dom';
import config from '../../config';

/**
 * @deprecated Legacy light-theme header from pre-FloatingLayout architecture.
 * Kept temporarily for rollback/reference only.
 * Do not attach to new routes.
 * Replacement: FloatingLayout with DynamicIsland and player surfaces.
 */
const Header = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to={config.routes.home} className="text-2xl font-bold text-indigo-600">
                        MusicWeb
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link
                            to={config.routes.home}
                            className="text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                            Trang chủ
                        </Link>
                        <Link
                            to="/explore"
                            className="text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                            Khám phá
                        </Link>
                        <Link
                            to="/library"
                            className="text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                            Thư viện
                        </Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to={config.routes.login}
                            className="text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            to={config.routes.register}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Đăng ký
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
