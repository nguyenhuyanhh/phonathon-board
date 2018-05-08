"use strict";

var sheet = new Sheet();

function loadTimesheets() {
    // load the spreadsheet using Tabletop
    console.debug("Refreshing data from spreadsheet.");
    sheet.clear();
    Tabletop.init({
        key: URL,
        wanted: ["Settings", "Callers", "Timesheets"],
        callback: processTimesheets,
    });
}

function parseCallers(data) {
    // Parse callers from sheet "Callers"
    for (var i = 0; i < data.length; i++) {
        // get caller
        var row = data[i];
        var caller = new SheetCaller(row["Name"], row["Full Name"], row["Role"], row["IC"], row["Matric"], row["Email"]);
        sheet.callers[row["Name"]] = caller;
    }
}

function parseTimesheets(data, shifts) {
    // Parse timesheets from sheet "Timesheets"
    // Initialize lookup with shifts
    var lookup = {};
    shifts.forEach(shift => {
        lookup[shift] = { "callers": [] };
    });

    // First row: supervisors
    var sups = data[0];
    for (var key in sups) {
        var value = sups[key];
        try {
            if (value == "Supervisor") {
                // first column, don't care
                continue;
            }
            // check whether cell value is a valid supervisor
            if (sheet.callers.hasOwnProperty(value)) {
                var sup = sheet.callers[value];
                if (sup.role == "Supervisor") {
                    lookup[key]["supervisor"] = sheet.callers[value];
                } else {
                    throw value + " is not a supervisor";
                }
            } else {
                throw value + " is not a caller";
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Remaining rows
    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        for (key in row) {
            value = row[key];
            try {
                if (!value) {
                    // empty cell
                    continue;
                }
                // check whether cell value is a valid caller
                if (sheet.callers.hasOwnProperty(value)) {
                    lookup[key]["callers"].push(sheet.callers[value]);
                } else {
                    throw value + "is not a caller";
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    // Create SheetShift objects
    for (key in lookup) {
        value = lookup[key];
        if (value.hasOwnProperty("supervisor")) {
            var supervisor = value["supervisor"];
        } else {
            supervisor = false;
        }
        var shift = new SheetShift(key, supervisor, value["callers"]);
        sheet.shifts[key] = shift;
    }
}

function processTimesheets(data, tabletop) {
    // Parse the spreadsheet
    parseCallers(tabletop.sheets("Callers").all());

    var t = tabletop.sheets("Timesheets");
    var shifts = [];
    t.columnNames.forEach(element => {
        if (element != "Shift") {
            shifts.push(element);
        }
    });
    parseTimesheets(t.all(), shifts);
}

window.addEventListener("DOMContentLoaded", loadTimesheets);