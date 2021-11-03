import UAParser from 'ua-parser-js';
import { Counter } from './send';

const parser = new UAParser();
const counter = new Counter();

counter.init('4043329bc2be441aabe3048c8bac2dc6', String(Math.random()).substr(2, 12), 'send test');
counter.setAdditionalParams({
  env: 'development',
  platform: parser.getDevice().type,
  browser: parser.getBrowser().name,
  os: parser.getOS().name,
});

counter.send('platform', parser.getDevice().type)
counter.send('browser', parser.getBrowser().name)
counter.send('os', parser.getOS().name)
counter.send('connect', performance.timing.connectEnd - performance.timing.connectStart);
counter.send('ttfb', performance.timing.responseEnd - performance.timing.requestStart);

let timeStart = Date.now();

setTimeout(function () {
  document.querySelector('.quiz-heading').style.color = 'red';
  counter.send('heading', Date.now() - timeStart);
}, Math.random() * 1000 + 500);

document.querySelector('.quiz-area').onhover = function () {
  let timeStart = Date.now();

  setTimeout(function () {
    counter.send('quiz', Date.now() - timeStart);
  }, Math.random() * 1000 + 2000);
}
