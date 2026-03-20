const express = require("express");
const axios   = require("axios");
const cors    = require("cors");

const app  = express();
const PORT = process.env.PORT || 3000;

const API_KEY = "78f502e3b55840b0aa7c89d1ccb8c260";
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.get("/recipes", async function (req, res) {
    const ingredients = req.query.ingredients;
    const diet        = req.query.diet;

    //all the input validation
    if (!ingredients || ingredients.trim() === "") {
        return res.status(400).json({ message: "Ingredients are required." });
    }

    try {
        const response = await axios.get(
            "https://api.spoonacular.com/recipes/complexSearch",
            {
                params: {
                    apiKey:              API_KEY,
                    includeIngredients:  ingredients.trim(),
                    diet:                diet || "",
                    number:              8,
                    addRecipeInformation: true
                }
            }
        );

        const recipes = response.data.results || [];

        const simplified = recipes.map(function (r) {
            return {
                id:             r.id,
                title:          r.title,
                image:          r.image,
                readyInMinutes: r.readyInMinutes,
                servings:       r.servings,
                sourceUrl:      r.sourceUrl || ""
            };
        });

        res.status(200).json(simplified);

    } catch (error) {
        console.error("API error:", error.message);

        if (error.response && error.response.status === 402) {
            return res.status(402).json({ message: "API error. Try again later." });
        }

        res.status(500).json({ message: "Failed to fetch recipes. Please try again." });
    }
});

//for the health check
app.get("/health", function (req, res) {
    res.status(200).json({ status: "ok" });
});

//Start server only when run directly
if (require.main === module) {
    app.listen(PORT, function () {
        console.log("Server running on http://localhost:" + PORT);
    });
}

module.exports = app;