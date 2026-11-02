"use client";

import { useEffect, useState } from "react";

const empty = { name: "", description: "", price: "", stock: "", imageUrl: "" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/products");
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: (p.price / 100).toFixed(2),
      stock: String(p.stock),
      imageUrl: p.imageUrl || "",
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(empty);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
    const res = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }
    cancelEdit();
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Could not delete");
      return;
    }
    load();
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Products</h1>

      <form onSubmit={handleSubmit} className="mb-8 grid gap-3 rounded border p-4 sm:grid-cols-2">
        <h2 className="font-semibold sm:col-span-2">{editingId ? "Edit product" : "Add product"}</h2>
        <input className="rounded border p-2" placeholder="Name" value={form.name} onChange={update("name")} required />
        <input className="rounded border p-2" placeholder="Image URL (optional)" value={form.imageUrl} onChange={update("imageUrl")} />
        <input className="rounded border p-2" type="number" step="0.01" min="0.01" placeholder="Price (e.g. 19.99)" value={form.price} onChange={update("price")} required />
        <input className="rounded border p-2" type="number" step="1" min="0" placeholder="Stock" value={form.stock} onChange={update("stock")} required />
        <textarea className="rounded border p-2 sm:col-span-2" placeholder="Description" value={form.description} onChange={update("description")} />
        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
        <div className="flex gap-2 sm:col-span-2">
          <button className="rounded bg-black px-4 py-2 text-white disabled:opacity-50" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="rounded border px-4 py-2">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{(p.price / 100).toFixed(2)}</td>
                  <td className="p-2">{p.stock}</td>
                  <td className="space-x-3 p-2">
                    <button onClick={() => startEdit(p)} className="underline">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

