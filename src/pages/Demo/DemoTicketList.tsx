import SupportMetrics from "../../components/support/SupportMetrics";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DemoSupportList from "../../components/support/DemoSupportList";

export default function DemoTicketList() {
  return (
    <div>
      <PageMeta
        title="Support Ticket"
        description="This is the Support Ticket page for School Sigma"
      />
      <PageBreadcrumb pageTitle="Support Ticket" />
      <SupportMetrics />
      <DemoSupportList />
    </div>
  );
}
