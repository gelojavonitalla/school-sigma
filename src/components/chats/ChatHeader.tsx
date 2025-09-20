import ChatHeaderTitle from "./ChatHeaderTitle";

interface ChatHeaderProps {
  onToggle: () => void;
  activeThreadId?: string | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onToggle, activeThreadId }) => {
  return (
    <div className="sticky px-4 pt-4 pb-4 sm:px-5 sm:pt-5 xl:pb-0">
      {/* ⬇️ pass the id to show correct avatar/name */}
      <ChatHeaderTitle activeThreadId={activeThreadId} />

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full text-gray-700 border border-gray-300 rounded-lg h-11 max-w-11 dark:border-gray-700 dark:text-gray-400 xl:hidden"
        >
          {/* ... (unchanged icon) */}
          <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" /* ... */>
            <path /* ... */ />
          </svg>
        </button>

        <div className="relative w-full my-2">
          <form>
            <button className="absolute -translate-y-1/2 left-4 top-1/2">
              {/* ... (unchanged search icon) */}
              <svg className="fill-gray-500 dark:fill-gray-400" width="20" height="20" /* ... */>
                <path /* ... */ />
              </svg>
            </button>
            <input
              type="text"
              placeholder={activeThreadId ? "Search in this conversation…" : "Search..."}
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[42px] pr-3.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;