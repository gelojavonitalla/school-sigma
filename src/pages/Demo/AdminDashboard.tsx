import { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import {
  UserPlus,
  ShieldAlert,
  AlertCircle,
  LifeBuoy,
  BellDot,
} from "lucide-react";
import ChartTab from "./../../components/common/ChartTab";

/* --- Small badge with dark-mode aware colors --- */
function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "success" | "error";
}) {
  const cls =
    color === "success"
      ? "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400"
      : "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400";
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

export default function AdminDashboard() {
  /* Detect dark mode to sync ApexCharts colors */
  const [isDark, setIsDark] = useState<boolean>(
    typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    // Watch for theme toggle (Tailwind toggles the 'dark' class on <html>)
    const html = document.documentElement;
    const obs = new MutationObserver(() =>
      setIsDark(html.classList.contains("dark")),
    );
    obs.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const [stats] = useState({
    pendingInvites: 21,
    failedLogins24h: 9,
    missingParentProfiles: 12,
    openTickets: 4,
    unreadAnnouncements: 410,
  });

  /* Icons get explicit light/dark colors for contrast */
  const statCards = [
    {
      label: "Pending Invites",
      value: stats.pendingInvites,
      icon: <UserPlus className="h-6 w-6 text-gray-600 dark:text-gray-300" />,
      change: "↓ 2%",
      color: "error",
    },
    {
      label: "Failed Logins (24h)",
      value: stats.failedLogins24h,
      icon: <ShieldAlert className="h-6 w-6 text-red-500 dark:text-red-400" />,
      change: "↑ 4%",
      color: "error",
    },
    {
      label: "Missing Parent Profiles",
      value: stats.missingParentProfiles,
      icon: <AlertCircle className="h-6 w-6 text-gray-600 dark:text-gray-300" />,
      change: "↓ 5%",
      color: "error",
    },
    {
      label: "Open Support Tickets",
      value: stats.openTickets,
      icon: <LifeBuoy className="h-6 w-6 text-gray-600 dark:text-gray-300" />,
      change: "↑ 3%",
      color: "error",
    },
    {
      label: "Unread Announcements",
      value: stats.unreadAnnouncements,
      icon: <BellDot className="h-6 w-6 text-gray-600 dark:text-gray-300" />,
      change: "↑ 7%",
      color: "error",
    },
  ];

  const series = useMemo(
    () => [
      { name: "Teachers", data: [22, 31, 45, 32, 40, 55, 42, 48] },
      { name: "Parents", data: [35, 41, 36, 52, 38, 45, 51, 60] },
      { name: "Students", data: [50, 60, 55, 72, 66, 75, 80, 89] },
      { name: "Admin", data: [12, 15, 11, 14, 13, 17, 16, 19] },
    ],
    [],
  );

  const axisMuted = isDark ? "#9CA3AF" : "#6B7280"; // gray-400 vs gray-500
  const fore = isDark ? "#E5E7EB" : "#374151"; // gray-200 vs gray-700
  const gridColor = isDark ? "#1F2937" : "#E5E7EB"; // gray-800 vs gray-200

  const options: ApexOptions = {
    colors: ["#2a31d8", "#465fff", "#7592ff", "#c2d6ff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      stacked: true,
      height: 315,
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: fore,
      background: "transparent",
    },
    theme: { mode: isDark ? "dark" : "light" },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 10,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: Array(8).fill(axisMuted) } },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontSize: "14px",
      fontWeight: 400,
      markers: { size: 5, shape: "circle", strokeWidth: 0 },
      itemMargin: { horizontal: 10 },
      labels: { colors: axisMuted },
    },
    yaxis: {
      labels: { style: { colors: [axisMuted] } },
    },
    grid: {
      borderColor: gridColor,
      yaxis: { lines: { show: true } },
    },
    fill: { opacity: 1 },
    tooltip: {
      theme: isDark ? "dark" : "light",
      x: { show: false },
      y: { formatter: (val: number) => val.toString() },
    },
  };

  const emailOptions: ApexOptions = {
    legend: { show: false },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
      foreColor: fore,
      background: "transparent",
    },
    theme: { mode: isDark ? "dark" : "light" },
    stroke: { curve: "straight", width: [2, 2] },
    fill: { type: "gradient", gradient: { opacityFrom: 0.55, opacityTo: 0 } },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      borderColor: gridColor,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: { enabled: true, theme: isDark ? "dark" : "light" },
    xaxis: {
      type: "category",
      categories: [
        "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: Array(12).fill(axisMuted) } },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: { style: { fontSize: "12px", colors: [axisMuted] } },
      title: { text: "" },
    },
  };

  const emailSeries = useMemo(
    () => [
      { name: "Email", data: [20, 30, 45, 40, 60, 50, 75, 90, 100, 110, 130, 150] },
      { name: "SMS", data: [10, 20, 25, 30, 40, 35, 45, 60, 70, 85, 90, 100] },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                {card.icon}
              </div>
              <Badge color={card.color as "success" | "error"}>{card.change}</Badge>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">{card.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white/90">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] xl:col-span-6">
          <div className="mb-6 flex justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Monthly Logins by Role
            </h3>
          </div>
          <div className="custom-scrollbar overflow-x-auto pl-2">
            <Chart
              className="-ml-5 min-w-[700px] xl:min-w-full"
              options={options}
              series={series}
              type="bar"
              height={315}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 xl:col-span-6">
          <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
            <div className="w-full">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Communications This Year
              </h3>
              <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
                Emails and SMS sent each month
              </p>
            </div>
            <div className="flex w-full items-start gap-3 sm:justify-end">
              <ChartTab />
            </div>
          </div>
          <div className="custom-scrollbar max-w-full overflow-x-auto">
            <div className="min-w-[1000px] xl:min-w-full">
              <Chart options={emailOptions} series={emailSeries} type="area" height={310} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}