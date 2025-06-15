
import { useState } from "react";
import { uploadToIPFS } from "../lib/ipfs";
import { createTokenWithMetadata } from "../lib/token";
import { Connection, clusterApiUrl } from "@solana/web3.js";

export default function TokenForm() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const connection = new Connection(clusterApiUrl("devnet"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatus("Uploading metadata to IPFS...");
      const ipfsUrl = await uploadToIPFS(name, symbol, image);
      setStatus("Creating token on Solana Devnet...");
      await createTokenWithMetadata(
        name,
        symbol,
        parseInt(supply, 10),
        ipfsUrl,
        connection
      );
      setStatus("Token created successfully!");
    } catch (error) {
      setStatus("Error: " + (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Token Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Total Supply"
        value={supply}
        onChange={(e) => setSupply(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        required
      />
      <button type="submit">Create Token</button>
      <p>{status}</p>
    </form>
  );
}
