// src/hooks/useUsers.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // usuarios por página

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/users?page=${page}&limit=${limit}`);
      setUsers(res.data.users);         // Ajustar según estructura del backend
      setTotalPages(res.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error al cargar usuarios', error);
    } finally {
      setLoading(false);
    }
  };

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchUsers(page);
    }
  };

  const reloadUsers = () => fetchUsers(currentPage);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  return {
    users,
    loading,
    currentPage,
    totalPages,
    reloadUsers,
    fetchUsers,
    changePage
  };
};