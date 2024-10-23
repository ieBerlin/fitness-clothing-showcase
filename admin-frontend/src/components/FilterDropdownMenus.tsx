import { FC, ReactNode } from "react";
import { isArray } from "lodash";

const DropdownFilterGroup: FC<{
  dropDownMenus?: ReactNode[] | ReactNode;
  searchDropDownMenu?: ReactNode;
}> = ({ dropDownMenus, searchDropDownMenu }) => {
  return (
    <div className="w-full space-y-6 mb-2">
      <div className="flex flex-wrap items-center gap-4 w-full p-4 bg-white border border-gray-200">
        {searchDropDownMenu && (
          <div className="flex-1 min-w-[200px]">{searchDropDownMenu}</div>
        )}
        {dropDownMenus && (
          <div className="flex flex-wrap w-full items-center justify-around gap-2">
            {isArray(dropDownMenus) ? (
              dropDownMenus.map((menu, index) => (
                <div key={index} className="w-full sm:w-auto flex-shrink-0">
                  {menu}
                </div>
              ))
            ) : (
              <div className="w-full sm:w-auto flex-shrink-0">
                {dropDownMenus}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownFilterGroup;
