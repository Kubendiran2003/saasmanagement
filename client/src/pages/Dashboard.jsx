import { useEffect, useState } from "react";
import {
  Search,
  Building2,
  CheckCircle,
  Users,
  Grid3x3,
  Edit3,
  Trash2,
  ChevronDown,
} from "lucide-react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({ clients: 0, products: 0 });
  const [clients, setClients] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [productFilter, setProductFilter] = useState("All Products");
  const [editModal, setEditModal] = useState({ open: false, client: null });
  const [editForm, setEditForm] = useState({
  name: "",
  email: "",
  company: "",
  domain: "",
  status: "Active",
  createdAt: new Date().toISOString().substring(0, 10),
});

  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const [addModal, setAddModal] = useState(false);
const [addForm, setAddForm] = useState({
  name: '',
  email: '',
  company: 'Starter',
  domain: '',
  plan: 'Free',
  status: 'Active',
  createdAt: new Date().toISOString().substring(0, 10), // format YYYY-MM-DD
});


  const fetchClients = async () => {
    const res = await axios.get("/clients");
    setClients(res.data);

    let total = 0;
    const map = {};
    for (const client of res.data) {
      const products = await axios.get(`/products/${client._id}`);
      map[client._id] = products.data.length;
      total += products.data.length;
    }
    setProductMap(map);
    setStats({ clients: res.data.length, products: total });
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-cyan-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-pink-500",
    ];
    return colors[name.length % colors.length];
  };

  const getStatusColor = (company) => {
    if (company === "Enterprise") return "bg-purple-100 text-purple-800";
    if (company === "Professional") return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800";
  };

  const getStatus = (company) =>
    company === "Starter" ? "Inactive" : "Active";

  const activeTenants = clients.filter(
    (client) => getStatus(client.company) === "Active"
  ).length;

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Statuses" ||
      getStatus(client.company) === statusFilter;
    const matchesProduct =
      productFilter === "All Products" || client.company === productFilter;
    return matchesSearch && matchesStatus && matchesProduct;
  });

  const openEditModal = (client) => {
  setEditForm({
    name: client.name || '',
    email: client.email || '',
    company: client.company || 'Starter',
    domain: client.domain || '',
    status: client.status || 'Active',
    createdAt: client.createdAt?.substring(0, 10) || new Date().toISOString().substring(0, 10),
  });
  setEditModal({ open: true, client });
};


  const handleEditSubmit = async (e) => {
  e.preventDefault();
  await axios.put(`/clients/${editModal.client._id}`, editForm);
  setEditModal({ open: false, client: null });
  fetchClients();
};


  const handleDelete = async (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this tenant?");
  if (confirmed) {
    await axios.delete(`/clients/${id}`);
    fetchClients(); // refresh list
  }
};

const handleAddSubmit = async (e) => {
  e.preventDefault();
  await axios.post('/clients', {
    name: addForm.name,
    email: addForm.email,
    company: addForm.company
  });
  setAddModal(false);
  setAddForm({
    name: '',
    email: '',
    company: 'Starter',
    domain: '',
    status: 'Active',
    createdAt: new Date().toISOString().substring(0, 10),
  });
  fetchClients();
};



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Grid3x3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              SaaS Tenant Manager
            </h1>
          </div>
          <button
  onClick={() => setAddModal(true)}
  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
>
  + Add New Tenant
