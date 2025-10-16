import styles from './CardForm.module.css';

export default function CardForm({ form, setForm, onSave, onCancel }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className={styles.formContainer} onSubmit={(e) => e.preventDefault()}>
      <label className={styles.label}>
        Marca:
        <input
          type="text"
          name="marca"
          value={form.marca}
          onChange={handleChange}
          className={styles.input}
        />
      </label>

      <label className={styles.label}>
        Modelo:
        <input
          type="text"
          name="modelo"
          value={form.modelo}
          onChange={handleChange}
          className={styles.input}
        />
      </label>

      <label className={styles.label}>
        Color:
        <input
          type="text"
          name="color"
          value={form.color}
          onChange={handleChange}
          className={styles.input}
        />
      </label>

      <label className={styles.label}>
        Lugar:
        <input
          type="text"
          name="lugar"
          value={form.lugar}
          onChange={handleChange}
          className={styles.input}
        />
      </label>

      <label className={styles.label}>
        Síntesis:
        <textarea
          name="sintesis"
          value={form.sintesis}
          onChange={handleChange}
          className={styles.input}
          rows={4}
        />
      </label>

      <label className={styles.label}>
        Fecha:
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          className={styles.input}
        />
      </label>

      <div className={styles.buttonGroup}>
        <button type="button" onClick={onSave} className={styles.saveButton}>
          💾 Guardar
        </button>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          ❌ Cancelar
        </button>
      </div>
    </form>
  );
}