type TokenListProps = {
  tokens?: any[];
};

export const TokenList = ({ tokens = [] }: TokenListProps) => {
  return (
    <div>
      <h2>Tokens disponibles</h2>
      <ul>
        {tokens.map((token, index) => (
          <li key={index}>
            {token.name} ({token.symbol})
          </li>
        ))}
      </ul>
    </div>
  );
};