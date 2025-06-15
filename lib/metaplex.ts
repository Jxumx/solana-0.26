
import {
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  CreateMetadataAccountV3InstructionArgs,
  createCreateMetadataAccountV3Instruction,
} from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";

/**
 * Retorna el PDA de metadatos para un mint dado.
 */
export function getMetadataPDA(mint: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0];
}

/**
 * Crea la instrucción para registrar los metadatos.
 */
export function createMetadataInstruction({
  mint,
  mintAuthority,
  payer,
  updateAuthority,
  name,
  symbol,
  uri,
}: {
  mint: PublicKey;
  mintAuthority: PublicKey;
  payer: PublicKey;
  updateAuthority: PublicKey;
  name: string;
  symbol: string;
  uri: string;
}): TransactionInstruction {
  const metadataPDA = getMetadataPDA(mint);

  const data: CreateMetadataAccountV3InstructionArgs = {
    data: {
      name,
      symbol,
      uri,
      sellerFeeBasisPoints: 100, // 1%
      creators: null,
      collection: null,
      uses: null,
    },
    isMutable: true,
    collectionDetails: null,
  };

  return createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPDA,
      mint,
      mintAuthority,
      payer,
      updateAuthority,
    },
    {
      createMetadataAccountArgsV3: data,
    }
  );
}
