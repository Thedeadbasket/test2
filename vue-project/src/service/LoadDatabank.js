
import axios from 'axios';




export async function saveAllData(saveId) {
    try {

        const response = await axios.get(`http://localhost:3010/data/${saveId.value}`);

        console.log('Daten erfolgreich geladen:', response.data);
        localStorage.setItem('saveId', saveId.value);
        const data = response.data;


        if (data.estimation && data.tracks && data.risks && data.metric) {

            sessionStorage.setItem('customers', JSON.stringify(data.estimation));
            sessionStorage.setItem('tracksData', JSON.stringify(data.tracks));
            sessionStorage.setItem('risks', JSON.stringify(data.risks));
            sessionStorage.setItem('metricsData', JSON.stringify(data.metric));


        }
    } catch (error) {
        console.error('Fehler beim Laden:', error.response?.data || error.message);

    }

}