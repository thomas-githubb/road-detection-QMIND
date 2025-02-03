// layout.tsx
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="fixed top-0 w-full bg-background border-b border-border z-50">
          <nav className="flex items-center justify-between p-4">
            <div className="text-xl font-bold text-primary">PaveAI</div>
            <div className="flex space-x-6">
              <a href="/" className="hover:text-primary transition">
                Home
              </a>
              <a href="/about" className="hover:text-primary transition">
                About
              </a>
<<<<<<< HEAD
              <a href="/get-started" className="hover:text-primary transition">
                Get Started
=======
              <a href="/dashboard" className="hover:text-primary transition">
                Dashboard
              </a>
              <a href="/auth" className="hover:text-primary transition">
                Log In
>>>>>>> 0fcc3e25d6c749ff37e39b73da8073ba853e98ad
              </a>
            </div>
          </nav>
        </header>
        <main className="mt-16">{children}</main>
        <footer className="bg-secondary text-secondary-foreground py-6 text-center">
          <p>&copy; 2025 RoadAI. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
