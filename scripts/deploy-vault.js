import hre from "hardhat";
import dotenv from "dotenv";

// Explicitly load the local environment variables
dotenv.config({ path: '.env.local' });

async function main() {
  console.log("====================================================");
  console.log("🛰️  Deploying Bazaria Escrow Vault to Polygon Amoy...");
  console.log("====================================================");

 const bazTokenAddress = process.env.NEXT_PUBLIC_BAZ_TOKEN_ADDRESS;
  
  // Automatically derive the public address if the public key isn't explicitly defined
  let signerPublicKey = process.env.SERVER_TX_SIGNER_PUBLIC_KEY;
  if (!signerPublicKey && process.env.SERVER_TX_SIGNER_PRIVATE_KEY) {
    try {
      // Ensure the private key has the 0x prefix before passing it to the Wallet wrapper
      const pk = process.env.SERVER_TX_SIGNER_PRIVATE_KEY.startsWith("0x") 
        ? process.env.SERVER_TX_SIGNER_PRIVATE_KEY 
        : `0x${process.env.SERVER_TX_SIGNER_PRIVATE_KEY}`;
        
      signerPublicKey = new hre.ethers.Wallet(pk).address;
    } catch (e) {
      console.error("❌ Failed to derive public key from private key string:", e.message);
    }
  }

  // 👇 Keep these debug lines to watch it work
  console.log("🔍 DEBUG - All Loaded Keys:", Object.keys(process.env).filter(k => k.includes("BAZ") || k.includes("SIGNER") || k.includes("PUBLIC")));
  console.log(`🔍 DEBUG - BAZ Address Value: [${bazTokenAddress}]`);
  console.log(`🔍 DEBUG - Derived Signer Public Key: [${signerPublicKey}]\n`);
