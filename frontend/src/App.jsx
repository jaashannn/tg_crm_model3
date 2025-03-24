import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import './styles.css';


import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import AdminSummary from "./components/dashboard/AdminSummary";
import DepartmentList from "./components/department/DepartmentList";
import AddDepartment from "./components/department/AddDepartment";
import EditDepartment from "./components/department/EditDepartment";
import List from "./components/employee/List";
import Add from "./components/employee/Add";
import View from "./components/employee/View";
import Edit from "./components/employee/Edit";

// Lead components
import LeadList from "./components/lead/LeadList";
import ViewLead from "./components/lead/ViewLead";
import AssignLead from "./components/lead/AssignLead";
import AddLead from "./components/lead/AddLead";

// Salary components
import AddSalary from "./components/salary/Add";
import ViewSalary from "./components/salary/View";

// Employee dashboard components
import Summary from "./components/EmployeeDashboard/Summary";
import LeaveList from "./components/leave/List";
import AddLeave from "./components/leave/Add";
import Table from "./components/leave/Table";
import Detail from "./components/leave/Detail";

// Task components
import TaskList from "./components/Task/TaskList";
import ViewTask from "./components/Task/ViewTask";
import AssignTask from "./components/Task/AssignTask";

// Deal components
import ListDeal from "./components/deal/ListDeal";
import ViewDeal from "./components/deal/ViewDeal";

// Report and meeting components
import Reports from "./components/report/Report";
import Meetings from "./components/meeting/Meeting";

// Settings and other components
import Setting from "./components/setting/Setting";
import Demos from "./components/demo/Demo";
import Clients from "./components/client/Client";
import NotFound from "./pages/NotFound";

// Employee-specific components
import EmployeeLeadList from "./components/lead/employee/EmployeeLeadList";
import EmployeeViewLead from "./components/lead/employee/EmployeeViewLead";
import EmployeeTaskList from "./components/Task/employee/EmployeeTaskList";
import EmployeeViewTask from "./components/Task/employee/EmployeeViewTask";
import EmployeeMeeting from "./components/meeting/employee/EmployeeMeeting";
import Profile from "./components/profile/Profile";
import EmployeeSetting from "./components/setting/EmployeeSetting";
import Account from "./components/account/Account";
import AccountView from "./components/account/AccountView";
import Dartboard from "./components/dartboard/Dartboard";
import BulkAssign from "./components/lead/BulkAssign";
import NodemailerForm from "./components/mail/Nodemail";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to admin dashboard */}
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />

        {/* Public route for login */}
        <Route path="/login" element={<Login />} />

        {/* Admin dashboard routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          {/* Dashboard Summary */}
          <Route index element={<AdminSummary />} />

          {/* Leads */}
          <Route path="leads" element={<LeadList />} />
          <Route path="leads/:id" element={<ViewLead />} />
          <Route path="leads/assign/:id" element={<AssignLead />} />
          <Route path="leads/add" element={<AddLead />} />
          <Route path="leads/bulk-assign" element={<BulkAssign />} />

          {/* Deals */}
          <Route path="deals" element={<ListDeal />} />
          <Route path="deals/:id" element={<ViewDeal />} />

          {/* Reports */}
          <Route path="reports" element={<Reports />} />

          {/* Settings */}
          <Route path="setting" element={<Setting />} />

          {/* Demos and Clients */}
          <Route path="demos" element={<Demos />} />
          <Route path="clients" element={<Clients />} />

          {/* dartboard */}

          <Route path="dartboard" element={<Dartboard />} />


          {/* accounts */}

          <Route path="accounts" element={<Account />} />
          <Route path="account/:id" element={<AccountView />} />


            {/* email */}
          <Route path="sendemails" element={<NodemailerForm />} />
          {/* Tasks */}
          <Route path="tasks" element={<TaskList />} />
          <Route path="tasks/:id" element={<ViewTask />} />
          <Route path="add-task" element={<AssignTask />} />
        

          {/* Meetings */}
          <Route path="meetings" element={<Meetings />} />

          {/* Departments */}
          <Route path="departments" element={<DepartmentList />} />
          <Route path="add-department" element={<AddDepartment />} />
          <Route path="department/:id" element={<EditDepartment />} />

          {/* Employees */}
          <Route path="employees" element={<List />} />
          <Route path="add-employee" element={<Add />} />
          <Route path="employees/:id" element={<View />} />
          <Route path="employees/edit/:id" element={<Edit />} />
          <Route path="employees/salary/:id" element={<ViewSalary />} />

          {/* Salary */}
          <Route path="salary/add" element={<AddSalary />} />

          {/* Leaves */}
          <Route path="leaves" element={<Table />} />
          <Route path="leaves/:id" element={<Detail />} />
          <Route path="employees/leaves/:id" element={<LeaveList />} />
        </Route>

        {/* Employee dashboard routes */}
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin", "employee"]}>
                <EmployeeDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          {/* Employee Dashboard Summary */}
          <Route index element={<Summary />} />

          {/* Profile */}
          <Route path="profile" element={<Profile />} />

          {/* Tasks */}
          <Route path="tasks" element={<EmployeeTaskList />} />
          <Route path="tasks/:id" element={<EmployeeViewTask />} />

          {/* Leads */}
          <Route path="leads" element={<EmployeeLeadList />} />
          <Route path="leads/:id" element={<EmployeeViewLead />} />
          <Route path="leads/add" element={<AddLead />} />

          {/* Leaves */}
          <Route path="leaves/:id" element={<LeaveList />} />
          <Route path="add-leave" element={<AddLeave />} />

          {/* Salary */}
          <Route path="salary/:id" element={<ViewSalary />} />

          {/* Meetings */}
          <Route path="meetings" element={<EmployeeMeeting />} />

          {/* Settings */}
          <Route path="settings" element={<EmployeeSetting />} />
        </Route>

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
