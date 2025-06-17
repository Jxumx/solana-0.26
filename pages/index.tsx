import Head from "next/head";
import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import TokenForm from ".../components/TokenForm";
import TokenList from ".../components/TokenList";
import TradingViewChart from ".../components/TradingViewChart";
import { getAllTokens } from ".../lib/token";

export default function Home() {
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    async function loadTokens() {
      const tokens = await getAllTokens();
      setTokens(tokens);
    }
    loadTokens();
  }, []);

  return (
    <>
      <Head>
        <title>Crear Criptomoneda en Solana</title>
        <meta
          name="description"
          content="Crea tu propia criptomoneda en la red de pruebas Devnet de Solana fácilmente y gratis."
        />
      </Head>

      <main className="min-h-screen bg-gray-50 p-4">
        <div className="bg-yellow-200 text-yellow-900 p-3 rounded-xl text-center shadow-md mb-6">
          Esta web está en fase de pruebas (Devnet). Todos los tokens creados son de prueba y no tienen valor real.
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Creador de Criptomonedas Solana</h1>
          <WalletMultiButton />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <TokenForm />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Tokens disponibles</h2>
            <TokenList tokens={tokens} />
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Gráfico de precio (TradingView)</h2>
          <TradingViewChart />
        </div>
      </main>
    </>
  );
}
