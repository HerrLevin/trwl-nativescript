import {isEmpty} from "lodash-es";

let baseURL: string = "https://traewelling.de/api/v1";
const appSettings = require("@nativescript/core/application-settings");

//Idk bout that. Stole it from https://stackoverflow.com/questions/54074380/how-to-wrap-javascript-fetch-in-a-function-unhandled-promise-rejection
function fetchAPI(url: string, body: string | object | null = null, method: string = 'GET') {
  const apiKey = appSettings.getString("API");

  if (isEmpty(apiKey)) {
    return Promise.reject(new Error("No API key given!"));
  }

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

export function logout() {
  return fetchAPI("/auth/logout", null, "POST");
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

export function autocomplete(query: string): Promise<AutoCompleteResponse> {
  query = query.replace("/", " ");

  return fetchAPI(`/trains/station/autocomplete/${encodeURI(query)}`);
}

export function getDashboard(page: number = 1, global: boolean = false): Promise<DashboardResponse> {
  let url: string = global ? "/dashboard/global" : "/dashboard";
  url = `${url}?page=${page}`;
  return fetchAPI(url);
}


/**
 * Types follow here.
 */

export type DashboardResponse = {
  data: Status[],
  links: Links,
  meta: PaginationMeta
}

export type PaginationMeta = {
  current_page: number,
  from: number,
  path: string,
  per_page: number,
  to: string
};

export type Links = {
  first: string,
  last: string,
  prev: string | null,
  next: string | null,
};

export type Status = {
  id: number,
  body: string | null,
  type: string,
  user: number,
  username: string,
  preventIndex: boolean,
  business: Business,
  visibility: Visibility,
  likes: number,
  liked: boolean,
  isLikable: boolean,
  createdAt: string,
  train: Train,
  event: Event | null
};

export type Train = {
  trip: number,
  hafasId: string,
  category: category,
  number: string,
  journeyNumber: number,
  lineName: string,
  distance: number,
  points: number,
  duration: number,
  speed: number,
  origin: TrainStopover,
  destination: TrainStopover,
  operator: Operator
}

export type TrainStopover = {
  id: number,
  name: string,
  rilIdentifier: string,
  evaIdentifier: string,
  arrival: string | null,
  arrivalPlanned: string | null,
  arrivalReal: string | null,
  arrivalPlatformPlanned: string | null,
  arrivalPlatformReal: string | null,
  departure: string | null,
  departurePlanned: string | null,
  departureReal: string | null,
  departurePlatformPlanned: string | null,
  departurePlatformReal: string | null,
  platform: string | null,
  isArrivalDelayed: boolean,
  isDepartureDelayed: boolean,
  cancelled: boolean
}

export type Operator = {
  identifier: string,
  name: string
}

export type Event = {
  id: number,
  name: string,
  slug: string,
  host: string,
  url: string,
  begin: string,
  end: string,
  station: Station | null
}

export type Station = {
  id: number,
  name: string,
  latitude: number,
  longitude: number,
  ibnr: number,
  rilIdentifier: string | null
}

enum category {
  nationalExpress = "nationalExpress",
  national = "national",
  regionalExp = "regionalExp",
  regional = "regional",
  suburban = "suburban",
  bus = "bus",
  ferry = "ferry",
  subway = "subway",
  tram = "tram",
  taxi = "taxi"
}

enum Business {
  Private = 0,
  Business = 1,
  Commute = 2,
}

enum Visibility {
  Public = 0,
  Unlisted = 1,
  Followers = 2,
  Private = 3,
  Authenticated = 4
}

export type ShortTrainStation = {
  ibnr: number,
  rilIdentifier: string | null,
  name: string
};

interface AutoCompleteResponse {
  data: ShortTrainStation[]
}
