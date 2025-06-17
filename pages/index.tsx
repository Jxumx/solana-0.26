import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import TokenForm from "../components/TokenForm";

export default function Home() {
    return (
        <div>
            <WalletMultiButton />
            <TokenForm />
        </div>
    );
}
