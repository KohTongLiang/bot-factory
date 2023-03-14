import { FC } from 'react';
import '../../style/styles.scss';
import { BsLinkedin, BsGithub } from 'react-icons/bs';

const Footer: FC = () => {
  return (
    <footer className="footer" style={{ backgroundColor: "#0D1219" }}>
      <div className="footer-content" style={{ color: "white" }}>
        &copy; {new Date().getFullYear()} - 
        <span> Development </span>
      </div>
    </footer>
  );
};

export default Footer;
