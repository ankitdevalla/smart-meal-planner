// src/components/Ingredient/IngredientItem.js

import React from 'react';
import axios from 'axios';

const IngredientItem = ({ ingredient, fetchIngredients }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/ingredients/${ingredient.id}/`);
      fetchIngredients(); // Refetch ingredients after deleting
    } catch (error) {
      console.error('Error deleting ingredient:', error);
    }
  };

  return (
    <li>
      {ingredient.name}
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
};

export default IngredientItem;
