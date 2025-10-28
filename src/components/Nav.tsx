import { Link } from 'react-router';

export default function Nav() {
  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/posts/database">Database</Link> | <Link to="/posts/docker">Docker</Link> | <Link to="/posts/network">Network</Link> | <Link to="/posts/linux">linux</Link>
    </nav>
  )
}
