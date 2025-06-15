export async function uploadToIPFS(name: string, symbol: string, image: File) {
  const formData = new FormData();
  formData.append("file", image);
  const metadata = {
    name,
    symbol,
    properties: {
      files: [{ type: image.type, uri: "image.png" }]
    }
  };
  formData.append("pinataMetadata", JSON.stringify(metadata));
  const response = await fetch("https://api.nft.storage/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NFT_STORAGE_KEY}`
    },
    body: image
  });
  const data = await response.json();
  return `https://ipfs.io/ipfs/${data.value.cid}`;
}