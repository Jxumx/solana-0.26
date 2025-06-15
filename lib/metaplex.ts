import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionArgs,
  DataV2,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  Connection,
  PublicKey,
  Keypair,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

export async function createMetadata(
  connection: Connection,
  mint: PublicKey,
  wallet: Keypair,
  name: string,
  symbol: string,
  uri: string
) {
  const metadataPDA = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0];

  const accounts = {
    metadata: metadataPDA,
    mint,
    mintAuthority: wallet.publicKey,
    payer: wallet.publicKey,
    updateAuthority: wallet.publicKey,
  };

  const args: CreateMetadataAccountV3InstructionArgs = {
    data: {
      name,
      symbol,
      uri,
      sellerFeeBasisPoints: 100,
      creators: [
        {
          address: new PublicKey("EitHP7isqEtAC8bu9kaKKYRLWY6APEnDga1egUuEcaZR"),
          verified: false,
          share: 1,
        },
        {
          address: wallet.publicKey,
          verified: true,
          share: 99,
        },
      ],
      collection: null,
      uses: null,
    },
    isMutable: true,
    collectionDetails: null,
  };

  const ix = createMetadataAccountV3({ ...accounts }, { ...args });
  const tx = new Transaction().add(ix);

  await sendAndConfirmTransaction(connection, tx, [wallet]);
}