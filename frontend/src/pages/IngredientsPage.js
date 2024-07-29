// src/pages/IngredientsPage.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import IngredientList from '../components/Ingredients/IngredientList';
import IngredientForm from '../components/Ingredients/IngredientForm';

const IngredientsPage = () => {
  const [ingredients, setIngredients] = useState([]);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/ingredients/');
      setIngredients(response.data);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  return (
    <div>
      <h1>Manage Ingredients</h1>
      <IngredientForm fetchIngredients={fetchIngredients} />
      <IngredientList ingredients={ingredients} fetchIngredients={fetchIngredients} />
    </div>
  );
};

export default IngredientsPage;
