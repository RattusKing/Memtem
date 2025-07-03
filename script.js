/* ====== World Clocks ====== */
const { DateTime } = luxon;

const cities = [
  { id: 'Portland',   zone: 'America/Los_Angeles' },
  { id: 'NewYork',    zone: 'America/New_York'    },
  { id: 'London',     zone: 'Europe/London'       },
  { id: 'Islamabad',  zone: 'Asia/Karachi'        },  // Islamabad shares Asia/Karachi TZ
  { id: 'Beijing',    zone: 'Asia/Shanghai'       },
  { id: 'Tokyo',      zone: 'Asia/Tokyo'          },
];

function updateClocks() {
  cities.forEach(({ id, zone }) => {
    const now = DateTime.now().setZone(zone);
    document.getElementById(`clock-${id}`).textContent =
      now.toFormat('HH:mm:ss ‑ dd LLL yyyy');
  });
}
updateClocks();                // initial paint
setInterval(updateClocks, 1000);// tick every second

/* ====== Daily Obituaries (NY Times RSS via rss2json) ====== */
const RSS_URL = 'https://rss.nytimes.com/services/xml/rss/nyt/Obituaries.xml';
const API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

async function loadObits() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('RSS error');

    const list = document.getElementById('obits-list');
    list.innerHTML = ''; // clear placeholder

    data.items.slice(0, 10).forEach(item => {
      const li = document.createElement('li');
      li.innerHTML =
        `<a href="${item.link}" target="_blank" rel="noopener">
           <strong>${item.title}</strong>
         </a> <em>(${DateTime.fromISO(item.pubDate).toFormat('dd LLL yyyy')})</em>`;
      list.appendChild(li);
    });
  } catch (err) {
    document.getElementById('obits-list').innerHTML =
      `<li>Could not load obituaries (${err.message}).</li>`;
  }
}
loadObits();                    // first load
setInterval(loadObits, 3600e3); // refresh every hour
