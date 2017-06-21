'use strict';
var APP_ID = "amzn1.ask.skill.2bddeb66-c52b-485d-aa26-a4e821a65e63"; // TODO replace with your app ID (OPTIONAL).
var accessToken;

const Alexa = require('alexa-sdk');
var request = require('request');

var speechOutput;
var reprompt;

var confirmPhrases = [
    "I am done",
    "Done",
    "Finished"
];

var welcomePhrases = [
    "Lets drink something!",
    "How can i help you?",
    "Hi, What can I do for you?"
];

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;

    alexa.registerHandlers(handlers);

    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.handler.state = states.NORMAL;
        var speechOutput = randomPhrase(welcomePhrases);
        this.emit(':ask', speechOutput, welcomeReprompt);
    },
    'GetByName': function () {
        //SELECT id,CreatedDate FROM Lead WHERE Status='' ORDER BY CreatedDate DESC
        var self = this;

       var Name = isSlotValid(this.event.request, "Name");

        if (self.event.request.intent.slots != undefined) {
            console.log("slots: " + JSON.stringify(self.event.request.intent.slots));
        }

        getListOfCoctailsByName(Name, function (records) {
            var count = 0;
            var speechOutput = "";

            if (records != null) {
                count = records.length;
                if (count == 1) {
                    speechOutput = "i found " + records[0].strDrink + "; The instrucion is: " + records[0].strInstructions + ";";
                    if (records[0].strDrinkThumb != null) {
                        var imageObj = {
                            smallImageUrl: records[0].strDrinkThumb,
                            largeImageUrl: records[0].strDrinkThumb
                        };
                        var cardTitle = records[0].strDrink;
                        var cardContent = records[0].strInstructions;
                    }
                } else if (count == 2) {
                    speechOutput = "i found 2 coctails with this name; The " + records[0].strDrink + " and " + records[1].strDrink + "; Which one are you want to make?";
                } else if (count >= 3) {
                    speechOutput = "i found " + count + " coctails with this name; The first 3 is the " + records[0].strDrink + ", " + records[1].strDrink + ", " + records[2].strDrink + "; Which one are you want to make?";
                } else if (count == 0) {
                    speechOutput = "I can't find any coctail with this name";
                }
            } else {
                speechOutput = "I can't find any coctail with this name";
            }
            console.log("end of request");


            if (imageObj != null && cardTitle != null && cardContent != null) {
                self.emit(':tellWithCard', speechOutput, cardTitle, cardContent, imageObj);
            } else {
                self.emit(':tell', speechOutput);
            }
        });
        
    }, 'GetByIngredient': function () {
        //SELECT id,CreatedDate FROM Lead WHERE Status='' ORDER BY CreatedDate DESC
        var self = this;

        var Name = isSlotValid(this.event.request, "Ingredient");

        if (self.event.request.intent.slots != undefined) {
            console.log("slots: " + JSON.stringify(self.event.request.intent.slots));
        }

        getListOfCoctailsIngredient(Name, function (records) {
            var count = 0;
            var speechOutput = "";

            if (records != null) {
                count = records.length;
                if (count == 1) {
                    speechOutput = "i found " + records[0].strDrink + "; The instrucion is: " + records[0].strInstructions + ";";
                    if (records[0].strDrinkThumb != null) {
                        var imageObj = {
                            smallImageUrl: records[0].strDrinkThumb,
                            largeImageUrl: records[0].strDrinkThumb
                        };
                        var cardTitle = records[0].strDrink;
                        var cardContent = records[0].strInstructions;
                    }
                } else if (count == 2) {
                    speechOutput = "i found 2 coctails with this name; The " + records[0].strDrink + " and " + records[1].strDrink + "; Which one are you want to make?";
                } else if (count >= 3) {
                    speechOutput = "i found " + count + " coctails with this name; The first 3 is the " + records[0].strDrink + ", " + records[1].strDrink + ", " + records[2].strDrink + "; Which one are you want to make?";
                } else if (count == 0) {
                    speechOutput = "I can't find any coctail with this name";
                }
            } else {
                speechOutput = "I can't find any coctail with this name";
            }
            console.log("end of request");


            if (imageObj != null && cardTitle != null && cardContent != null) {
                self.emit(':tellWithCard', speechOutput, cardTitle, cardContent, imageObj);
            } else {
                self.emit(':tell', speechOutput);
            }

        });
    },'GetRandom': function () {
        //SELECT id,CreatedDate FROM Lead WHERE Status='' ORDER BY CreatedDate DESC
        var self = this;

        if (self.event.request.intent.slots != undefined) {
            console.log("slots: " + JSON.stringify(self.event.request.intent.slots));
        }

        getListOfCoctailRandom(function (records) {
            var speechOutput = "";

            if (records != null) {
                    speechOutput = "Your random cocktail is " + records[0].strDrink + "; The instrucion is: " + records[0].strInstructions + ";";
                    if (records[0].strDrinkThumb != null) {
                        var imageObj = {
                            smallImageUrl: records[0].strDrinkThumb,
                            largeImageUrl: records[0].strDrinkThumb
                        };
                        var cardTitle = records[0].strDrink;
                        var cardContent = records[0].strInstructions;
                    }
            } else {
                speechOutput = "I can't find any coctail";
            }
            console.log("end of request");


            if (imageObj != null && cardTitle != null && cardContent != null) {
                self.emit(':tellWithCard', speechOutput, cardTitle, cardContent, imageObj);
            } else {
                self.emit(':tell', speechOutput);
            }
        });
    },
    'AMAZON.NoIntent': function () {
        this.emit(':tell', 'Ok, see you next time!');
    },
    'AMAZON.HelpIntent': function () {
        speechOutput = "";
        reprompt = "";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        speechOutput = "";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        speechOutput = "";
        this.emit(':tell', speechOutput);
    },
    'SessionEndedRequest': function () {
        var speechOutput = "";
        this.emit(':tell', speechOutput);
    }, 'Unhandled': function () {
        var speechOutput = "this intent is unhandled";
        this.emit(':tell', speechOutput)
    }
};

