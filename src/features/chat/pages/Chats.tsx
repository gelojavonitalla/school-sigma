import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ChatSidebar from "../widgets/ChatSidebar";
import ChatBox from "../widgets/ChatBox";
import PageMeta from "../../../components/common/PageMeta";
import { useParams } from "react-router";

export default function Chats() {
  // Accept optional /chat/:threadId param
  const { threadId } = useParams<{ threadId?: string }>();

  return (
    <>
      <PageMeta
        title="School Sigma - Chat Page"
        description="This is the Chat page for School Sigma"
      />
      <PageBreadcrumb pageTitle="Chats" />
      <div className="h-[calc(100vh-150px)] overflow-hidden sm:h-[calc(100vh-174px)]">
        <div className="flex flex-col h-full gap-6 xl:flex-row xl:gap-5">
          {/* Sidebar gets active thread id for highlighting */}
          <ChatSidebar activeThreadId={threadId ?? null} />

          {/* Chat box loads the thread */}
          <ChatBox />
        </div>
      </div>
    </>
  );
}
