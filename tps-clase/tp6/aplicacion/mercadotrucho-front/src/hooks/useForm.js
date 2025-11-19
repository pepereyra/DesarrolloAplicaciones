import { useState } from 'react';

/**
 * Custom hook para manejar formularios
 * @param {Object} initialValues - Estado inicial del formulario
 * @param {Function} onSubmit - Función a ejecutar al enviar el formulario
 */
export default function useForm(initialValues, onSubmit) {
  const [formData, setFormData] = useState(initialValues);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Error en el formulario');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    error,
    setError,
    loading,
    handleChange,
    handleSubmit,
  };
}
