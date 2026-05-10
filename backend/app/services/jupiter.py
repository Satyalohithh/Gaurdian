import requests

def get_token_price_jupiter(mint):
    try:
        url = f"https://price.jup.ag/v4/price?ids={mint}"
        response = requests.get(url)
        data = response.json()

        return data["data"][mint]["price"]
    except:
        return 0