"use strict";

/* exported Board, BoardCaller, BoardPledge, comparePledgeAmount, comparePledgeOrder */

// Object definitions

const TYPE_PL = 1; // pledge
const TYPE_CC = 2; // credit card
const TYPE_GR = 3; // GIRO
const TYPES = { 1: "P", 2: "C", 3: "G" };

class BoardCaller {
    constructor (name) {
        // define a Caller
        this.name = name;
        // array of BoardPledge objects
        this.pledges = [];
        // total number of pledges
        this.pledgeCount = 0;
        // number of pledges of each type
        this.pledgeCounts = { 1: 0, 2: 0, 3: 0 };
        // total amount of pledges of each type
        this.pledgeAmounts = { 1: 0, 2: 0, 3: 0 };
    }

    addPledge (pledge) {
        // Add a pledge to the caller's pledges
        this.pledges.push(pledge);
        // update the count and amount
        this.pledgeCount++;
        this.pledgeCounts[pledge.type]++;
        this.pledgeAmounts[pledge.type] += pledge.amount;
    }

    toStr () {
        // String representation of the Caller object
        // e.g. Caller X getting 1 pledges, 1 credits, 1 GIROs: (P)100,(C)50,(G)10
        var plgs = [];
        this.pledges.forEach(element => {
            plgs.push(element.toStr());
        });
        if (plgs.length) {
            return ("Caller " + this.name + " getting " + this.pledgeCounts[TYPE_PL] + " pledges, " + this.pledgeCounts[TYPE_CC] + " credits, " + this.pledgeCounts[TYPE_GR] + " GIROs: " + plgs.join(","));
        }
        else {
            return ("Caller " + this.name + " gets no pledge");
        }
    }
}

function compareCaller(caller1, caller2) {
    // compare callers based on number of pledges, then name
    if (caller1.pledgeCount != caller2.pledgeCount) {
        return caller1.pledgeCount - caller2.pledgeCount;
    }
    if (caller1.pledgeCounts[TYPE_GR] != caller2.pledgeCounts[TYPE_GR]) {
        return caller1.pledgeCounts[TYPE_GR] - caller2.pledgeCounts[TYPE_GR];
    }
    if (caller1.pledgeCounts[TYPE_CC] != caller2.pledgeCounts[TYPE_CC]) {
        return caller1.pledgeCounts[TYPE_CC] - caller2.pledgeCounts[TYPE_CC];
    }
    if (caller1.pledgeCounts[TYPE_PL] != caller2.pledgeCounts[TYPE_PL]) {
        return caller1.pledgeCounts[TYPE_PL] - caller2.pledgeCounts[TYPE_PL];
    }
    if (caller1.name < caller2.name) {
        return 1;
    }
    if (caller1.name > caller2.name) {
        return -1;
    }
    return 0;
}

class BoardPledge {
    constructor (amount, type, sortOrder) {
        // define a Pledge
        this.amount = amount;
        // pledge type
        this.type = type;
        // pledge sort order
        this.sortOrder = sortOrder;
    }

    toStr () {
        // String representation of a Pledge object
        // e.g. (P)50
        return ("(" + TYPES[this.type] + ")" + this.amount);
    }
}

function comparePledgeAmount(pledge1, pledge2) {
    // compare pledges based on type, then amount
    if (pledge1.type != pledge2.type) {
        return pledge1.type - pledge2.type;
    }
    if (pledge1.amount != pledge2.amount) {
        return pledge1.amount - pledge2.amount;
    }
    return 0;
}

function comparePledgeOrder(pledge1, pledge2) {
    // compare pledges based on type, then sort order
    if (pledge1.type != pledge2.type) {
        return pledge1.type - pledge2.type;
    }
    if (pledge1.sortOrder != pledge2.sortOrder) {
        return pledge1.sortOrder - pledge2.sortOrder;
    }
    return 0;
}

class Board {
    constructor () {
        // array of BoardCaller objects
        this.callers = [];
    }

    clear () {
        // Clear the board
        if (this.callers) {
            this.callers = [];
        }
    }

    sort () {
        // Sort callers in descending order
        this.callers.sort(compareCaller).reverse();
    }
}