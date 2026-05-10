import { ethers } from "ethers";
import artifact from "./artifacts/contracts/Listing.sol/Listing.json";

// Build an interface from the ABI
const iface = new ethers.Interface(artifact.abi);

// Paste the raw input data from the contract creation transaction on Polygonscan
const data = "<PASTE_TX_INPUT_DATA>";

try {
  const decoded = iface.parseTransaction({ data });
  console.log(decoded);
} catch (err) {
  console.error("Failed to decode:", err);
}
