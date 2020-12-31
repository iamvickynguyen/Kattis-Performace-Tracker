let modalBtn = document.getElementById("modalBtn");
let modalHeader = document.getElementById("exampleModalLongTitle");
let modalBody = document.getElementById("modal-body");

// Calendarize lib
var calendar = document.getElementById("user-calendar");
var currentYear = new Date().getFullYear();
var calendarize = new Calendarize();

function createDetailList(l) {
    const ul = document.createElement("ul");
    ul.setAttribute("id", "myUl");
    document.body.appendChild(ul);

    l.forEach(function(item) {
        var li = document.createElement("li");
        var t = document.createTextNode(`${item.problem} ${item.time} ${item.status} ${item.cpu} ${item.lang}`);
        li.appendChild(t);
        document.getElementById("myUl").appendChild(li);
    });

    return ul;
}

var getDetailData = function(date) {
    let queryDate = new Date(date.toString()).toISOString().slice(0,10)
    fetch(`/api/details/${queryDate}`)
    .then(function(response) { return response.json(); })
    .then(function(data) {
        while (modalBody.firstChild) { modalBody.removeChild(modalBody.firstChild); }
        modalHeader.innerHTML = queryDate;
        modalBody.appendChild(createDetailList(data.results));
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