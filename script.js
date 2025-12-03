// --- Şəhər və rayonlar ---
const cities = [
    { name: "Bakı", population: 2300000, coords: [40.409264, 49.867092] },
    { name: "Gəncə", population: 335000, coords: [40.687859, 46.37233] },
    { name: "Sumqayıt", population: 340000, coords: [40.589722, 49.668611] },
    { name: "Mingəçevir", population: 105000, coords: [40.7699, 47.0489] },
    { name: "Lənkəran", population: 52000, coords: [38.753611, 48.851111] },

    // ✔ Bu formatda yeni əlavə edə bilərsən (coords YOXDUR ↓)
    // { name: "Sabirabad", population: 110000 }
];
cities.push({
    name: "Sabirabad",
    population: 110000
});

// --- Xəritə yaradılması ---
const map = L.map("map").setView([40.3, 47.7], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "© OpenStreetMap qatları"
}).addTo(map);


// --- Əhali rəngi ---
function getColor(population) {
    if (population > 1000000) return "#b91c1c";
    if (population > 300000) return "#ea580c";
    return "#facc15";
}

// --- Radius (2x böyük) ---
function getRadius(population) {
    const base = 7;
    const scale = Math.sqrt(population) / 220;
    return (base + scale) * 2;
}


// --- 🔥 Koordinatları avtomatik alma funksiyası ---
async function fetchCoords(cityName) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${cityName}+Azerbaijan`;

    const response = await fetch(url, {
        headers: { "User-Agent": "CityMapApp/1.0" }
    });

    const data = await response.json();
    if (data.length === 0) return null;

    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}


// --- Şəhərlərin siyahısı üçün HTML elementi ---
const cityListEl = document.getElementById("city-list");


// --- 🔥 Şəhərləri xəritəyə əlavə edən əsas blok ---
cities.forEach(async city => {

    // 👉 Əgər koordinat YOXDURSA — avtomatik tap!
    if (!city.coords) {
        city.coords = await fetchCoords(city.name);

        if (!city.coords) {
            console.warn(city.name, "üçün koordinat tapılmadı!");
            return;
        }
    }

    // 👉 Marker əlavə et
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


    // 👉 Soldakı siyahıya əlavə et
    const li = document.createElement("li");

    li.innerHTML = `
        <span class="city-name">${city.name}</span>
        <span class="city-pop">${populationFormatted}</span>
    `;

    li.addEventListener("click", () => {
        map.setView(city.coords, 10);
        circle.openPopup();
    });

    cityListEl.appendChild(li);
});
