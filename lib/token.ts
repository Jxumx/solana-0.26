
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import { createMetadata } from "./metaplex";

export async function createTokenWithMetadata(
  name: string,
  symbol: string,
  supply: number,
  uri: string,
  connection: Connection
) {
  const fromWallet = Keypair.generate();

  const mint = await createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    0
  );

  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    fromWallet.publicKey
  );

  await mintTo(
    connection,
    fromWallet,
    mint,
    fromTokenAccount.address,
    fromWallet.publicKey,
    supply
  );

  await createMetadata(mint, fromWallet, name, symbol, uri, connection);

  return mint;
}
