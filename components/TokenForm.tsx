
import { useState } from "react";
import { uploadToIPFS } from "../lib/ipfs";
import { createTokenWithMetadata } from "../lib/token";
import { useConnection } from "@solana/wallet-adapter-react";

export default function TokenForm() {
  const { connection } = useConnection();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setStatus("Please upload an image.");
      return;
    }
    try {
      setStatus("Uploading image to IPFS...");
      const ipfsUrl = await uploadToIPFS(name, symbol, image);
      setStatus("Creating token on Solana Devnet...");
      await createTokenWithMetadata(
        name,
        symbol,
        supply,
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
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Token Name" />
      <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Symbol" />
      <input value={supply} onChange={(e) => setSupply(e.target.value)} placeholder="Supply" />
      <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <button type="submit">Create Token</button>
      <p>{status}</p>
    </form>
  );
}
