// netlify/functions/prices.js
exports.handler = async function(event, context) {
    try {
        const apiKey = process.env.COINGECKO_API_KEY;
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,dogecoin&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h`, {
            headers: {
                'x-cg-demo-api-key': apiKey,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `CoinGecko API error: ${response.status}` })
            };
        }

        const data = await response.json();
        const formattedData = data.map(coin => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            price: coin.current_price,
            change24h: coin.price_change_percentage_24h,
            image: coin.image
        }));

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(formattedData)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed fetching prices" })
        };
    }
};
