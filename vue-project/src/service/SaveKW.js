export function SaveKW(tracks) {
    try {
        const stored = sessionStorage.getItem('schedule');
        const loaded = stored ? JSON.parse(stored) : {};

        const tracksraw = sessionStorage.getItem('tracksData');
        const trackData = tracksraw ? JSON.parse(tracksraw) : [];

        tracks.forEach((track) => {
            if (track.track && loaded[track.track]) {
                const kwArray = [];
                Object.entries(loaded[track.track]).forEach(([period, value]) => {
                    kwArray.push({
                        period: period,
                        value: Number(value) || 0
                    });
                });

                const trackIndex = trackData.findIndex(t => t.track === track.track);

                if (trackIndex !== -1) {
                    trackData[trackIndex].kw = kwArray;
                } else {
                    trackData.push({
                        track: track.track,
                        color: track.color || '',
                        riskbuffer: track.riskbuffer || '',
                        resultingEstimate: track.resultingEstimate || '',
                        totalEstimate: track.totalEstimate || '',
                        kw: kwArray
                    });
                }


                track.kw = kwArray;

                //console.log(`Track ${track.track} - KW Array:`, kwArray);
            }
        });


        sessionStorage.setItem('tracksData', JSON.stringify(trackData));
        console.log('Updated trackData:', trackData);

    } catch (error) {
        console.error('Error in SaveKW:', error);
    }
}