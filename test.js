const data = {
    "Efendi Zebua": {},
    "Linda Telaum Banua": {}
};

const daysInMonth = 30; // Assuming 30 days in the month, you can adjust according to the actual month

for (const name in data) {
    data[name] = {};
    for (let i = 1; i <= 5; i++) {
        data[name][i] = {};
        for (let j = 1; j <= daysInMonth; j++) {
            const day = j < 10 ? `0${j}` : `${j}`;
            const formattedDate = `${day}-06-2024`;
            data[name][i][formattedDate] = {};
        }
    }
}

console.log(data);
