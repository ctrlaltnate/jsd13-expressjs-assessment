import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const emptyForm = { name: "", price: "", quantity: "1" };

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts(query = search) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${API_URL}${query ? `?search=${encodeURIComponent(query)}` : ""}`,
      );
      if (!response.ok) throw new Error("โหลดสินค้าไม่สำเร็จ");
      setProducts(await response.json());
    } catch (err) {
      setError(`${err.message} — ตรวจสอบว่า server กำลังรันอยู่หรือไม่`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts("");
  }, []);

  function changeForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: String(product.price),
      quantity: String(product.quantity),
    });
    window.scrollTo({ top: 0 }); // กระโดดไปส่วนบนเพื่อแก้ไข
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function submitForm(event) {
    event.preventDefault();
    setError("");
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "บันทึกสินค้าไม่สำเร็จ");
      }
      cancelEdit();
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeProduct(id) {
    if (!window.confirm("ต้องการลบสินค้านี้ใช่หรือไม่?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("ลบสินค้าไม่สำเร็จ");
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  function searchProducts(event) {
    event.preventDefault();
    loadProducts(search);
  }

  return (
    <main className="page-shell">
      <section className="form-card">
        <h2>{editingId ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</h2>
        <form onSubmit={submitForm} className="product-form">
          <input
            name="name"
            value={form.name}
            onChange={changeForm}
            placeholder="ชื่อสินค้า"
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={changeForm}
            type="number"
            min="0"
            placeholder="ราคา"
            required
          />
          <input
            name="quantity"
            value={form.quantity}
            onChange={changeForm}
            type="number"
            min="1"
            placeholder="จำนวน"
            required
          />
          <button className="primary-button" type="submit">
            {editingId ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
          </button>
          {editingId && (
            <button
              className="secondary-button"
              type="button"
              onClick={cancelEdit}
            >
              ยกเลิก
            </button>
          )}
        </form>
      </section>

      <section className="list-card">
        <div className="list-heading">
          <form className="search-form" onSubmit={searchProducts}>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ค้นหาสินค้า..."
            />
            <button type="submit">ค้นหา</button>
          </form>
        </div>
        {error && <p className="error-message">{error}</p>}
        {loading ? (
          <p className="state-message">กำลังโหลดข้อมูล...</p>
        ) : products.length === 0 ? (
          <p className="state-message">ไม่พบสินค้า</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>สินค้า</th>
                  <th>ราคา</th>
                  <th>คงเหลือ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                      <small>ID: {product.id}</small>
                    </td>
                    <td>{Number(product.price).toLocaleString("th-TH")} บาท</td>
                    <td>
                      <span className="quantity">{product.quantity}</span> ชิ้น
                    </td>
                    <td className="actions">
                      <button onClick={() => startEdit(product)}>แก้ไข</button>
                      <button
                        className="delete-button"
                        onClick={() => removeProduct(product.id)}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
