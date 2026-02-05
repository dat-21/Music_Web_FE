// import Footer from '../footer/Footer';
import TopBar from '../../components/layouts/TopBar';
import Sidebar from '../../components/layouts/Sidebar';
import QueueSidebar from '../../components/layouts/QueueSidebar';
// import Player from '../../components/layouts/Player'; // Đã move lên App.tsx

interface DefaultLayoutProps {
    children: React.ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
    return (
        <div className="flex flex-col h-screen bg-black overflow-hidden p-2 gap-2 pb-21">
            {/* Top Bar - Header */}
            <div className="rounded-lg overflow-hidden">
                <TopBar />
            </div>

            {/* Main Layout: Sidebar + Content + Queue */}
            <div className="flex flex-1 overflow-hidden gap-2 min-h-0">
                {/* Left Sidebar - Ẩn trên mobile, hiện từ md trở lên */}
                <div className="hidden md:block rounded-lg h-full">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-auto rounded-lg h-full no-scrollbar">
                    {children}
                </main>

                {/* Right Queue Sidebar - Ẩn trên mobile và tablet, hiện từ lg trở lên */}
                <div className="hidden lg:block rounded-lg h-full">
                    <QueueSidebar />
                </div>
            </div>

            {/* Player Bar đã được move lên App.tsx để global */}
        </div>
    );
};

export default DefaultLayout;