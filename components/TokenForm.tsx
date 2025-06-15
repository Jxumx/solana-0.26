import { useState } from "react";
import { createTokenWithMetadata } from "../lib/token";
import { uploadToIPFS } from "../lib/ipfs";

export default function TokenForm() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symbol || !supply || !image) return;

    setStatus("Uploading image to IPFS...");
    try {
      const ipfsUrl = await uploadToIPFS(name, symbol, image);
      setStatus("Creating token on Solana Devnet...");
      await createTokenWithMetadata(name, symbol, Number(supply), ipfsUrl);
      setStatus("Token created successfully!");
    } catch (error) {
      setStatus("Error: " + (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input placeholder="Symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} required />
      <input placeholder="Supply" type="number" value={supply} onChange={(e) => setSupply(e.target.value)} required />
      <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} accept="image/*" required />
      <button type="submit">Create Token</button>
      <p>{status}</p>
    </form>
  );
}