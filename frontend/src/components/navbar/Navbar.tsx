import Link from "next/link";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Legal framework", href: "#legal" },
  { label: "About us", href: "#about" },
  { label: "Contact us", href: "#contact" },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link href="/" className="navbar__brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
          Monitor Capital Markets
        </Link>

        <nav className="navbar__nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="navbar__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="#login" className="navbar__login">
          Log in to your account
        </Link>
      </div>
    </header>
  );
}
