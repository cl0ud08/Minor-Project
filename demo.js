// Initialize the map
const map = L.map('map', {
    center: [28.6139, 77.2090], // Center on Delhi
    zoom: 11,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    dragging: true,
    touchZoom: true,
    zoomControl: true
});

    // Add the CartoDB Dark Matter tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);


const routeLayer = L.layerGroup().addTo(map);
const markers = [];

// Locations based on routes with improved coordinates
const locations = {
    'Delhi': [28.6139, 77.2090],
    'Connaught Place': [28.6271, 77.2080],
    'Rajiv Chowk': [28.6290, 77.2110],
    'Karol Bagh': [28.6530, 77.2110],
    'Ghaziabad': [28.6692, 77.4538],
    'Sahibabad': [28.6876, 77.4636],
    'Vasundhara': [28.6881, 77.4127],
    'Indirapuram': [28.6713, 77.3975],
    'Noida': [28.5829, 77.3236],
    'Sector 62': [28.5916, 77.3326],
    'Sector 50': [28.5880, 77.3396],
    'Sector 15': [28.5835, 77.3307],
    'Noida Sector 37': [28.5600, 77.3094],

    'South Delhi': [28.5500, 77.2000],
    'Saket': [28.5167, 77.2036],
    'Hauz Khas': [28.5535, 77.2071],
    'Okhla': [28.5574, 77.2074],
    'Delhi-Ghaziabad Border': [28.6284, 77.2614],
    'Cross the DND Flyway': [28.6184, 77.2844],
    'Sector 18': [28.5783, 77.3095],
    'Sector 25': [28.5800, 77.3090],

    'India Gate': [28.6139, 77.2295],
    'Greater Noida': [28.4845, 77.5087],
    'Pari Chowk': [28.4854, 77.5194],
    'Knowledge Park': [28.4845, 77.5105],
    'Sector 63': [28.5916, 77.3326]
};

// Example traffic data
const trafficAreas = {
    'Connaught Place': 'red', // High congestion area
    'Rajiv Chowk': 'red',     // High congestion area
    'Karol Bagh': 'orange',   // Moderate congestion
    'Ghaziabad': 'orange',    // Moderate congestion
    'Indirapuram': 'orange',  // Moderate congestion
    'Saket': 'yellow',        // Light to moderate congestion
    'Okhla': 'orange',        // Moderate congestion
    'Noida Sector 37': 'yellow', // Light to moderate congestion
    'Delhi-Ghaziabad Border': 'orange', // Moderate congestion
    'South Delhi': 'yellow',  // Light to moderate congestion
    'Hauz Khas': 'yellow',    // Light to moderate congestion
    'India Gate': 'yellow',   // Light to moderate congestion
    'Greater Noida': 'green', // Low congestion
    'Pari Chowk': 'green',    // Low congestion
    'Knowledge Park': 'green', // Low congestion
    'Sector 62': 'yellow',    // Light to moderate congestion
    'Sector 50': 'yellow',    // Light to moderate congestion
    'Sector 15': 'yellow'     // Light to moderate congestion
};

// Route definitions
const route1 = ['Delhi', 'Connaught Place', 'Rajiv Chowk', 'Karol Bagh', 'Ghaziabad', 'Sahibabad', 'Vasundhara', 'Indirapuram', 'Noida', 'Sector 62', 'Sector 50', 'Sector 15', 'Noida Sector 37'];
const route2 = ['Delhi', 'South Delhi', 'Saket', 'Hauz Khas', 'Okhla', 'Delhi-Ghaziabad Border', 'Cross the DND Flyway', 'Noida', 'Sector 18', 'Sector 25', 'Noida Sector 37'];
const route3 = ['Delhi', 'Connaught Place', 'India Gate', 'Greater Noida', 'Pari Chowk', 'Knowledge Park', 'Sector 63', 'Noida Sector 37'];
const graph = {
    'Delhi': { 'Connaught Place': 2, 'South Delhi': 5 },
    'Connaught Place': { 'Rajiv Chowk': 1, 'Delhi': 2 },
    'Rajiv Chowk': { 'Karol Bagh': 2, 'Connaught Place': 1 },
    'Karol Bagh': { 'Ghaziabad': 15, 'Rajiv Chowk': 2 },
    'Ghaziabad': { 'Sahibabad': 5, 'Karol Bagh': 15 },
    'Sahibabad': { 'Vasundhara': 5, 'Ghaziabad': 5 },
    'Vasundhara': { 'Indirapuram': 5, 'Sahibabad': 5 },
    'Indirapuram': { 'Noida': 7, 'Vasundhara': 5 },
    'Noida': { 'Sector 62': 5, 'Indirapuram': 7 },
    'Sector 62': { 'Sector 50': 5, 'Noida': 5 },
    'Sector 50': { 'Sector 15': 5, 'Sector 62': 5 },
    'Sector 15': { 'Noida Sector 37': 10, 'Sector 50': 5 },
    'Noida Sector 37': { 'Sector 15': 10 },

    'South Delhi': { 'Saket': 10, 'Hauz Khas': 8 },
    'Saket': { 'Hauz Khas': 4, 'South Delhi': 10 },
    'Hauz Khas': { 'Okhla': 7, 'Saket': 4 },
    'Okhla': { 'Delhi-Ghaziabad Border': 5, 'Hauz Khas': 7 },
    'Delhi-Ghaziabad Border': { 'Cross the DND Flyway': 3, 'Okhla': 5 },
    'Cross the DND Flyway': { 'Noida': 5, 'Delhi-Ghaziabad Border': 3 },
    'Noida': { 'Sector 18': 5, 'Cross the DND Flyway': 5 },
    'Sector 18': { 'Sector 25': 5, 'Noida': 5 },
    'Sector 25': { 'Noida Sector 37': 15, 'Sector 18': 5 },

    'India Gate': { 'Greater Noida': 20, 'Delhi': 1 },
    'Greater Noida': { 'Pari Chowk': 10, 'India Gate': 20 },
    'Pari Chowk': { 'Knowledge Park': 2, 'Greater Noida': 10 },
    'Knowledge Park': { 'Sector 63': 5, 'Pari Chowk': 2 },
    'Sector 63': { 'Noida Sector 37': 7, 'Knowledge Park': 5 },
    'Noida Sector 37': { 'Sector 63': 7 }
};

