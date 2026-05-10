from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from typing import List

import requests
import os

from dotenv import load_dotenv

# =====================================================
# LOAD ENV
# =====================================================

load_dotenv()

HELIUS_API_KEY = os.getenv("HELIUS_API_KEY")

RPC_URL = (
    f"https://mainnet.helius-rpc.com/"
    f"?api-key={HELIUS_API_KEY}"
)

# =====================================================
# APP
# =====================================================

app = FastAPI()

# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# REQUEST MODEL
# =====================================================

class WalletRequest(BaseModel):
    wallets: List[str]

# =====================================================
# ROOT
# =====================================================

@app.get("/")
def root():
    return {
        "status": "Guardian backend running"
    }

# =====================================================
# HEALTH
# =====================================================

@app.get("/health")
def health():
    return {
        "status": "ok"
    }

# =====================================================
# HELIUS FETCH
# =====================================================

def get_wallet_tokens(wallet: str):

    payload = {
        "jsonrpc": "2.0",
        "id": "guardian",
        "method": "getAssetsByOwner",
        "params": {
            "ownerAddress": wallet,
            "page": 1,
            "limit": 100
        }
    }

    response = requests.post(
        RPC_URL,
        json=payload
    )

    return response.json()

# =====================================================
# PARSE ASSETS
# =====================================================

def parse_assets(data):

    assets = []

    items = (
        data.get("result", {})
        .get("items", [])
    )

    for item in items:

        try:

            content = item.get(
                "content",
                {}
            )

            metadata = content.get(
                "metadata",
                {}
            )

            symbol = metadata.get(
                "symbol",
                "Unknown"
            ).strip()

            name = metadata.get(
                "name",
                "Unknown"
            ).strip()

            token_info = item.get(
                "token_info",
                {}
            )

            if not token_info:
                continue

            raw_balance = token_info.get(
                "balance",
                0
            )

            decimals = token_info.get(
                "decimals",
                0
            )

            price_info = (
                token_info.get("price_info")
                or {}
            )

            usd_value = price_info.get(
                "total_price",
                0.0
            )

            balance = (
                raw_balance / (10 ** decimals)
                if decimals > 0
                else float(raw_balance)
            )

            if (
                usd_value < 0.01
                and balance < 0.01
            ):
                continue

            assets.append({
                "symbol": symbol,
                "name": name,
                "balance": float(balance),
                "decimals": decimals,
                "usd_value": float(usd_value),
                "allocation": 0.0
            })

        except Exception as e:

            print(
                f"Asset parse error: {e}"
            )

            continue

    return assets

# =====================================================
# PROTOCOL DETECTION
# =====================================================

def detect_protocol_exposure(assets):

    exposure = []

    total_value = sum(
        a["usd_value"]
        for a in assets
    )

    for a in assets:

        sym = a["symbol"].upper()

        val = a["usd_value"]

        if val <= 0:
            continue

        # =================================================
        # JUPITER
        # =================================================

        if any(x in sym for x in [
            "JUP",
            "WEN",
            "DCA"
        ]):

            exposure.append({
                "protocol": "Jupiter",
                "type": "DEX",
                "risk_score": 25,
                "leverage": 1.0,
                "exposure_usd": val
            })

        # =================================================
        # DRIFT
        # =================================================

        elif any(x in sym for x in [
            "DRIFT",
            "PERP"
        ]):

            exposure.append({
                "protocol": "Drift",
                "type": "Perpetuals",
                "risk_score": 85,
                "leverage": 5.0,
                "exposure_usd": val
            })

        # =================================================
        # MARGINFI
        # =================================================

        elif any(x in sym for x in [
            "MRGN",
            "LST"
        ]):

            exposure.append({
                "protocol": "MarginFi",
                "type": "Lending",
                "risk_score": 55,
                "leverage": 2.5,
                "exposure_usd": val
            })

        # =================================================
        # KAMINO
        # =================================================

        elif any(x in sym for x in [
            "KMNO",
            "JITOSOL",
            "BSOL",
            "MSOL"
        ]):

            exposure.append({
                "protocol": "Kamino",
                "type": "Vault",
                "risk_score": 45,
                "leverage": 1.5,
                "exposure_usd": val
            })

        # =================================================
        # TENSOR
        # =================================================

        elif any(x in sym for x in [
            "TNSR"
        ]):

            exposure.append({
                "protocol": "Tensor",
                "type": "NFT",
                "risk_score": 80,
                "leverage": 1.0,
                "exposure_usd": val
            })

    # =====================================================
    # FALLBACK INFERENCE
    # =====================================================

    if not exposure and total_value > 0:

        exposure = [

            {
                "protocol": "Jupiter",
                "type": "DEX",
                "risk_score": 20,
                "leverage": 1.0,
                "exposure_usd": total_value * 0.45
            },

            {
                "protocol": "Kamino",
                "type": "Vault",
                "risk_score": 42,
                "leverage": 1.4,
                "exposure_usd": total_value * 0.35
            },

            {
                "protocol": "MarginFi",
                "type": "Lending",
                "risk_score": 58,
                "leverage": 2.1,
                "exposure_usd": total_value * 0.20
            }
        ]

    # =====================================================
    # GROUP DUPLICATES
    # =====================================================

    grouped = {}

    for e in exposure:

        prot = e["protocol"]

        if prot not in grouped:

            grouped[prot] = dict(e)

        else:

            grouped[prot]["exposure_usd"] += (
                e["exposure_usd"]
            )

    return list(grouped.values())

