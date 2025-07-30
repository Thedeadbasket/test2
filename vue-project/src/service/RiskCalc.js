export function RiskCalc(risks) {
    risks.forEach(risk => {
        const impact = Number(risk.impactInDays) || 0;
        const likelihoodStr = risk.likelihoodInPercent || '0';
        const likelihood = Number(String(likelihoodStr).replace('%', '')) || 0;
        const multiplier = Number(risk.teamMultiplier) || 1;

        if (likelihood > 0) {
            const bufferRaw = impact * (likelihood / 100) * multiplier;
            risk.riskbuffer = Math.round(bufferRaw * 10) / 10;
        } else {
            risk.riskbuffer = 0;
        }
    });


    updateTracksDataWithRiskBuffer(risks);

    return risks;
}

function updateTracksDataWithRiskBuffer(risks) {
    try {

        const tracksDataRaw = sessionStorage.getItem('tracksData');
        if (!tracksDataRaw) return;

        const tracksData = JSON.parse(tracksDataRaw);


        const trackRiskBuffers = {};

        risks.forEach(risk => {
            if (risk.track && risk.riskbuffer) {
                if (!trackRiskBuffers[risk.track]) {
                    trackRiskBuffers[risk.track] = 0;
                }
                trackRiskBuffers[risk.track] += risk.riskbuffer;
            }
        });


        tracksData.forEach(track => {
            if (trackRiskBuffers[track.track]) {
                track.riskbuffer = Math.round(trackRiskBuffers[track.track] * 10) / 10;
            } else {

                track.riskbuffer = 0;
            }
        });

        // Save updated tracksData back to sessionStorage
        sessionStorage.setItem('tracksData', JSON.stringify(tracksData));

        console.log('TracksData updated with riskbuffer values:', tracksData);

    } catch (error) {
        console.error('Error updating tracksData with riskbuffer:', error);
    }
}

