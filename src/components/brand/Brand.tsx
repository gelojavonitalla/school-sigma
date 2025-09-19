import { Link } from "react-router";

type BrandProps = {
  showText?: boolean;         // hide for collapsed sidebar/mobile if you want
  imgSrc?: string;            // override path if needed
  className?: string;
};

export default function Brand({
  showText = true,
  imgSrc = "/images/brand/gcf.jpeg", // put your file here
  className = "",
}: BrandProps) {
  return (
    <Link to="/" className={`flex items-center gap-3 shrink-0 ${className}`}>
      {/* Logomark container: keeps the round seal crisp on dark/light */}
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
        <img
          src={imgSrc}
          alt="GCF South Metro Christian School"
          className="h-7 w-7 object-contain"
          loading="eager"
        />
      </span>

      {showText && (
        <span className="truncate text-[15px] font-semibold tracking-tight text-gray-900 dark:text-white/90">
          GCF South Metro Christian School
        </span>
      )}
    </Link>
  );
}