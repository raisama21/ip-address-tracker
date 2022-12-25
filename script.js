const form = document.querySelector(".form");
const ipAddressEl = document.querySelector(".ip-address");
const regionEl = document.querySelector(".region");
const cityEl = document.querySelector(".city");
const postalCodeEl = document.querySelector(".postal-code");
const timezoneEl = document.querySelector(".timezone");
const ispEl = document.querySelector(".isp");

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const input = document.querySelector("input");
  if (input.value == null || input.value === "") return;

  geolocationApi(input.value);

  input.value = "";
});

const map = L.map("map").setView([0, 0], 0);
const locationIcon = L.icon({
  iconUrl: "./images/icon-location.svg",
  shadowUrl: "./images/icon-location.svg",

  iconSize: [46, 55],
  shadowSize: [46, 55],
});
const marker = L.marker([0, 0], { icon: locationIcon }).addTo(map);

const tile_url = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution = {
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
};

const tiles = L.tileLayer(tile_url, {
  maxZoom: 19,
  attribution,
});
tiles.addTo(map);

async function getAPI() {
  const response = await fetch(`https://api.ipify.org/?format=json`);

  const data = await response.json();
  const ip = data.ip;
  geolocationApi(ip);
}

let firstTime = true;

if (firstTime) {
  getAPI();
  firstTime = false;
}

async function geolocationApi(ip_address) {
  const response = await fetch(
    `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_N7yGnVw46aVfVRkvpKgye1qt1XuaN&ipAddress=${ip_address}`
  );

  const data = await response.json();
  const { ip, isp, location } = data;
  const { city, country, lat, lng, postalCode, region, timezone } = location;

  ipAddressEl.textContent = ip;
  regionEl.textContent = region;
  cityEl.textContent = city;
  postalCodeEl.textContent = postalCode;
  timezone.textContent = timezone;
  ispEl.textContent = isp;

  marker.setLatLng([lat, lng]);
  map.setView([lat, lng], 13);
}
