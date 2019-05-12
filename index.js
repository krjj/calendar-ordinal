var argv = require('minimist')(process.argv.slice(2));

/**
 @constant
 @type {Array}  
 @default
*/
var gregorianReform = [1929, 02, 01, 13]

/**
 @constant
 @type {number}
 @default
*/
var ordinalDay = 244

/**
 @constant
 @type {Array}
 @default
*/
const month = ['-', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/**
 @constant
 @type {Array}
 @default
*/
const monthCount = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

/**
 * Checks if the year is before Gregorian Reform year
 * @param {number} year - Year to check
 * @returns {boolean}
 * @example
 * isJulianYear(2017)
 */
function isJulianYear(year) {
    if (year < gregorianReform[0]) {
        return true
    } else {
        return false
    }
}

/**
 * Checks if the gregorian year has leap day
 * @param {number} year - Year to check
 * @returns {boolean}
 * @example
 * isLeapYearGregorian(2017)
 */
function isLeapYearGregorian(year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)
}

/**
 * Checks if the julian year has leap day
 * @param {number} year - Year to check
 * @returns {boolean}
 * @example
 * isLeapYearJulian(2017)
 */
function isLeapYearJulian(year) {
    return ((year % 4 == 0))
}


/**
 * Get suffix for the day number of the month
 * @param {number} day - Day number
 * @returns {string}
 * @example
 * getSuffixDayOfMonth(12)
 */
function getSuffixDayOfMonth(day) {
    if (((4 <= day) && (day <= 20)) || ((24 <= day) && (day <= 30))) {
        suffix = "th"
    }
    else {
        suffix = ["st", "nd", "rd"][day % 10 - 1]
    }
    return suffix
}




/**
 * Get date from Ordinal Date
 * @param {number} day Day number
 * @param {boolean} [isLeapYear=false] True if leap year
 * @param {number} [adjust=0] Substract no of days from the year
 * @returns {Object} 
 * @example
 * getDateFromOrdinal(244,false,0)
 */
function getDateFromOrdinal(od, isLeapYear = false, adjust = 0) {

    od -= adjust
    monthCount[2] = isLeapYear === true ? 29 : 28

    let m, d, i = 0

    for (e of monthCount) { // iterate through the months
        if (e != 0) {
            od = od - e
            if (od > 0) {
                // Ordinal date not in this month
            } else {
                m = i
                d = (e) + (od)
                break
            }
        }
        i++
    }

    return { month: m, monthLong: month[m], day: d, dayWithSuffix: d + getSuffixDayOfMonth(d) }
}


function init(year = 2017, od = 244, mode = 'cal') {

    if (argv.y === undefined) { console.warn('\x1b[33m', 'Fallback to default year. Argument not passed -y', year, '\x1b[0m') }
    else {
        if (!Number.isInteger(argv.y)) {
            console.error('\x1b[31m', 'Year must be an integer', '\x1b[0m')
            process.exit()
        } else {
            year = argv.y
        }
    }


    if (argv.o === undefined) { console.warn('\x1b[33m', 'Fallback to default ordinal date. Argument not passed -o', od, '\x1b[0m') }
    else {
        if (!Number.isInteger(argv.o)) {
            console.error('\x1b[31m', 'Ordinal Date must be an integer', '\x1b[0m')
            process.exit()
        } else {
            od = argv.o
        }
    }

    if (argv.m === undefined) { console.warn('\x1b[33m', 'Fallback to default mode.  Argument not passed -m', mode, '\x1b[0m') }
    else {
        if (argv.m === 'cal') {
            mode = argv.m
        } else if (argv.m === 'gcal') {
            mode = argv.m
        } else {
            console.error('\x1b[31m', 'Invalid mode', argv.m, '\x1b[0m')
            process.exit()
        }
    }

    ordinalDay = od

    console.info('\x1b[32m', 'Gregorian Reformation Period.', gregorianReform, '\x1b[0m')
    console.info('\x1b[32m', 'Ordinal Date.', year + "-" + od, 'ISO 8601 YYYY-DDD format.', '\x1b[0m')

    let isLeap = isJulianYear(year) === true ? isLeapYearJulian(year) : isLeapYearGregorian(year)
    console.info('\x1b[32m', year, isLeap ? 'is leap year' : 'is not leap year', isJulianYear(year) ? 'is julian year' : 'is gregorian year', '\x1b[0m')
    let adj = 0;

    
    if (year === gregorianReform[0] && mode == 'cal') {
        console.info('\x1b[34m', year, 'Overide. This is year of gregorian reform.', '\x1b[0m')
        adj = gregorianReform[3]
    }

    let result = getDateFromOrdinal(ordinalDay, isLeap, adj)
    return result.dayWithSuffix + ' ' + result.monthLong + ' ' + year

}


console.log(init())



//mode=cal -> 355 days for reformation year , removes day from reform month
//mode-gcal -> 365 days for reformation year, does not remove days
// 