import Link from "next/link";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Explore", href: "#explore" },
  { label: "Community", href: "#community" },
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link href="/" className="navbar__brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
          DevFrame
        </Link>

        <nav className="navbar__nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="navbar__link">
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="navbar__actions">
          <Link href="#login" className="navbar__login">
            Log in
          </Link>
          <Link href="#start" className="navbar__btn">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
