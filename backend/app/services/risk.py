def adjust_risk_with_positions(score, positions):
    for pos in positions:
        leverage = pos.get("leverage", 1)

        if leverage > 3:
            score += 10
        if leverage > 5:
            score += 20

    return min(score, 100)


def analyze_liquidation_risk(positions):
    warnings = []

    for pos in positions:
        try:
            current = pos.get("current_price", 0)
            liq = pos.get("liquidation_price", 0)

            if current > 0 and liq > 0:
                distance = abs(current - liq) / current

                if distance < 0.1:
                    warnings.append("⚠️ Very close to liquidation (<10%)")
                elif distance < 0.2:
                    warnings.append("⚠️ Moderate liquidation risk (<20%)")

        except:
            continue

    return warnings


def enrich_positions_with_metrics(positions):
    enriched = []

    for pos in positions:
        try:
            entry = pos.get("entry_price", 0)
            current = pos.get("current_price", 0)
            liq = pos.get("liquidation_price", 0)

            # PnL %
            if entry > 0 and current > 0:
                pnl_percent = ((current - entry) / entry) * 100
            else:
                pnl_percent = 0

            # liquidation distance %
            if current > 0 and liq > 0:
                liq_distance = abs(current - liq) / current * 100
            else:
                liq_distance = 100

            # leverage approximation
            if liq_distance > 0:
                leverage = min(10, 100 / liq_distance)
            else:
                leverage = 10

            enriched.append({
                **pos,
                "pnl_percent": round(pnl_percent, 2),
                "liquidation_distance_percent": round(liq_distance, 2),
                "leverage": round(leverage, 2)
            })

        except:
            continue

    return enriched
def generate_actions(score, positions):
    actions = []

    if score > 70:
        actions.append("Reduce overall exposure to high-risk assets")

    for pos in positions:
        lev = pos.get("leverage", 1)
        liq_dist = pos.get("liquidation_distance_percent", 100)

        if lev > 5:
            actions.append(f"Reduce leverage on {pos['market']} position")

        if liq_dist < 10:
            actions.append(f"URGENT: Close or hedge {pos['market']} (near liquidation)")
        elif liq_dist < 20:
            actions.append(f"Consider reducing position size on {pos['market']}")

    if not actions:
        actions.append("Portfolio is well-balanced. No immediate action needed.")

    return list(set(actions))