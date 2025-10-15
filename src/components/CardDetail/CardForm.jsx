export default function CardForm({ form, setForm, onSave, onCancel }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      {['marca', 'modelo', 'color', 'lugar'].map((field) => (
        <label key={field}>
          {field.charAt(0).toUpperCase() + field.slice(1)}:<br />
          <input
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          /><br />
        </label>
      ))}
      <label>Síntesis:<br />
        <textarea
          value={form.sintesis}
          onChange={(e) => setForm({ ...form, sintesis: e.target.value })}
        />
      </label><br />
      <button onClick={onSave}>Guardar cambios</button>
      <button onClick={onCancel} style={{ marginLeft: '1rem' }}>Cancelar</button>
    </div>
  );
}