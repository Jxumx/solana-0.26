
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';
import TokenForm from '../components/TokenForm';
import TokenList from '../components/TokenList';
import TradingViewChart from '../components/TradingViewChart';

require('@solana/wallet-adapter-react-ui/styles.css');

export default function HomePage() {
  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function App() {
  const { connected } = useWallet();

  return (
    <div className="container">
      <Head>
        <title>Solana Token Creator</title>
        <meta name="description" content="Create your own crypto on Solana" />
      </Head>

      <div className="banner">⚠️ This site is in test mode. Tokens created have no real value. ⚠️</div>

      <header>
        <h1>Solana Token Creator</h1>
        <WalletMultiButton />
      </header>

      {connected && (
        <>
          <TokenForm />
          <TokenList />
        </>
      )}

      <section style={{ marginTop: '2rem' }}>
        <h2>Solana Price Chart</h2>
        <TradingViewChart symbol="BINANCE:SOLUSDT" />
      </section>

      <style jsx>{`
        .container {
          padding: 2rem;
          font-family: Arial, sans-serif;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .banner {
          background: yellow;
          padding: 1rem;
          text-align: center;
          font-weight: bold;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
