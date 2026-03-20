const request = require("supertest");
const app     = require("../server");

//the first test
describe("GET /health", function () {
    test("returns 200 with status ok", async function () {
        const res = await request(app).get("/health");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status", "ok");
    });
});

// the second test for the missing ingredients
describe("GET /recipes - input validation", function () {
    test("returns 400 when ingredients are missing", async function () {
        const res = await request(app).get("/recipes");
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message");
    });
    test("returns 400 when ingredients is empty", async function () {
        const res = await request(app).get("/recipes?ingredients=");
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message");
    });
});

//test 3 for the live API call or not
describe("GET /recipes - live API", function () {
    test("returns 200 and array with valid ingredients", async function () {
        const res = await request(app).get("/recipes?ingredients=chicken");

        if (res.statusCode === 402) {
            console.warn("API quota exceeded - skipping");
            return;
        }

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }, 15000);
});