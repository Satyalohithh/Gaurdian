import requests
from app.core.config import HELIUS_API_KEY

def get_wallet_tokens(wallet_address):
    url = f"https://mainnet.helius-rpc.com/?api-key={HELIUS_API_KEY}"

    payload = {
        "jsonrpc": "2.0",
        "id": "1",
        "method": "getAssetsByOwner",
        "params": {
            "ownerAddress": wallet_address,
            "page": 1,
            "limit": 100
        }
    }

    response = requests.post(url, json=payload)
    data = response.json()

    assets = data.get("result", {}).get("items", [])
    tokens = []

    for asset in assets:
        try:
            mint = asset.get("id")
            amount = asset.get("token_info", {}).get("balance", 0)

            if mint and amount:
                tokens.append({
                    "mint": mint,
                    "amount": amount
                })
        except:
            continue

    return tokens