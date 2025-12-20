// import Footer from '../footer/Footer';
import TopBar from '../../components/homepage/TopBar';
import Sidebar from '../../components/homepage/Sidebar';
import QueueSidebar from '../../components/homepage/QueueSidebar';
import Player from '../../components/homepage/Player';

interface DefaultLayoutProps {
    children: React.ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
    return (
        <div className="flex flex-col h-screen bg-black overflow-hidden p-2 gap-2">
            {/* Top Bar - Header */}
            <div className="rounded-lg overflow-hidden">
                <TopBar />
            </div>

            {/* Main Layout: Sidebar + Content + Queue */}
            <div className="flex flex-1 overflow-hidden gap-2 min-h-0">
                {/* Left Sidebar */}
                <div className="rounded-lg h-full">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-auto rounded-lg h-full no-scrollbar">
                    {children}
                </main>

                {/* Right Queue Sidebar */}
                <div className="rounded-lg h-full">
                    <QueueSidebar />
                </div>
            </div>

            {/* Player Bar */}
            <div className="rounded-lg overflow-hidden flex-shrink-0">
                <Player />
            </div>
        </div>
    );
};

export default DefaultLayout;