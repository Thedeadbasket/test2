export function TotalEstimateCalc(tracks) {
    const totalEstimate = {}
    const tracksraw = sessionStorage.getItem('tracksData');
    if (!tracksraw) return;
    const tracksdata = JSON.parse(tracksraw);

    tracks.forEach((track) => {
        if (track.track && track.riskbuffer) {
            const Riskbuffer = Number(track.riskbuffer) || 0;
            const Result = Number(track.resultingEstimate) || 0;
            const addins = Number(track.addins) || 0;

            if (!totalEstimate[track.track]) {
                totalEstimate[track.track] = 0;
            }

            const total = Result + Riskbuffer + addins;
            totalEstimate[track.track] = total; // += entfernt, da es nur einen Track pro Name gibt

            // Track in tracksdata finden und updaten
            const trackIndex = tracksdata.findIndex(t => t.track === track.track);
            if (trackIndex !== -1) {
                tracksdata[trackIndex].totalEstimate = totalEstimate[track.track];
            }
        }
    });

    // FEHLER BEHOBEN: sessionStorage nur EINMAL nach der Schleife speichern
    sessionStorage.setItem('tracksData', JSON.stringify(tracksdata));
    console.log('TotalEstimateCalc completed, tracks saved:', tracksdata.map(t => ({ track: t.track, totalEstimate: t.totalEstimate })));
}