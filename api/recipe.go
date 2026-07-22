package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"google.golang.org/genai"
)

type RequestBody struct {
	Ingredients []string `json:"ingredients"`
}

type ResponseBody struct {
	Recipe string `json:"recipe"`
	Error  string `json:"error,omitempty"`
}

// Handler adalah entry point wajib untuk Vercel Serverless Function
func Handler(w http.ResponseWriter, r *http.Request) {
	// 1. Setup Header CORS (agar tidak diblokir browser)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Tangani Preflight Request
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 2. Parse Request Body dari React
	var req RequestBody
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil || len(req.Ingredients) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ResponseBody{Error: "Bahan makanan tidak boleh kosong"})
		return
	}

	// 3. Panggil Gemini API
	ctx := context.Background()
	apiKey := os.Getenv("GEMINI_API_KEY") // Ambil dari Environment Variable Vercel

	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey: apiKey,
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ResponseBody{Error: "Gagal inisialisasi Gemini Client"})
		return
	}

	prompt := fmt.Sprintf("Buatkan resep masakan lezat berdasarkan bahan-bahan berikut: %v. Format output dalam Markdown.", req.Ingredients)

	resp, err := client.Models.GenerateContent(ctx, "gemini-3.5-flash-lite", genai.Text(prompt), nil)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ResponseBody{Error: err.Error()})
		return
	}

	// 4. Kirimkan Hasil ke Frontend
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ResponseBody{
		Recipe: resp.Text(),
	})
}