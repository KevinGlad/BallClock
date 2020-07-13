// Codding Chalenge for Resmark

// Problem Description 

// BALL CLOCK
// Tempus et mobilius
// Time and motion
// Tempus est mensura motus rerum mobilium.
// Time is the measure of movement.
// -- Auctoritates Aristotelis
// ...and movement has long been used to measure time. For example, the ball clock is a simple
// device which keeps track of the passing minutes by moving ball-bearings. Each minute, a
// rotating arm removes a ball bearing from the queue at the bottom, raises it to the top of the
// clock and deposits it on a track leading to indicators displaying minutes, five-minutes and hours.
// These indicators display the time between 1:00 and 12:59, but without 'a.m.' or 'p.m.' indicators.
// Thus 2 balls in the minute indicator, 6 balls in the five-minute indicator and 5 balls in the hour
// indicator displays the time 5:32.
// Unfortunately, most commercially available ball clocks do not incorporate a date indication,
// although this would be simple to do with the addition of further carry and indicator tracks.
// However, all is not lost! As the balls migrate through the mechanism of the clock, they change
// their relative ordering in a predictable way. Careful study of these orderings will therefore yield
// the time elapsed since the clock had some specific ordering. The length of time which can be
// measured is limited because the orderings of the balls eventually begin to repeat. Your program
// must compute the time before repetition, which varies according to the total number of balls
// present.
// Operation of the Ball Clock
// Every minute, the least recently used ball is removed from the queue of balls at the bottom of
// the clock, elevated, then deposited on the minute indicator track, which is able to hold four balls.
// When a fifth ball rolls on to the minute indicator track, its weight causes the track to tilt. The four
// balls already on the track run back down to join the queue of balls waiting at the bottom in
// reverse order of their original addition to the minutes track. The fifth ball, which caused the tilt,
// rolls on down to the five-minute indicator track. This track holds eleven balls. The twelfth ball
// carried over from the minutes causes the five-minute track to tilt, returning the eleven balls to
// the queue, again in reverse order of their addition. The twelfth ball rolls down to the hour
// indicator. The hour indicator also holds eleven balls, but has one extra fixed ball which is always
// present so that counting the balls in the hour indicator will yield an hour in the range one to
// twelve. The twelfth ball carried over from the five-minute indicator causes the hour indicator to
// tilt, returning the eleven free balls to the queue, in reverse order, before the twelfth ball itself
// also returns to the queue.
// Input
// The input defines a succession of ball clocks. Each clock operates as described above. The
// clocks differ only in the number of balls present in the queue at one o'clock when all the clocks
// start. This number is given for each clock, one per line and does not include the fixed ball on the
// hours indicator. Valid numbers are in the range 27 to 127. A zero signifies the end of input.
// Output
// For each clock described in the input, your program should report the number of balls given in
// the input and the number of days (24-hour periods) which elapse before the clock returns to its
// initial ordering.
// Sample Input
// 30
// 45
// 0
// Output for the Sample Input
// 30 balls cycle after 15 days.
// 45 balls cycle after 378 days.

// Strategy
// this is a brute force design that emulates a physical ball clock.
// a better design would be to do a mathmatical calculation on how many
// itterations it takes to return to the original order based on the number of balls.

// This class emulates the tray that holds the balls that indicate time.
class tray {

    constructor(maxSize) {

        this._maxSize = maxSize  // maximum number of balls the tray can hold

        this.tray = []   // array to hold the balls as they enter
    
    }

    // function to add a ball to the tray
    // if the ball causes the tray to exceed its max size, the contents of the 
    // tray is returned. The last ball is returned seperatly
    addBall(ballNum) {

        let rtnValue = { lastBall: null, trayContents: [] }  // trayContents could be null but this shows we intend to return an array

        if (this.tray.length == this._maxSize) {

            rtnValue.lastBall = ballNum

            // reverse the array before returning it.
            // This reduces the resuability of this code but
            // I don't really see it being used for any other purpose
            // and it will make things nicer. KG 7/20

            // copy the mutated the array.
            rtnValue.trayContents = [...this.tray.reverse()]

            // clear the array
            this.tray = []
        }
        else {

            this.tray.push(ballNum)

        }

        return rtnValue

    }
}

function isSorted(arrayToCheck, expectedBalls) {

    let rtnValue = true

    // if we don't have the number of balls needed, it doesn't matter if
    // we are sorted.
    if (arrayToCheck.length !== expectedBalls) {
    
        rtnValue = false
    
    }

    // use a loop so we can exit out as soon as we are not sorted
    // start at the second element so we can check against the previous
    // without walking off the end of the array
    // we check if rtnValue is true so we can avoid entering the loop if we
    // don't have the expected number of balls.
    for (let intCnt = 2; intCnt < arrayToCheck.length && rtnValue === true; intCnt++) {

        // is previous number one less
        if (arrayToCheck[intCnt] - arrayToCheck[intCnt - 1] !== 1) {

            // not in original sorted order
            rtnValue = false

            // abort
            break // out of for.  We could eliminate this but it will save us a comparison

        } // endif check previous number is one less

    }

    return rtnValue
}

export default function findCompleteCycle(numberOfBalls) {

    let cycles = 0  //  each cycle is one minute.  for 127 balls the number of cycles is 3477600.  No need to use BigInt
    let minuteTray = new tray(4)
    let fiveMinuteTray = new tray(11)
    let hourTray = new tray(11) 
    let feederTray = [] // main feeder tray.  This is the tray all balls return to and start from
    let currentBall // place to hold the current ball

    // make sure number of balls is a number
    let numBalls = 0

    try {

        numBalls = Number(numberOfBalls)

    }
    catch (error) {

        throw new Error(`${numberOfBalls} is invalid. Number of balls must be numeric`)

    }

    // make sure we have an int
    if (!Number.isInteger(numBalls)) {

        throw new Error(`${numberOfBalls} is invalid. Number of balls must be an integer`)

    }

    // check to make sure the number of balls is within our parameters
    if (numBalls < 27 || numBalls > 127) {

        throw new Error(`${numBalls} balls is outside of range 27 to 127`)

    }

    // initialize array with balls. each ball is consecutivly numbered
    feederTray = Array.from(Array(numBalls), (element, index) => index + 1)

    do {

        cycles++

        // take a ball off of the start of the array
        currentBall = feederTray.shift()

        // put ball in minutes tray
        let minResults = minuteTray.addBall(currentBall)

        // did we fill it?
        // no need to check the type. != will do
        if (minResults.lastBall != null) {

            // copy returned balls to end of feeder tray
            feederTray = [...feederTray, ...minResults.trayContents]

            // pass the last ball to fiveMinute tray
            let fiveMinResults = fiveMinuteTray.addBall(minResults.lastBall)

            if (fiveMinResults.lastBall != null) {

                // copy returned balls to end of feeder tray
                feederTray = [...feederTray, ...fiveMinResults.trayContents]

                // pass the last ball to hour tray
                let hourResults = hourTray.addBall(fiveMinResults.lastBall)

                if (hourResults.lastBall != null) {

                    // copy returned balls to end of feeder tray
                    // in this case the last ball is returned to the feeder tray as well.
                    feederTray = [...feederTray,  ...hourResults.trayContents, hourResults.lastBall]

                } // end if hour

            } // end if five minutes

        } // end if minutes


    } while (isSorted(feederTray, numBalls) == false)

    return cycles
}