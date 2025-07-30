

export function AddinsCalc() {
    console.log("AddinsCalc");

    const trackraw = sessionStorage.getItem('tracksData');
    if (!trackraw) return;

    const trackData = JSON.parse(trackraw);
    const trackTotals = {};


    trackData.forEach((item) => {
        if (item.resultingEstimate && item.track) {
            const estimate = Number(item.resultingEstimate);
            const addins = estimate * 0.16;
            if (!trackTotals[item.track]) {
                trackTotals[item.track] = 0;
            }
            trackTotals[item.track] += addins;
        }
    });


    trackData.forEach((item) => {
        if (item.track && trackTotals[item.track]) {
            item.addins = trackTotals[item.track];
        }
    });

    sessionStorage.setItem('tracksData', JSON.stringify(trackData));
    console.log("Updated trackData:", trackData);
}