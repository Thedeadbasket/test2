export function EstimationCalc(customers) {
    const customersraw = sessionStorage.getItem('customers');
    if (!customersraw) return;

    const customerData = JSON.parse(customersraw);
    const customerEstimation = {}
    const tracksraw = sessionStorage.getItem('tracksData');
    if (!tracksraw) return;
    const tracksdata = JSON.parse(tracksraw);

    customers.forEach((estimation) => {
        if (estimation.track && estimation.resultingEstimate) {
            const result = Number(estimation.resultingEstimate);

            if (!customerEstimation[estimation.track]) {
                customerEstimation[estimation.track] = 0;
            }
            customerEstimation[estimation.track] += result;
        }
    })

    // FEHLER BEHOBEN: sessionStorage nur EINMAL nach der Schleife speichern
    tracksdata.forEach((track) => {
        if (customerEstimation[track.track]) {
            track.resultingEstimate = customerEstimation[track.track];
        }
    });

    // Speichere ALLE Tracks zusammen, nicht einzeln in der Schleife
    sessionStorage.setItem('tracksData', JSON.stringify(tracksdata));
    console.log('EstimationCalc completed, tracks saved:', tracksdata);
}