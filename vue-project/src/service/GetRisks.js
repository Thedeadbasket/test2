export function getRisks() {
    const RiskData = sessionStorage.getItem('risks');
    if (RiskData) {
        return JSON.parse(RiskData).map(r => ({
            objectiveRisk: r.objectiveRisk,
            impactInDays: r.impactInDays,
            likelihoodInPercent: r.likelihoodInPercent,
            teamMultiplier: r.teamMultiplier,
            riskbuffer: r.riskbuffer,
            affectedTrack: r.affectedTrack,
        }));
    }
    return [];
}


