import { useState } from 'react';

export default function CardSearchForm({ onSearch }) {
  const [filters, setFilters] = useState({
    dominio: '',
    marca: '',
    modelo: '',
    color: '',
    lugar:'',
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
      lugar:'',
      fechaInicio: '',
      fechaFin: '',
    };
    setFilters(cleared);
    onSearch(cleared);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        name="dominio"
        placeholder="Dominio"
        value={filters.dominio}
        onChange={handleChange}
        style={{ marginRight: '0.5rem' }}
      />
      <input
        name="marca"
        placeholder="Marca"
        value={filters.marca}
        onChange={handleChange}
        style={{ marginRight: '0.5rem' }}
      />
      <input
        name="modelo"
        placeholder="Modelo"
        value={filters.modelo}
        onChange={handleChange}
        style={{ marginRight: '0.5rem' }}
      />
      <input
        name="color"
        placeholder="Color"
        value={filters.color}
        onChange={handleChange}
        style={{ marginRight: '0.5rem' }}
      />
      <input
        name="lugar"
        placeholder="Lugar"
        value={filters.lugar}
        onChange={handleChange}
        style={{ marginRight: '0.5rem' }}
      />
      <input
        name="fechaInicio"
        type="date"
        value={filters.fechaInicio}
        onChange={handleChange}
        style={{ marginRight: '0.5rem' }}
      />
      <input
        name="fechaFin"
        type="date"
        value={filters.fechaFin}
        onChange={handleChange}
        style={{ marginRight: '0.5rem' }}
      />
      <button type="submit">Buscar</button>
      <button type="button" onClick={handleReset} style={{ marginLeft: '0.5rem' }}>
        Limpiar
      </button>
    </form>
  );
}