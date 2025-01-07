import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js';
import employeeRouter from './routes/employee.js';
import salaryRouter from './routes/salary.js';
import leaveRouter from './routes/leave.js';
import settingRouter from './routes/setting.js';
import dashboardRouter from './routes/dashboard.js';
import leadRouter from './routes/lead.js'; // Import the lead routes
import connectToDatabase from './db/db.js';
import taskRouter from './routes/task.js'
import meetingRouter from './routes/meeting.js'
import noteRouter from './routes/note.js'
import callLogRouter from './routes/callLog.js'

connectToDatabase();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public/uploads'));

// Route prefixes
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/setting', settingRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/lead', leadRouter); 
app.use('/api/task', taskRouter); 
app.use('/api/meeting', meetingRouter); 
app.use('/api/note', noteRouter); 
app.use("/api/calllog", callLogRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server is Running on port ${process.env.PORT}`);
});
