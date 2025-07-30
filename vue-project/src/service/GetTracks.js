export function getTracks() {
    const TrackData = sessionStorage.getItem('tracksData');
    if (TrackData) {
        return JSON.parse(TrackData).map(t => ({
            track: t.track,
            color: t.color,
            riskbuffer: t.riskbuffer
        }));
    }
    return [];
}


