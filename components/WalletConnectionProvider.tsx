import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const WalletConnectionProvider = () => {
  return (
    <div className="mb-4">
      <WalletMultiButtonDynamic />
    </div>
  );
};

export default WalletConnectionProvider;