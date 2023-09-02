
const apiKey: string = "nothing";
const baseURL: string = "https://traewelling.de/api/v1";

//Idk bout that. Stole it from https://stackoverflow.com/questions/54074380/how-to-wrap-javascript-fetch-in-a-function-unhandled-promise-rejection
function fetchAPI(url: string, body: string | null = null, method: string = 'GET') {
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
  };

  return fetch(baseURL + url, {headers, 'method': method, body})
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
