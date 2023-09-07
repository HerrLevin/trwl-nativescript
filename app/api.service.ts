
const apiKey: string = "nothing";
const baseURL: string = "https://traewelling.de/api/v1";

//Idk bout that. Stole it from https://stackoverflow.com/questions/54074380/how-to-wrap-javascript-fetch-in-a-function-unhandled-promise-rejection
function fetchAPI(url: string, body: string | object | null = null, method: string = 'GET') {
  let init: RequestInit = {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    method: method
  };

  if (method !== 'GET') {
    init.body = JSON.stringify(body);
  }

  return fetch(baseURL + url, init)
    .then(response => {
      if (response.ok) {
        const contentType = response.headers.get('Content-Type') || '';

        if (contentType.includes('application/json')) {
          return response.json().catch(error => {
            return Promise.reject(new Error('Invalid JSON: ' + error.message));
          });
        }

        if (contentType.includes('text/html')) {
          return response.text().then(html => {
            return {
              'page_type': 'generic',
              'html': html
            };
          }).catch(error => {
            return Promise.reject(new Error('HTML error: ' + error.message));
          });
        }

        return Promise.reject(new Error('Invalid content type: ' + contentType));
      }

      if (response.status === 404) {
        return Promise.reject(new Error('Page not found: ' + url));
      }

      return response.json().catch((error) => {
        return Promise.reject(new Error(error));
      });

    }).catch(error => {
      return Promise.reject(new Error(error.message));
    });
}


export function getDepartures(stationName: string): Promise<any> {
  console.info("getDepartures");
  return fetchAPI(`/trains/station/${encodeURI(stationName)}/departures`);
}

export function getLineRun(hafasTripId: string, lineName: string, startId: number) {
  console.info("getLineRun");
  return fetchAPI(`/trains/trip?hafasTripId=${encodeURI(hafasTripId)}&lineName=${encodeURI(lineName)}&start=${startId}`);
}

export function checkin(
  tripId: string,
  lineName: string,
  start: number,
  destination: number,
  departure: string,
  arrival: string,
  force: boolean,
  body: string | null,
  business: number = 0,
  visibility: number = 0,
  eventId: number | null = null,
  toot: boolean = false
) {
  console.info("checkin");

  return fetchAPI(
    "/trains/checkin",
    {tripId, lineName, start, destination, departure, arrival, force, body, business, visibility, eventId, toot},
    "POST"
  );
}