// Priority Queue implementation
class PriorityQueue {
    constructor() {
        this.items = [];
    }
    enqueue(element, priority) {
        this.items.push({ element, priority });
        this.items.sort((a, b) => a.priority - b.priority);
    }
    dequeue() {
        return this.items.shift();
    }
    isEmpty() {
        return this.items.length === 0;
    }
}

// Dijkstra's Algorithm
function dijkstra(start, end) {
    let distances = {};
    let prev = {};
    let pq = new PriorityQueue();

    for (let node in graph) {
        distances[node] = Infinity;
        prev[node] = null;
        pq.enqueue(node, Infinity);
    }
    distances[start] = 0;
    pq.enqueue(start, 0);

    while (!pq.isEmpty()) {
        let u = pq.dequeue().element;
        if (u === end) break;
        
        for (let neighbor in graph[u]) {
            let alt = distances[u] + graph[u][neighbor];
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                prev[neighbor] = u;
                pq.enqueue(neighbor, alt);
            }
        }
    }

    let path = [];
    for (let at = end; at; at = prev[at]) {
        path.push(at);
    }
    return path.reverse();
}

// A* Algorithm
function aStar(start, end) {
    const heuristic = (a, b) => {
        // Simple Euclidean heuristic
        const [latA, lngA] = locations[a];
        const [latB, lngB] = locations[b];
        return Math.sqrt((latA - latB) ** 2 + (lngA - lngB) ** 2);
    };

    let openSet = new PriorityQueue();
    let cameFrom = {};
    let gScore = {};
    let fScore = {};

    for (let node in graph) {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
        openSet.enqueue(node, Infinity);
    }
    gScore[start] = 0;
    fScore[start] = heuristic(start, end);
    openSet.enqueue(start, fScore[start]);

    while (!openSet.isEmpty()) {
        let current = openSet.dequeue().element;

        if (current === end) {
            // Reconstruct path
            let path = [];
            while (cameFrom[current]) {
                path.push(current);
                current = cameFrom[current];
            }
            path.push(start);
            return path.reverse();
        }

        for (let neighbor in graph[current]) {
            let tentativeGScore = gScore[current] + graph[current][neighbor];
            if (tentativeGScore < gScore[neighbor]) {
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentativeGScore;
                fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, end);
                openSet.enqueue(neighbor, fScore[neighbor]);
            }
        }
    }

    return []; // No path found
}

// Function to update sidebar with locations based on route
function updateSidebarLocations(route) {
    const locationList = document.getElementById('locationList');
    locationList.innerHTML = ''; // Clear the list

    route.forEach(location => {
        const li = document.createElement('li');
        li.textContent = location;
        if (trafficAreas[location]) {
            li.style.color = trafficAreas[location];
        }
        li.addEventListener('click', () => {
            map.setView(locations[location], 14);
        });
        locationList.appendChild(li);
    });
}

