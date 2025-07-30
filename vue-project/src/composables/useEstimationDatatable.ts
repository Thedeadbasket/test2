import { ref } from 'vue';

export function useEstimationDatatable(colums, metric) {
    const customers = ref([]);
    const addEpic = () => {
        const newEpicGroup = {
            id: customers.value.length + 1,
            epicGroup: null,
            epic: null,
            story: null,
            task: null,
            track: null,
            estimate: null,
            resultingEstimate: null,
            override: null,
        };
        customers.value.push(newEpicGroup);
        sessionStorage.setItem('customers', JSON.stringify(customers.value));
    };
    function isEmptyRow(row) {
        return Object.entries(row).every(([key, value]) => {
            if (key === 'id') return true; // ID ignorieren
            return value === null || value === undefined || value === '';
        });
    }
    const loadTableData = () => {
        const gespeicherteDaten = sessionStorage.getItem('customers')
        if (gespeicherteDaten) {
            const parsed = JSON.parse(gespeicherteDaten)
            parsed.forEach((item, index) => {
                if (!item.id) {
                    item.id = index + 1
                }
            })
            customers.value = parsed
        } else {
            addEpic()
        }
    }
    return {
        customers,
        addEpic,
        loadTableData,
        isEmptyRow,

    }
}