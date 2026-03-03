import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-8 pt-16 md:pt-8 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}