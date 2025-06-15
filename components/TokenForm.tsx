import { useState } from "react";
import { uploadToIPFS } from "../lib/ipfs";
import { createTokenWithMetadata } from "../lib/token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export default function TokenForm() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !publicKey) {
      setStatus("Image and wallet connection required.");
      return;
    }

    try {
      setStatus("Uploading metadata to IPFS...");
      const ipfsUrl = await uploadToIPFS(name, symbol, image);
      setStatus("Creating token on Solana Devnet...");
      await createTokenWithMetadata(
        name,
        symbol,
        parseInt(supply),
        ipfsUrl,
        connection
      );
      setStatus("Token created successfully!");
    } catch (error) {
      setStatus("Error: " + (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-xl shadow-md space-y-4">
      <input
        type="text"
        placeholder="Token Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Total Supply"
        value={supply}
        onChange={(e) => setSupply(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="w-full"
        accept="image/*"
        required
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
        Create Token
      </button>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </form>
  );
}
