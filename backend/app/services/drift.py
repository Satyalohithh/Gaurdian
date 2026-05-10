import asyncio
from solana.rpc.async_api import AsyncClient
from driftpy.drift_client import DriftClient
from driftpy.types import PositionDirection
from anchorpy import Wallet
from solders.keypair import Keypair

RPC_URL = "https://api.mainnet-beta.solana.com"


async def _fetch_positions(wallet_address: str):
    client = AsyncClient(RPC_URL)

    # dummy wallet just to init client
    dummy_wallet = Wallet(Keypair())
    drift_client = DriftClient(client, dummy_wallet)

    await drift_client.subscribe()

    # load user
    user = await drift_client.get_user_account_public_key(wallet_address)
    drift_user = await drift_client.get_user(user)

    positions = []

    for pos in drift_user.get_user_account().perp_positions:
        if pos.base_asset_amount != 0:
            side = "long" if pos.base_asset_amount > 0 else "short"

            positions.append({
                "market": str(pos.market_index),
                "side": side,
                "size": abs(pos.base_asset_amount) / 1e9,

                # normalize prices (Drift uses big ints)
                "entry_price": pos.quote_entry_amount / 1e6,
                "current_price": pos.quote_break_even_amount / 1e6,
                "liquidation_price": pos.liquidation_price / 1e6
            })

    await client.close()
    return positions


def get_drift_positions(wallet_address):
    try:
        return asyncio.run(_fetch_positions(wallet_address))
    except:
        return []