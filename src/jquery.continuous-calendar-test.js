module("calendar rendering", {
  setup: createCalendarContainer
});

test("shows year", function() {
  createCalendarWithOneWeek();
  assertHasValues(".continuousCalendar thead th.month", ["2008"]);
});

test("shows week days", function() {
  cal({startDate: "4/30/2008"}).continuousCalendar({weeksBefore: 0,weeksAfter: 0});
  assertHasValues(".continuousCalendar thead th.weekDay", [
    "ma", "ti", "ke", "to", "pe", "la", "su"
  ]);
});

test("lists week days for vappu 2009", function() {
  cal({startDate: "4/20/2009", endDate: "4/26/2009"}).continuousCalendar({weeksBefore: 0,weeksAfter: 0});
  equals($.trim(cal().find(".continuousCalendar tbody").html()),
    '<tr>' +
    '<th class="month odd"></th>' +
    '<th class="week odd">17</th>' +
    '<td class="date odd selected">20</td>' +
    '<td class="date odd selected">21</td>' +
    '<td class="date odd selected">22</td>' +
    '<td class="date odd selected">23</td>' +
    '<td class="date odd selected">24</td>' +
    '<td class="date odd selected">25</td>' +
    '<td class="date odd selected">26</td>' +
    '</tr>'
    );
});

test("lists given number of weeks before given date", function() {
  cal({startDate: "4/18/2009"}).continuousCalendar({weeksBefore: 2,weeksAfter: 0});
  assertHasValues(".date", [
    30, 31, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19
  ]);
});

test("lists given number of weeks after given date", function() {
  cal({startDate: "4/18/2009"}).continuousCalendar({weeksBefore: 0,weeksAfter: 2});
  assertHasValues(".date", [
    13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 1, 2, 3
  ]);
});

test("shows month name on first row of full week", function() {
  cal({startDate: "4/30/2009"}).continuousCalendar({weeksBefore: 0,weeksAfter: 5});
  var months = cal().find(" tbody .month");
  equals(months.size(), 6);
  var firstMonth = months.eq(1);
  equals(firstMonth.text(), "toukokuu");
  equals(firstMonth.next().next().text(), "4");
  var secondMonth = months.eq(5);
  equals(secondMonth.text(), "kesäkuu");
  equals(secondMonth.next().next().text(), "1");
});

test("highlights current date and shows year for janary", function() {
  var today = new Date();
  createBigCalendar();
  var cells = cal().find(".today");
  equals(cells.size(), 1);
  equals(cells.text(), today.getDate());
  equals(cal().find(".month").withText("tammikuu").parent().next().find(".month").text(), "2009");
});

test("highlights selected date", function() {
  cal({startDate:"4/30/2009"}).continuousCalendar({weeksBefore:2,weeksAfter:2});
  equals(cal().find(".selected").text(), "30");
});

test("higlights selected date range", function() {
  createRangeCalendarWithThreeWeeks();
  equals(cal().find(".selected").size(), 7);
});

test("if start date not selected show around current day instead", function() {
  cal().continuousCalendar({weeksBefore: 0,weeksAfter: 0});
  var today = new Date();
  equals(cal().find(".date").size(), 7);
  var weekDays = [];
  var firstDay = today.getFirstDateOfWeek(Date.MONDAY);
  for (var i = 0; i < 7; i++) {
    weekDays.push(firstDay.plusDays(i).getDate());
  }
  assertHasValues(".date", weekDays);
  equals(cal().find(".selected").size(), 0);
});

test("render week numbers", function() {
  createCalendarWithOneWeek();
  ok(cal().find(".week").text() > 0);
});

test("calendar with no range has no range class", function() {
  createCalendarWithOneWeek();
  ok(!cal().find(".calendarBody").hasClass("range"));
});

test("calendar with range has range class", function() {
  createRangeCalendarWithThreeWeeks();
  ok(cal().find(".calendarBody").hasClass("range"));
});

module("calendar events", {
  setup: createCalendarContainer
});

