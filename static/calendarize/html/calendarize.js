/* Author: Jim Camut */

function Calendarize() {
	// var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	// var dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
	var monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
	var dayNames = ["S", "M", "T", "W", "T", "F", "S"];

	return {

		// Return the days in a month - given a year and the month number
		getDaysInMonth: function(month, year) {
			var date = new Date(year, month, 1);
			var days = [];
			while (date.getMonth() === month) {
				days.push(new Date(date));
				date.setDate(date.getDate() + 1);
			}
			return days;
		},

		// return an array of the first day of each month for a given year
		getMonthsInYear: function(year) {
			var date = new Date(year, 0, 1);
			var months = [];
			var monthCount = 0;
			while (monthCount < 12) {
				months.push(new Date(date));
				date.setMonth(date.getMonth() + 1);
				monthCount++;
			}
			return months;
		},

		getMonthsInRange: function(startDate, endDate) {
			var start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
			var end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
			var months = [];
			var monthCount = 0;
			while (start <= end) {
				months.push( new Date(start) );
				start.setMonth(start.getMonth() + 1);
				monthCount++;
			}
			return months;
		},

		// Create a full 12-month calendar
		buildYearCalendar: function(el, year) {
			var _this = this;
			var months = _this.getMonthsInYear(year);

			var opts = {
				showMonth: true,
				showDaysOfWeek: true,
				showYear: true,
				clickHandler: function(e) {
					var day = e.target.getAttribute("data-date");
					//alert(day);
				}
			};

			months.forEach(function(a, b) {
				var $monthNode = _this.buildMonth(b, year, opts);
				el.appendChild($monthNode);
			});
		},

		buildMonthsInRange: function(el, opts, startDate, limit) {
			var _this = this;
			var endDate = new Date( new Date().setDate(startDate.getDate() + limit) );
			var months = _this.getMonthsInRange(startDate, endDate);
			
			opts = opts  || {};
			opts.limitDate = endDate || false;
			if (opts.reverse) months = months.reverse();

			months.forEach(function(a, b) {
				var month = a.getMonth();
				var year = a.getFullYear();
				var $monthNode = _this.buildMonth(month, year, opts);
				el.appendChild($monthNode);
			});
		},

		// Generate months between startDate and endDate
		buildMonthsWithStartAndEndDates: function(el, opts, startDate, endDate, func) {
			var _this = this;
			var months = _this.getMonthsInRange(startDate, endDate);

			var func = func || function() {};

			var opts = {
				showMonth: true,
				showDaysOfWeek: true,
				showYear: true,
				clickHandler: function(e) {
					var day = e.target.getAttribute("data-date");
					func(day);
				},
				color: opts.color || "#fff",
				selectedDates: opts.selectedDates || {},
				tooltip: opts.tooltip || {}
			};

			months.forEach(function(a, b) {
				var month = a.getMonth();
				var year = a.getFullYear();
				var $monthNode = _this.buildMonth(month, year, opts);
				el.appendChild($monthNode);
			});
		},

		// Add days and place fillers for a given month
		// This function and the one above needs consolidated
		buildMonth: function(monthNum, year, opts) {
			//if (monthNum === undefined || year === undefined) return "something is missing";
			var _this = this;
			var dtm = new Date(year, monthNum, 1);
			var dtmMonth = dtm.getMonth();
			var prevM = new Date(dtm.setMonth(dtmMonth - 1));
			var nextM = new Date(dtm.setMonth(dtmMonth + 1));
			var daysInMonth = _this.getDaysInMonth(monthNum, year);
			var daysPrevMonth = _this.getDaysInMonth(prevM.getMonth(), prevM.getFullYear());
			var daysNextMonth = _this.getDaysInMonth(nextM.getMonth(), nextM.getFullYear());
			var $monthNode = document.createElement('div');
			var $titleNode = document.createElement('h6');
			var skipLength = daysInMonth[0].getDay();
			var preLength = daysInMonth.length + skipLength;
			var postLength = function() {
				if (preLength % 7 === 0) {
					return 0;
				} else {
					if (preLength < 35) {
						return 35 - preLength;
					} else {
						return 42 - preLength;
					}
				}
			}

			$monthNode.classList.add('month');

			// Add a Title to the month
			if (opts.showMonth) {
				$titleNode.innerText =  (opts.showYear ? year : '') + "/" + monthNames[monthNum];
				$monthNode.appendChild($titleNode);
			}


			// Add Days of week to the top row
			if (opts.showDaysOfWeek) {
				dayNames.forEach(function(a, b) {
					var $dayNode = document.createElement('div');
					$dayNode.classList.add('dow');
					$dayNode.innerText = dayNames[b];
					$monthNode.appendChild($dayNode);
				});
			}


			// Add blank days to fill in before first day
			for (var i = 0; i < skipLength; i++) {
				var $dayNode = document.createElement('div');
				$dayNode.classList.add('dummy-day');
				$dayNode.innerText = daysPrevMonth.length - (skipLength - (i + 1));
				$monthNode.appendChild($dayNode);
			}


			// Place a day for each day of the month
			daysInMonth.forEach(function(c, d) {
				var today = new Date(new Date().setHours(0, 0, 0, 0));
				var $dayNode = document.createElement('div');
				$dayNode.classList.add('day');
				$dayNode.setAttribute("data-date", c);
				$dayNode.innerText = (d + 1);
				var dow = new Date(c).getDay();
				var dateParsed = Date.parse(c);
				var todayParsed = Date.parse(today);

				if (dateParsed === todayParsed) $dayNode.classList.add('today');
				if (dateParsed > todayParsed) $dayNode.classList.add('future');
				if (dateParsed <todayParsed) $dayNode.classList.add('past');

				if (dow === 0 || dow === 6) $dayNode.classList.add('weekend');
				if (opts.onlyCurrent && c < today) $dayNode.classList.add('dummy-day');
				if (opts.limitDate) {
					if (c > opts.limitDate) {
						$dayNode.classList.add('dummy-day');
					}
				}

				if (opts.filterDayOfWeek) {
					var valid = false;
					for (var i = 0; i < opts.filterDayOfWeek.length; i++) {
						if (c.getDay() == opts.filterDayOfWeek[i]) {
							valid = true;
						}
					}
					if (!valid) {
						$dayNode.classList.add('dummy-day');
					}
				}

				var twodigitdate = ("0" + (d + 1)).slice(-2);
				var twodigitmonth = ("0" + (monthNum + 1)).slice(-2);
				var dateFormat = `${year}-${twodigitmonth}-${twodigitdate}`;
				if (opts.selectedDates.hasOwnProperty(dateFormat)) {
					if (opts.clickHandler && !$dayNode.classList.contains('dummy-day')) {
						function handleEvent(e) {
							e = e || window.event;
							e.preventDefault();
							e.stopPropagation();
							var touches = false;
							if (!touches) {
								touches = true;
								setTimeout(function() {
									touches = false;
								}, 300);
								opts.clickHandler(e);
							}
						}
						$dayNode.addEventListener("touchstart", handleEvent);
						$dayNode.addEventListener("mousedown", handleEvent);
					}
		
					$dayNode.style.backgroundColor = opts.color || "fff";

					if (opts.tooltip && Object.keys(opts.tooltip).length > 0)
						$dayNode.setAttribute("title", opts.tooltip[dateFormat]);
				}
				
				$monthNode.appendChild($dayNode);
			});

			// Add in the dummy filler days to make an even block
			for (var j = 0; j < postLength(); j++) {
				var $dayNode = document.createElement('div');
				$dayNode.classList.add('dummy-day');
				$dayNode.innerText = j + 1;
				$monthNode.appendChild($dayNode);
			}

			return $monthNode;

		}
	}
}

