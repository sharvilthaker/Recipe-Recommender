// set up the minimal HTML so that the script.js does not crash.
document.body.innerHTML = `
    <form id="SearchF">
        <input id="ingredients" />
        <select id="diet"></select>
        <button id="SearchBtn" type="submit">Find Recipes</button>
    </form>
    <div id="AreaS"></div>
    <section id="results-section" hidden>
        <h2 id="results-heading"></h2>
        <div id="results-grid"></div>
    </section>
    <span id="inError" hidden></span>
`;

const { validateIngredients, stripHtml } = require("../public/script.js");

//The first test
describe("stripHtml()", function () {
    test("removes HTML tags from a string", function () {
        expect(stripHtml("<p>Hello <b>world</b></p>")).toBe("Hello world");
    });

    test("returns plain text unchanged", function () {
        expect(stripHtml("plain text")).toBe("plain text");
    });

    test("handles empty string", function () {
        expect(stripHtml("")).toBe("");
    });
});

//the second test
describe("validateIngredients()", function () {
    beforeEach(function () {
        document.getElementById("ingredients").value = "";
        document.getElementById("inError").hidden = true;
    });

    test("returns false when input is empty", function () {
        const result = validateIngredients();
        expect(result).toBe(false);
    });

    test("returns true when input has a value", function () {
        document.getElementById("ingredients").value = "chicken";
        const result = validateIngredients();
        expect(result).toBe(true);
    });

    test("returns false for whitespace only", function () {
        document.getElementById("ingredients").value = "   ";
        const result = validateIngredients();
        expect(result).toBe(false);
    });
});