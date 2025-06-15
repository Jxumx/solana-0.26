import {
  createCreateMetadataAccountV3Instruction,
  CreateMetadataAccountArgsV3,
  DataV2,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID
} from '@metaplex-foundation/mpl-token-metadata';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';

export function createMetadataInstruction({
  mint,
  payer,
  name,
  symbol,
  uri
}: {
  mint: PublicKey;
  payer: PublicKey;
  name: string;
  symbol: string;
  uri: string;
}): TransactionInstruction {
  const metadataPDA = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0];

  const data: DataV2 = {
    name,
    symbol,
    uri,
    sellerFeeBasisPoints: 100,
    creators: null,
    collection: null,
    uses: null,
  };

  const instruction = createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPDA,
      mint,
      mintAuthority: payer,
      payer,
      updateAuthority: payer,
    },
    {
      createMetadataAccountArgsV3: {
        data,
        isMutable: true,
        collectionDetails: null,
      },
    }
  );

  return instruction;
}