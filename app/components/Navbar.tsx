
const NavBarLineItems = () => (
  ['new', 'past', 'ask', 'show'].map(link => (
      <li key={link}>
        <a href={link}>{link}</a>
      </li>
    ))
)

export default function Navbar() {
    return (
        <main className="container mx-auto px-2">
            <div className="navbar">
            <div className="navbar-start">
                <a href='/' className="btn btn-ghost text-xl">Hacked News</a>
            </div>

            <div className="navbar-end">
                {/* standard navbar menu */}
                <ul className="menu hidden sm:menu-horizontal bg-base-100">
                <NavBarLineItems />
                </ul>

                {/* mobile navbar menu */}
                <details className="dropdown dropdown-end sm:hidden">
                <summary className="btn btn-ghost rounded-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                    </svg>
                </summary>
                <ul className="dropdown-content menu bg-base-100 rounded-box shadow">
                    <NavBarLineItems />
                </ul>
                </details>

            </div>
            </div>
        </main>
    );
}