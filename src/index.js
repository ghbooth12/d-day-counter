'use strict';
var http = require('http');
var DayCounter = require('./DayCounter');
var ua = require('universal-analytics');

var server = http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

        // if (event.session.application.applicationId !== "amzn1.ask.skill.8eceba64-c029-4c26-9674-a41dcea09778") {
        //      context.fail("Invalid Application ID");
        // }


        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("HowManyWeeksUntilIntent" === intentName) {
        setDateInSession(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        helpSession(callback);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to Date Counter. " +
        "Please ask me, how many days until, the date you choose. For example, how many days until december 25th.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please ask me how many days until the date you choose. For example, " +
        "how many days left until december 25th.";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function helpSession(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Help";
    var speechOutput = "You can ask, how many days until, the date you choose. For example, how many days until december 25th.";
    // If the user either does not reply to the message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please ask me how many days until the date you choose. For example, how many days until december 25th.";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Thank you for using Date Counter. I hope to see you soon!";
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function setDateInSession(intent, session, callback) {
    var cardTitle = intent.name;
    var specifiedDate = intent.slots.Date.value;
    var sessionAttributes = {};
    var speechOutput = "";
    var repromptText = "";
    var shouldEndSession = true;

    if (specifiedDate) {
      var dayCounter = new DayCounter();
      var dateArr = dayCounter.configDate(specifiedDate);
      var dateObj = dayCounter.dateToObject(dateArr);
      var answerSpeech = dayCounter.weeksAndDays(dateObj);

      speechOutput = answerSpeech;
      repromptText = answerSpeech;
    } else {
      speechOutput = "I'm not sure what your date is. You can say, how many days until, the date you want. For example, " + "how many days until december 25th.";
      repromptText = "Please ask me how many days until the date you want. For example, " +
      "how many days until december 25th.";
    }

    // Google Analytics
    var intentTrackingID = ua('UA-81433628-1');
    console.log("sending data to GA");

    // intentTrackingID.event('invalid request', 'blank value').send();

    var requestedData = ('myData' + speechOutput).toString();
    intentTrackingID.event('success', requestedData).send();
    console.log("sending data to GA");

    // intentTrackingID.event('error', error.toString()).send();

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

response.end('Hello World\n');

});

server.listen(8000);

console.log('Server running at http://127.0.0.1:8000');
