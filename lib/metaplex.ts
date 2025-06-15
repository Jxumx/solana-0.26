
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import {
  DataV2,
  CreateMetadataAccountArgsV3,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  findMetadataPda,
} from "@metaplex-foundation/mpl-token-metadata";

/**
 * Generate a transaction instruction to create metadata for a token.
 */
export async function createMetadataInstruction(
  mint: PublicKey,
  mintAuthority: PublicKey,
  payer: PublicKey,
  updateAuthority: PublicKey,
  name: string,
  symbol: string,
  uri: string
): Promise<TransactionInstruction> {
  const metadataPda = findMetadataPda(mint);

  const metadataData: DataV2 = {
    name,
    symbol,
    uri,
    sellerFeeBasisPoints: 100, // 1% fee
    creators: [
      {
        address: new PublicKey("EitHP7isqEtAC8bu9kaKKYRLWY6APEnDga1egUuEcaZR"),
        verified: true,
        share: 1,
      },
      {
        address: updateAuthority,
        verified: false,
        share: 99,
      },
    ],
    collection: null,
    uses: null,
  };

  const args: CreateMetadataAccountArgsV3 = {
    data: metadataData,
    isMutable: true,
    collectionDetails: null,
  };

  return createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPda,
      mint,
      mintAuthority,
      payer,
      updateAuthority,
    },
    {
      createMetadataAccountArgsV3: args,
    }
  );
}
