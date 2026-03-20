"use strict";

//all DOM elements
const searchForm       = document.getElementById("SearchF");
const ingredientsInput = document.getElementById("ingredients");
const dietSelect       = document.getElementById("diet");
const searchBtn        = document.getElementById("SearchBtn");
const statusArea       = document.getElementById("AreaS");
const resultsSection   = document.getElementById("results-section");
const resultsGrid      = document.getElementById("results-grid");
const resultsHeading   = document.getElementById("results-heading");
const ingredientsError = document.getElementById("inError");

//Validation 
function validateIngredients() {
    const value = ingredientsInput.value.trim();
    if (!value) {
        ingredientsInput.style.borderColor = "red";
        ingredientsError.hidden = false;
        return false;
    }
    ingredientsInput.style.borderColor = "#ccc";
    ingredientsError.hidden = true;
    return true;
}

// to clear the error as a user types
ingredientsInput.addEventListener("input", function () {
    if (ingredientsInput.value.trim()) {
        ingredientsInput.style.borderColor = "#ccc";
        ingredientsError.hidden = true;
    }
});

//for uI Helpers
function showLoading() {
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";
    statusArea.innerHTML = "<p class='loading'>Loading recipes...</p>";
    resultsSection.hidden = true;
    resultsGrid.innerHTML = "";
}

function resetButton() {
    searchBtn.disabled = false;
    searchBtn.textContent = "Find Recipes";
}

function showError(message) {
    statusArea.innerHTML = "<p class='error-banner'>" + message + "</p>";
}

function showEmpty() {
    statusArea.innerHTML = "<p class='empty-banner'>No recipes found. Try different ingredients or remove a filter.</p>";
}

function clearStatus() {
    statusArea.innerHTML = "";
}

//func to strip htmll from API summaries
function stripHtml(html) {
    const ape = document.createElement("div");
    ape.innerHTML = html;
    return ape.textContent || ape.innerText || "";
}

//to renders the recipe cards
function renderRecipes(recipes) {
    resultsGrid.innerHTML = "";

    recipes.forEach(function (recipe) {
        const red = document.createElement("div");
        red.className = "recipe-red";

        const img1 = recipe.image
            ? "<img src='" + recipe.image + "' alt='" + recipe.title + "' />"
            : "<div style='height:150px;background:#eee;display:flex;align-items:center;justify-content:center;'>No Image</div>";

        red.innerHTML =
            img1 +
            "<div class='red-body'>" +
            "<h3>" + recipe.title + "</h3>" +
            (recipe.readyInMinutes ? "<p>Time: " + recipe.readyInMinutes + " mins</p>" : "") +
            (recipe.servings ? "<p>Serves: " + recipe.servings + "</p>" : "") +
            "</div>";

        resultsGrid.appendChild(red);
    });

    resultsHeading.textContent = recipes.length + " Recipe(s) Found";
    resultsSection.hidden = false;
}

//fetch recipes from the server 
async function fetchRecipes(ingredients, diet) {
    showLoading();

    let rec = "/recipes?ingredients=" + encodeURIComponent(ingredients);
    if (diet) {
        rec += "&diet=" + encodeURIComponent(diet);
    }

    try {
        const response = await fetch(rec);

        if (!response.ok) {
            const data = await response.json().catch(function () { return {}; });
            throw new Error(data.message || "Server error " + response.status);
        }

        const recipes = await response.json();
        clearStatus();
        resetButton();

        if (!Array.isArray(recipes) || recipes.length === 0) {
            showEmpty();
            return;
        }

        renderRecipes(recipes);

    } catch (error) {
        resetButton();
        showError("Something went wrong: " + error.message);
        console.error("Fetch error:", error);
    }
}

//Form submit 
searchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateIngredients()) {
        ingredientsInput.focus();
        return;
    }

    const ingredients = ingredientsInput.value.trim();
    const diet        = dietSelect.value;

    fetchRecipes(ingredients, diet);
});

//functions for testing 
if (typeof module !== "undefined") {
    module.exports = { validateIngredients, stripHtml, renderRecipes };
}