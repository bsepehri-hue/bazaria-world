import { NextResponse } from "next/server";
import { ethers } from "ethers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipient, amount, referenceId } = body;

    // 1. Validate incoming parameters
    if (!recipient || !amount || !referenceId) {
      return NextResponse.json(
        { error: "Missing required payload parameters" },
        { status: 400 }
      );
    }

    // 2. Fetch configurations from our backend environment
    const privateKey = process.env.SERVER_TX_SIGNER_PRIVATE_KEY;
    const vaultAddress = process.env.NEXT_PUBLIC_BAZARIA_VAULT_ADDRESS;

    if (!privateKey || !vaultAddress) {
      return NextResponse.json(
        { error: "Server missing environment configuration" },
        { status: 500 }
      );
    }

    // 3. Format referenceId to match standard Solidity bytes32 hex string (0x...)
    const formattedRefId = referenceId.startsWith("0x") ? referenceId : `0x${referenceId}`;
    
    // 4. Mimic Solidity's keccak256(abi.encodePacked(...)) precisely
    const messageHash = ethers.solidityPackedKeccak256(
      ["address", "uint256", "bytes32", "address"],
      [recipient, amount, formattedRefId, vaultAddress]
    );

    // 5. Sign the message hash using the secure server wallet
    const wallet = new ethers.Wallet(privateKey);
    const signature = await wallet.signMessage(ethers.toBeArray(messageHash));

    // 6. Return the signature voucher to the client application
    return NextResponse.json({
      success: true,
      signature,
      messageHash,
    });

  } catch (error: any) {
    console.error("❌ Signer API Error:", error);
    return NextResponse.json(
      { error: "Internal server error during cryptographic signing" },
      { status: 500 }
    );
  }
}
