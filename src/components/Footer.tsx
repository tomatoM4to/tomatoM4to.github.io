import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className='footer'>
      <div className='footer-content'>
        <div className='footer-links'>
          <a href="https://github.com/tomatoM4to" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://github.com/tomatoM4to/tomatoM4to.github.io" target="_blank" rel="noopener noreferrer">Repo</a>
          <Link to="/license">License</Link>
        </div>
        <p className='footer-copyright'>
          © {new Date().getFullYear()} tomatoM4to. Code is Open Source.
        </p>
      </div>
    </footer>
  )
}