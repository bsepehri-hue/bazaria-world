const fs = require("fs");
const path = require("path");

// Point directly to the artifact JSON you just listed
const artifactPath = path.join(__dirname, "artifacts/contracts/HelloListToBid.sol/HelloListToBid.json");
const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

console.log("=== Artifact Info ===");
console.log("Contract:", artifact.contractName);
console.log("Source:", artifact.sourceName);

const ctor = (artifact.abi || []).find(x => x.type === "constructor");
const ctorInputs = (ctor?.inputs || []).map(i => `${i.type} ${i.name}`);
console.log("Constructor inputs:", ctorInputs.length ? ctorInputs.join(", ") : "(none)");

console.log("\n=== Build Settings ===");
const buildInfoDir = path.join(__dirname, "artifacts/build-info");
const files = fs.readdirSync(buildInfoDir).filter(f => f.endsWith(".json"));

let found = null;
for (const f of files) {
  const bi = JSON.parse(fs.readFileSync(path.join(buildInfoDir, f), "utf8"));
  if (bi.output?.contracts?.[artifact.sourceName]?.[artifact.contractName]) {
    found = bi;
    break;
  }
}

if (!found) {
  console.error("No matching build-info found.");
  process.exit(1);
}

const settings = found.input?.settings || {};
const optimizer = settings.optimizer || { enabled: false, runs: 0 };

console.log("Solidity version:", found.solcVersion || found.solcLongVersion || "unknown");
console.log("Optimizer enabled:", optimizer.enabled);
console.log("Optimizer runs:", optimizer.runs);
console.log("EVM version:", settings.evmVersion || "default");
console.log("viaIR:", settings.viaIR || false);