test("highlights and selects clicked day", function() {
  createCalendarWithOneWeek();
  cal().find(".date:eq(1)").click();
  equals(cal().find(".selected").text(), "29");
  equals(startFieldValue(), "4/29/2008");
});

test("week number click selects whole week", function () {
  createRangeCalendarWithThreeWeeks();
  cal().find(".week").withText(18).click();
  assertHasValues(".selected", [27,28,29,30,1,2,3]);
  equals(startFieldValue(), "4/27/2009");
  equals(endFieldValue(), "5/3/2009");
});

test("week number click on single date calendar does nothing", function () {
  cal({startDate: "4/18/2009"}).continuousCalendar({weeksBefore: 2,weeksAfter: 0});
  cal().find(".week").withText(15).click();
  equals(cal().find(".selected").size(), 1);
});

var preventDefaultIsCalled;

test("mouse click and drag highlights range and updates fields", function() {
  preventDefaultIsCalled = false;
  createRangeCalendarWithThreeWeeks();
  mouseDownOnDay(27);
  mouseMoveOnDay(27);
  mouseMoveOnDay(28);
  mouseMoveOnDay(29);
  mouseUpOnDay(29);
  equals(cal().find(".selected").size(), 3);
  equals(startFieldValue(), "4/27/2009");
  equals(endFieldValue(), "4/29/2009");
  ok(preventDefaultIsCalled, "prevent default is called");
});

test("mouse click on month selects whole month", function() {
  //TODO use calendar with a full month
  createBigCalendar();
  cal().find(".month").withText("toukokuu").click();
  equals(cal().find(".selected").size(), 31);
  equals(startFieldValue(), "5/1/2009");
  equals(endFieldValue(), "5/31/2009");
  
});

test("range is movable", function() {
  createRangeCalendarWithThreeWeeks();
  mouseDownOnDay(30);
  mouseMoveOnDay(27);
  mouseUpOnDay(27);
  assertHasValues(".selected", [26,27,28,29,30,1,2]);
});

var testIndex = 0;

function createCalendarContainer() {
  testIndex++;
  var container = $("<div>").css({
    margin: "10px",
    float: "left",
    height: "160px"
  });
  var index = $('<div></div>').append(testIndex).css({
    "font-weight": "bold",
    "color": "green"
  });
  container.attr("id", calendarId());
  container.append(index);
  $("#main").append(container);
}

function cal(params) {
  var container = $("#" + calendarId());
  addFieldIfRequired("startDate");
  addFieldIfRequired("endDate");
  function addFieldIfRequired(fieldName) {
    if (params && params[fieldName]) {
      var field = $("<input>").attr("type", "text").addClass(fieldName).val(params[fieldName]);
      container.append(field);
    }
  }

  return container;
}

function _mouseEvent(functionName, date) {
  cal().data(functionName)({
    target:cal().find(".date").withText(date),
    preventDefault: function() {preventDefaultIsCalled = true;
    }
  });
}

function mouseDownOnDay(date) {
  _mouseEvent("mouseDown", date);
}

function mouseMoveOnDay(date) {
  _mouseEvent("mouseMove", date);
}

function mouseUpOnDay(date) {
  _mouseEvent("mouseUp", date);
}

function calendarId() {
  return "continuousCalendar" + testIndex;
}

function createCalendarWithOneWeek() {
  cal({startDate:"4/30/2008"}).continuousCalendar({weeksBefore: 0,weeksAfter: 0});
}

function createRangeCalendarWithThreeWeeks() {
  cal({startDate: "4/29/2009", endDate: "5/5/2009"}).continuousCalendar({weeksBefore:2,weeksAfter:2});
}
function createBigCalendar() {
  var todayText = new Date().format(dateFormat.masks.constructorFormat);
  cal({startDate: todayText, endDate: todayText }).continuousCalendar({weeksBefore: 20,weeksAfter: 20});
}

function assertHasValues(selector, expectedArray) {
  same($.map(cal().find(selector), function (elem) {
    return $(elem).text();
  }), $.map(expectedArray, function(i) { return i.toString();}));
}

function startFieldValue() {
  return cal().find("input.startDate").val();
}

function endFieldValue() {
  return cal().find("input.endDate").val();
}