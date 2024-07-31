import React from 'react';
import axios from 'axios';

const IngredientItem = ({ ingredient, fetchIngredients }) => {
  const handleDelete = async () => {
    const token = localStorage.getItem('access_token');

    try {
      await axios.delete(`http://localhost:8000/api/ingredients/${ingredient.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchIngredients(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      alert('Error deleting ingredient. Please try again.');
    }
  };

  return (
    <div>
      <span>{ingredient.name}</span>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default IngredientItem;
