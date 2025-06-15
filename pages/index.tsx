import { useEffect, useState } from 'react';
import { TokenList } from '../components/TokenList';

export default function Home() {
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    // Simulación de carga de tokens
    setTokens([{ name: "Token1", symbol: "TK1" }]);
  }, []);

  return (
    <div>
      <TokenList tokens={tokens} />
    </div>
  );
}