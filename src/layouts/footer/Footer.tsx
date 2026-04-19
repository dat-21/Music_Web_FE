import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * @deprecated Legacy light-theme footer from pre-FloatingLayout architecture.
 * Kept temporarily for rollback/reference only.
 * Do not attach to new routes.
 * Replacement: FloatingLayout section footers or page-scoped footer blocks.
 */
const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white mt-12 py-8">
            <div className="max-w-[1400px] mx-auto px-8">
                <div className="grid grid-cols-4 gap-8 mb-6">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Về thư viện</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>
                                <Link to="/about" className="hover:text-white cursor-pointer transition-colors inline-block">
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link to="/rules" className="hover:text-white cursor-pointer transition-colors inline-block">
                                    Quy chế hoạt động
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-white cursor-pointer transition-colors inline-block">
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Dịch vụ</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>
                                <Link to="/books" className="hover:text-white cursor-pointer transition-colors inline-block">
                                    Mượn sách
                                </Link>
                            </li>
                            <li>
                                <Link to="/books" className="hover:text-white cursor-pointer transition-colors inline-block">
                                    Đọc sách điện tử
                                </Link>
                            </li>
                            <li>
                                <Link to="/my-reservations" className="hover:text-white cursor-pointer transition-colors inline-block">
                                    Đặt mượn trước
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Hỗ trợ</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>
                                <Link to="/guide" className="hover:text-white cursor-pointer transition-colors inline-block">
                                    Hướng dẫn sử dụng
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="hover:text-white cursor-pointer transition-colors inline-block">
                                    Câu hỏi thường gặp
                                </Link>
                            </li>
                            <li>
                                <Link to="/policy" className="hover:text-white cursor-pointer transition-colors inline-block">
                                    Chính sách
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-center gap-2"><MapPin size={16} /> 123 Đường ABC, TP.HCM</li>
                            <li className="flex items-center gap-2"><Phone size={16} /> (028) 1234 5678</li>
                            <li className="flex items-center gap-2"><Mail size={16} /> library@example.com</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
                    <p>© 2025 Library Management System. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;