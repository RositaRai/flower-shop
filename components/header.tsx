import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="logo">🌸 Žiedai</Link>

      <nav>
        <Link href="/">Pradžia</Link>
        <Link href="/#bouquets">Puokštės</Link>
        <Link href="/reports">Pardavimų ataskaitos</Link>
      </nav>

      <Link href="/bouquets/new" className="add-button">
        + Nauja puokštė
      </Link>
    </header>
  );
}