// src/layout/AppSidebar.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router"; // keep as-is for your project setup

// Assume these icons are imported from an icon library
import { ChevronDownIcon, HorizontaLDots } from "../icons";
import { Users, Settings, ReceiptText, BookOpen, GraduationCap } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

type Phase = 1 | 2 | 3 | 4;

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  new?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; phase?: Phase }[];
};

const phaseBadgeClasses = (phase: Phase | undefined) => {
  const p = phase ?? 1;
  if (p === 1) {
    // red
    return "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300";
  }
  if (p === 2) {
    // green
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";
  }
  if (p === 4) {
    // blue (phase 4)
    return "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300";
  }
  // yellow (phase 3)
  return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
};

const navItems: NavItem[] = [
  {
    icon: <Settings />,
    name: "Site Admin",
    subItems: [
      { name: "Dashboard", path: "/demo/dashboard", phase: 1 },
      { name: "Users", path: "/demo/users", phase: 1 },
      { name: "Profile", path: "/demo/profile", phase: 1 },
      { name: "Tickets", path: "/demo/tickets", phase: 3 },
    ],
  },
  {
    icon: <ReceiptText />,
    name: "Accounting",
    subItems: [
      { name: "Invoices & Payments", path: "/demo/invoices", phase: 1 },
      { name: "Tuition & Fees", path: "/demo/accounting/products", phase: 2 },
      { name: "Fee Bundle List", path: "/demo/accounting/bundles", phase: 2 },
      { name: "Fee Bundle", path: "/demo/accounting/bundler", phase: 2 },
      { name: "Fee Assignment", path: "/demo/accounting/assignment", phase: 2 },
    ],
  },
  {
    icon: <BookOpen />,
    name: "Teachers",
    subItems: [
      { name: "Dashboard", path: "/demo/dashboard/teachers", phase: 4 },
      { name: "Task Board", path: "/demo/teachers/task", phase: 4 },
      { name: "Attendance", path: "/demo/teachers/attendance", phase: 4 },
      { name: "Record Grades", path: "/demo/teachers/record", phase: 4 },
      { name: "Make Quiz", path: "/demo/teachers/make-quiz", phase: 4 },
      { name: "Chat", path: "/chat", phase: 4 },
    ],
  },
  {
    icon: <Users />,
    name: "Parents",
    subItems: [
      { name: "Parents Dashboard", path: "/demo/dashboard/parents", phase: 1 },
      { name: "Reserve", path: "/demo/parents/reserve", phase: 1 },
      { name: "Tuition", path: "/demo/tuition-pricing", phase: 2 },
      { name: "Tuition Quotation", path: "/demo/tuition-quotation", phase: 2 },
    ],
  },
  {
    icon: <GraduationCap />,
    name: "Students",
    subItems: [
      { name: "Take Quiz", path: "/demo/students/quiz", phase: 4 },
    ],
  },
];

const othersItems: NavItem[] = [];
const supportItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, setIsMobileOpen } = useSidebar();
  const location = useLocation();

  // Auto-close sidebar on mobile after route change
  useEffect(() => {
    if (isMobileOpen) setIsMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  useEffect(() => {
    let submenuMatched = false;
    ["main"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : menuType === "support" ? supportItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main", index });
              submenuMatched = true;
            }
          });
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main") => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index ? null : { type: menuType, index }
    );
  };

  const renderMenuItems = (items: NavItem[], menuType: "main") => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${!isExpanded && !isHovered ? "xl:justify-center" : "xl:justify-start"}`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>

              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}

              {nav.new && (isExpanded || isHovered || isMobileOpen) && (
                <span
                  className={`ml-auto absolute right-10 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "menu-dropdown-badge-active"
                      : "menu-dropdown-badge-inactive"
                  } menu-dropdown-badge`}
                >
                  new
                </span>
              )}

              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link to={nav.path} className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
                <span className={`menu-item-icon-size ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}

          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}

                      {/* Right-side badges (Phase + optional new/pro) */}
                      <span className="flex items-center gap-2 ml-auto">
                        {/* Phase badge placeholder */}
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${phaseBadgeClasses(
                            subItem.phase
                          )}`}
                          title={`Phase ${subItem.phase ?? 1}`}
                        >
                          Phase {subItem.phase ?? 1}
                        </span>

                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path) ? "menu-dropdown-badge-pro-active" : "menu-dropdown-badge-pro-inactive"
                            } menu-dropdown-badge-pro`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed flex flex-col top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        xl:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "xl:justify-center" : "justify-start"}`}>
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img className="dark:hidden" src="/images/brand/school-sigma-light.png" alt="Logo" width={150} height={40} />
              <img className="hidden dark:block" src="/images/brand/school-sigma-dark.png" alt="Logo" width={150} height={40} />
            </>
          ) : (
            <img src="/images/brand/sigma_icon_rounded.png" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "xl:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots className="size-6" />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;