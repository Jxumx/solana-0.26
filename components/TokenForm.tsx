
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
    if (!image || !publicKey) return;
    setStatus("Uploading image to IPFS...");
    try {
      const ipfsUrl = await uploadToIPFS(name, symbol, image);
      setStatus("Creating token on Solana Devnet...");
      await createTokenWithMetadata(name, symbol, Number(supply), ipfsUrl, connection, publicKey);
      setStatus("Token created successfully!");
    } catch (error) {
      setStatus("Error: " + (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Symbol" required />
      <input type="number" value={supply} onChange={(e) => setSupply(e.target.value)} placeholder="Supply" required />
      <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} required />
      <button type="submit">Create Token</button>
      <p>{status}</p>
    </form>
  );
}
