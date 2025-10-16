import { useState } from 'react';
import styles from './CardSearchForm.module.css';

export default function CardSearchForm({ onSearch }) {
  const [filters, setFilters] = useState({
    dominio: '',
    marca: '',
    modelo: '',
    color: '',
    lugar: '',
    fechaInicio: '',
    fechaFin: '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const cleared = {
      dominio: '',
      marca: '',
      modelo: '',
      color: '',
      lugar: '',
      fechaInicio: '',
      fechaFin: '',
    };
    setFilters(cleared);
    onSearch(cleared);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {['dominio', 'marca', 'modelo', 'color', 'lugar'].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={filters[field]}
          onChange={handleChange}
          className={styles.input}
        />
      ))}

      <input
        name="fechaInicio"
        type="date"
        value={filters.fechaInicio}
        onChange={handleChange}
        className={styles.input}
      />
      <input
        name="fechaFin"
        type="date"
        value={filters.fechaFin}
        onChange={handleChange}
        className={styles.input}
      />

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.buttonPrimary}>🔍 Buscar</button>
        <button type="button" onClick={handleReset} className={styles.buttonSecondary}>
          🧹 Limpiar
        </button>
      </div>
    </form>
  );
}