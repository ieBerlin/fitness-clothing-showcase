import { ReactNode, useEffect, useRef, useState } from "react";
interface DropdownMenuProps {
  label: ReactNode;
  content: ReactNode;
  position?: string;
}
const DropdownMenu: React.FC<DropdownMenuProps> = ({
  label,
  content,
  position = "right-0",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        dropdownMenuRef.current?.contains(event.target as Node) ||
        buttonRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      setIsOpen(false);
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        id="menu-button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={toggleMenu}
      >
        {label}
      </button>

      {isOpen && (
        <div
          ref={dropdownMenuRef}
          className={`rounded-lg absolute ${position} z-10 w-56 origin-top-right bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          {" "}
          {content}
        </div>
      )}
    </div>
  );
};
export default DropdownMenu;
