import React from 'react';

export const TokenList = ({ tokens }: { tokens: any[] }) => {
  return (
    <div>
      <h2>Created Tokens</h2>
      <ul>
        {tokens.map((token, i) => (
          <li key={i}>{token.name} — {token.symbol}</li>
        ))}
      </ul>
    </div>
  );
};