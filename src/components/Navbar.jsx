export default function Navbar({ onNavigate, openSection }) {
  const links = [
    { key: null, label: 'Home' },
    { key: 'experience', label: 'Experience' },
    { key: 'education', label: 'Education' },
    { key: 'skills', label: 'Skills' },
    { key: 'contact', label: 'Contact' },
  ]

  return (
    <nav className="cyber-nav">
      <div className="cyber-nav-left">
        <span className="cyber-logo">NK</span>
      </div>
      <div className="cyber-nav-center">
        {links.map((l) => (
          <button
            key={l.label}
            className={`cyber-nav-link${openSection === l.key ? ' active' : ''}`}
            onClick={() => onNavigate(l.key)}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="cyber-nav-right">
        <a className="cyber-btn-outline" href="mailto:nirvikkc@gmail.com" rel="noopener noreferrer">HIRE_ME</a>
      </div>
    </nav>
  )
}
