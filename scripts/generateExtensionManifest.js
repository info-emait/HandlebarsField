import fs from "fs";
import path from "path";

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf-8"));
const manifestJson = JSON.parse(fs.readFileSync(path.join(root, "vss-extension.json"), "utf-8")
    .replaceAll("#{Id}#", packageJson.name)
    .replaceAll("#{Version}#", packageJson.version)
    .replaceAll("#{Publisher}#", packageJson.author)
    .replaceAll("#{Description}#", packageJson.description));

fs.writeFileSync(
    path.join(root, "dist", "vss-extension.json"),
    JSON.stringify(manifestJson, null, 2)
);

console.log("Manifest vss-extension.json generated");