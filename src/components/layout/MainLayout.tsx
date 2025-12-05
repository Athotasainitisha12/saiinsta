import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="md:hidden">
        <Header />
      </div>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="pb-16 md:ml-[72px] md:pb-0 xl:ml-[244px]">
        <div className="mx-auto max-w-[630px]">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
};
