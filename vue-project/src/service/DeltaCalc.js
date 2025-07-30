export function DeltaCalc() {
    const times = sessionStorage.getItem('tracksData');
    if (!times) return;

    const resultTime = {}
    const time = JSON.parse(times);

    // Calculate total planned time for each track (weeks * 5 days)
    time.forEach((item) => {
        if (item.kw && item.track) {
            if (!resultTime[item.track]) {
                resultTime[item.track] = 0;
            }
            //console.log(item);
            item.kw.forEach(kw => {
                const number = Number(kw.value);
                resultTime[item.track] += number * 5;
            });
            //console.log(resultTime);
        }
    });

    // Set planned time for each item
    time.forEach((item) => {
        if (item.track && resultTime[item.track]) {
            item.plannedTime = resultTime[item.track];
        }
    });

    // Calculate delta (difference between resulting estimate and planned time)
    time.forEach((item) => {
        if (item.resultingEstimate && item.track && resultTime[item.track]) {
            const resultingNumber = Number(item.resultingEstimate);
            const plannedNumber = Number(resultTime[item.track]);
            item.delta = resultingNumber - plannedNumber;
            //console.log(`Track ${item.track}: Delta = ${item.delta}`);
        }
    });

    // Save updated data back to sessionStorage
    sessionStorage.setItem('tracksData', JSON.stringify(time));
    console.log("Updated trackData:", time);
}