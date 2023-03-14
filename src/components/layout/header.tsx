import { FC, useContext } from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "../../firebase";
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/theme-context';
import '../../style/styles.scss';

const Header: FC = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [user, loading, error] = useAuthState(auth);

  return (
    <Navbar expand="lg" variant={theme} style={{ backgroundColor: "#0D1219" }}>
      <Container>
        <Navbar.Brand><Link to="/" style={{ textDecoration: 'none' }}>BotFaktory</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!user && (
              <Nav.Link href="/signin" style={{ textDecoration: 'none' }}>
                Log in
              </Nav.Link>
            )}
            {user && (
              <Nav.Link onClick={logout} href="/signin" style={{ textDecoration: 'none' }}>
                Sign out
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
