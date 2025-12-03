const cities = [
    { name: "Bakı", population: 2300000, coords: [40.409264, 49.867092] },
    { name: "Gəncə", population: 335000, coords: [40.687859, 46.37233] },
    { name: "Sumqayıt", population: 340000, coords: [40.589722, 49.668611] },
    { name: "Mingəçevir", population: 105000, coords: [40.7699, 47.0489] },
    { name: "Lənkəran", population: 52000, coords: [38.753611, 48.851111] },
    { name: "Şirvan", population: 85000, coords: [39.9469, 48.9200] },
    { name: "Naxçıvan", population: 94000, coords: [39.208889, 45.412222] },
    { name: "Şəki", population: 68000, coords: [41.1919, 47.1706] },
    { name: "Quba", population: 38000, coords: [41.3626, 48.5250] },
    { name: "Qusar", population: 17000, coords: [41.4275, 48.4302] },
    { name: "Xaçmaz", population: 66000, coords: [41.4630, 48.8091] },
    { name: "Ağcabədi", population: 135000, coords: [40.0528, 47.4594] },
    { name: "Ağdam", population: 40000, coords: [40.0336, 46.8364] },
    { name: "Zaqatala", population: 31000, coords: [41.6338, 46.6431] },
    { name: "Balakən", population: 10000, coords: [41.7250, 46.4089] },
    { name: "Masallı", population: 93000, coords: [39.0341, 48.6650] },
    { name: "Cəlilabad", population: 113000, coords: [39.2091, 48.4919] },
    { name: "Salyan", population: 39000, coords: [39.5964, 48.9840] },
    { name: "Qazax", population: 22000, coords: [41.0922, 45.3650] },
    { name: "Tovuz", population: 170000, coords: [40.9922, 45.6286] }
];

const map = L.map("map").setView([40.3, 47.7], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "© OpenStreetMap qatları"
}).addTo(map);

function getColor(population) {
    if (population > 1000000) return "#b91c1c";   // yüksək əhali
    if (population > 300000) return "#ea580c";   // orta əhali
    return "#facc15";                            // az əhali
}

function getRadius(population) {
    const base = 7;
    const scale = Math.sqrt(population) / 220;

    return (base + scale) * 2;   // ← 2 dəfə böyüdülmüş radius
}

const cityListEl = document.getElementById("city-list");

cities.forEach(city => {
    const circle = L.circleMarker(city.coords, {
        radius: getRadius(city.population),
        fillColor: getColor(city.population),
        color: "#111827",
        weight: 1,
        fillOpacity: 0.75
    }).addTo(map);

    const populationFormatted = city.population.toLocaleString("az-Latn-AZ");

    circle.bindPopup(
        `<strong>${city.name}</strong><br>Əhali: ${populationFormatted} nəfər`
    );

    const li = document.createElement("li");
    const nameSpan = document.createElement("span");
    const popSpan = document.createElement("span");

    nameSpan.className = "city-name";
    popSpan.className = "city-pop";

    nameSpan.textContent = city.name;
    popSpan.textContent = populationFormatted;

    li.appendChild(nameSpan);
    li.appendChild(popSpan);

    li.addEventListener("click", () => {
        map.setView(city.coords, 10);
        circle.openPopup();
    });

    cityListEl.appendChild(li);
});
