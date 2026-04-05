'use strict';
 
// ── TABLA DE FERRADOS POR CONCELLO (m²) ──────────────────────────────────────
const FERRADO_TABLE = {
  // A Coruña
  'A Coruña': 444, 'Abegondo': 436, 'Aranga': 436, 'Arzúa': 536,
  'Ames': 639, 'Arteixo': 444, 'A Baña': 528, 'Bergondo': 436,
  'Betanzos': 436, 'Boimorto': 536, 'Boiro': 484, 'Cabana de Bergantiños': 524,
  'Cambre': 444, 'Carballo': 524, 'Carnota': 400, 'Cariño': 444,
  'Carral': 444, 'Cerceda': 639, 'Cedeira': 509, 'Cee': 436,
  'Cerdido': 509, 'Coristanco': 524, 'Corcubión': 424, 'Dumbría': 424,
  'Ferrol': 509, 'Fene': 548, 'Friol': 436, 'Irixoa': 436,
  'Laxe': 524, 'Lousame': 420, 'Malpica de Bergantiños': 524, 'Mañón': 548,
  'Mazaricos': 424, 'Melle': 436, 'Mera': 436, 'Miño': 548,
  'Moeche': 509, 'Monfero': 548, 'Mugardos': 548, 'Muros': 335,
  'Muxía': 424, 'Narón': 509, 'Neda': 509, 'Negreira': 528,
  'Noia': 420, 'Oleiros': 444, 'Ortigueira': 444, 'O Pino': 536,
  'Oza-Cesuras': 436, 'Paderne': 436, 'Padrón': 420, 'Ponteceso': 524,
  'Pontedeume': 548, 'Porto do Son': 480, 'Ribeira': 484, 'Rianxo': 484,
  'Rois': 424, 'San Sadurniño': 509, 'Santa Comba': 528, 'Sada': 436,
  'Santiago de Compostela': 639, 'Sobrado': 536, 'Teo': 639, 'Touro': 536,
  'Trazo': 640, 'Valdoviño': 509, 'Vedra': 639, 'Vilasantar': 536,
  'Vimianzo': 424, 'Zas': 424,
  // Lugo
  'Lugo': 436, 'Abadín': 504, 'Alfoz': 714, 'Antas de Ulla': 604,
  'Baleira': 714, 'Becerreá': 578, 'Begonte': 525, 'Bóveda': 489,
  'Castromaior': 525, 'Castro de Rei': 629, 'Cospeito': 525, 'Fonsagrada': 507,
  'Guntín': 436, 'Incio': 559, 'Láncara': 629, 'Lourenzá': 638,
  'Meira': 514, 'Mondoñedo': 612, 'Monforte de Lemos': 489, 'Monterroso': 604,
  'Muras': 548, 'Outeiro de Rei': 436, 'Pantón': 489, 'Paradela': 559,
  'Pastoriza': 504, 'Pedrafita do Cebreiro': 578, 'Pol': 496, 'Ribas de Sil': 465,
  'Rivadeo': 612, 'Rodeiro': 536, 'Samos': 559, 'Sarria': 629,
  'Sober': 484, 'Trabada': 638, 'Triacastela': 430, 'Valadouro': 714,
  'Viveiro': 548, 'Xermade': 525, 'Xove': 725,
  // Ourense
  'Ourense': 626, 'Allariz': 629, 'A Rúa': 629, 'Baños de Molgas': 629,
  'Barbadás': 629, 'Beade': 629, 'Bola': 629, 'Calvos de Randín': 629,
  'Carballeda de Avia': 629, 'Castrelo do Val': 629, 'Cualedro': 629,
  'Entrimo': 629, 'Esgos': 629, 'Larouco': 629, 'Laza': 629,
  'Leiro': 629, 'Lobeira': 629, 'Maceda': 629, 'Melón': 629,
  'Merza': 629, 'Montederramo': 629, 'Muíños': 629, 'Oímbra': 629,
  'O Bolo': 629, 'Os Blancos': 629, 'Petín': 629, 'Pobra de Trives': 629,
  // Pontevedra
  'Pontevedra': 629, 'Agolada': 536, 'As Neves': 629, 'As Pontes': 548,
  'A Estrada': 629, 'Barro': 629, 'Bueu': 472, 'Cambados': 629,
  'Campo Lameiro': 629, 'Cangas': 472, 'Cañiza': 437, 'Catoira': 629,
  'Cerdedo-Cotobade': 629, 'Coirós': 436, 'Cuntis': 629, 'Dozón': 536,
  'Fornelos de Montes': 74, 'Gondomar': 541, 'Grove': 629, 'Lalín': 536,
  'Mos': 497, 'Nigrán': 541, 'Pazos de Borbén': 74, 'Ponteareas': 437,
  'Ponte Caldelas': 629, 'Porriño': 497, 'Portas': 629, 'Poio': 629,
  'Redondela': 69, 'Ribadumia': 629, 'Salceda de Caselas': 629,
  'Salvaterra de Miño': 437, 'Sanxenxo': 629, 'Silleda': 536,
  'Soutomaior': 64, 'Tui': 497, 'Valga': 629, 'Vilaboa': 629,
  'Vilagarcía de Arousa': 545, 'Vigo': 541, 'Vila de Cruces': 629,
  'Vilanova de Arousa': 629,
};
 
