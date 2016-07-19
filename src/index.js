'use strict';
// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
        }
        */

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
    if ("HowManyDaysUntilIntent" === intentName) {
        setDateInSession(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback);
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
    var speechOutput = "Welcome to D Day Counter. " +
        "Please ask me how many days left until the date you want. For example, how many days left until december 25th.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please ask me how many days left until the date you want. For example, " +
        "how many days left until december 25th.";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Thank you for using D Day Counter. I hope to see you soon!";
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function setDateInSession(intent, session, callback) {
    var cardTitle = intent.name;
    var specifiedDateSlot = intent.slots.Date;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if (specifiedDateSlot) {
        var specifiedDate = specifiedDateSlot.value;
        sessionAttributes = createDateAttributes(specifiedDate);
        var daysLeft = gapInDays(dateToObject(specifiedDate));
        speechOutput = daysLeft + " days left until " + specifiedDate + ". ";
        repromptText = daysLeft + " days left until " + specifiedDate + ". ";
    } else {
        speechOutput = "I'm not sure what your date is. Please ask me how many days left until the date you want. For example, " + "how many days left until december 25th.";
        repromptText = "Please ask me how many days left until the date you want. For example, " +
            "how many days left until december 25th.";
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function createDateAttributes(specifiedDate) {
    return {
        specifiedDate: specifiedDate
    };
}

// -------------------- Later Feature ------------------------
// function getColorFromSession(intent, session, callback) {
//     var specifiedDate;
//     var repromptText = null;
//     var sessionAttributes = {};
//     var shouldEndSession = false;
//     var speechOutput = "";
//
//     if (session.attributes) {
//         specifiedDate = session.attributes.specifiedDate;
//     }
//
//     if (specifiedDate) {
//         speechOutput = "Your date is " + specifiedDate + ". Goodbye.";
//         shouldEndSession = true;
//     } else {
//         speechOutput = "I'm not sure what your date is, you can ask, how many days left until " +
//             " december 25th.";
//     }
//
//     // Setting repromptText to null signifies that we do not want to reprompt the user.
//     // If the user does not respond or says something that is not understood, the session
//     // will end.
//     callback(sessionAttributes,
//          buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
// }


// Date to object
function dateToObject(dateStr) {
  // Logic here
  return new Date(2016, 11, 25);
}

function gapInDays(dateObj) {
  var today = new Date();
  var gapInMs = dateObj - today;
  var msPerDay = 24 * 60 * 60 * 1000;
  var gap = Math.floor(gapInMs / msPerDay);
  return gap;
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
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
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
