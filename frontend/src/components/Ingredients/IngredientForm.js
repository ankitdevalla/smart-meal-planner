// src/components/Ingredient/IngredientForm.js

import React, { useState } from 'react';
import axios from 'axios';

const IngredientForm = ({ fetchIngredients, initialData = {} }) => {
  const [ingredient, setIngredient] = useState(initialData);

  const handleChange = (e) => {
    setIngredient({ ...ingredient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (ingredient.id) {
        await axios.put(`http://localhost:8000/api/ingredients/${ingredient.id}/`, ingredient);
      } else {
        await axios.post('http://localhost:8000/api/ingredients/', ingredient);
      }
      fetchIngredients(); //refetch the ingredients
      setIngredient(initialData); // Clear form
    } catch (error) {
      console.error('Error saving ingredient:', error);
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
    </form>
  );
};

export default IngredientForm;
