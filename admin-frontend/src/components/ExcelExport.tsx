/* eslint-disable @typescript-eslint/no-explicit-any */
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import React, { FC, ReactElement } from "react";

interface ExcelExportProps {
  children: ReactElement<{ onClick: () => void }>;
  data: any[];
  fileName: string;
}

const ExcelExport: FC<ExcelExportProps> = ({ children, data, fileName }) => {
  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return React.cloneElement(children, { onClick: exportToExcel });
};

export default ExcelExport;
