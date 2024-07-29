// src/components/Ingredient/IngredientList.js

import React from 'react';
import IngredientItem from './IngredientItem';

const IngredientList = ({ ingredients, fetchIngredients }) => {
  return (
    <div>
      <h2>Ingredients</h2>
      <ul>
        {ingredients.map((ingredient) => (
          <IngredientItem key={ingredient.id} ingredient={ingredient} fetchIngredients={fetchIngredients} />
        ))}
      </ul>
    </div>
  );
};

export default IngredientList;
