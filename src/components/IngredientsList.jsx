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

      {/* Selalu tampilkan container jika sudah ada bahan */}
      <div className="get-recipe-container">
        <div>
          <h3>Siap untuk resep?</h3>
          <p>
            {ingredientsListItems.length < 3
              ? `Tambahkan minimal ${3 - ingredientsListItems.length} bahan lagi untuk membuka resep.`
              : "Buatlah resep berdasarkan daftar bahan Anda."}
          </p>
        </div>
        <button
          onClick={props.getRecipe}
          disabled={ingredientsListItems.length < 3}
        >
          Dapatkan Resep
        </button>
      </div>
    </section>
  );
}
