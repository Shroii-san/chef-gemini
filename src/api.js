export async function getRecipeFromBackend(ingredientArr) {
  try {
    const response = await fetch("http://localhost:8080/api/recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ingredients: ingredientArr, // mengirim array misal: ["telur", "bawang", "nasi"]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Terjadi kesalahan server");
    }

    return data.recipe; // Berisi teks Markdown resep dari Gemini
  } catch (error) {
    console.error("Gagal mengambil resep:", error);
    throw error;
  }
}
