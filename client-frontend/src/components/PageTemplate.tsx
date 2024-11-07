import { FC, ReactNode } from "react";
import { Helmet } from "react-helmet";

const PageTemplate: FC<{ title?: string; children: ReactNode }> = ({
  title,
  children,
}) => {
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
