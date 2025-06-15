
import {
  createCreateMetadataAccountV3Instruction,
  DataV2,
  PROGRAM_ID as METADATA_PROGRAM_ID
} from '@metaplex-foundation/mpl-token-metadata';
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction
} from '@solana/web3.js';
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';

export async function createTokenWithMetadata(
  name: string,
  symbol: string,
  supply: number,
  uri: string,
  connection: Connection
): Promise<PublicKey> {
  const payer = Keypair.generate(); // Para desarrollo. En producción, usa el wallet del usuario.
  const mint = Keypair.generate();

  const lamports = await connection.getMinimumBalanceForRentExemption(82);

  const transaction = new Transaction();

  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint.publicKey,
      space: 82,
      lamports,
      programId: TOKEN_PROGRAM_ID
    }),
    createInitializeMintInstruction(
      mint.publicKey,
      0,
      payer.publicKey,
      payer.publicKey
    )
  );

  const ata = await getAssociatedTokenAddress(mint.publicKey, payer.publicKey);

  transaction.add(
    createAssociatedTokenAccountInstruction(
      payer.publicKey,
      ata,
      payer.publicKey,
      mint.publicKey
    ),
    createMintToInstruction(
      mint.publicKey,
      ata,
      payer.publicKey,
      supply
    )
  );

  const metadataPDA = (
    await PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        METADATA_PROGRAM_ID.toBuffer(),
        mint.publicKey.toBuffer()
      ],
      METADATA_PROGRAM_ID
    )
  )[0];

  const data: DataV2 = {
    name,
    symbol,
    uri,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null
  };

  transaction.add(
    createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataPDA,
        mint: mint.publicKey,
        mintAuthority: payer.publicKey,
        payer: payer.publicKey,
        updateAuthority: payer.publicKey
      },
      {
        createMetadataAccountArgsV3: {
          data,
          isMutable: true,
          collectionDetails: null
        }
      }
    )
  );

  await connection.sendTransaction(transaction, [payer, mint]);

  return mint.publicKey;
}
