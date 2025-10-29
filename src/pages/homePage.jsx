import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function HomePage() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState(null);
  const [searchId, setSearchId] = useState(""); // 🔍 new state

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_URL);
      setEmployees(res.data);
    } catch {
      toast.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData);
        toast.success("Employee updated successfully");
      } else {
        await axios.post(API_URL, formData);
        toast.success("Employee added successfully");
      }
      setFormData({ name: "", email: "" });
      setEditId(null);
      fetchEmployees();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success("Deleted successfully");
        fetchEmployees();
      } catch {
        toast.error("Delete failed");
      }
    }
  };

  const handleEdit = (emp) => {
    setFormData({ name: emp.name, email: emp.email });
    setEditId(emp.id);
  };

  // 🔍 Search employee by ID
  const handleSearch = async () => {
    if (!searchId) {
      fetchEmployees();
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/${searchId}`);
      setEmployees([res.data]);
      toast.success("Employee found");
    } catch {
      toast.error("Employee not found");
      setEmployees([]);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4 text-center">Employee Management</h1>

      {/* Add / Update Form */}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2 w-full rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* 🔍 Search Section */}
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Search by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-green-500 text-white px-4 rounded hover:bg-green-600"
        >
          Search
        </button>
      </div>

      {/* Employee Table */}
      <table className="w-full border-collapse border text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td className="border p-2">{emp.id}</td>
                <td className="border p-2">{emp.name}</td>
                <td className="border p-2">{emp.email}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="bg-yellow-400 text-white px-2 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-gray-500">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
