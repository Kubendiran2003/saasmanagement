import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/api";
import { useAuth } from "../context/AuthContext";

const Products = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get(`/products/${id}`);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`/products/item/${editingId}`, form);
    } else {
      await axios.post(`/products/${id}`, form);
    }
    setForm({ name: "", price: "", description: "" });
    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
    });
    setEditingId(product._id);
  };

  const handleDelete = async (pid) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      await axios.delete(`/products/item/${pid}`);
      fetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
  🛠️ Manage Products
  <span className="block text-sm font-normal text-gray-500 mt-1">
    Admin: {user?.name || "Unknown"}
  </span>
</h2>



        {/* Product Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <input
            type="text"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <button
  type="submit"
  className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700"
>
  {editingId ? "✏️ Update" : "➕ Add"}
</button>

        </form>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200 shadow-sm rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 border">{product.name}</td>
                  <td className="p-3 border">₹{product.price}</td>
                  <td className="p-3 border">{product.description}</td>
                  <td className="p-3 border">
                    <div className="flex gap-2">
                      <button
  onClick={() => handleEdit(product)}
  className="text-blue-600 hover:underline text-sm flex items-center gap-1"
>
  ✏️ Edit
</button>
<button
  onClick={() => handleDelete(product._id)}
  className="text-red-600 hover:underline text-sm flex items-center gap-1"
>
  🗑️ Delete
</button>

                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 p-4">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
