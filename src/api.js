export async function getRecipeFromGoogle(ingredients) {
  // Langsung panggil ke /api/recipe
  const response = await fetch("/api/recipe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ingredients }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal mengambil data dari server");
  }

  const data = await response.json();
  return data.recipe;
}
