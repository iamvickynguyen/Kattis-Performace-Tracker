let modalBtn = document.getElementById("modalBtn");
let modalHeader = document.getElementById("detailDateModal");
let modalTableRows = document.getElementById("modalTableRows");

// Calendarize lib
var calendar = document.getElementById("user-calendar");
var currentYear = new Date().getFullYear();
var calendarize = new Calendarize();

function clearChildren(el) {
    while (el.firstChild) { el.removeChild(el.firstChild); }
}

function createDetailRows(el, data) {
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        const r = document.createElement("tr");
        r.setAttribute("id", `detailRow${i}`);
        el.appendChild(r);
        var texts = [item.problem, item.time, item.status, item.cpu, item.lang];
        texts.forEach(function(txt) {
            var td = document.createElement("td");
            var tdtxt = document.createTextNode(txt);
            td.appendChild(tdtxt);
            document.getElementById(`detailRow${i}`).appendChild(td);
        });
    };
}

var getDetailData = function(date) {
    let queryDate = new Date(date.toString()).toISOString().slice(0,10)
    fetch(`/api/details/${queryDate}`)
    .then(function(response) { return response.json(); })
    .then(function(data) {
        clearChildren(modalTableRows);
        createDetailRows(modalTableRows, data.results);
        modalHeader.innerHTML = queryDate;
        modalBtn.click();
    })
    .catch(function(error) { console.log(error); })
}

fetch('/api/statuscountgroupbydate')
    .then(function(response) { return response.json(); })
    .then(function(data) { 
        const statuscountgroupbydate = data.results;
        let selectedDates = {};
        statuscountgroupbydate.forEach(function(d) { selectedDates[d.date] = true; });

        const allDates = statuscountgroupbydate.map(function(d) { return new Date(d.date); });
        const maxDate = new Date(Math.max.apply(null, allDates));
        const minDate = new Date(Math.min.apply(null, allDates));

        let dateDict = {};
        statuscountgroupbydate.forEach(function(e) {
            let s = e.ac_count != null ? "AC: " + e.ac_count + " " : "";
            s +=  e.wa_count != null ? "WA: " + e.wa_count + " " : "";
            s +=  e.tle_count != null ? "TLE: " + e.tle_count + " " : "";
            s +=  e.others_count != null ? "Others: " + e.others_count + " " : "";
            dateDict[e.date] = s.trim(); 
        });

        calendarize.buildMonthsWithStartAndEndDates(calendar, {'color': '#FFA384', 'selectedDates': selectedDates, 'tooltip': dateDict}, minDate, maxDate, getDetailData);
    })
    .catch(function(error) { console.log(error); })