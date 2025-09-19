import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DemoUserInvitesList from "../../components/support/DemoUserInvitesList";
import DemoInviteMetrics from "../../components/support/DemoInviteMetrics";

export default function AdminUserUpload() {
  return (
    <div>
      <PageMeta
        title="User Invite"
        description="This is the User Invite page for School Sigma"
      />
      <PageBreadcrumb pageTitle="User Invite" />
      <DemoInviteMetrics />
      <DemoUserInvitesList />
    </div>
  );
}
