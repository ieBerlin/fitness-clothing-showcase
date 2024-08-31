export interface DropdownItemProps {
  label: string;
  href: string;
}
const DropdownItem: React.FC<DropdownItemProps> = ({ label, href }) => {
  return (
    <a
      href={href}
      className="block px-4 py-2 text-sm text-gray-700 font-medium hover:text-white hover:bg-indigo-500 rounded-md"
    >
      {label}
    </a>
  );
};
export default DropdownItem;
