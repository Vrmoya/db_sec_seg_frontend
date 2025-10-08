import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCardBlocks } from '../redux/slices/cardsSlice';

export default function CardSearchForm() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    type: '',
    marca: '',
    modelo: '',
    dominio: '',
    color: '',
    lugar: '',
    startDate: '',
    endDate: '',
    });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const filtros = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v !== '')
    );
    dispatch(fetchCardBlocks(filtros));
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input name="type" placeholder="Tipo" value={form.type} onChange={handleChange} />
      <input name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} />
      <input name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} />
      <input name="dominio" placeholder="Dominio" value={form.dominio} onChange={handleChange} />
      <input name="color" placeholder="Color" value={form.color} onChange={handleChange} />
      <input name="lugar" placeholder="Lugar" value={form.lugar} onChange={handleChange} />
      <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
      <input name="endDate" type="date" value={form.endDate} onChange={handleChange} />
      <button type="submit">Buscar</button>
    </form>
  );
}