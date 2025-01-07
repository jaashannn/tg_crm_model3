import React, { useState } from 'react';

const Profile = () => {
  // Dummy data for the employee
  const [employee, setEmployee] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    salary: 50000,
    leaves: 12,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: employee.name,
    email: employee.email,
    salary: employee.salary,
    leaves: employee.leaves,
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle profile update
  const handleSubmit = (e) => {
    e.preventDefault();
    setEmployee(formData); // Update employee data with the form values
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-center mb-6">Employee Profile</h1>
      <div className="profile-details">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium">Salary</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium">Leaves</label>
              <input
                type="text"
                name="leaves"
                value={formData.leaves}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info space-y-4">
            <p><strong className="text-sm">Name:</strong> {employee.name}</p>
            <p><strong className="text-sm">Email:</strong> {employee.email}</p>
            <p><strong className="text-sm">Salary:</strong> ${employee.salary}</p>
            <p><strong className="text-sm">Leaves:</strong> {employee.leaves} days</p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
