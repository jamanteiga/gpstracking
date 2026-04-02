'use strict';
 
const FERRADO_M2 = 436;
let isTracking = false, watchId = null, lastTimestamp = 0;
let coords = [], pathLine = null, polygonLayer = null;
 
// Mapa centrado en Galicia
const map = L.map('map', { zoomControl: false }).setView([42.88, -8.54], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);
 
// Centrar al usuario nada más abrir
navigator.geolocation.getCurrentPosition(pos => {
    map.setView([pos.coords.latitude, pos.coords.longitude], 16);
    document.getElementById('status-text').textContent = "GPS Listo";
}, null, { enableHighAccuracy: true });
 
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log(err));
}
 
function startTracking() {
    coords = [];
    if (pathLine)     map.removeLayer(pathLine);
    if (polygonLayer) map.removeLayer(polygonLayer);
 
    isTracking = true;
    document.getElementById('actionBtn').textContent         = "DETENER";
    document.getElementById('actionBtn').className           = "btn btn-stop";
    document.getElementById('exportContainer').style.display = "none";
    document.getElementById('area-display').style.display    = "none";
    document.getElementById('modeSelect').disabled           = true;
 
    const mode = document.getElementById('modeSelect').value;
 
    // FIX 1: modo 'walk' (a pie) -> 1 segundo, igual que vehículo.
    //         modos tractor -> 5 segundos.
    const interval = (mode === 'veh' || mode === 'walk') ? 1000 : 5000;
 
    watchId = navigator.geolocation.watchPosition(
        (pos) => {
            const now = Date.now();
            if (now - lastTimestamp < interval) return;
 
            lastTimestamp = now;
            const p = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                alt: pos.coords.altitude || 0,
                vel: pos.coords.speed    || 0,   // m/s (API estandar)
                ts:  now
            };
            coords.push(p);
            updateMap(mode, p);
            if (coords.length >= 3) calculateArea();
        },
        null,
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
}
 
function updateMap(mode, p) {
    const latlngs = coords.map(c => [c.lat, c.lng]);
 
    if (!pathLine) {
        pathLine = L.polyline(latlngs, { color: '#007bff', weight: 5 }).addTo(map);
    } else {
        pathLine.setLatLngs(latlngs);
    }
 
    if (mode.includes('_a') || mode === 'walk') {
        if (!polygonLayer) {
            polygonLayer = L.polygon(latlngs, { color: '#28a745', fillOpacity: 0.3 }).addTo(map);
        } else {
            polygonLayer.setLatLngs(latlngs);
        }
    }
 
    map.setView([p.lat, p.lng], 18);
    document.getElementById('status-text').textContent = `Puntos: ${coords.length}`;
}
 
function calculateArea() {
    try {
        const turfCoords = coords.map(c => [c.lng, c.lat]);
        turfCoords.push(turfCoords[0]);
        const polygon = turf.polygon([turfCoords]);
        const areaM2  = turf.area(polygon);
 
        document.getElementById('area-display').style.display  = "block";
        document.getElementById('val-ha').textContent  = (areaM2 / 10000).toFixed(3);
        document.getElementById('val-fer').textContent = (areaM2 / FERRADO_M2).toFixed(2);
    } catch (e) { console.error("Error calculo area", e); }
}
 
function stopTracking() {
    isTracking = false;
    if (watchId) navigator.geolocation.clearWatch(watchId);
    document.getElementById('actionBtn').textContent = "INICIAR RASTREO";
    document.getElementById('actionBtn').className   = "btn btn-start";
    document.getElementById('modeSelect').disabled   = false;
    if (coords.length > 0)
        document.getElementById('exportContainer').style.display = "flex";
}
 
function download(blob, name) {
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = name;
    a.click();
}
 
// -- CSV ----------------------------------------------------------------------
// FIX 2: formato CSV europeo: separador de columna ";" y decimal ","
//         Esto evita que Excel en español confunda el separador decimal con
//         el separador de columna (bug que convertia 5,2 km/h en 52 km/h).
//         BOM \uFEFF para que Excel detecte UTF-8 correctamente.
document.getElementById('btnCSV').addEventListener('click', () => {
    const BOM = '\uFEFF';
    let csv = BOM + "Lat;Lng;Alt(m);Km/h;Hora\n";
    coords.forEach(p => {
        const time   = new Date(p.ts).toLocaleTimeString('es-ES');
        const lat    = p.lat.toFixed(6).replace('.', ',');
        const lng    = p.lng.toFixed(6).replace('.', ',');
        const alt    = p.alt.toFixed(1).replace('.', ',');
        const velKmh = (p.vel * 3.6).toFixed(1).replace('.', ',');
        csv += `${lat};${lng};${alt};${velKmh};${time}\n`;
    });
    download(new Blob([csv], { type: 'text/csv;charset=utf-8' }), "track.csv");
});
 
// -- KML ----------------------------------------------------------------------
document.getElementById('btnKML').addEventListener('click', () => {
    let kml = '<?xml version="1.0" encoding="UTF-8"?>'
            + '<kml xmlns="http://www.opengis.net/kml/2.2"><Document><Placemark>'
            + '<LineString><coordinates>\n';
    coords.forEach(p => { kml += `${p.lng},${p.lat},${p.alt.toFixed(1)}\n`; });
    kml += '</coordinates></LineString></Placemark></Document></kml>';
    download(new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' }), "track.kml");
});
 
// -- COMPARTIR ----------------------------------------------------------------
const btnShare = document.getElementById('btnShare');
if (btnShare) {
    btnShare.addEventListener('click', async () => {
        const BOM = '\uFEFF';
        let csv = BOM + "Lat;Lng;Alt(m);Km/h;Hora\n";
        coords.forEach(p => {
            const time   = new Date(p.ts).toLocaleTimeString('es-ES');
            const lat    = p.lat.toFixed(6).replace('.', ',');
            const lng    = p.lng.toFixed(6).replace('.', ',');
            const alt    = p.alt.toFixed(1).replace('.', ',');
            const velKmh = (p.vel * 3.6).toFixed(1).replace('.', ',');
            csv += `${lat};${lng};${alt};${velKmh};${time}\n`;
        });
 
        let kml = '<?xml version="1.0" encoding="UTF-8"?>'
                + '<kml xmlns="http://www.opengis.net/kml/2.2"><Document><Placemark>'
                + '<LineString><coordinates>\n';
        coords.forEach(p => { kml += `${p.lng},${p.lat},${p.alt.toFixed(1)}\n`; });
        kml += '</coordinates></LineString></Placemark></Document></kml>';
 
        const csvFile = new File([csv], 'track.csv', { type: 'text/csv' });
        const kmlFile = new File([kml], 'track.kml', { type: 'application/vnd.google-earth.kml+xml' });
 
        if (navigator.canShare && navigator.canShare({ files: [csvFile, kmlFile] })) {
            try {
                await navigator.share({ files: [csvFile, kmlFile], title: 'GPS Track' });
            } catch (e) { if (e.name !== 'AbortError') console.warn(e); }
        } else {
            download(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'track.csv');
            download(new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' }), 'track.kml');
        }
    });
}
 
// -- BOTON PRINCIPAL ----------------------------------------------------------
document.getElementById('actionBtn').addEventListener('click', () => {
    isTracking ? stopTracking() : startTracking();
});