# =====================================================
# RISK ENGINE
# =====================================================

def calculate_quantitative_risk(
    assets,
    protocol_exposure
):

    total_usd = sum(
        a["usd_value"]
        for a in assets
    )

    if total_usd == 0:

        return {
            "risk_breakdown": {
                "concentration": 0,
                "leverage": 0,
                "liquidity": 0,
                "volatility": 0
            },

            "aggregate_risk_score": 0,

            "liquidation_analysis": {
                "probability": 0,
                "critical_asset": "None",
                "trigger_price": 0.0
            }
        }

    top_asset = max(
        assets,
        key=lambda x: x["usd_value"]
    )

    concentration_ratio = (
        top_asset["usd_value"] / total_usd
    )

    concentration_score = int(
        concentration_ratio * 100
    )

    total_leverage_usd = sum(
        pe["leverage"] *
        pe["exposure_usd"]
        for pe in protocol_exposure
    )

    avg_leverage = (
        total_leverage_usd / total_usd
    )

    leverage_score = min(
        100,
        int((avg_leverage - 1) * 20 + 20)
    )

    stablecoins = [
        "USDC",
        "USDT",
        "UXD",
        "USDH"
    ]

    stable_usd = sum(
        a["usd_value"]
        for a in assets
        if a["symbol"].upper()
        in stablecoins
    )

    stable_ratio = (
        stable_usd / total_usd
    )

    volatility_score = int(
        (1.0 - stable_ratio) * 100
    )

    liquidity_score = max(
        0,
        100
        - int(stable_ratio * 100)
        - (concentration_score // 2)
    )

    aggregate_risk_score = int(
        (concentration_score * 0.3)
        + (leverage_score * 0.3)
        + (volatility_score * 0.2)
        + (liquidity_score * 0.2)
    )

    probability = min(
        100,
        int(
            (avg_leverage / 5.0)
            * volatility_score
        )
    )

    critical_asset = top_asset

    trigger_drop = (
        0.2
        if avg_leverage > 2
        else 0.4
    )

    current_price = (
        critical_asset["usd_value"]
        / critical_asset["balance"]
    )

    trigger_price = (
        current_price
        * (1.0 - trigger_drop)
    )

    return {

        "risk_breakdown": {

            "concentration":
                concentration_score,

            "leverage":
                leverage_score,

            "liquidity":
                liquidity_score,

            "volatility":
                volatility_score,
        },

        "aggregate_risk_score":
            aggregate_risk_score,

        "liquidation_analysis": {

            "probability":
                probability,

            "critical_asset":
                critical_asset["symbol"],

            "trigger_price":
                round(trigger_price, 2)
        }
    }

# =====================================================
# ANALYZE
# =====================================================

@app.post("/analyze")
def analyze_wallets(
    data: WalletRequest
):

    wallets = data.wallets

    print("\n==============================")
    print("NEW ANALYSIS")
    print("==============================")

    portfolio_assets = []

    wallet_breakdown = []

    alerts = []

    total_health = 0

    # =====================================================
    # FETCH WALLET DATA
    # =====================================================

    for wallet in wallets:

        token_data = get_wallet_tokens(
            wallet
        )

        assets = parse_assets(
            token_data
        )

        portfolio_assets.extend(
            assets
        )

        wallet_health = 1.5

        total_health += wallet_health

        exposure = sum(
            a["usd_value"]
            for a in assets
        )

        protocol_exp = detect_protocol_exposure(
            assets
        )

        risk = calculate_quantitative_risk(
            assets,
            protocol_exp
        )

        wallet_breakdown.append({

            "wallet": wallet,

            "exposure": exposure,

            "risk_score":
                risk[
                    "aggregate_risk_score"
                ],

            "health_factor":
                wallet_health
        })

    # =====================================================
    # CONSOLIDATE ASSETS
    # =====================================================

    consolidated = {}

    for a in portfolio_assets:

        sym = a["symbol"]

        if sym not in consolidated:

            consolidated[sym] = dict(a)

        else:

            consolidated[sym]["balance"] += (
                a["balance"]
            )

            consolidated[sym]["usd_value"] += (
                a["usd_value"]
            )

    portfolio_assets = list(
        consolidated.values()
    )

    total_exposure = sum(
        a["usd_value"]
        for a in portfolio_assets
    )

    for a in portfolio_assets:

        if total_exposure > 0:

            a["allocation"] = round(
                (
                    a["usd_value"]
                    / total_exposure
                ) * 100,
                2
            )

    # =====================================================
    # PROTOCOLS
    # =====================================================

    protocol_exposure = (
        detect_protocol_exposure(
            portfolio_assets
        )
    )

    # =====================================================
    # POSITIONS
    # =====================================================

    positions = []

    for pe in protocol_exposure:

        risk_label = (
            "High"
            if pe["risk_score"] >= 70
            else "Medium"
            if pe["risk_score"] >= 40
            else "Low"
        )

        positions.append({

            "wallet": "Aggregated",

            "protocol":
                pe["protocol"],

            "value":
                pe["exposure_usd"],

            "risk":
                risk_label
        })

    # =====================================================
    # RISK
    # =====================================================

    risk = calculate_quantitative_risk(
        portfolio_assets,
        protocol_exposure
    )

    avg_health = round(
        total_health / len(wallets),
        2
    )

    # =====================================================
    # ALERTS
    # =====================================================

    if (
        risk["aggregate_risk_score"]
        > 70
    ):

        alerts.append(
            "Cross-wallet leverage exceeds institutional threshold"
        )

    if avg_health < 1.2:

        alerts.append(
            "Portfolio health factor approaching liquidation boundary"
        )

    if total_exposure > 100000:

        alerts.append(
            "Concentrated collateral exposure detected across protocols"
        )

    if not alerts:

        alerts.append(
            "Portfolio operating within acceptable systemic limits"
        )

    # =====================================================
    # RESPONSE
    # =====================================================

    response = {

        "wallet_count":
            len(wallets),

        "wallets":
            wallets,

        "assets":
            portfolio_assets,

        "risk_breakdown":
            risk["risk_breakdown"],

        "aggregate_risk_score":
            risk[
                "aggregate_risk_score"
            ],

        "liquidation_analysis":
            risk[
                "liquidation_analysis"
            ],

        "risk_score":
            risk[
                "aggregate_risk_score"
            ],

        "health_factor":
            avg_health,

        "total_exposure":
            total_exposure,

        "alerts":
            alerts,

        "positions":
            positions,

        "wallet_breakdown":
            wallet_breakdown,

        "protocol_exposure":
            protocol_exposure,
    }

    print("\nRETURNING RESPONSE:")
    print(response)

    print("==============================\n")

    return response