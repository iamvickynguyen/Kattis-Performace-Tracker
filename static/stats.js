let modalBtn = document.getElementById("modalBtn");
let modalHeader = document.getElementById("detailDateModal");
let modalTableRows = document.getElementById("modalTableRows");
let carouselContainer = document.getElementById("carousel-container");
const username = new URL(window.location.href).pathname.split('/')[1];

function clearChildren(el) {
    while (el.firstChild) { el.removeChild(el.firstChild); }
}

function createCarouselSlide(el, year) {
    // calendar
    const carouselItem = document.createElement("div");
    carouselItem.setAttribute("class", "carousel-item");
    carouselItem.setAttribute("id", `carousel-item-${year}`);
    el.appendChild(carouselItem);

    const calendarElement = document.createElement("div");
    calendarElement.setAttribute("id", `user-calendar-${year}`);
    calendarElement.setAttribute("class", "container");

    // title
    const calendarTitleDiv = document.createElement("div");
    calendarTitleDiv.setAttribute("class", "calendar-title");
    const calendarYearHeader = document.createElement("h1");
    const calendarYearCaption = document.createTextNode(`${year}`);
    calendarYearHeader.appendChild(calendarYearCaption);
    calendarTitleDiv.appendChild(calendarYearHeader)

    carouselItem.appendChild(calendarTitleDiv);
    carouselItem.appendChild(calendarElement);
    el.appendChild(carouselItem);
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
    fetch(`/api/details?user=${username}&date=${queryDate}`)
    .then(function(response) { return response.json(); })
    .then(function(data) {
        clearChildren(modalTableRows);
        createDetailRows(modalTableRows, data.results);
        modalHeader.innerHTML = queryDate;
        modalBtn.click();
    })
    .catch(function(error) { console.log(error); })
}

fetch(`/api/statuscountgroupbydate?user=${username}`)
    .then(function(response) { return response.json(); })
    .then(function(data) { 
        years = {};
        data.results.forEach(function(item) { years[item.date.substring(0, 4)] = true; });
        //clearChildren(carouselContainer);

        for (const y in years) {
            createCarouselSlide(carouselContainer, y);

            let calendarize = new Calendarize();

            const statuscountgroupbydate = data.results.filter(function(item) { return item.date.substring(0, 4) == y; } );
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
    
            let calendar = document.getElementById(`user-calendar-${y}`);
            calendarize.buildMonthsWithStartAndEndDates(calendar, {'color': '#FFA384', 'selectedDates': selectedDates, 'tooltip': dateDict}, minDate, maxDate, getDetailData);
        }

        // set current year active
        let yearArr = [];
        for (const y in years) { yearArr.push(y); }
        let curYear = yearArr.reduce(function(a, b) { return Math.max(a, b); });
        let curCarousel = document.getElementById(`carousel-item-${curYear}`);
        curCarousel.classList.add("active");
    })
    .catch(function(error) { console.log(error); })