
import {
  DataV2,
  CreateMetadataAccountV3InstructionArgs,
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";

/**
 * Crea la instrucción para registrar los metadatos del token.
 */
export function createMetadataInstruction({
  metadata,
  mint,
  mintAuthority,
  payer,
  updateAuthority,
  name,
  symbol,
  uri,
}: {
  metadata: PublicKey;
  mint: PublicKey;
  mintAuthority: PublicKey;
  payer: PublicKey;
  updateAuthority: PublicKey;
  name: string;
  symbol: string;
  uri: string;
}): TransactionInstruction {
  const dataV2: DataV2 = {
    name,
    symbol,
    uri,
    sellerFeeBasisPoints: 100,
    creators: null,
    collection: null,
    uses: null,
  };

  const args: CreateMetadataAccountV3InstructionArgs = {
    data: dataV2,
    isMutable: true,
    collectionDetails: null,
  };

  return createCreateMetadataAccountV3Instruction(
    {
      metadata,
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
