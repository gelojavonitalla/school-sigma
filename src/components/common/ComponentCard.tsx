import { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  title?: ReactNode;
  desc?: ReactNode;
  action?: ReactNode; // <-- header-right actions
  children?: ReactNode;
  className?: string;
};

export default function ComponentCard({
  title,
  desc,
  action,
  children,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]",
        className,
      )}
    >
      {(title || desc || action) && (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                {title}
              </h3>
            )}
            {desc && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
            )}
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {children}
    </div>
  );
}