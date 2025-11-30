import { Bell, Menu, Search, ShoppingCart, User, LogOut, Package, Bookmark } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { FiBookOpen } from 'react-icons/fi';
import { APP_NAME } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement>(null);

    // Đóng menu khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu]);

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
            logout();
            setShowUserMenu(false);
            navigate('/login');
        }
    };

    const handleUserClick = () => {
        if (isAuthenticated) {
            setShowUserMenu(!showUserMenu);
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="bg-primary text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-8">
                <div
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/')}
                >
                    <FiBookOpen size={30} />
                    <h1 className="text-4xl font-bold">{APP_NAME}</h1>
                </div>

                <button
                    className="bg-transparent border-none text-white flex items-center gap-2 cursor-pointer text-base hover:opacity-80 transition-opacity"
                >
                    <Menu size={20} />
                    <span>Thể Loại</span>
                </button>
            </div>

            <div className="w-[400px] relative">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light"
                    size={20}
                />
                <input
                    type="text"
                    placeholder="Tìm Sách"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 pl-10 rounded-md border-none outline-none text-sm text-text"
                />
            </div>

            <div className="flex gap-8 items-center ">
                {[
                    { Icon: Bell, label: 'Thông Báo', onClick: () => console.log('Thông báo') },
                    { Icon: ShoppingCart, label: 'Danh Sách Mượn', onClick: () => navigate('/my-borrows') },
                ].map(({ Icon, label, onClick }) => (
                    <button
                        key={label}
                        onClick={onClick}
                        className="bg-transparent border-none text-white cursor-pointer flex flex-col items-center gap-1 hover:scale-105 transition-transform"
                    >
                        <Icon size={24} />
                        <span className="text-sm">{label}</span>
                    </button>
                ))}

                {/* User Account Button with Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={handleUserClick}
                        className="bg-transparent border-none text-white cursor-pointer flex flex-col items-center gap-1 hover:scale-105 transition-transform"
                    >
                        <User size={24} />
                        <span className="text-sm max-w-[100px] truncate">
                            {isAuthenticated && user ? user.fullName : 'Tài Khoản'}
                        </span>
                    </button>

                    {/* Dropdown Menu khi đã đăng nhập */}
                    {isAuthenticated && (
                        <div
                            className={`absolute right-0 top-full mt-2 bg-white text-text rounded-lg shadow-xl min-w-[220px] z-50 overflow-hidden transition-all duration-300 ease-in-out origin-top-right ${showUserMenu
                                ? 'opacity-100 scale-100 translate-y-0'
                                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                }`}
                        >
                            <div className="p-3 border-b border-border bg-secondary">
                                <p className="font-medium text-base truncate text-black">{user?.fullName}</p>
                                <p className="text-sm text-text-light truncate text-black">{user?.email}</p>
                                <p className="text-xs text-text-light mt-1">
                                    <span className="inline-block px-4 py-0.5 bg-primary text-white rounded-full capitalize">
                                        {user?.role}
                                    </span>
                                </p>
                            </div>

                            <div>
                                <button
                                    onClick={() => {
                                        navigate('/profile');
                                        setShowUserMenu(false);
                                    }}
                                    className="font-medium w-full text-left px-4 py-2 hover:bg-blue-100 text-black cursor-pointer transition-colors flex items-center gap-2"
                                >
                                    <User size={18} />
                                    <span>Thông tin cá nhân</span>
                                </button>

                                <button
                                    onClick={() => {
                                        navigate('/history');
                                        setShowUserMenu(false);
                                    }}
                                    className="font-medium w-full text-left px-4 py-2 hover:bg-blue-100 text-black cursor-pointer transition-colors flex items-center gap-2"
                                >
                                    <Package size={18} />
                                    <span>Lịch Sử Mượn </span>
                                </button>

                                <button
                                    onClick={() => {
                                        navigate('/my-reservations');
                                        setShowUserMenu(false);
                                    }}
                                    className="font-medium w-full text-left px-4 py-2 hover:bg-blue-100 text-black cursor-pointer transition-colors flex items-center gap-2"
                                >
                                    <Bookmark size={18} />  {/* hoặc CalendarClock, ClipboardList, Clock */}
                                    <span>Đặt mượn trước</span>
                                </button>

                                <div className="border-t border-border my-2"></div>

                                <button
                                    onClick={handleLogout}
                                    className="cursor-pointer w-full text-left px-4 py-3 hover:bg-red-50 transition-colors flex items-center gap-3 text-red-500 font-medium"
                                >
                                    <LogOut size={18} />
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;