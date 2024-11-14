import { FC, ReactNode, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

const PageTemplate: FC<{ title?: string; children: ReactNode }> = ({
  title,
  children,
}) => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const formattedTitle = title
    ? title
        .replace(/[-,_]/g, " ")
        .replace(/\b\w/g, (match) => match.toUpperCase())
    : "Quasars Official Store | Gym Clothes & Workout Wear";

  return (
    <>
      <Helmet>
        <title>{formattedTitle}</title>
      </Helmet>
      {children}
    </>
  );
};
export default PageTemplate;
