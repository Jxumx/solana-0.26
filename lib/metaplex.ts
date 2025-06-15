
import {
  createCreateMetadataAccountV3Instruction,
  DataV2,
} from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { METADATA_PROGRAM_ID } from "./constants";

export function createMetadataInstruction(
  mint: PublicKey,
  mintAuthority: PublicKey,
  payer: PublicKey,
  updateAuthority: PublicKey,
  name: string,
  symbol: string,
  uri: string
): TransactionInstruction {
  const metadataAccount = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    METADATA_PROGRAM_ID
  )[0];

  const data: DataV2 = {
    name,
    symbol,
    uri,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  };

  return createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataAccount,
      mint,
      mintAuthority,
      payer,
      updateAuthority,
    },
    {
      createMetadataAccountArgsV3: {
        data,
        isMutable: true,
        collectionDetails: null,
      },
    }
  );
}
