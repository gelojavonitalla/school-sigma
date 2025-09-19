import GridShape from "../../components/common/GridShape";
import CountdownTimer from "../../components/common/CountdownTimer";
import PageMeta from "../../components/common/PageMeta";
import SafeLink from "../../components/links/SafeLink";

function nextDec15(): Date {
  const now = new Date();
  const target = new Date(now.getFullYear(), 11, 15, 9, 0, 0); // Dec=11, 9:00 AM
  if (target.getTime() <= now.getTime()) {
    target.setFullYear(target.getFullYear() + 1);
  }
  return target;
}

export default function ComingSoon() {
  const targetDate = nextDec15();

  return (
    <>
      <PageMeta
        title="School Sigma — Phase 1 Coming Soon"
        description="This demo uses mock data. Phase badges indicate rollout timing; role access will be enforced in production."
      />

      <div className="relative z-1 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-6">
        <GridShape />

        <div>
          <div className="mx-auto w-full max-w-[520px] text-center">
            {/* Brand */}
            <SafeLink to="/" className="mb-6 inline-block">
              {/* Use your existing brand assets */}
              <img
                className="dark:hidden"
                src="/images/brand/school-sigma-light.png"
                alt="School Sigma"
                width={180}
                height={48}
              />
              <img
                className="hidden dark:block"
                src="/images/brand/school-sigma-dark.png"
                alt="School Sigma"
                width={180}
                height={48}
              />
            </SafeLink>

            <h1 className="mb-2 text-title-md font-bold text-gray-800 dark:text-white/90 xl:text-title-xl">
              Phase 1 Launch — Coming Soon
            </h1>

            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              This is a <strong>demo environment</strong> — data isn’t saved and features are mock-ups.
              In production, the sidebar items will be visible based on your <strong>role</strong>
              (Parent, Teacher, Admin). Phase badges indicate rollout timing.
            </p>

            {/* Phase & date line */}
            <p className="mb-8 text-sm text-gray-600 dark:text-gray-300">
              <span className="rounded-md bg-rose-100 px-2 py-0.5 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                Phase 1
              </span>{" "}
               target: <strong>December 15, 2026</strong>
            </p>

            {/* ===== Countdown Timer ===== */}
            <CountdownTimer targetDate={targetDate} />
            {/* ===== /Countdown Timer ===== */}

            {/* Email capture (placeholder only) */}
            <p className="mb-5 mt-8 text-sm text-gray-700 dark:text-gray-400">
              Want updates? (Demo only — not saved)
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thanks! In production this would subscribe you for updates.");
              }}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <div className="w-full sm:w-[320px]">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email address"
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:shadow-focus-ring focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-400 dark:focus:border-brand-300"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-3 text-sm font-medium text-white hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600 sm:w-auto"
                >
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.7497 2.29248C10.7497 1.87827 10.4139 1.54248 9.99967 1.54248C9.58546 1.54248 9.24967 1.87827 9.24967 2.29248V2.83613C6.0823 3.20733 3.62467 5.9004 3.62467 9.16748V14.4591H3.33301C2.91879 14.4591 2.58301 14.7949 2.58301 15.2091C2.58301 15.6234 2.91879 15.9591 3.33301 15.9591H4.37467H15.6247H16.6663C17.0806 15.9591 17.4163 15.6234 17.4163 15.2091C17.4163 14.7949 17.0806 14.4591 16.6663 14.4591H16.3747V9.16748C16.3747 5.9004 13.9171 3.20733 10.7497 2.83613V2.29248ZM14.8747 14.4591V9.16748C14.8747 6.47509 12.6921 4.29248 9.99967 4.29248C7.30729 4.29248 5.12467 6.47509 5.12467 9.16748V14.4591H14.8747ZM7.99967 17.7085C7.99967 18.1228 8.33546 18.4585 8.74967 18.4585H11.2497C11.6639 18.4585 11.9997 18.1228 11.9997 17.7085C11.9997 17.2943 11.6639 16.9585 11.2497 16.9585H8.74967C8.33546 16.9585 7.99967 17.2943 7.99967 17.7085Z"
                    />
                  </svg>
                  Notify Me
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}