import ChatBoxHeader from "./ChatBoxHeader";
import ChatBoxSendForm from "./ChatBoxSendForm";

interface ChatItem {
  id: number;
  name: string;
  role: string;
  profileImage: string;
  status: "online" | "offline";
  lastActive: string;
  message: string;
  isSender: boolean;
  imagePreview?: string;
}

const chatList: ChatItem[] = [
  {
    id: 1,
    name: "Ma. Teresa Reyes",
    role: "Magulang ni River (G5 – Galatians)",
    profileImage: "../../images/user/user-18.jpg",
    status: "online",
    lastActive: "15 mins",
    message:
      "Pwede po ba akong makipag-usap bukas 2:00–5:00 PM tungkol sa progress ni River?",
    isSender: false,
  },
  {
    id: 2,
    name: "Sir Jose Santos",
    role: "Punong-guro (Principal)",
    profileImage: "../../images/user/user-17.jpg",
    status: "online",
    lastActive: "30 mins",
    message:
      "Pa-update po ng advisory attendance ngayong araw. Salamat.",
    isSender: false,
  },
  {
    id: 3,
    name: "You",
    role: "",
    profileImage: "",
    status: "online",
    lastActive: "2 hours ago",
    message:
      "Sige po, noted. Available ako bukas ng 3:30 PM para sa meeting.",
    isSender: true,
  },
  {
    id: 4,
    name: "Sir Jose Santos",
    role: "Punong-guro (Principal)",
    profileImage: "../../images/user/user-17.jpg",
    status: "online",
    lastActive: "2 hours ago",
    message:
      "Pakisend na rin ang listahan ng late submissions ng G5 – Galatians.",
    isSender: false,
  },
  {
    id: 5,
    name: "You",
    role: "",
    profileImage: "",
    status: "online",
    lastActive: "2 hours ago",
    message:
      "On it po. Iu-upload ko sa system bago mag-4 PM.",
    isSender: true,
  },
  {
    id: 6,
    name: "Ma. Teresa Reyes",
    role: "Magulang ni River (G5 – Galatians)",
    profileImage: "../../images/user/user-18.jpg",
    status: "online",
    lastActive: "2 hours ago",
    message:
      "Teacher, pakitingnan po ang consent form para sa field trip.",
    isSender: false,
    imagePreview: "../../images/chat/chat.jpg",
  },
];

export default function ChatBox() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:w-3/4">
      {/* <!-- ====== Chat Box Start --> */}
      <ChatBoxHeader />
      <div className="flex-1 max-h-full p-5 space-y-6 overflow-auto custom-scrollbar xl:space-y-8 xl:p-6">
        {chatList.map((chat) => (
          <div
            key={chat.id}
            className={`flex ${
              chat.isSender ? "justify-end" : "items-start gap-4"
            }`}
          >
            {!chat.isSender && (
              <div className="w-10 h-10 overflow-hidden rounded-full">
                <img
                  src={chat.profileImage}
                  alt={`${chat.name} profile`}
                  className="object-cover object-center w-full h-full"
                />
              </div>
            )}

            <div className={`${chat.isSender ? "text-right" : ""}`}>
              {chat.imagePreview && (
                <div className="mb-2 w-full max-w-[270px] overflow-hidden rounded-lg">
                  <img
                    src={chat.imagePreview}
                    alt="chat"
                    className="object-cover"
                  />
                </div>
              )}

              <div
                className={`px-3 py-2 rounded-lg ${
                  chat.isSender
                    ? "bg-brand-500 text-white dark:bg-brand-500"
                    : "bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-white/90"
                } ${chat.isSender ? "rounded-tr-sm" : "rounded-tl-sm"}`}
              >
                <p className="text-sm ">{chat.message}</p>
              </div>
              <p className="mt-2 text-gray-500 text-theme-xs dark:text-gray-400">
                {chat.isSender
                  ? chat.lastActive
                  : `${chat.name}, ${chat.lastActive}`}
              </p>
            </div>
          </div>
        ))}
      </div>
      <ChatBoxSendForm />
      {/* <!-- ====== Chat Box End --> */}
    </div>
  );
}