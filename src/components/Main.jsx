import { useState, useRef, useEffect } from "react";
import IngredientsList from "./IngredientsList";
import Recipe from "./Recipe";
import LoadingSpinner from "./LoadingSpinner";
import { getRecipeFromBackend } from "../api";

export default function Main() {
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const recipeSection = useRef(null);

  useEffect(() => {
    if (recipe !== "" && recipeSection.current !== null) {
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipe]);

  async function getRecipe() {
    try {
      setLoading(true);

      const recipeMarkdown = await getRecipeFromBackend(
        ingredients.map((item) => item.name),
      );

      setRecipe(recipeMarkdown);
    } catch (error) {
      console.error("Gagal mendapatkan resep:", error);
    } finally {
      setLoading(false);
    }
  }

  function addIngredient(formData) {
    const newIngredientName = formData.get("ingredient");
    if (!newIngredientName) return;

    const newIngredient = {
      id: crypto.randomUUID(),
      name: newIngredientName,
    };
    setIngredients((prevIngredient) => [...prevIngredient, newIngredient]);
  }

  function deleteIngredient(id) {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((item) => item.id !== id),
    );
  }

  return (
    <main>
      <form action={addIngredient} className="add-ingredient-form">
        <input
          type="text"
          aria-label="Tambahkan Bahan"
          placeholder="contoh: Telur"
          className="add-ingredient-input"
          name="ingredient"
          required
        />
        <button className="add-ingredient-button">Tambah Bahan</button>
      </form>

      {ingredients.length > 0 && (
        <IngredientsList
          ingredients={ingredients}
          getRecipe={getRecipe}
          deleteIngredient={deleteIngredient}
        />
      )}

      {loading ? (
        <LoadingSpinner message="Sedang mengambil resep dari AI..." />
      ) : (
        recipe && <Recipe recipe={recipe} ref={recipeSection} />
      )}
    </main>
  );
}
