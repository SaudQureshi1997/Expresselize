const fs = require("fs");
const path = require("path");

const modelsPath = "./dist/models"

const files = fs.readdirSync(path.resolve(modelsPath));

const promises = files.map(async (file) => {
    const model = require(path.resolve(modelsPath, file)).default;
    await model.sync();
    console.log(`Migrated: ${file}.`);
});

Promise.all(promises).then(() => process.exit(0));