function getListOfCoctailsByName(name, callback) {
    var result;
    console.log("request: " + 'http://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + name);
    request('http://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + name, function (error, response, body) {
        if (!error) {
            console.log("ok");
            var object = JSON.parse(body);
            result = object.drinks;
            callback(result);
        } else {
            console.log("error");
            console.log(error.code);
            result = null;
            callback(result);
        }
    });
}
function getListOfCoctailsIngredient(ingredient, callback) {
    var result;
    console.log("request: " + 'http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + ingredient);
    request('http://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + ingredient, function (error, response, body) {
        if (!error) {
            console.log("ok");
            var object = JSON.parse(body);
            result = object.drinks;
            callback(result);
        } else {
            console.log("error");
            console.log(error.code);
            result = null;
            callback(result);
        }
    });
}

function getListOfCoctailRandom(callback) {
    var result;
    console.log("request: " + 'http://www.thecocktaildb.com/api/json/v1/1/random.php');
    request('http://www.thecocktaildb.com/api/json/v1/1/random.php', function (error, response, body) {
        if (!error) {
            console.log("ok");
            var object = JSON.parse(body);
            result = object.drinks;
            callback(result);
        } else {
            console.log("error");
            console.log(error.code);
            result = null;
            callback(result);
        }
    });
}

function delegateSlotCollection() {
    console.log("in delegateSlotCollection");
    console.log("current dialogState: " + this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
        console.log("in Beginning");
        var updatedIntent = this.event.request.intent;
        //optionally pre-fill slots: update the intent object with slot values for which
        //you have defaults, then return Dialog.Delegate with this updated intent
        // in the updatedIntent property
        this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
        console.log("in not completed");
        // return a Dialog.Delegate directive with no updatedIntent property.
        this.emit(":delegate");
    } else {
        console.log("in completed");
        console.log("returning: " + JSON.stringify(this.event.request.intent));
        // Dialog is now complete and all required slots should be filled,
        // so call your normal intent handler.
        return this.event.request.intent;
    }
}

function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return (array[i]);
}

function isSlotValid(request, slotName) {
    var slot = request.intent.slots[slotName];
    //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
    var slotValue;

    //if we have a slot, get the text and store it into speechOutput
    if (slot && slot.value) {
        //we have a value in the slot
        slotValue = slot.value.toLowerCase();
        return slotValue;
    } else {
        //we didn't get a value in the slot.
        return false;
    }
}
