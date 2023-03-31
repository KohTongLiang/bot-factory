import { useContext } from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { auth, logout } from "../../firebase";
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/theme-context';
import { AuthContext } from '../../context/AuthContext';
import '../../style/styles.scss';

function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { user, loading } = useContext(AuthContext);

  return (
    <Navbar expand="lg" variant={theme} style={{ backgroundColor: "#0D1219" }}>
      <Container>
        <Navbar.Brand><Link to="/" style={{ textDecoration: 'none', color: 'white' }}>BotFaktory</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!loading && (
              <>
                <Link to="/about" className='nav-link' style={{ textDecoration: 'none' }}>
                  About
                </Link>
                <Link to="/documentation" className='nav-link' style={{ textDecoration: 'none' }}>
                  Documentation
                </Link>
                {!user && (
                  <>
                    <Link to="/signin" className='nav-link' style={{ textDecoration: 'none' }}>
                      Log in
                    </Link>
                  </>
                )}
                {user && (
                  <>
                    <Link to="/inventory" className='nav-link' style={{ textDecoration: 'none' }}>
                      Inventory
                    </Link>
                    <Link to="/build" className='nav-link' style={{ textDecoration: 'none' }}>
                      Build
                    </Link>
                    <Link to="/feedback" className='nav-link' style={{ textDecoration: 'none' }}>
                      Feedback
                    </Link>
                    <Nav.Link onClick={logout} href="/signin" style={{ textDecoration: 'none' }}>
                      Sign out
                    </Nav.Link>
                  </>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
