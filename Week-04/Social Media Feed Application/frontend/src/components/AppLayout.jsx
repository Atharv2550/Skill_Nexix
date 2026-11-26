import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const AppLayout = ({ children, rightPanel = null }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <MobileNav />

      <div className="md:pl-64 lg:pl-72 pb-20 md:pb-10">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className={rightPanel ? 'grid grid-cols-1 gap-6 xl:grid-cols-12' : ''}>
            <main className={rightPanel ? 'xl:col-span-8 space-y-5' : 'mx-auto max-w-2xl space-y-5'}>
              {children}
            </main>
            {rightPanel && (
              <aside className="hidden xl:block xl:col-span-4">{rightPanel}</aside>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;

