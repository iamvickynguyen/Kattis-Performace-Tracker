const table = document.querySelector(".table");
const months = document.querySelector(".month-container");
let day = 0;

function drawTable(year) {
    const box = document.createElement("div");
    box.classList.add("week-text");
    months.appendChild(box);
    for (let i = 0; i < 52; i++) {
        const monthBox = document.createElement("div");
        monthBox.classList.add("month-box");
        monthBox.setAttribute("id", `box-${i}`);
        months.appendChild(monthBox);
    }
    table.appendChild(addText());
    table.appendChild(drawFirstWeek(year, 0));
    for (let i = 1; i < 52; i++) {
        table.appendChild(drawWeek(i));
    }
    table.appendChild(drawLastWeek(year, 52));
}

function addText() {
    const element = document.createElement("div");
    element.classList.add("week-boxes");

    const weekdays = ["S", "M", "T", "W", "Th", "F", "Sa"];
    weekdays.forEach((day) => {
        const box = document.createElement("div");
        box.classList.add("week-text");
        box.innerText = day;
        element.appendChild(box);
    });
    return element;

}
function drawWeek(week) {
    const element = document.createElement("div");
    element.classList.add("week-boxes");
    element.setAttribute("id", `week-${week}`);

    for (let i = 0; i < 7; i++) {
        const box = document.createElement("div");
        box.classList.add("day");
        box.setAttribute("data-toggle", "tooltip");
        box.setAttribute("data-placement", "top");
        box.setAttribute("title", `${getDate(2020, day, false)}\ntesting`);
        box.setAttribute("id", `day-${day}`);
        day++;
        element.appendChild(box);
    }
    return element;
}

function drawFirstWeek(year, week) {
    const firstDay = new Date(year, 0, 1);
    const element = document.createElement("div");
    element.classList.add("week-boxes");
    element.setAttribute("id", `week-${week}`);

    for (let i = 0; i < firstDay.getDay(); i++) {
        const box = document.createElement("div");
        box.classList.add("day");
        box.style.background = "lightgray";
        element.appendChild(box);

    }

    for (let i = firstDay.getDay(); i < 7; i++) {
        const box = document.createElement("div");
        box.setAttribute("data-toggle", "tooltip");
        box.setAttribute("data-placement", "top");
        box.setAttribute("title", `${day}`);
        box.setAttribute("id", `day-${day}`);
        day++;
        box.classList.add("day");
        element.appendChild(box);
    }
    return element;
}

function drawLastWeek(year, week) {
    const lastDay = new Date(year, 11, 31);
    const element = document.createElement("div");
    element.classList.add("week-boxes");
    element.setAttribute("id", `week-${week}`);

    for (let i = 0; i < lastDay.getDay(); i++) {
        const box = document.createElement("div");
        box.classList.add("day");
        box.setAttribute("data-toggle", "tooltip");
        box.setAttribute("data-placement", "top");
        box.setAttribute("title", `${day}`);
        box.setAttribute("id", `day-${day}`);
        day++;
        element.appendChild(box);
    }

    for (let i = lastDay.getDay(); i < 7; i++) {
        const box = document.createElement("div");
        box.classList.add("day");
        box.style.background = "lightgray";
        element.appendChild(box);
    }
    return element;
}

function generateMonths() {
    const leap = [0, 30, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    const nonLeap = [0, 30, 58, 89, 119, 149, 180, 211, 242, 272, 303, 333];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    nonLeap.forEach((month, idx) => {
        const firstDay = document.querySelector(`#day-${month}`);
        const id = firstDay.parentElement.id;
        const monthBox = document.querySelector(`#box-${id.slice(5)}`);
        monthBox.innerText = months[idx];
    })
}
// ----

function getDate(year, num, isLeap) {
    const leap = [0, 30, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
    const nonLeap = [0, 30, 58, 89, 119, 149, 180, 211, 242, 272, 303, 333, 364];
    // still need to check Dec
    let month, day;
    if (isLeap) {
        leap.forEach((numDay, idx) => {
            if (num > numDay) {
                month = idx;
                day = num - numDay;
            }
        })
    } else {
        nonLeap.forEach((numDay, idx) => {
            if (num > numDay) {
                month = idx;
                day = num - numDay;
            }
        })
    }
    const date = new Date(Date.UTC(year, month, day)).toISOString().slice(0,10);
    return date;

}

drawTable(2020);
generateMonths();

// https://github.com/GramThanos/jsCalendar/issues/16
// Add Support for Custom Event Listeners
jsCalendar.prototype.addDateEventListener = function (event, handler, useCapture) {
	if (typeof useCapture === 'undefined') useCapture = false;
	// Save instance
	var that = this;
	// Loop through day elements
	var i, j;
	for (i = 0; i < 6; i++) {
		for (j = 0; j < 7; j++) {
			// Attach event
			this._elements.bodyCols[i * 7 + j].addEventListener(event, (function(index){
				return function (event) {
					// On fire, call handler
					handler(event, that._active[index]);
				};
			})(i * 7 + j), useCapture);
		}
	}
};

// --------- CALENDAR -------------
var userCalendar = document.getElementById('user-calendar');
var calendar = new jsCalendar('#user-calendar');

// Create a tooltip div
var tooltip = document.createElement('div');
tooltip.style.width = '200px';
tooltip.style.marginLeft = '10px';
tooltip.style.height = '30px';
tooltip.style.marginTop = '-40px';
tooltip.style.lineHeight = '30px';
tooltip.style.display = 'none';
tooltip.style.position = 'absolute';
tooltip.style.top = '0';
tooltip.style.bottom = '0';
tooltip.style.textAlign = 'center';
tooltip.style.background = 'rgba(0, 0, 0, 0.75)';
tooltip.style.color = '#ffffff';
tooltip.style.border = '1px solid #000';
tooltip.style.borderRadius = '5px';
tooltip.innerHTML = '123';
document.body.appendChild(tooltip);

fetch('/api/statuscountgroupbydate')
    .then(function(response) { return response.json(); })
    .then(function(data) { 
        const statuscountgroupbydate = data.results;
        let dateDict = {};
        statuscountgroupbydate.forEach(e => {
            let s = e.ac_count != null ? "AC: " + e.ac_count + " " : "";
            s +=  e.wa_count != null ? "WA: " + e.wa_count + " " : "";
            s +=  e.tle_count != null ? "TLE: " + e.tle_count + " " : "";
            dateDict[e.date] = s.trim(); 
        });
        console.log(statuscountgroupbydate);

        // Attach events to show/hide tooltip
        calendar.addDateEventListener('mousemove', function(event, date) {
            tooltip.style.top = Math.round(event.pageY) + 'px';
            tooltip.style.left = Math.round(event.pageX) + 'px';
            const dateToString = jsCalendar.tools.dateToString(date, 'yyyy-MM-DD');
            if (dateDict.hasOwnProperty(dateToString)) {
                tooltip.innerHTML = dateDict[dateToString];
                tooltip.style.display = 'block';
            } else {
                tooltip.style.display = 'none';
            }
            
        }, false);
        calendar.addDateEventListener('mouseout', function() {
            tooltip.style.display = 'none';
        }, false);
    })
    .catch(function(error) { console.log(error); })