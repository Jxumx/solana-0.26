import { useState } from "react";

export default function TokenForm() {
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [supply, setSupply] = useState("");

    return (
        <form>
            <input placeholder="Nombre del token" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="Símbolo" value={symbol} onChange={e => setSymbol(e.target.value)} />
            <input placeholder="Cantidad total" value={supply} onChange={e => setSupply(e.target.value)} />
        </form>
    );
}
