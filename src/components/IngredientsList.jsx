export default function IngredientsList(props) {
  const ingredientsListItems = props.ingredients.map((item, index) => (
    <li key={item.id}>
      {index + 1}. {item.name}
      <button
        onClick={() => props.deleteIngredient(item.id)}
        className="del-btn"
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </li>
  ));

  return (
    <section>
      <h2>Bahan-bahan yang tersedia:</h2>
      <ul className="ingredients-list" aria-live="polite">
        {ingredientsListItems}
      </ul>
      {ingredientsListItems.length > 2 ? (
        <div className="get-recipe-container">
          <div>
            <h3>Siap untuk resep?</h3>
            <p>Buatlah resep berdasarkan daftar bahan Anda.</p>
          </div>
          <button onClick={props.getRecipe}>Dapatkan Resep</button>
        </div>
      ) : null}
    </section>
  );
}
