const table = document.querySelector(".table");
const months = document.querySelector(".month-container");
// const Chart = require("chart");
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

    // const box = document.createElement("div");
    // box.classList.add("day");
    // box.style.background = "white";
    // box.setAttribute("id", `${week}`);
    // element.appendChild(box);

    for (let i = 0; i < 7; i++) {
        const box = document.createElement("div");
        box.classList.add("day");
        // const dayContent = document.createElement("div");
        // dayContent.classList.add("day-content");
        // box.addEventListener("click", () => {
        //     dayContent.classList.toggle("active");
        // })
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

    // const box = document.createElement("div");
    // box.classList.add("day");
    // box.style.background = "white";
    // box.setAttribute("id", `${week}`);
    // element.appendChild(box);

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

    // const box = document.createElement("div");
    // box.classList.add("day");
    // box.setAttribute("id", `${week}`);
    // box.style.background = "white";
    // element.appendChild(box);

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
    // const date = new Date(Date.UTC(2020, 0, day));
    // const option = { weekday: "short" };
    // return new Intl.DateTimeFormat("en-US", option).format(date);
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
        // for (let i = 0; i < 12; i++) {
        //     if (num < leap[i + 1]) {
        //         const date = new Date(Date.UTC(year, i, num - leap[i]));
        //     }
        // }
    } else {
        nonLeap.forEach((numDay, idx) => {
            if (num > numDay) {
                month = idx;
                day = num - numDay;
            }
        })
        // for (let i = 0; i < 12; i++) {
        //     if (num < nonLeap[i + 1]) {
        //         const date = new Date(Date.UTC(year, i, num - nonLeap[i]));
        //     }
        // }
    }
    const date = new Date(Date.UTC(year, month, day));
    const option = { weekday: "short" };
    return date;

}

// const loginForm = document.querySelector(".login-form");
// const showPasswordIcon =
//     loginForm && loginForm.querySelector(".show-password");
// const inputPassword =
//     loginForm && loginForm.querySelector('input[type="password"');
// showPasswordIcon.addEventListener("click", function () {
//     const inputPasswordType = inputPassword.getAttribute("type");
//     inputPasswordType === "password"
//         ? inputPassword.setAttribute("type", "text")
//         : inputPassword.setAttribute("type", "password");
// });

drawTable(2020);
generateMonths();

// graph part
let mychart = document.getElementById("myChart").getContext("2d");
// Global option
Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultFontColor = "#777";



let massPopChart = new Chart(mychart, {
    type: "bar",    // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
        labels: ["A", "B", "C", "D", "E", "F"],
        datasets: [{
            label: "Density",
            data: [
                123,
                125,
                543,
                235,
                45,
                23
            ],
            // backgroundColor: "green",
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 215, 0.6)',
                'rgba(255, 205, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(153, 102, 255, 0.6)',
            ],
            borderWidth: 4,
            borderColor: "#777",
            hoverBorderWidth: 3,
            hoverBorderColor: "#000"
        }, {
            label: "Amount",
            data: [
                12,
                4,
                5,
                16,
                20,
                9
            ]
        }],
    },
    options: {
        title: {
            display: true,
            text: "Testing",
            fontSize: 25,
        },
        legend: {
            // display: false,
            position: "right",  // top, bottom, left, right
            labels: {
                fontColor: "#000",
            }
        },
        layout: {
            padding: {
                left: 50,
                right: 0,
                bottom: 0,
                top: 0
            }
        },
        tooltips: {
            enabled: true
        }

    }

});