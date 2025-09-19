import React, { useState, useMemo, ChangeEvent } from "react";
import TableDropdown from "../common/TableDropdown";
import { Upload } from "lucide-react";

interface Invite {
  id: string;
  name: string;
  email: string;
  role: string;
  date: string;
  status: "Accepted" | "Pending";
  statusClass: string;
}

const UserInvitesList: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<"All" | "Accepted" | "Pending">("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const invites: Invite[] = [
    {
      id: "#001",
      name: "Lindsey Curtis",
      email: "lindsey@email.com",
      role: "Parent",
      date: "12 Feb, 2027",
      status: "Accepted",
      statusClass:
        "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500",
    },
    {
      id: "#002",
      name: "Kaiya George",
      email: "kaiya@email.com",
      role: "Teacher",
      date: "13 Mar, 2027",
      status: "Pending",
      statusClass:
        "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500",
    },
    {
      id: "#003",
      name: "Zain Geidt",
      email: "zain@email.com",
      role: "Parent",
      date: "19 Mar, 2027",
      status: "Pending",
      statusClass:
        "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500",
    },
    {
      id: "#004",
      name: "Abram Schleifer",
      email: "abram@email.com",
      role: "Teacher",
      date: "25 Apr, 2027",
      status: "Accepted",
      statusClass:
        "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500",
    },
    {
      id: "#005",
      name: "Mia Chen",
      email: "mia@email.com",
      role: "Parent",
      date: "28 Apr, 2027",
      status: "Pending",
      statusClass:
        "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500",
    },
  ];

  const filteredInvites = useMemo(() => {
    return invites.filter((invite) => {
      const matchStatus =
        statusFilter === "All" || invite.status === statusFilter;
      const matchSearch =
        invite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invite.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [invites, statusFilter, searchQuery]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
      <div className="flex flex-wrap justify-between gap-4 border-b border-gray-200 p-5 dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            User Invites
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Recent parent/teacher invites sent
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-4 py-2.5 rounded-lg text-sm">
            + Add User
          </button>
          <button className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-lg text-sm">
            <Upload className="w-4 h-4" />
            Bulk User Upload
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-3 px-5 py-4">
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
          {(["All", "Accepted", "Pending"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${statusFilter === status
                  ? "bg-white shadow-theme-xs text-gray-900 dark:bg-gray-800 dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
          placeholder="Search..."
          className="h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 shadow-theme-xs"
        />
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Name / Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredInvites.map((invite) => (
              <tr key={invite.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {invite.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {invite.email}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-400">
                  {invite.role}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-400">
                  {invite.date}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`${invite.statusClass} text-xs font-medium rounded-full px-2 py-0.5`}
                  >
                    {invite.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <TableDropdown
                    dropdownButton={<button className="text-gray-500">...</button>}
                    dropdownContent={
                      <>
                        <button className="text-xs w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-white/5">View</button>
                        <button className="text-xs w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-white/5">Delete</button>
                      </>
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserInvitesList;