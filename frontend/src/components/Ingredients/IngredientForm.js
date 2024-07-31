import React, { useState } from 'react';
import axios from 'axios';

const IngredientForm = ({ fetchIngredients, initialData = {} }) => {
  const [ingredient, setIngredient] = useState(initialData);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setIngredient({ ...ingredient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    try {
      if (ingredient.id) {
        await axios.put(`http://localhost:8000/api/ingredients/${ingredient.id}/`, ingredient, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post('http://localhost:8000/api/ingredients/', ingredient, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      fetchIngredients(); // Refetch ingredients after saving
      setIngredient(initialData); // Clear form
    } catch (error) {
      console.error('Error saving ingredient:', error);
      setError('Error saving ingredient. Please ensure all fields are correctly filled.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={ingredient.name || ''}
        onChange={handleChange}
        placeholder="Ingredient Name"
        required
      />
      <button type="submit">Save Ingredient</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default IngredientForm;
