/**
 * Deployment script for CrowdfundingFactory
 *
 * Usage:
 *   Local Hardhat node:   npx hardhat run scripts/deploy.js --network localhost
 *   In-process (no node): npx hardhat run scripts/deploy.js
 *
 * After deployment, copy the printed contract address into:
 *   src/utils/constants.js  →  contractAddress
 */

const hre = require("hardhat");
const fs  = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("─────────────────────────────────────────");
  console.log("Deploying CrowdfundingFactory...");
  console.log("Deployer address :", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance :", hre.ethers.formatEther(balance), "ETH");
  console.log("─────────────────────────────────────────");

  // Deploy the contract
  const Factory = await hre.ethers.getContractFactory("CrowdfundingFactory");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();

  const address = await factory.getAddress();

  console.log("✅ CrowdfundingFactory deployed to:", address);
  console.log("─────────────────────────────────────────");

  // ── Auto-update constants.js with the real address ──────────────────────
  const constantsPath = path.join(__dirname, "../src/utils/constants.js");

  if (fs.existsSync(constantsPath)) {
    let content = fs.readFileSync(constantsPath, "utf8");

    // Replace the placeholder address line
    content = content.replace(
      /export const contractAddress\s*=\s*["'][^"']*["'];/,
      `export const contractAddress = "${address}"; // deployed on ${new Date().toISOString()}`
    );

    fs.writeFileSync(constantsPath, content, "utf8");
    console.log("📝 Updated src/utils/constants.js with deployed address.");
  }

  // ── Write deployment info to a JSON file for reference ──────────────────
  const deploymentInfo = {
    network:         hre.network.name,
    contractAddress: address,
    deployer:        deployer.address,
    deployedAt:      new Date().toISOString(),
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, `${hre.network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2),
    "utf8"
  );

  console.log(`📄 Deployment info saved to deployments/${hre.network.name}.json`);
  console.log("─────────────────────────────────────────");
  console.log("Next steps:");
  console.log("  1. Copy the address above into src/utils/constants.js");
  console.log("     (the deploy script does this automatically)");
  console.log("  2. Run: npx hardhat compile");
  console.log("     to generate the ABI in artifacts/");
  console.log("─────────────────────────────────────────");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
