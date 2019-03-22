"use strict";

var sheet = new Sheet();

function loadTimesheets() {
  // load the spreadsheet using Tabletop
  console.debug("Refreshing data from spreadsheet.");
  sheet.clear();
  Tabletop.init({
    key: URL,
    wanted: ["Settings", "Callers", "Timesheets"],
    callback: processTimesheets
  });
}

function parseCallers(data) {
  // Parse callers from sheet "Callers"
  for (var i = 0; i < data.length; i++) {
    // get caller
    var row = data[i];
    var caller = new SheetCaller(
      row["Name"],
      row["Full Name"],
      row["Role"],
      row["IC"],
      row["Matric"],
      row["Email"]
    );
    sheet.callers[row["Name"]] = caller;
  }
}

function parseShifts(data) {
  // Parse shifts from the header row of sheet "Timesheets"
  var year = new Date().getFullYear();
  var shifts = {};
  data.forEach(datetime_str => {
    if (datetime_str != "Shift") {
      // parse the date/time from str
      // format: day/month start_time-end_time (1/5 1830-2130)
      var shift = {};
      var datetime = datetime_str.split(" ");
      var date_str = datetime[0];
      var time_str = datetime[1];
      var d = date_str.split("/");
      var t = time_str.split("-");
      var month = parseInt(d[1]) - 1;
      var day = parseInt(d[0]);
      var start_time = new Date(
        year,
        month,
        day,
        parseInt(t[0].slice(0, 2)),
        parseInt(t[0].slice(2))
      );
      var end_time = new Date(
        year,
        month,
        day,
        parseInt(t[1].slice(0, 2)),
        parseInt(t[1].slice(2))
      );
      shift.year = year;
      shift.month = month;
      shift.day = day;
      shift.start_time = start_time;
      shift.end_time = end_time;
      shift.sunday = start_time.getDay() == 0 ? true : false;
      shifts[datetime_str] = shift;
    }
  });
  return shifts;
}

function parseCell(cell, col, shifts, supervisor) {
  // Parse a non-header cell from sheet "Timesheets"
  if (!cell || cell == "Supervisor") {
    // empty/ useless cell
    return;
  }
  var obj = shifts[col];

  try {
    // Parse the caller name and timing info
    var caller_time = cell.trim().split("(");
    if (caller_time.length == 1) {
      // normal shifts
      var caller = caller_time[0];
      var start_time = new Date(obj.start_time);
      var end_time = new Date(obj.end_time);
    } else if (caller_time.length == 2) {
      // different start time/ end time
      caller = caller_time[0].trim();
      var start_end_str = caller_time[1].trim().slice(0, 9);
      var t = start_end_str.split("-");
      start_time = new Date(
        obj.year,
        obj.month,
        obj.day,
        parseInt(t[0].slice(0, 2)),
        parseInt(t[0].slice(2))
      );
      end_time = new Date(
        obj.year,
        obj.month,
        obj.day,
        parseInt(t[1].slice(0, 2)),
        parseInt(t[1].slice(2))
      );
    } else {
      throw "Invalid cell: " + cell;
    }

    // Check caller
    if (sheet.callers.hasOwnProperty(caller)) {
      var callerObj = sheet.callers[caller];
    } else {
      throw "Invalid caller " + caller;
    }

    // Assign supervisor
    if (supervisor) {
      if (callerObj.role != "Supervisor") {
        shifts[col].supervisor = undefined;
        throw "Not a supervisor: " + caller;
      } else {
        shifts[col].supervisor = caller;
      }
    }

    // Adjust timing for supervisor
    if (supervisor) {
      if (!obj.sunday) {
        // non-Sunday shifts, shift start time 15 mins earlier
        start_time.setMinutes(start_time.getMinutes() - 15);
      } else if (obj.start_time.getHours() == 16) {
        // Sunday shifts, shift end time 15 mins later
        end_time.setMinutes(end_time.getMinutes() + 15);
      }
    }

    // Make SheetShift obj
    if (supervisor) {
      // Supervisor shift
      var type = "Supervisor";
      var sup = undefined;
    } else if (callerObj.role == "Caller") {
      // Caller shift
      type = "Caller";
      sup = obj.supervisor;
    } else {
      // Mentor shift
      type = "Mentor";
      sup = obj.supervisor;
    }
    callerObj.addShift(col, new SheetShift(type, start_time, end_time, sup));
  } catch (error) {
    console.error(error);
    return;
  }
}

function parseTimesheets(data, shifts) {
  // Parse timesheets from sheet "Timesheets"
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var supervisor = i == 0 ? true : false;
    for (var col in row) {
      var cell = row[col];
      parseCell(cell, col, shifts, supervisor);
    }
  }
}

function displayTimesheets() {
  // Display the timesheets
  sheet = sheet.filter();

  // Populate callers
  var sel = document.getElementById("sheet-caller");
  for (var caller in sheet.callers) {
    var opt = document.createElement("option");
    opt.value = caller;
    opt.innerHTML = caller;
    sel.appendChild(opt);
  }
}

function processTimesheets(data, tabletop) {
  // Parse the spreadsheet
  parseCallers(tabletop.sheets("Callers").all());

  var shifts = parseShifts(tabletop.sheets("Timesheets").columnNames);
  parseTimesheets(tabletop.sheets("Timesheets").all(), shifts);

  // Display timesheets
  displayTimesheets();
}

function formHandler(f) {
  var formData = new FormData(f.target);
  console.log(formData);
}

window.addEventListener("DOMContentLoaded", loadTimesheets);
document.querySelector("form").addEventListener("submit", formHandler);