const DEFAULT_CONCELLO = 'Abegondo';
const DEFAULT_FERRADO  = 436;
 
let currentFerrado  = DEFAULT_FERRADO;
let currentConcello = DEFAULT_CONCELLO;
 
// ── ESTADO ────────────────────────────────────────────────────────────────────
let isTracking = false, watchId = null, lastTimestamp = 0;
let coords = [], pathLine = null, polygonLayer = null;
 
// ── MAPA ──────────────────────────────────────────────────────────────────────
const map = L.map('map', { zoomControl: false }).setView([42.88, -8.54], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);
 
// ── NORMALIZACIÓN DE NOMBRES PARA COMPARACIÓN ─────────────────────────────────
function normalizeName(s) {
    return s.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // quitar acentos
            .replace(/[-]/g, ' ')                               // guión → espacio
            .replace(/[^a-z0-9\s]/g, '')                       // quitar símbolos
            .replace(/\s+/g, ' ')
            .trim();
}
 
function lookupFerrado(name) {
    if (!name) return null;
    const target = normalizeName(name);
    // 1ª pasada: coincidencia exacta normalizada
    for (const [key, val] of Object.entries(FERRADO_TABLE)) {
        if (normalizeName(key) === target) return { concello: key, ferrado: val };
    }
    // 2ª pasada: coincidencia parcial (por variaciones menores del nombre)
    for (const [key, val] of Object.entries(FERRADO_TABLE)) {
        const norm = normalizeName(key);
        if (norm.includes(target) || target.includes(norm)) {
            return { concello: key, ferrado: val };
        }
    }
    return null;
}
 
// ── GEOCODIFICACIÓN INVERSA (Nominatim / OpenStreetMap — gratuito) ─────────────
async function detectConcello(lat, lng) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&accept-language=gl,es`;
        const res  = await fetch(url);
        if (!res.ok) throw new Error('Nominatim error ' + res.status);
        const data = await res.json();
        const addr = data.address || {};
 
        // Probar varios campos en orden de especificidad
        const candidates = [
            addr.municipality,
            addr.town,
            addr.village,
            addr.city,
            addr.county,
        ].filter(Boolean);
 
        for (const name of candidates) {
            const found = lookupFerrado(name);
            if (found) return found;
        }
    } catch (e) {
        console.warn('Error geocodificación:', e);
    }
    // Fuera de tabla o error → por defecto Abegondo
    return { concello: DEFAULT_CONCELLO, ferrado: DEFAULT_FERRADO };
}
 
// ── MOSTRAR CONCELLO ACTIVO ───────────────────────────────────────────────────
function updateConcelloDisplay() {
    let el = document.getElementById('concello-info');
    if (!el) {
        // Crear elemento si no existe en el HTML
        el = document.createElement('div');
        el.id = 'concello-info';
        el.style.cssText = 'font-size:0.8rem;color:#555;text-align:center;padding:3px 0 1px';
        const areaDisplay = document.getElementById('area-display');
        if (areaDisplay) areaDisplay.insertAdjacentElement('afterend', el);
        else document.getElementById('stats').insertAdjacentElement('afterend', el);
    }
    el.textContent = `📍 ${currentConcello} · 1 ferrado = ${currentFerrado} m²`;
}
 
// ── GPS INICIAL: centrar mapa y detectar concello ─────────────────────────────
navigator.geolocation.getCurrentPosition(async pos => {
    const { latitude: lat, longitude: lng } = pos.coords;
    map.setView([lat, lng], 16);
    document.getElementById('status-text').textContent = "GPS Listo";
 
    const result = await detectConcello(lat, lng);
    currentConcello = result.concello;
    currentFerrado  = result.ferrado;
    updateConcelloDisplay();
}, null, { enableHighAccuracy: true });
 
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log(err));
}
 
// Mostrar concello por defecto hasta que llegue el GPS
updateConcelloDisplay();
 
// ── TRACKING ──────────────────────────────────────────────────────────────────
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
 
    const mode     = document.getElementById('modeSelect').value;
    const interval = (mode === 'veh' || mode === 'walk') ? 1000 : 5000;
 
    watchId = navigator.geolocation.watchPosition(
        (pos) => {
            const now = Date.now();
            if (now - lastTimestamp < interval) return;
 
            lastTimestamp = now;
            const p = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                alt: (pos.coords.altitude || 0) / 10,
                vel: pos.coords.speed    || 0,
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
        document.getElementById('val-fer').textContent = (areaM2 / currentFerrado).toFixed(2);
        updateConcelloDisplay();
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
 
// ── EXPORTACIÓN ───────────────────────────────────────────────────────────────
function download(blob, name) {
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = name;
    a.click();
}
 
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
 
document.getElementById('btnKML').addEventListener('click', () => {
    let kml = '<?xml version="1.0" encoding="UTF-8"?>'
            + '<kml xmlns="http://www.opengis.net/kml/2.2"><Document><Placemark>'
            + '<LineString><coordinates>\n';
    coords.forEach(p => { kml += `${p.lng},${p.lat},${p.alt.toFixed(1)}\n`; });
    kml += '</coordinates></LineString></Placemark></Document></kml>';
    download(new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' }), "track.kml");
});
 
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
 
// ── BOTÓN PRINCIPAL ───────────────────────────────────────────────────────────
document.getElementById('actionBtn').addEventListener('click', () => {
    isTracking ? stopTracking() : startTracking();
});