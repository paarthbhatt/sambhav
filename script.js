document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "http://api.thingspeak.com/update?api_key=QWDBCMUXA2DWC524&field1=";
    const channelId = "2699351";

    const voltageData = [];
    const timeLabels = [];

    fetchData();

    function fetchData() {
        fetch(`https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=20`)
            .then(response => response.json())
            .then(data => {
                displayData(data.feeds[0]);
                updateChart(data.feeds);
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    function displayData(data) {
        const batteryDataContainer = document.getElementById("battery-data");
        batteryDataContainer.innerHTML = `
            <p><strong>Battery Voltage:</strong> ${data.field1} V</p>
            <p><strong>Temperature:</strong> ${data.field2} °C</p>
            <p><strong>Current:</strong> ${data.field3} A</p>
            <p><strong>Timestamp:</strong> ${new Date(data.created_at).toLocaleString()}</p>
        `;
    }

    function updateChart(feeds) {
        feeds.forEach(feed => {
            voltageData.push(feed.field1);  // Voltage data
            timeLabels.push(new Date(feed.created_at).toLocaleTimeString());
        });

        const ctx = document.getElementById("voltageChart").getContext("2d");
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Battery Voltage (V)',
                    data: voltageData,
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.3)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true, labels: { color: "#ffffff" } }
                },
                scales: {
                    x: { title: { display: true, text: "Time", color: "#ffffff" } },
                    y: { title: { display: true, text: "Voltage (V)", color: "#ffffff" } }
                }
            }
        });
    }
});
