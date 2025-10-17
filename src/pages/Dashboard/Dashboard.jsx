import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCardBlocks } from "../../redux/slices/cardsSlice";
import CardBlock from "../../components/CardBlock/CardBlock";
import CardSearchForm from "../../components/CardSearchForm/CardSearchForm";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useLocation, useNavigate } from "react-router-dom";

import layout from "./Layout.module.css";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { blocks, loading, error, total } = useSelector((state) => state.cards);
  const { user } = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const limit = 10;

  useEffect(() => {
    if (location.state?.filters) {
      setFilters(location.state.filters);
      setPage(location.state.page || 1);
    }
  }, [location.state?.filters, location.state?.page]);

  useEffect(() => {
    dispatch(fetchCardBlocks({ ...filters, limit, offset: (page - 1) * limit }));
  }, [dispatch, page, filters]);

  const handleSearch = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const handleExportPDF = () => {
    if (!Array.isArray(blocks) || blocks.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Bloques exportados", 14, 20);

    const tableData = blocks.map((b) => [
      b.id,
      b.dominio,
      b.marca,
      b.modelo,
      b.color,
      b.lugar,
      new Date(b.fecha).toLocaleDateString("es-AR"),
      b.sintesis || "",
    ]);

    autoTable(doc, {
      head: [["ID", "Dominio", "Marca", "Modelo", "Color", "Lugar", "Fecha", "Síntesis"]],
      body: tableData,
      startY: 30,
      styles: { fontSize: 10 },
    });

    doc.save(`bloques_exportados_${Date.now()}.pdf`);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Header onToggleSidebar={() => setSidebarVisible(!sidebarVisible)} />
      <div className={layout.mainContent}>
        <Sidebar isVisible={sidebarVisible} />
        <main className={layout.pageContent}>
          <h2>Cantidad de Registros ({total})</h2>

          {(user?.role === "admin" || user?.role === "editor") && (
            <button
              onClick={() => navigate("/cards/create")}
              className={layout.buttonPrimary}
              style={{ marginBottom: "1rem" }}
            >
              ➕ Cargar Nuevo
            </button>
          )}

          <button onClick={handleExportPDF} className={layout.buttonSecondary}>
            🧾 Exportar PDF
          </button>

          <CardSearchForm onSearch={handleSearch} />

          {loading && <p>Cargando bloques...</p>}
          {typeof error === "string" && error && (
            <p style={{ color: "red" }}>{error}</p>
          )}

          {Array.isArray(blocks) && blocks.length > 0 ? (
            <div className={layout.gridContainer}>
              {blocks.map((block) => (
                <CardBlock
                  key={block.id}
                  block={{ ...block, _filters: filters, _page: page }}
                />
              ))}
            </div>
          ) : (
            !loading && !error && <p>No hay bloques disponibles.</p>
          )}

          <div style={{ marginTop: "1rem" }}>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={layout.buttonSecondary}
            >
              Anterior
            </button>
            <span style={{ margin: "0 1rem" }}>
              Página {page} de {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className={layout.buttonSecondary}
            >
              Siguiente
            </button>
          </div>
        </main>
      </div>
    </>
  );
}