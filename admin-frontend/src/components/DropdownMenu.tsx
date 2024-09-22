import { ReactNode, useEffect, useRef, useState } from "react";

interface DropdownMenuProps {
  label: ReactNode;
  content: ReactNode;
  position?: string;
  closeOnContentClick?: boolean;
  onSubmit?: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  label,
  content,
  position = "right-0",
  closeOnContentClick = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleContentClick = () => {
    if (closeOnContentClick) {
      setIsOpen(false);
    }
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
          onClick={handleContentClick}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
