package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"google.golang.org/genai"
)

// Struktur data untuk menerima request JSON dari Frontend
type RecipeRequest struct {
	Ingredients []string `json:"ingredients"`
}

// Struktur data untuk merespons ke Frontend
type RecipeResponse struct {
	Recipe string `json:"recipe"`
	Error  string `json:"error,omitempty"`
}

const systemPrompt = `
Anda adalah asisten yang menerima daftar bahan yang dimiliki pengguna dan menyarankan resep yang dapat mereka buat menggunakan sebagian atau seluruh bahan tersebut. Anda tidak harus menggunakan setiap bahan yang mereka sebutkan dalam resep Anda. Resep tersebut boleh menyertakan bahan tambahan yang tidak mereka sebutkan, namun usahakan untuk tidak menambahkan terlalu banyak bahan ekstra. Formatlah tanggapan Anda menggunakan Markdown agar lebih mudah ditampilkan di halaman web.`

func recipeHandler(w http.ResponseWriter, r *http.Request) {
	// 1. Atur Header CORS agar Frontend (Browser) bisa mengakses API ini
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 2. Decode JSON dari request body Frontend
	var req RecipeRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil || len(req.Ingredients) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(RecipeResponse{Error: "Bahan-bahan tidak boleh kosong"})
		return
	}

	ctx := context.Background()

	// 3. Inisialisasi Gemini Client
	// SDK otomatis membaca environment variable GEMINI_API_KEY
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey: os.Getenv("GEMINI_API_KEY"),
	})
	if err != nil {
		log.Printf("Gagal inisialisasi client: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(RecipeResponse{Error: "Gagal menghubungkan ke service AI"})
		return
	}

	// 4. Format prompt dari daftar bahan
	ingredientsStr := fmt.Sprintf("Saya memiliki bahan: %v. Tolong berikan resep yang Anda rekomendasikan!", req.Ingredients)

	// BENAR (Ambil indeks [0] dari slice yang dihasilkan genai.Text)
	resp, err := client.Models.GenerateContent(ctx, "gemini-3.5-flash-lite", genai.Text(ingredientsStr), &genai.GenerateContentConfig{
		SystemInstruction: genai.Text(systemPrompt)[0], 
})
	if err != nil {
		log.Printf("Gagal generate content: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(RecipeResponse{Error: "Gagal memproses resep"})
		return
	}

	// 6. Kirim hasil resep ke Frontend
	recipeText := resp.Text()
	json.NewEncoder(w).Encode(RecipeResponse{Recipe: recipeText})
}

func main() {
	http.HandleFunc("/api/recipe", recipeHandler)

	fmt.Println("Server Go berjalan di http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}