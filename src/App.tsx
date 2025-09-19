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
import Chats from "./pages/Chat/Chats";
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
            <Route path="/demo/chat" element={<Chats />} />
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
