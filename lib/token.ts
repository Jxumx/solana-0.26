import { Connection, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { createCreateMetadataAccountV3Instruction, DataV2 } from "@metaplex-foundation/mpl-token-metadata";
import { Keypair } from "@solana/web3.js";

export async function createTokenWithMetadata(
  name: string,
  symbol: string,
  supply: number,
  uri: string,
  connection: Connection
) {
  const payer = Keypair.generate();
  const mint = await createMint(connection, payer, payer.publicKey, null, 9);

  const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, payer.publicKey);
  await mintTo(connection, payer, mint, tokenAccount.address, payer, supply * Math.pow(10, 9));

  const metadataPDA = (
    await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
        mint.toBuffer()
      ],
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
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

  const ix = createCreateMetadataAccountV3Instruction({
    metadata: metadataPDA,
    mint: mint,
    mintAuthority: payer.publicKey,
    payer: payer.publicKey,
    updateAuthority: payer.publicKey
  }, {
    createMetadataAccountArgsV3: {
      data,
      isMutable: true,
      collectionDetails: null
    }
  });

  const tx = new Transaction().add(ix);
  await sendAndConfirmTransaction(connection, tx, [payer]);
}