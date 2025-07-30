import axios from 'axios';

export async function PatchData() {
    const saveId = localStorage.getItem('saveId');
    console.log('SaveId:', saveId);

    if (saveId !== 'LOCALSAVE') {
        try {
            const customers = JSON.parse(sessionStorage.getItem('customers') || '[]');
            const tracksDataRaw = sessionStorage.getItem('tracksData');
            const tracksData = tracksDataRaw ? JSON.parse(tracksDataRaw) : { tracks: [] };
            const risks = JSON.parse(sessionStorage.getItem('risks') || '[]');
            const metrics = JSON.parse(sessionStorage.getItem('metricsData') || '[]');
            const schedule = JSON.parse(sessionStorage.getItem('schedule') || '[]');

            if (!saveId) {
                throw new Error('saveId ist erforderlich');
            }

            // Hier bauen wir den Request-Body zusammen
            const requestBody = {
                fileName: saveId,
                estimation: customers.map(c => ({
                    epicGroup: c.epicGroup,
                    epic: c.epic,
                    story: c.story,
                    task: c.task,
                    track: c.track,
                    estimate: c.estimate,
                    resultingEstimate: c.resultingEstimate,
                    override: c.override
                })),
                risks: risks.map(r => ({
                    objectiveRisk: r.objectiveRisk,
                    impactInDays: r.impactInDays,
                    likelihoodInPercent: r.likelihoodInPercent,
                    teamMultiplier: r.teamMultiplier,
                    riskbuffer: r.riskbuffer,
                    affectedTrack: r.affectedTrack
                })),
                metric: metrics.map(m => ({
                    metrics: m.metrics,
                    times: m.times,
                })),
                tracks: tracksData.map(t => ({
                    track: t.track,
                    color: t.color,
                    riskbuffer: t.riskbuffer,
                    resultingEstimate: t.resultingEstimate,
                    totalEstimate: t.totalEstimate,
                    addins: t.addins,
                    delta: t.delta,
                    plannedTime: t.plannedTime,
                    kw: t.kw || [] // Füge das kw Array hinzu, falls vorhanden
                }))
            };

            console.log('Request Body:', requestBody);

            const response = await axios.patch(`http://localhost:3010/data/${saveId}`, requestBody);

            console.log('Daten erfolgreich gespeichert:', response.data);
        } catch (error) {
            console.error('Fehler beim Speichern:', error.response?.data || error.message);
        }
    } else {
        console.log('WILL NOT PATCH LOCALSAVE');
    }
}
