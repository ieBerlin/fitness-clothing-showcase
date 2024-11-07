import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";

const CategorySection: FC<{
  categoryTitle: string;
  filterControls?: ReactNode;
  children: ReactNode;
  link?: {
    label: string;
    href: string;
  };
}> = ({ categoryTitle, filterControls, link, children }) => {
  return (
    <section className="py-12 px-2 md:px-4 lg:px-8 bg-white border-t border-gray-300">
      <div className="mb-6 flex w-full flex-row items-end justify-start gap-4">
        <h2 className="text-2xl font-bold tracking-widest uppercase text-black text-left">
          {categoryTitle}
        </h2>
        {link && (
          <Link
            to={link.href}
            className="text-black font-semibold tracking-wider underline underline-offset-2 hover:no-underline transition duration-300 ease-in-out"
          >
            {link.label}
          </Link>
        )}
      </div>

      {filterControls}
      {children}
    </section>
  );
};

export default CategorySection;
