import { useState } from 'react';
import { createTokenWithMetadata } from '../lib/token';
import { uploadToIPFS } from '../lib/ipfs';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export default function TokenForm() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [supply, setSupply] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !image) return;

    try {
      setStatus("Uploading to IPFS...");
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
      <input placeholder="Token Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Symbol" onChange={e => setSymbol(e.target.value)} />
      <input placeholder="Supply" onChange={e => setSupply(e.target.value)} />
      <input type="file" onChange={e => setImage(e.target.files?.[0] || null)} />
      <button type="submit">Create Token</button>
      <p>{status}</p>
    </form>
  );
}