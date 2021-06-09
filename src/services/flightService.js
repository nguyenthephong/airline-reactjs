export async function getFlightStations() {
    return await fetch('http://localhost:8081/airports', {
            method: 'get',
            headers: { 'Content-Type': 'application/json'}
        });
}

export async function getFlightTypes() {
    return [
        {
            key: 'One-Way',
            value: 'One way'
        },
        {
            key: 'Round-Trip',
            value: 'Round trip'
        }
    ]
}

export async function searchFlight(searchCriteria) {
    console.log(searchCriteria);
    return await fetch(`http://localhost:8081/flights/search?fromStation=${searchCriteria.fromStation}&toStation=${searchCriteria.toStation}&toDate=${searchCriteria.toDate}&fromDate=${searchCriteria.fromDate}&totalTickets=${searchCriteria.totalTickets}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function submitOrder(searchCriteria) {
    // TODO: call API
    fetch('http://localhost:8081/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchCriteria)
    })
    .then(response => response.json())
    .then(order => {
        return order;
    });
}
