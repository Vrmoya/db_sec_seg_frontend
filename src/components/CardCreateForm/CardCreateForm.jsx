import { useNavigate } from "react-router-dom";
import { useState } from "react";
import baseApi from "../../services/baseApi";
import styles from "../../styles/Theme.module.css";

export default function CardCreateForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: "",
    marca: "",
    modelo: "",
    dominio: "",
    color: "",
    lugar: "",
    fecha: "",
    sintesis: "",
  });

  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleVolver = () => {
    navigate("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      files.forEach((file) => formData.append("images", file));

      const res = await baseApi.post("/cards", formData);
      const newCardId = res.data.id;

      if (files.length > 0) {
        await baseApi.post(`/cards/${newCardId}/images`, formData);
      }

      setSuccess(true);
      setForm({
        type: "",
        marca: "",
        modelo: "",
        dominio: "",
        color: "",
        lugar: "",
        fecha: "",
        sintesis: "",
      });
      setFiles([]);
    } catch (err) {
      console.error("Error al crear card:", err);
      setError("Hubo un error al crear el registro.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.title}>Crear Nuevo Registro</h2>

      {["type", "marca", "modelo", "dominio", "color", "lugar", "sintesis"].map((field) => (
        <div key={field} className={styles.field}>
          <label className={styles.label}>{field.toUpperCase()}</label>
          <input
            name={field}
            value={form[field]}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
      ))}

      <div className={styles.field}>
        <label className={styles.label}>FECHA</label>
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>IMÁGENES</label>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png"
          onChange={(e) => setFiles([...e.target.files])}
          className={styles.fileInput}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit" disabled={submitting} className={styles.submitButton}>
          {submitting ? "Creando..." : "Crear card"}
        </button>
        <button type="button" onClick={handleVolver} className={styles.backButton}>
          🔙 Volver
        </button>
      </div>

      {success && <p className={styles.successMessage}>✅ Card creado correctamente</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
    </form>
  );
}