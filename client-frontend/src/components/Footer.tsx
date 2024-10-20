import React, { forwardRef, useContext, useEffect, useRef } from "react";
import { NavbarHeightContext } from "../store/navbarStore";

const Footer = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  function Footer(_, ref) {
    const { onUpdateHeight } = useContext(NavbarHeightContext);
    const footerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (footerRef.current) {
        onUpdateHeight({
          footerHeight: footerRef.current.offsetHeight,
        });
      }
    }, [onUpdateHeight]);

    return (
      <footer className="bg-black text-white py-8" ref={footerRef}>
        <div className="container mx-auto text-center" ref={ref}>
          <h2 className="text-3xl font-bold mb-2 text-shadow">Quasars</h2>
          <p className="text-sm mb-4 italic">Elevate your fitness journey with us.</p>
          <p className="text-lg mb-4">&copy; {new Date().getFullYear()} Quasars. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-lg hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-lg hover:underline">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-lg hover:underline">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    );
  }
);

export default Footer;
