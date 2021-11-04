function quantile(arr, q) {
	const sorted = arr.sort((a, b) => a - b);
	const pos = (sorted.length - 1) * q;
	const base = Math.floor(pos);
	const rest = pos - base;

	if (sorted[base + 1] !== undefined) {
		return Math.floor(sorted[base] + rest * (sorted[base + 1] - sorted[base]));
	} else {
		return Math.floor(sorted[base]);
	}
};

function prepareData(result) {
	return result.data.map(item => {
		item.date = item.timestamp.split('T')[0];

		return item;
	});
}

const countableMetrics = ['connect', 'ttfb', 'quiz_start (sec)'];

function getDateRange(fromDate, toDate) {
	const range = [];

	for (
		let date = new Date(fromDate);
		date <= new Date(toDate);
		date.setDate(date.getDate() + 1)
	) {
		range.push(date.toISOString().slice(0, 10));
	}

	return range;
};

// TODO: реализовать
// показать значение метрики за несколько дней
function showMetricByPeriod(data, page, startDate, endDate) {
	console.log(`
	All metrics for period from ${startDate} to ${endDate}:`);

	const table = {};
	let i = 1;

	getDateRange(startDate, endDate).forEach(date => {
		countableMetrics.forEach(metric => {
			table[i++] = {
				metric,
				date,
				...addMetricByDate(data, page, metric, date),
			};
		})
	});

	console.table(table);
}

// показать сессию пользователя
function showSession(data, requestId) {
	console.log(`
	All metrics for requestID ${requestId}:`);

	let sessionData = data.filter((item) => item.requestId == requestId);

	let table = {};

	sessionData.forEach(data => {
		table[data.name] = data.value;

		for (let key in data.additional) {
			table[key] = data.additional[key];
		};
	});

	console.table(table);
}

// сравнить метрику в разных срезах
function compareMetric(data, metricName, metrisLocation, date) {
	console.log(`
	Comparing of user ${metricName.toUpperCase()} for ${date ? date : 'all the time'}:`);

	let queryData = !date ? data :
		data.filter(item => item.date == date);

	const table = {
		'TOTAL (users number)': queryData.length,
	};

	queryData.forEach(item => {
		let key = metrisLocation ? item[metrisLocation][metricName] : item[metricName];
		if (key === undefined) key = 'desktop';
		table[key] ? table[key]++ : table[key] = 1;
	});

	console.table(table);
};

// добавить метрику за выбранный день
function addMetricByDate(data, page, name, date) {
	let sampleData = data
		.filter(item => item.page == page && item.name == name && item.date == date)
		.map(item => item.value);

	let result = {};

	result.hits = sampleData.length;
	result.p25 = quantile(sampleData, 0.25);
	result.p50 = quantile(sampleData, 0.5);
	result.p75 = quantile(sampleData, 0.75);
	result.p95 = quantile(sampleData, 0.95);

	return result;
}
// рассчитывает все метрики за день
function calcMetricsByDate(data, page, date) {
	console.log(`
	All metrics for ${date}:`);

	let table = {};
	countableMetrics.forEach(metric => {
		table[metric] = addMetricByDate(data, page, metric, date);
	});
	console.table(table);
};

fetch('https://shri.yandex/hw/stat/data?counterId=57C50A26-03F6-4E28-B883-3E1F80AD916F')
	.then(res => res.json())
	.then(result => {
		let data = prepareData(result);

		calcMetricsByDate(data, 'send test', '2021-11-04');
		showMetricByPeriod(data, 'send test', '2021-11-03', '2021-11-04')
		showSession(data, '600321823553');
		compareMetric(data, 'os', 'additional', '2021-11-03');
		compareMetric(data, 'platform', 'additional', '2021-11-03');
		compareMetric(data, 'platform', 'additional');
		compareMetric(data, 'browser', 'additional', '2021-11-03');
	});