// Function to update sidebar active location
function updateSidebarActiveLocation(location) {
    const items = document.querySelectorAll('#locationList li');
    items.forEach(item => {
        if (item.textContent === location) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Function to animate marker
function animateMarker(latLngs, duration, marker, location) {
    let startTime = null;
    const startLatLng = L.latLng(latLngs[0]);
    const endLatLng = L.latLng(latLngs[1]);

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / duration;
        if (progress < 1) {
            const currentLatLng = L.latLng([
                startLatLng.lat + (endLatLng.lat - startLatLng.lat) * progress,
                startLatLng.lng + (endLatLng.lng - startLatLng.lng) * progress
            ]);
            marker.setLatLng(currentLatLng);
            requestAnimationFrame(animate);
        } else {
            marker.setLatLng(endLatLng);
        }
    }

    requestAnimationFrame(animate);
}

// Function to update route step-by-step
// Function to update route step-by-step
function updateRouteStepByStep(route, trafficHighlight = false) {
    routeLayer.clearLayers();
    markers.forEach(marker => marker.remove());
    markers.length = 0;

    let index = 0;

    function nextStep() {
        if (index < route.length) {
            const currentLoc = route[index];
            const nextLoc = route[index + 1];

            if (trafficHighlight && trafficAreas[currentLoc]) {
                showAlert(`Traffic detected at ${currentLoc}. Consider rerouting!`);
            } else {
                closeAlert();
            }

            // Marker options with color based on path
            const markerOptions = {
                color: trafficAreas[currentLoc] || 'blue',
                radius: 10,
                fillColor: 'black',
                fillOpacity: 0.9,
                weight: 3
            };

            const marker = L.circleMarker([locations[currentLoc][0], locations[currentLoc][1]], markerOptions).addTo(map);
            marker.bindPopup(currentLoc).openPopup();
            markers.push(marker);

            updateSidebarActiveLocation(currentLoc);

            // Polyline options with color based on traffic
            let polylineOptions = {
                color: trafficAreas[currentLoc] || 'blue',
                weight: 8,
                opacity: 0.7,
                dashArray: '5, 10'
            };

            if (trafficHighlight && trafficAreas[currentLoc]) {
                polylineOptions.color = trafficAreas[currentLoc];
                polylineOptions.weight = 6;
                polylineOptions.dashArray = '';
            }

            if (nextLoc) {
                const latLngs = [locations[currentLoc], locations[nextLoc]];
                L.polyline(latLngs, polylineOptions).addTo(routeLayer);

                animateMarker(latLngs, 2000, marker, nextLoc);
            }

            index++;
            setTimeout(nextStep, 2500);
        }
    }

    nextStep();
}

// Function to display alerts for traffic
// Function to display alerts for traffic
function showAlert(message) {
    let alertDiv = document.getElementById('trafficAlert');
    if (!alertDiv) {
        alertDiv = document.createElement('div');
        alertDiv.id = 'trafficAlert';
        alertDiv.style.position = 'fixed';
        alertDiv.style.bottom = '10px';
        alertDiv.style.left = '10px';
        alertDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        alertDiv.style.color = 'white';
        alertDiv.style.padding = '10px';
        alertDiv.style.borderRadius = '5px';
        alertDiv.style.zIndex = 1000;
        document.body.appendChild(alertDiv);
    }
    alertDiv.textContent = message;
}

// Function to close alerts
function closeAlert() {
    const alertDiv = document.getElementById('trafficAlert');
    if (alertDiv) {
        alertDiv.remove();
    }
}

// Functions for pathfinding algorithms
function findShortestPath(start, end, algorithm) {
    let distances = {};
    let prev = {};
    let pq = new PriorityQueue();

    for (let node in graph) {
        distances[node] = Infinity;
        prev[node] = null;
        pq.enqueue(node, Infinity);
    }
    distances[start] = 0;
    pq.enqueue(start, 0);

    while (!pq.isEmpty()) {
        let u = pq.dequeue().element;
        if (u === end) break;
        
        for (let neighbor in graph[u]) {
            let alt = distances[u] + graph[u][neighbor];
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                prev[neighbor] = u;
                pq.enqueue(neighbor, alt);
            }
        }
    }

    let path = [];
    for (let at = end; at; at = prev[at]) {
        path.push(at);
    }
    return path.reverse();
}


// Priority Queue implementation


// Event listeners for buttons
document.getElementById('route1Button').addEventListener('click', () => {
    updateRouteStepByStep(route1, true);
    updateSidebarLocations(route1);
});

document.getElementById('route2Button').addEventListener('click', () => {
    updateRouteStepByStep(route2, true);
    updateSidebarLocations(route2);
});

document.getElementById('route3Button').addEventListener('click', () => {
    updateRouteStepByStep(route3, true);
    updateSidebarLocations(route3);
});

document.getElementById('optimalButtonDijkstra').addEventListener('click', () => {
    const path = dijkstra('Delhi', 'Noida Sector 37');
    updateRouteStepByStep(path, true);
    updateSidebarLocations(path);
});

document.getElementById('optimalButtonAStar').addEventListener('click', () => {
    const path = aStar('Delhi', 'Noida Sector 37');
    updateRouteStepByStep(path, true);
    updateSidebarLocations(path);
});
// Function to scroll to active location in the sidebar
function scrollToActiveLocation() {
    const activeItem = document.querySelector('#locationList li.active');
    if (activeItem) {
        activeItem.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest' // Ensures the item is visible in the view
        });
    }
}

// Update function to include scrolling
function updateSidebarActiveLocation(location) {
    const items = document.querySelectorAll('#locationList li');
    items.forEach(item => {
        if (item.textContent === location) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    scrollToActiveLocation(); // Scroll to active location
}
