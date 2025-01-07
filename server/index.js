import express from 'express';
import cors from 'cors';
import axios from 'axios';
import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js';
import employeeRouter from './routes/employee.js';
import salaryRouter from './routes/salary.js';
import leaveRouter from './routes/leave.js';
import settingRouter from './routes/setting.js';
import dashboardRouter from './routes/dashboard.js';
import leadRouter from './routes/lead.js';
import connectToDatabase from './db/db.js';
import taskRouter from './routes/task.js';
import meetingRouter from './routes/meeting.js';
import noteRouter from './routes/note.js';
import callLogRouter from './routes/callLog.js';
import trackingRoutes from './routes/tracking.js'

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

//for tracking

app.use("/api/tracking", trackingRoutes);

// OAuth and Microsoft Graph API Integration
const CLIENT_ID = '306fd3ed-5cc1-421a-92aa-6ecab4b62fe4';
const CLIENT_SECRET = 'BSC8Q~s22C5EAJZL5zVkSKEZ4sdF9r1ERZPUmazV';
const REDIRECT_URI = 'http://localhost:5000/auth/callback';  // Update with your actual redirect URI

// API to handle the code exchange for an access token
app.post('/api/auth/exchange', async (req, res) => {
    const { code, role } = req.body;

    try {
        // Exchange the authorization code for an access token
        const response = await axios.post('https://login.microsoftonline.com/e5430463-8807-41c4-b7e0-f2434bbd3e1d/oauth2/v2.0/token', new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
        }));

        const { access_token } = response.data;

        // Send the access token and role back to the frontend
        res.json({ accessToken: access_token, role });
    } catch (error) {
        console.error('Error during token exchange', error);
        res.status(500).send('Failed to exchange code for token');
    }
});

// API to fetch emails using the access token
app.get('/api/auth/fetchEmails', async (req, res) => {
    const { accessToken } = req.query;

    try {
        const emailResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Check if mail is available or fallback to userPrincipalName
        const email = emailResponse.data.mail || emailResponse.data.userPrincipalName;

        // Send the user info back (you can include email, name, etc.)
        res.json({
            email,
            name: emailResponse.data.displayName,
        });
    } catch (error) {
        console.error('Error fetching user info', error);
        res.status(500).send('Failed to fetch user info');
    }
});

// Simplified OAuth callback handler - calls the /api/auth/exchange route
app.get('/auth/callback', async (req, res) => {
    const { code, state } = req.query;  // Get the authorization code and state from the query parameters
    console.log(code,"its code i fetched ")

    if (!code) {
        return res.status(400).send('Authorization code not provided');
    }

    try {
        // Call your /api/auth/exchange route to exchange the code for an access token
        const response = await axios.post('http://localhost:5000/api/auth/exchange', {
            code: code,
            role: state,  // You can send the 'role' from the state parameter (if needed)
        });

        // Handle the response from /api/auth/exchange
        const { accessToken, role } = response.data;

        // Do something with the access token, like storing it or sending a response
        res.json({ message: 'Successfully authenticated', accessToken, role });
    } catch (error) {
        console.error('Error during OAuth callback handling', error);
        res.status(500).send('Failed to exchange code for token');
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is Running on port ${process.env.PORT || 5000}`);
});
