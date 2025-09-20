import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Maintenance from "./pages/OtherPage/Maintenance";
import FiveZeroZero from "./pages/OtherPage/FiveZeroZero";
import FiveZeroThree from "./pages/OtherPage/FiveZeroThree";
import Invoices from "./pages/Invoices";
import ComingSoon from "./pages/OtherPage/ComingSoon";
import Chats from "./features/chat/pages/Chats";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import TwoStepVerification from "./pages/AuthPages/TwoStepVerification";
import Success from "./pages/OtherPage/Success";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AdminDashboard from "./pages/Demo/AdminDashboard";
import DemoTicketList from "./pages/Demo/DemoTicketList";
import AdminUserUpload from "./pages/Demo/AdminUserUpload";
import PricingTablesTuition from "./pages/Demo/PricingTablesTuition";
import ParentDashboard from "./pages/Demo/ParentDashboard";
import StudentTuition from "./pages/Demo/StudentTuition";
import EnrollmentItemsList from "./pages/Demo/EnrollmentItemsList";
import GradeFeeBundler from "./pages/Demo/GradeFeeBundler";
import StudentBundleAssignment from "./pages/Demo/StudentBundleAssignment";
import FeeBundleList from "./pages/Demo/FeeBundleList";
import TeacherDashboard from "./pages/Demo/TeacherDashboard";
import TeacherTaskboard from "./pages/Demo/TeacherTaskboard";
import TakeAttendance from "./pages/Demo/TakeAttendance";
import RecordGrades from "./pages/Demo/RecordGrades";
import Reservation from "./pages/Demo/Reservation";
import TakeQuiz from "./pages/Demo/TakeQuiz";
import MakeQuiz from "./pages/Demo/MakeQuiz";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<ComingSoon />} />

            {/* ---- Future routes (404 placeholders) ---- */}
            <Route path="/admin" element={<NotFound />} />
            <Route path="/admin/settings" element={<NotFound />} />
            <Route path="/admin/settings/tenant" element={<NotFound />} />
            <Route path="/admin/settings/branding" element={<NotFound />} />
            <Route path="/admin/settings/roles" element={<NotFound />} />
            <Route path="/admin/audit-logs" element={<NotFound />} />
            <Route path="/admin/grade-limits" element={<NotFound />} />
            <Route path="/admin/reservation-windows" element={<NotFound />} />
            <Route path="/admin/pricing-rules" element={<NotFound />} />

            <Route path="/accounting" element={<NotFound />} />
            <Route path="/accounting/enrollment-items" element={<NotFound />} />
            <Route path="/accounting/bundles" element={<NotFound />} />
            <Route path="/accounting/assignment" element={<NotFound />} />
            <Route path="/accounting/reports" element={<NotFound />} />

            <Route path="/finance" element={<NotFound />} />
            <Route path="/finance/dashboard" element={<NotFound />} />
            <Route path="/finance/payments" element={<NotFound />} />
            <Route path="/finance/receipts" element={<NotFound />} />
            <Route path="/finance/verifications" element={<NotFound />} />
            <Route path="/finance/reports" element={<NotFound />} />
            <Route path="/finance/exports" element={<NotFound />} />

            <Route path="/parents" element={<NotFound />} />
            <Route path="/parents/dashboard" element={<NotFound />} />
            <Route path="/parents/reservations" element={<NotFound />} />
            <Route path="/parents/payments" element={<NotFound />} />
            <Route path="/parents/profile" element={<NotFound />} />

            <Route path="/teachers" element={<NotFound />} />
            <Route path="/teachers/dashboard" element={<NotFound />} />
            <Route path="/teachers/taskboard" element={<NotFound />} />
            <Route path="/teachers/attendance" element={<NotFound />} />
            <Route path="/teachers/record-grades" element={<NotFound />} />
            <Route path="/teachers/make-quiz" element={<NotFound />} />
            <Route path="/teachers/quizzes" element={<NotFound />} />

            <Route path="/students" element={<NotFound />} />
            <Route path="/students/dashboard" element={<NotFound />} />
            <Route path="/students/assignments" element={<NotFound />} />
            <Route path="/students/quiz" element={<NotFound />} />
            <Route path="/students/quiz/:quizId" element={<NotFound />} />

            <Route path="/devices/kiosk" element={<NotFound />} />
            <Route path="/devices/reader" element={<NotFound />} />

            <Route path="/reports" element={<NotFound />} />
            <Route path="/reports/enrollment" element={<NotFound />} />
            <Route path="/reports/finance" element={<NotFound />} />

            <Route path="/chat" element={<Chats />} />
            <Route path="/chat/:threadId?" element={<Chats />} />

            <Route path="/demo/dashboard" element={<AdminDashboard />} />
            <Route path="/demo/profile" element={<UserProfiles />} />
            <Route path="/demo/tickets" element={<DemoTicketList />} />
            <Route path="/demo/users" element={<AdminUserUpload />} />
            <Route path="/demo/tuition-pricing" element={<PricingTablesTuition />} />
            <Route path="/demo/dashboard/parents" element={<ParentDashboard />} />
            <Route path="/demo/tuition-quotation" element={<StudentTuition />} />
            <Route path="/demo/accounting/products" element={<EnrollmentItemsList />} />
            <Route path="/demo/accounting/bundler" element={<GradeFeeBundler />} />
            <Route path="/demo/accounting/assignment" element={<StudentBundleAssignment />} />
            <Route path="/demo/accounting/bundles" element={<FeeBundleList />} />
            <Route path="/demo/dashboard/teachers" element={<TeacherDashboard />} />
            <Route path="/demo/teachers/task" element={<TeacherTaskboard />} />
            <Route path="/demo/teachers/attendance" element={<TakeAttendance />} />
            <Route path="/demo/teachers/record" element={<RecordGrades />} />
            <Route path="/demo/teachers/make-quiz" element={<MakeQuiz />} />
            <Route path="/demo/parents/reserve" element={<Reservation />} />
            <Route path="/demo/students/quiz" element={<TakeQuiz />} />
            <Route path="/demo/invoices" element={<Invoices />} />

            
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/two-step-verification"
            element={<TwoStepVerification />}
          />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/success" element={<Success />} />
          <Route path="/five-zero-zero" element={<FiveZeroZero />} />
          <Route path="/five-zero-three" element={<FiveZeroThree />} />
        </Routes>
      </Router>
    </>
  );
}
