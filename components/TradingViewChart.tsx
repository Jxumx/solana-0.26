import React, { useEffect } from 'react';

interface Props {
  symbol: string;
}

const TradingViewChart = ({ symbol }: Props) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      new TradingView.widget({
        width: "100%",
        height: 500,
        symbol: symbol,
        interval: "D",
        timezone: "Etc/UTC",
        theme: "light",
        style: "1",
        locale: "en",
        container_id: "tradingview_chart"
      });
    };
    document.body.appendChild(script);
  }, [symbol]);

  return <div id="tradingview_chart" />;
};

export default TradingViewChart;