fetch('/api/statuscountgroupbydate')
    .then(response => response.json())
    .then(data => { console.log(data); })
    .catch(error => { console.log(error); })

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
    const date = new Date(Date.UTC(year, month, day));
    return date;

}

drawTable(2020);
generateMonths();