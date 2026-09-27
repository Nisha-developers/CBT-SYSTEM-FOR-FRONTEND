import { Routes, Route, useNavigate} from 'react-router-dom';
import { useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute';

import Homepage from '../pages/Homepage';
import Login from '../pages/Login';
import AdminSignup from '../pages/AdminSignup';

import Step1SchoolInfo from '../pages/SchoolSetup/Step1SchoolInfo';
import Step2Arms from '../pages/SchoolSetup/Step2Arms';
import Step3Classes from '../pages/SchoolSetup/Step3Classes';
import Step4Subjects from '../pages/SchoolSetup/Step4Subjects';

import DashboardLayout from '../components/Layout/DashboardLayout';
import Overview from '../pages/Dashboard/Overview';
import Students from '../pages/Dashboard/Students';
import ObjExam from '../pages/Dashboard/Exams/ObjExam';
import TheoryExam from '../pages/Dashboard/Exams/TheoryExam';
import CreateObjExam from '../pages/Dashboard/Exams/CreateObjExam';
import CreateTheoryExam from '../pages/Dashboard/Exams/CreateTheoryExam';
import QuestionImport from '../pages/Dashboard/Exams/QuestionImport';
import ViewResults from '../pages/Dashboard/Results/ViewResults';
import RecordTheoryMarks from '../pages/Dashboard/Results/RecordTheoryMarks';
import PastResults from '../pages/Dashboard/Results/PastResults';
import SchoolSettings from '../pages/Dashboard/Settings/SchoolSettings';
import ArmSettings from '../pages/Dashboard/Settings/ArmSettings';
import SubjectSettings from '../pages/Dashboard/Settings/SubjectSettings';
import DeleteSchool from '../pages/Dashboard/Settings/DeleteSchool';

import StudentLogin from '../pages/Student/StudentLogin';
import StudentDashboard from '../pages/Student/StudentDashboard';
import AvailableExams from '../pages/Student/AvailableExams';
import ExamInstructions from '../pages/Student/ExamInstructions';
import TakeExam from '../pages/Student/TakeExam';
import MyResults from '../pages/Student/MyResults';

export default function AppRoutes() {
  const question1 = ['name', 'motto', 'address', 'phone'];
  const question2 = ['email', 'HeadLine', 'Description', 'Logo'];

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/school-setup/info" element={<Step1SchoolInfo fields={question1} />} />
      <Route path="/school-setup/info2" element={<Step1SchoolInfo fields={question2} />} />
      <Route path="/school-setup/classes" element={<Step3Classes />} />
      <Route path="/school-setup/arms" element={<Step2Arms />} />
      <Route path="/school-setup/subjects" element={<Step4Subjects />} />
      <Route path="/school-setup/admin-signup" element={<AdminSignup />} />

      {/* Student */}
      <Route path="/student/login" element={<StudentLogin />} />
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/exams"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <AvailableExams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/exams/:id/instructions"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <ExamInstructions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/exams/:id/take"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <TakeExam />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/results"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <MyResults />
          </ProtectedRoute>
        }
      />

      {/* Admin dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin', 'teacher']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="students" element={<Students />} />

        <Route path="exams/obj" element={<ObjExam />} />
        <Route path="exams/obj/create" element={<CreateObjExam />} />
        <Route path="exams/obj/:id/import" element={<QuestionImport />} />
        <Route path="exams/theory" element={<TheoryExam />} />
        <Route path="exams/theory/create" element={<CreateTheoryExam />} />

        <Route path="results" element={<ViewResults />} />
        <Route path="results/theory" element={<RecordTheoryMarks />} />
        <Route path="results/past" element={<PastResults />} />

        <Route path="settings/school" element={<SchoolSettings />} />
        <Route path="settings/arms" element={<ArmSettings />} />
        <Route path="settings/subjects" element={<SubjectSettings />} />
        <Route path="settings/delete" element={<DeleteSchool />} />
      </Route>
    </Routes>
  );
}
