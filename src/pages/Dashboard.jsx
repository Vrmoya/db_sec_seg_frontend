import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCardBlocks, fetchCardStats } from '../redux/slices/cardsSlice';
import CardBlock from '../components/CardBlock';
import CardSearchForm from '../components/CardSearchForm';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useLocation } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { blocks, loading, error, total, stats } = useSelector((state) => state.cards);

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const limit = 10;

  // Restaurar filtros y página si vienen desde CardDetail
  useEffect(() => {
    if (location.state?.filters) {
      setFilters(location.state.filters);
      setPage(location.state.page || 1);
    }
  }, [location.state?.filters, location.state?.page]);

  // Cargar bloques según filtros y paginación
  useEffect(() => {
    dispatch(fetchCardBlocks({ ...filters, limit, offset: (page - 1) * limit }));
  }, [dispatch, page, filters]);

  // Cargar métricas del dashboard
  useEffect(() => {
    dispatch(fetchCardStats());
  }, [dispatch]);

  const handleSearch = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const handleExportPDF = () => {
    if (!Array.isArray(blocks) || blocks.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Bloques exportados', 14, 20);

    const tableData = blocks.map((b) => [
      b.id,
      b.dominio,
      b.marca,
      b.modelo,
      b.color,
      b.lugar,
      new Date(b.fecha).toLocaleDateString('es-AR'),
      b.sintesis || '',
    ]);

    autoTable(doc, {
      head: [['ID', 'Dominio', 'Marca', 'Modelo', 'Color', 'Lugar', 'Fecha', 'Síntesis']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 10 },
    });

    doc.save(`bloques_exportados_${Date.now()}.pdf`);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem' }}>
          <h2>Validación de registros ({total})</h2>

          <button onClick={handleExportPDF} style={{ marginBottom: '1rem' }}>
            🧾 Exportar PDF
          </button>

          {/* 📊 Métricas del sistema */}
          {stats && (
            <div style={{ marginBottom: '2rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
              <p><strong>Total:</strong> {stats.total}</p>
              <p><strong>✅ Validados:</strong> {stats.validados}</p>
              <p><strong>❌ No validados:</strong> {stats.noValidados}</p>

              <details style={{ marginTop: '1rem' }}>
                <summary>📍 Registros por lugar</summary>
                <ul>
                  {stats.porLugar.map((l) => (
                    <li key={l.lugar}>{l.lugar}: {l.count}</li>
                  ))}
                </ul>
              </details>

              <details style={{ marginTop: '1rem' }}>
                <summary>🚗 Registros por marca</summary>
                <ul>
                  {stats.porMarca.map((m) => (
                    <li key={m.marca}>{m.marca}: {m.count}</li>
                  ))}
                </ul>
              </details>
            </div>
          )}

          <CardSearchForm onSearch={handleSearch} />

          {loading && <p>Cargando bloques...</p>}
          {typeof error === 'string' && error && (
            <p style={{ color: 'red' }}>{error}</p>
          )}

          {Array.isArray(blocks) && blocks.length > 0 ? (
            blocks.map((block) => (
              <CardBlock
                key={block.id}
                block={{ ...block, _filters: filters, _page: page }}
              />
            ))
          ) : (
            !loading && !error && <p>No hay bloques disponibles.</p>
          )}

          <div style={{ marginTop: '1rem' }}>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Anterior
            </button>
            <span style={{ margin: '0 1rem' }}>
              Página {page} de {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </button>
          </div>
        </main>
      </div>
    </>
  );
}