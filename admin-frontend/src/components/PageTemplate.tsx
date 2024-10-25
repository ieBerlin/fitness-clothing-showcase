import { FC, ReactNode } from "react";
import { Helmet } from "react-helmet";
interface PageTemplateProps {
  title?: string;
  children: ReactNode;
}
const PageTemplate: FC<PageTemplateProps> = ({ title, children }) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        {/* <meta name="description" content="This is a description of my page" /> */}
      </Helmet>
      <div className="h-full flex-grow flex flex-col px-6 md:px-10 py-4 md:py-6">
        {title && (
          <h1 className="text-gray-800 font-semibold text-xl md:text-2xl lg:text-3xl mb-3 ml-3">
            {title}
          </h1>
        )}

        {children}
      </div>
    </>
  );
};
export default PageTemplate;