</button>

        </div>
      </div>

      {/* Controls */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex space-x-3 ml-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-4 py-2"
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="border rounded px-4 py-2"
            >
              <option>All Products</option>
              <option>Enterprise</option>
              <option>Professional</option>
              <option>Starter</option>
            </select>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Tenants"
            count={stats.clients}
            icon={<Building2 className="w-6 h-6 text-indigo-600" />}
            color="indigo"
          />
          <StatCard
            title="Active Tenants"
            count={activeTenants}
            icon={<CheckCircle className="w-6 h-6 text-green-600" />}
            color="green"
          />
          <StatCard
            title="Avg Products/Tenant"
            count={
              stats.clients > 0
                ? (stats.products / stats.clients).toFixed(1)
                : "0.0"
            }
            icon={<Users className="w-6 h-6 text-blue-600" />}
            color="blue"
          />
          <StatCard
            title="Total Features Enabled"
            count={stats.products * 6}
            icon={<Grid3x3 className="w-6 h-6 text-purple-600" />}
            color="purple"
          />
        </div>

        {/* Clients */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div
              key={client._id}
              className="bg-white rounded-xl p-6 border shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 ${getAvatarColor(
                      client.name
                    )} rounded-full flex items-center justify-center text-white font-semibold text-sm`}
                  >
                    {getInitials(client.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {client.name}
                    </h3>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getStatus(client.company) === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {getStatus(client.company)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      client.company
                    )}`}
                  >
                    {client.company}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {productMap[client._id] || 0} Products
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <button
                  onClick={() => navigate(`/clients/${client._id}/products`)}
                  className="text-indigo-600 hover:underline text-sm"
                >
                  Manage Products
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(client)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editModal.open && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-[500px] shadow-lg relative">
      <h2 className="text-xl font-bold mb-4">Edit Tenant</h2>
      <button
        onClick={() => setEditModal({ open: false, client: null })}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
      <form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-4 text-sm">
        <input
          type="text"
          placeholder="Tenant Name"
          value={editForm.name}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          className="p-2 border rounded col-span-1"
          required
        />
        <input
          type="text"
          placeholder="Domain"
          value={editForm.domain}
          onChange={(e) => setEditForm({ ...editForm, domain: e.target.value })}
          className="p-2 border rounded col-span-1"
        />
        <input
          type="email"
          placeholder="Admin Email"
          value={editForm.email}
          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
          className="p-2 border rounded col-span-1"
          required
        />
        <select
          value={editForm.company}
          onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
          className="p-2 border rounded col-span-1"
        >
          <option value="Enterprise">Enterprise</option>
                <option value="Professional">Professional</option>
                <option value="Starter">Starter</option>
        </select>
        <select
          value={editForm.status}
          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
          className="p-2 border rounded col-span-1"
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <input
          type="date"
          value={editForm.createdAt}
          onChange={(e) => setEditForm({ ...editForm, createdAt: e.target.value })}
          className="p-2 border rounded col-span-1"
        />
        <div className="col-span-2 flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={() => setEditModal({ open: false, client: null })}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Update Tenant
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {addModal && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-lg w-[500px] p-6 relative">
      <h2 className="text-xl font-bold mb-4">Add New Tenant</h2>
      <button
        onClick={() => setAddModal(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
      <form onSubmit={handleAddSubmit} className="grid grid-cols-2 gap-4 text-sm">
        <input
          type="text"
          placeholder="Tenant Name"
          value={addForm.name}
          onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
          className="p-2 border rounded col-span-1"
          required
        />
        <input
          type="text"
          placeholder="Domain"
          value={addForm.domain}
          onChange={(e) => setAddForm({ ...addForm, domain: e.target.value })}
          className="p-2 border rounded col-span-1"
        />
        <input
          type="email"
          placeholder="Email"
          value={addForm.email}
          onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
          className="p-2 border rounded col-span-1"
          required
        />
        <select
          value={addForm.company}
          onChange={(e) => setAddForm({ ...addForm, company: e.target.value })}
          className="p-2 border rounded col-span-1"
        >
          <option value="Enterprise">Enterprise</option>
                <option value="Professional">Professional</option>
                <option value="Starter">Starter</option>
        </select>
        <select
          value={addForm.status}
          onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
          className="p-2 border rounded col-span-1"
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <input
          type="date"
          value={addForm.createdAt}
          onChange={(e) => setAddForm({ ...addForm, createdAt: e.target.value })}
          className="p-2 border rounded col-span-1"
        />
        <div className="col-span-2 flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={() => setAddModal(false)}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Save Tenant
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

const StatCard = ({ title, count, icon, color }) => (
  <div
    className={`bg-white rounded-xl p-6 shadow-sm border-l-4 border-${color}-500`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{count}</p>
      </div>
      <div
        className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}
      >
        {icon}
      </div>
    </div>
  </div>
);

export default Dashboard;
