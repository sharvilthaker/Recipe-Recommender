module.exports = {
    verbose: true,
    projects: [
        {
            displayName: "server",
            testEnvironment: "node",
            testMatch: ["**/tests/server.test.js"]
        },
        {
            displayName: "client",
            testEnvironment: "jsdom",
            testMatch: ["**/tests/client.test.js"]
        }
    ]
};