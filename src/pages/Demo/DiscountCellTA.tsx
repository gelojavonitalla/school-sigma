// components/finance/DiscountCellTA.tsx
import { useState } from "react";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";       // ← adjust path if needed
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";
import { Plus, Percent } from "lucide-react";

type DiscountType = "Early Bird" | "Sibling";

export default function DiscountCellTA({
  onAdd,
  disabled,
}: {
  onAdd: (d: DiscountType) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const add = (d: DiscountType) => {
    onAdd(d);
    close();
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        disabled={!!disabled}
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        <Plus className="h-4 w-4" />
        Add
      </button>

      <Dropdown
        isOpen={open}
        onClose={close} // TailAdmin handles click-away & Esc for you
        className="absolute left-0 mt-2 min-w-[220px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg z-50 dark:border-gray-800 dark:bg-gray-900"
      >
        <ul className="flex flex-col">
          <li>
            <DropdownItem
              onItemClick={() => add("Early Bird")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5"
            >
              <Percent className="h-4 w-4" />
              <span>Early Bird</span>
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={() => add("Sibling")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5"
            >
              <Percent className="h-4 w-4" />
              <span>Sibling</span>
            </DropdownItem>
          </li>
        </ul>
      </Dropdown>
    </div>
  );
}