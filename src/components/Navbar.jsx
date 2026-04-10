export default function Navbar({ onNavigate, openSection }) {
  const links = [
    { key: null, label: 'Home', mobileLabel: null },
    { key: 'experience', label: 'Experience', mobileLabel: 'Exp' },
    { key: 'education', label: 'Education', mobileLabel: 'Edu' },
    { key: 'skills', label: 'Skills', mobileLabel: 'Skills' },
    { key: 'contact', label: 'Contact', mobileLabel: null },
  ]

  return (
    <nav className="cyber-nav">
      <div className="cyber-nav-left">
        <span className="cyber-logo" onClick={() => onNavigate(null)}>NK</span>
      </div>
      <div className="cyber-nav-center">
        {links.map((l) => (
          <button
            key={l.label}
            className={`cyber-nav-link${openSection === l.key ? ' active' : ''}${l.mobileLabel === null ? ' hide-mobile' : ''}`}
            onClick={() => onNavigate(l.key)}
          >
            <span className="nav-full">{l.label}</span>
            {l.mobileLabel && <span className="nav-short">{l.mobileLabel}</span>}
          </button>
        ))}
      </div>
      <div className="cyber-nav-right">
        <a className="cyber-btn-outline" href="mailto:nirvikkc@gmail.com" rel="noopener noreferrer">HIRE_ME</a>
      </div>
    </nav>
  )
}
