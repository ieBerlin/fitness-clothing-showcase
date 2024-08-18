import { SVGProps } from "react";
import { NavLink } from "react-router-dom";

const SidebarItem: React.FC<{
    label: string,
    path: string,
    Icon: React.FC<SVGProps<SVGSVGElement>>
}> = ({ label, path, Icon }) => {
    return (
        <li className="mb-2">
            <NavLink
                to={path}
                className={({ isActive }) =>
                    isActive
                        ? "flex items-center gap-2 text-white font-semibold"
                        : "flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                }
            >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{label.charAt(0).toUpperCase() + label.slice(1)}</span>
            </NavLink>
        </li>
    );
}


export default SidebarItem