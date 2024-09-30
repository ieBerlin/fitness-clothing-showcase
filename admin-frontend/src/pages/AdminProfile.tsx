import { useState } from "react";
import PageTemplate from "../components/PageTemplate";
import DataTable from "../components/DataTable";
import Admin from "../models/Admin";
import { fetchAdmins } from "../utils/authUtils";
import { ExtendedFilterParams, SERVER_URL } from "../utils/http";
import UsableTable from "../components/UsableTable";
import DropdownFilterGroup from "../components/FilterDropdownMenus";
import SearchBar from "../components/SearchBar";
import defaultUserPicture from "/default-profile.jpg";
import { Link } from "react-router-dom";

const adminListQueryKey = ["admins"];

const defaultFilterParams: ExtendedFilterParams<unknown> = {
  currentPage: 1,
  searchTerm: "",
  itemLimit: 10,
};

function AdminProfile() {
  const [params, setParams] =
    useState<ExtendedFilterParams<typeof defaultFilterParams>>(
      defaultFilterParams
    );

  const handleUpdateParams = (newParams: typeof params) => {
    setParams((prevParams) => ({ ...prevParams, ...newParams }));
  };

  return (
    <PageTemplate title="Manage Admins">
      <div className="mb-6 flex space-x-4">
        <DataTable<Admin, unknown>
          key="manage-admins-data-table"
          updateParams={handleUpdateParams}
          fetchDataParams={params}
          initialParams={params}
          queryKey={adminListQueryKey}
          fetchItems={fetchAdmins}
          renderTableContent={({ updateFilterParams, dataEntries }) => ({
            ContentRenderer: ({ loading }) => (
              <UsableTable<Admin>
                isLoading={loading}
                data={dataEntries}
                renderContent={({ item: admin, index }) => (
                  <tr key={admin._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      <Link to={admin._id}>
                        <img
                          className="rounded-full w-8 h-8"
                          src={
                            admin.adminImage
                              ? `${SERVER_URL}/public/uploads/admin/${admin.adminImage}`
                              : defaultUserPicture
                          }
                        />
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      <Link to={admin._id}>{admin._id}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      <Link to={admin._id}>{admin.adminEmail}</Link>
                    </td>
                  </tr>
                )}
                tableHeadItems={["count", "pfp", "id", "email"]}
              />
            ),
            dropDownMenus: (
              <DropdownFilterGroup
                searchDropDownMenu={
                  <SearchBar
                    onChange={(e) =>
                      updateFilterParams("searchTerm", e.target.value)
                    }
                  />
                }
              />
            ),
          })}
        />
      </div>
    </PageTemplate>
  );
}

export default AdminProfile;
