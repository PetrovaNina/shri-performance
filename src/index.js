import UAParser from 'ua-parser-js';
import { Counter } from './send';

const parser = new UAParser();
const counter = new Counter();

counter.init('57C50A26-03F6-4E28-B883-3E1F80AD916F', String(Math.random()).substr(2, 12), 'send test');
counter.setAdditionalParams({
  env: 'development',
  browser: parser.getBrowser().name,
  os: parser.getOS().name,
  platform: parser.getDevice().type,
});

counter.send('connect', performance.timing.connectEnd - performance.timing.connectStart);
counter.send('ttfb', performance.timing.responseEnd - performance.timing.requestStart);

let timeStart = Date.now();

document.querySelector('.quiz-area').onmouseover = function () {
  counter.send('quiz_start (sec)', Math.floor((Date.now() - timeStart) / 1000));
}
