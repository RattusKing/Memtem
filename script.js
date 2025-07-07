// Wait for luxon to load before running
window.addEventListener('load', () => {
  const { DateTime } = luxon;

  const cities = [
    { id: 'Portland', zone: 'America/Los_Angeles' },
    { id: 'NewYork', zone: 'America/New_York' },
    { id: 'London', zone: 'Europe/London' },
    { id: 'Islamabad', zone: 'Asia/Karachi' },
    { id: 'Beijing', zone: 'Asia/Shanghai' },
    { id: 'Tokyo', zone: 'Asia/Tokyo' },
  ];

  // Update clocks every second
  function updateClocks() {
    cities.forEach(({ id, zone }) => {
      const now = DateTime.now().setZone(zone);
      const clockEl = document.getElementById(`clock-${id}`);
      if (clockEl) {
        clockEl.textContent = now.toFormat('HH:mm:ss - dd LLL yyyy');
      }
    });
  }
  updateClocks();
  setInterval(updateClocks, 1000);

  // NYT obituaries RSS feed (reliable for rss2json)
  const nytObitsFeed = 'https://rss.nytimes.com/services/xml/rss/nyt/Obituaries.xml';

  // Load obituaries and display in #obits-list
  async function loadObits(url) {
    try {
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status !== 'ok') throw new Error('RSS error');

      const list = document.getElementById('obits-list');
      list.innerHTML = '';

      data.items.slice(0, 10).forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${item.link}" target="_blank" rel="noopener">${item.title}</a> <em>(${DateTime.fromISO(item.pubDate).toFormat('dd LLL yyyy')})</em>`;
        list.appendChild(li);
      });
    } catch (err) {
      const list = document.getElementById('obits-list');
      list.innerHTML = `<li>Error loading obituaries: ${err.message}</li>`;
    }
  }

  // Load obituaries on page load
  loadObits(nytObitsFeed);
});

const obitForm = document.getElementById('obit-form');
const userObitsList = document.getElementById('user-obits-list');

obitForm.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('obit-name').value.trim();
  const date = document.getElementById('obit-date').value;
  const message = document.getElementById('obit-message').value.trim();

  if (!name || !date) {
    alert('Please enter both name and date of passing.');
    return;
  }

  // Format date nicely with Luxon
  const formattedDate = luxon.DateTime.fromISO(date).toFormat('dd LLL yyyy');

  // Create a new list item
  const li = document.createElement('li');
  li.style.padding = '12px 18px';
  li.style.borderBottom = '1px solid #004d00';
  li.style.transition = 'background-color 0.2s ease';
  li.style.color = '#00FF66';

  let content = `<strong>${name}</strong> <em>(${formattedDate})</em>`;
  if (message) {
    content += `<br><span style="color: #ddd;">${message}</span>`;
  }
  li.innerHTML = content;

  // Add hover effect
  li.addEventListener('mouseenter', () => li.style.backgroundColor = 'rgba(0, 255, 102, 0.15)');
  li.addEventListener('mouseleave', () => li.style.backgroundColor = 'transparent');

  userObitsList.prepend(li); // newest on top

  // Reset form
  obitForm.reset();
});

