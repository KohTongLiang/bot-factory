import { FC, ReactNode, useState } from 'react';
import Header from './header';
import Footer from './footer';
import { Col } from 'react-bootstrap';
import '../../style/layout.scss';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  // Detecting the default theme
  const isBrowserDefaulDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

  const getDefaultTheme = (): string => {
    const localStorageTheme = localStorage.getItem('default-theme');
    const browserDefault = isBrowserDefaulDark() ? 'dark' : 'light';
    return localStorageTheme || browserDefault;
  };

  const [theme, setTheme] = useState(getDefaultTheme());
  return (
    <div className="layout-wrapper">
      <div className="main-wrapper">
        <Header />
        <div className="content-wrapper">
          <Col>
            {children}
          </Col>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
