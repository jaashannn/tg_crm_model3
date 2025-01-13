import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

//for leads
import LeadList from "./components/lead/LeadList";

//for salary 
import AddSalary from "./components/salary/Add";
import ViewSalary from "./components/salary/View";
import Summary from './components/EmployeeDashboard/Summary'
import LeaveList from './components/leave/List'
import AddLeave from './components/leave/Add'
// import Setting from "./components/EmployeeDashboard/Setting";
import Table from "./components/leave/Table";
import Detail from "./components/leave/Detail";
import ViewLead from "./components/lead/ViewLead";
import AssignLead from "./components/lead/AssignLead";
import TaskList from "./components/Task/TaskList";

//for Deal 
import ListDeal from "./components/deal/ListDeal"

//For report
import Reports from "./components/report/Report";
import Meetings from "./components/meeting/Meeting";

import Setting from "./components/setting/Setting";

import Demos from "./components/demo/Demo";
import Clients from "./components/client/Client";

//Not found page 
import NotFound from "./pages/NotFound";
// import MeetingsList from "./components/meeting/MeetingList";

// *********employee import started***********
// leads part
import EmployeeLeadList from './components/lead/employee/EmployeeLeadList';
import EmployeeViewLead from './components/lead/employee/EmployeeViewLead';

//meeting part 



// Task part 
import EmployeeTaskList from './components/Task/employee/EmployeeTaskList'
import Profile from "./components/profile/Profile";
import ViewTask from "./components/Task/ViewTask";

import EmployeeViewTask from "./components/Task/employee/EmployeeViewTask";

import EmployeeMeeting from "./components/meeting/employee/EmployeeMeeting"
import AssignTask from "./components/Task/AssignTask";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />}></Route>
        <Route path="/login" element={<Login />}></Route>
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
          <Route index element={<AdminSummary />}></Route>

          {/* Route for leads */}
          <Route
            path="/admin-dashboard/leads"
            element={<LeadList />}
          ></Route>

          <Route
            path="/admin-dashboard/leads/:id"
            element={<ViewLead />}
          ></Route>
          <Route
            path="/admin-dashboard/leads/assign/:id"
            element={<AssignLead />}
          ></Route>

          {/* Route for deals */}

          <Route
            path="/admin-dashboard/deals"
            element={<ListDeal />}
          ></Route>


          {/* route for report */}


          <Route
            path="/admin-dashboard/reports"
            element={<Reports />}
          ></Route>
          {/* route for setting  */}

          <Route
            path="/admin-dashboard/setting"
            element={<Setting />}
          ></Route>

          {/* route for demo */}

          <Route
            path="/admin-dashboard/demos"
            element={<Demos />}
          ></Route>

          {/*route for Client */}

          <Route
            path="/admin-dashboard/clients"
            element={<Clients />}
          ></Route>

          {/*route for task */}

          <Route
            path="/admin-dashboard/tasks"
            element={<TaskList />}
          ></Route>

            
          <Route
            path="/admin-dashboard/tasks/:id"
            element={<ViewTask />}
          ></Route>

          <Route
            path="/admin-dashboard/add-task"
            element={<AssignTask />}
          ></Route>
  



          {/* route for meeting */}

          <Route
            path="/admin-dashboard/meetings"
            element={<Meetings />}
          ></Route>

          {/* Route for Deparment */}
          <Route
            path="/admin-dashboard/departments"
            element={<DepartmentList />}
          ></Route>
          <Route
            path="/admin-dashboard/add-department"
            element={<AddDepartment />}
          ></Route>
          <Route
            path="/admin-dashboard/department/:id"
            element={<EditDepartment />}
          ></Route>

          {/* Route for employee */}

          <Route path="/admin-dashboard/employees" element={<List />}></Route>


          <Route path="/admin-dashboard/add-employee" element={<Add />}></Route>
          <Route
            path="/admin-dashboard/employees/:id"
            element={<View />}
          ></Route>
          <Route
            path="/admin-dashboard/employees/edit/:id"
            element={<Edit />}
          ></Route>

          <Route
            path="/admin-dashboard/employees/salary/:id"
            element={<ViewSalary />}
          ></Route>

          {/* Route for salary  */}

          <Route
            path="/admin-dashboard/salary/add"
            element={<AddSalary />}
          ></Route>

          {/* Route for leaves */}
          <Route path="/admin-dashboard/leaves" element={<Table />}></Route>
          <Route path="/admin-dashboard/leaves/:id" element={<Detail />}></Route>
          <Route path="/admin-dashboard/employees/leaves/:id" element={<LeaveList />}></Route>

          <Route path="/admin-dashboard/setting" element={<Setting />}></Route>
        </Route>

        {/* Route for employee */}
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
          <Route index element={<Summary />}></Route>

          <Route path="/employee-dashboard/profile" element={<Profile />}></Route>
          <Route path="/employee-dashboard/tasks" element={<EmployeeTaskList />}></Route>
          <Route path="/employee-dashboard/leaves/:id" element={<LeaveList />}></Route>
          <Route path="/employee-dashboard/add-leave" element={<AddLeave />}></Route>
          <Route path="/employee-dashboard/salary/:id" element={<ViewSalary />}></Route>
          <Route path="/employee-dashboard/setting" element={<Setting />}></Route>

          {/* Route for leads */}
          <Route
            path="/employee-dashboard/leads"
            element={<EmployeeLeadList />}
          ></Route>

          <Route
            path="/employee-dashboard/leads/:id"
            element={<EmployeeViewLead />}
          ></Route>


          {/* route for meeting */}

          <Route
            path="/employee-dashboard/meetings"
            element={<EmployeeMeeting />}
          ></Route>


          {/*route for task */}

          <Route
            path="/employee-dashboard/tasks/:id"
            element={<EmployeeViewTask />}
          ></Route>


        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
