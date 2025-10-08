import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCardBlocks } from '../redux/slices/cardsSlice';

export default function CardFilters() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vehiculo, setVehiculo] = useState('');
  const dispatch = useDispatch();

  const handleFilter = () => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (vehiculo) params.vehiculo = vehiculo;

    dispatch(fetchCardBlocks(params));
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <input type="text" placeholder="Vehículo" value={vehiculo} onChange={(e) => setVehiculo(e.target.value)} />
      <button onClick={handleFilter}>Filtrar</button>
    </div>
  );
}