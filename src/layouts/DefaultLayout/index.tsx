// import Footer from '../footer/Footer';
import TopBar from '../../components/layouts/TopBar';
import Sidebar from '../../components/layouts/Sidebar';
import QueueSidebar from '../../components/layouts/QueueSidebar';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

interface DefaultLayoutProps {
    children: React.ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
    return (
        <div className="flex flex-col h-screen bg-black overflow-hidden p-2 gap-2 pb-21">
            {/* Top Bar - Header */}
            <div className="rounded-lg overflow-hidden">
                <ErrorBoundary fallback={null}>   {/* ← TopBar lỗi thì ẩn */}
                    <TopBar />
                </ErrorBoundary>
            </div>

            {/* Main Layout: Sidebar + Content + Queue */}
            <div className="flex flex-1 overflow-hidden gap-2 min-h-0">
                {/* Left Sidebar - Ẩn trên mobile, hiện từ md trở lên */}
                <div className="hidden md:block rounded-lg h-full">
                    <ErrorBoundary fallback={null}> {/* ← Sidebar lỗi thì ẩn */}
                        <Sidebar />
                    </ErrorBoundary>
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-auto rounded-lg h-full no-scrollbar">
                    {children}
                </main>

                {/* Right Queue Sidebar - Ẩn trên mobile và tablet, hiện từ lg trở lên */}
                <div className="hidden lg:block rounded-lg h-full">
                    <ErrorBoundary fallback={null}> {/* ← QueueSidebar lỗi thì ẩn */}
                        <QueueSidebar />
                    </ErrorBoundary>
                </div>
            </div>

            {/* Player Bar đã được move lên App.tsx để global */}
        </div>
    );
};

export default DefaultLayout;