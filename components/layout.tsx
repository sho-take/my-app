import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";  // ← 直接インポート

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 pt-24 lg:ml-64">{children}</main>
      </div>
    </div>
  );
}
