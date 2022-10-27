// Addon is active
let timeframeDashboardActive = false;

function formatNum(num) {
  return num.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });
}

function dhm (ms) {
  const days = Math.floor(ms / (24*60*60*1000));
  const daysms = ms % (24*60*60*1000);
  const hours = Math.floor(daysms / (60*60*1000));
  const hoursms = ms % (60*60*1000);
  const minutes = Math.floor(hoursms / (60*1000));
  const minutesms = ms % (60*1000);
  const sec = Math.floor(minutesms / 1000);
  return formatNum(days) + ":" + formatNum(hours) + ":" + formatNum(minutes) + ":" + formatNum(sec);
}

const timeMap = {
  '1m': 60000,
  '3m': 180000,
  '5m': 300000,
  '15m': 900000,
  '1h': 3600000,
  '4h': 14400000,
  'D': 86400000,
  'W': 604800000,
  'M': null
}

const timeframeDashboardContainer = document.createElement('div');

// Generate style for inner div style
function getInnerDivStyle(active, hover) {
  const divSize = active ? 30 : 33;
  const backgroundColor = active ? hover ? '#1e53e5' : '#2962ff' : hover ? '#2a2e39' : 'none';
  return `background-color: ${backgroundColor}; width: ${divSize}px; height: ${divSize}px; display: flex; justify-content: center; align-items: center; border-radius: 4px;`;
}

// Create Button
const customButton = document.createElement('div');
customButton.setAttribute(
  'style',
  'color: #b2b5be; width: auto; height: 36px; display: flex; justify-content: center; align-items: center;'
);

// Div inside button
const innerDiv = document.createElement('div');
innerDiv.setAttribute('style', getInnerDivStyle(timeframeDashboardActive));
innerDiv.setAttribute('id', 'tvp-custom-button');
customButton.appendChild(innerDiv)

// Set svg
innerDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="rgba(0, 0, 0, 0)" stroke="#b2b5be" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'

// Hover effects
customButton.addEventListener('mouseenter', () => innerDiv.setAttribute('style', getInnerDivStyle(timeframeDashboardActive, true)));
customButton.addEventListener('mouseleave', () => innerDiv.setAttribute('style', getInnerDivStyle(timeframeDashboardActive, false)));

// Update time text
function updateTimeText() {
    Object.keys(timeMap).forEach(t => {
    const tms = timeMap[t];
    const now = new Date();
    let ms = Math.abs(Date.now(now.getFullYear(), now.getMonth(), 1, -7) % tms - tms);
    if (t === 'W') {
      const dayOffset = -3;
      ms += (24*60*60*1000) * dayOffset;
    } else if (t === 'M') {
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, -7);
      ms = lastDayOfMonth.getTime() - now;
    }

    try {
      const timeframeText = document.getElementById(`dashboardTF_${t}`);
      // Temp 'fix' for weekly offset 
      if (t === 'W' && !document.getElementById('header-toolbar-symbol-search').children[1].innerText.includes('USDT')) {
        timeframeText.innerText = `Unavailable`;
      } else {
        timeframeText.innerText = `${dhm(ms)}`;
      }
      timeframeText.setAttribute('style', `color: ${ms > 30000 ? '#ffffff' : 'orange'}; margin-left: 0.2em;`)
    } catch(err) {

    }
  })
}

function renderTimeframeDashboard() {
  timeframeDashboardContainer.innerHTML = '';
  timeframeDashboardContainer.setAttribute('style', `display: flex; flex-direction: column; position: absolute; left: 62px; top: 45px;`);

  Object.keys(timeMap).forEach(timeframe => {
    const container = document.createElement('div');
    container.setAttribute('style', `background: rgba(217, 217, 217, 0.02); display: flex; justify-content: space-between; align-items: center; margin-top: 2px;`);

    const timeframeDisplayElement = document.createElement('div');
    timeframeDisplayElement.setAttribute('style', `color: black; font-size: 11px; display: flex; justify-content: center; align-items: center; width: 25px; height: 25px; margin: 0.2em; border-radius: 2px; background: ${defaultColors[timeframeConfig.get(timeframe)]};`);
    timeframeDisplayElement.innerText = timeframe;
    container.appendChild(timeframeDisplayElement);

    const timeLeftElement = document.createElement('p');
    timeLeftElement.setAttribute('id', `dashboardTF_${timeframe}`);
    container.appendChild(timeLeftElement);

    timeframeDashboardContainer.appendChild(container);
  })

  document.getElementById('overlap-manager-root').appendChild(timeframeDashboardContainer);
  updateTimeText();
};

// On click
innerDiv.addEventListener('click', () => {timeframeDashboardActive = !timeframeDashboardActive; timeframeDashboardActive ? renderTimeframeDashboard() : timeframeDashboardContainer.remove(); innerDiv.setAttribute('style', getInnerDivStyle(timeframeDashboardActive, true))})

// Inject Button
waitForElm('#drawing-toolbar').then(() => {
  document.getElementById('drawing-toolbar').children[0].children[0].children[0].children[0].children[2].children[0].insertAdjacentElement('beforebegin', customButton)

  // Update times
  setInterval(() => {
    updateTimeText();
  }, 1000)
})
