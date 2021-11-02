let counter = new Counter();

counter.init('D8F28E50-3339-11EC-9EDF-9F93090795B1', String(Math.random()).substr(2, 12), 'send test');
counter.setAdditionalParams({
  env: 'production',
  platform: 'touch'
});

counter.send('connect', performance.timing.connectEnd - performance.timing.connectStart);
counter.send('ttfb', performance.timing.responseEnd - performance.timing.requestStart);

let timeStart = Date.now();

setTimeout(function () {
  document.querySelector('.square').classList.add('black');

  counter.send('square', Date.now() - timeStart);
}, Math.random() * 1000 + 500);

let uuidv4 = function () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

let drawData = function () {
  let html = '',
    count = 500,
    genStart = Date.now();

  for (let i = 0; i < count; i++) {
    html += `<div class="row">${uuidv4().toUpperCase()}</div>`
  }

  counter.send('generate', Date.now() - genStart);

  let drawStart = Date.now();

  document.querySelector('.results').innerHTML = html;

  requestAnimationFrame(function () {
    counter.send('draw', Date.now() - drawStart);
  });
};

document.querySelector('.load').onclick = function () {
  let timeStart = Date.now();

  setTimeout(function () {
    counter.send('load', Date.now() - timeStart);

    drawData();
  }, Math.random() * 1000 + 2000);
}