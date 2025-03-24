TestGrid CRM System
Overview
This is a Customer Relationship Management (CRM) system built using the MERN stack (MongoDB, Express.js, React.js, Node.js) designed for TestGrid. The project is aimed at managing and organizing leads, employees, tasks, and other business details in a seamless way for TestGrid's operations. It features both admin and employee roles, with different permissions and dashboards.

Features
Admin Dashboard: Manage employees, assign tasks, monitor leads, and oversee business operations.
Employee Dashboard: View and manage assigned leads, update task statuses, and track progress.
Lead Management: Capture, assign, and track leads throughout their lifecycle.
Task Management: Assign and track tasks related to leads, employees, and business processes.
Role-based Authentication: Admins and employees have different levels of access and functionality.
Dynamic Charts and Analytics: Real-time data visualization for business insights.
Tech Stack
Frontend: React.js, Tailwind CSS (Styling)
Backend: Node.js, Express.js, MongoDB
Database: MongoDB
Authentication: JWT (JSON Web Token)
State Management: React Context API for authentication and user state
Deployment: AWS (for hosting)
Installation
Prerequisites
Node.js: Ensure that Node.js is installed on your system. If not, you can download it from here.
MongoDB: You need a MongoDB instance running. You can use a local installation or a cloud-based instance like MongoDB Atlas.
AWS (for Deployment): If you're deploying the app to AWS, ensure you have an AWS account and necessary setup (S3, EC2, etc.).
Clone the Repository
bash
Copy code
git clone https://github.com/jaashannn/TG_CRM_Model1.git
cd testgrid-crm
Install Backend Dependencies
Go to the server directory:
bash
Copy code
cd server
Install the backend dependencies:
bash
Copy code
npm installf
Set Up Environment Variables
Create a .env file in the server directory and add the following environment variables:

bash
Copy code
MONGODB_URI=your-mongodb-connection-url
JWT_SECRET=your-jwt-secret
PORT=5000
Install Frontend Dependencies
Go to the frontend directory:
bash
Copy code
cd frontend
Install the frontend dependencies:
bash
Copy code
npm install
Run the Application Locally
In the server directory, run:
bash
Copy code
npm start
In the frontend directory, run:
bash
Copy code
npm start
Access the app in your browser at http://localhost:5000.
Usage
Admin Features:
View and manage employees, leads, and tasks.
Assign tasks and monitor their progress.
Visualize data using dynamic charts and analytics.
Employee Features:
View assigned leads and tasks.
Update task status and progress.
View personal performance and progress.
Authentication:
The application uses JWT for secure authentication.
Admin users can manage employee accounts.
Employees can only access their assigned tasks and leads.
API Endpoints
POST /api/auth/login - Login to get a JWT token.
GET /api/lead - Fetch all leads (Admin only).
POST /api/lead - Create a new lead (Admin only).
GET /api/task - Fetch tasks for the logged-in employee.
POST /api/task - Assign tasks to employees (Admin only).
Deployment
You can deploy the app to AWS EC2 for the backend and AWS S3 for the frontend.

Backend: Deploy the backend server on EC2 or any cloud service that supports Node.js.
Frontend: Build the frontend using npm run build and deploy the static files to an S3 bucket or a CDN.
Contributing
Fork the repository.
Create a new branch (git checkout -b feature-name).
Commit your changes (git commit -am 'Add feature').
Push to the branch (git push origin feature-name).
Create a new pull request.
License
This project is licensed under the MIT License.