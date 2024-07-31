import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '../auth';
import IngredientList from '../components/Ingredients/IngredientList';
import IngredientForm from '../components/Ingredients/IngredientForm';

const IngredientsPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [error, setError] = useState('');

  const fetchIngredients = async () => {
    const token = await getAccessToken();
    if (!token) {
      setError('Unauthorized access - please log in.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:8000/api/ingredients/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIngredients(response.data);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      setError('Error fetching ingredients');
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  return (
    <div>
      <h1>Manage Ingredients</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <IngredientForm fetchIngredients={fetchIngredients} />
      <IngredientList ingredients={ingredients} fetchIngredients={fetchIngredients} />
    </div>
  );
};

export default IngredientsPage;
