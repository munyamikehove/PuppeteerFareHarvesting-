/*jshint esversion: 8 */
const admin = require("firebase-admin");
const puppeteer = require('puppeteer');
const moment = require("moment");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://zerojet-85661.firebaseio.com"
});

var db = admin.database();

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();

var readyToTriggerPuppteer = 0;
var allDatesAndDestinations = [];

// business class route query variables
var YYZtoNYC = {
    root: "https://us.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=145&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=123&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "newYorkCity",
    originDescription: "Toronto",

};
var NYCtoYYZ = {
    root: "https://us.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=123&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=145&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Toronto",
    originDescription: "newYorkCity",

};

var YYZtoROC = {
    root: "https://us.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=145&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=134&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Rochester",
    originDescription: "Toronto",

};
var ROCtoYYZ = {
    root: "https://us.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=134&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=145&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Toronto",
    originDescription: "Rochester",

};

var YYZtoSYR = {
    root: "https://us.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=145&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=139&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Syracuse",
    originDescription: "Toronto",

};
var SYRtoYYZ = {
    root: "https://us.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=139&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=145&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Toronto",
    originDescription: "Syracuse",

};

var YYZtoMON = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=145&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=280&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Montreal",
    originDescription: "Toronto",

};
var MONtoYYZ = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=280&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=145&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Toronto",
    originDescription: "Montreal",

};


var YYZtoBROU = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=145&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=448&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "brockUniversity",
    originDescription: "Toronto",

};
var BROUtoYYZ = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=448&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=145&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Toronto",
    originDescription: "brockUniversity",

};

var YYZtoSTC = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=145&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=427&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "stCatherines",
    originDescription: "Toronto",

};
var STCtoYYZ = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=427&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=145&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Toronto",
    originDescription: "stCatherines",

};

var YYZtoPOR = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=145&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=433&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "portColborne",
    originDescription: "Toronto",

};
var PORtoYYZ = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=433&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=145&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Toronto",
    originDescription: "portColborne",

};


var YYZtoKIR = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=145&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=279&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Kirkland",
    originDescription: "Toronto",

};
var KIRtoYYZ = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=279&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=145&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Toronto",
    originDescription: "Kirkland",

};


var YYZtoKIN = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=145&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=276&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Kingston",
    originDescription: "Toronto",

};
var KINtoYYZ = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=276&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=145&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Toronto",
    originDescription: "Kingston",

};


var YYZtoGRI = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=145&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=428&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Grimsby",
    originDescription: "Toronto",

};
var GRItoYYZ = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=428&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=145&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Toronto",
    originDescription: "Grimsby",

};


var YYZtoCOR = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=145&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=278&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Cornwall",
    originDescription: "Toronto",

};
var CORtoYYZ = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=278&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=145&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Toronto",
    originDescription: "Cornwall",

};

var YYZtoFOR = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=145&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=434&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "fortErie",
    originDescription: "Toronto",

};
var FORtoYYZ = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=434&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=145&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Toronto",
    originDescription: "fortErie",

};

var YYZtoBUF = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=145&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=95&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Buffalo",
    originDescription: "Toronto",

};
var BUFtoYYZ = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=95&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=145&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Toronto",
    originDescription: "Buffalo",

};

var YYZtoBRO = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=145&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=277&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Brockville",
    originDescription: "Toronto",

};
var BROtoYYZ = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=277&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=145&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Toronto",
    originDescription: "Brockville",

};

var YYZtoNIA = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=145&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=124&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "niagaraFalls",
    originDescription: "Toronto",

};
var NIAtoYYZ = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=124&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=145&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Toronto",
    originDescription: "niagaraFalls",

};

var YYZtoWELL = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=145&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=432&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Welland",
    originDescription: "Toronto",

};
var WELLtoYYZ = {
    root: "https://ca.megabus.com/journey-planner/journeys?days=1&concessionCount=0&",
    origin: "originId=432&", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "&destinationId=145&", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `departureDate=${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    trailDestination: "inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&",
    trailOrigin: "otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0",
    destinationDescription: "Toronto",
    originDescription: "Welland",

};

// Last ran Tue Dec 24 at 7:22pm
// var allDestinations = [NYCtoYYZ];
// var allDestinations = [YYZtoNYC];
// var allDestinations = [ROCtoYYZ];
// var allDestinations = [YYZtoROC];
// var allDestinations = [SYRtoYYZ];
// var allDestinations = [YYZtoSYR];
// var allDestinations = [MONtoYYZ];
// var allDestinations = [YYZtoMON];
// var allDestinations = [BROUtoYYZ];
// var allDestinations = [YYZtoBROU];
// var allDestinations = [STCtoYYZ];
// var allDestinations = [YYZtoSTC];
// var allDestinations = [PORtoYYZ];
// var allDestinations = [YYZtoPOR];
// var allDestinations = [KIRtoYYZ];
// var allDestinations = [YYZtoKIR];
// var allDestinations = [KINtoYYZ];
// var allDestinations = [YYZtoKIN];
// var allDestinations = [GRItoYYZ];
// var allDestinations = [YYZtoGRI];
// var allDestinations = [CORtoYYZ];
// var allDestinations = [YYZtoCOR];
// var allDestinations = [FORtoYYZ];
// var allDestinations = [YYZtoFOR];
// var allDestinations = [BUFtoYYZ];
// var allDestinations = [YYZtoBUF];
// var allDestinations = [BROtoYYZ];
// var allDestinations = [YYZtoBRO];
// var allDestinations = [NIAtoYYZ];
// var allDestinations = [YYZtoNIA];
// var allDestinations = [WELLtoYYZ];
 var allDestinations = [YYZtoWELL];




for (var index in allDestinations) {


    queryOptions = allDestinations[index];

    // Control the number of days to gather information for.
    var numberOfDays = 62;

    for (var currentDay = 0; currentDay < numberOfDays; currentDay++) {

        var newDay = moment()
            .add(currentDay, "days")
            .format("DD");

            var newMonth = moment()
            .add(currentDay, "days")
            .format("MM");

            var newYear = moment()
            .add(currentDay, "days")
            .format("YYYY");

            var newDate = moment()
            .add(currentDay, "days")
            .format("YYYY-MM-DD");

        var a = allDestinations[index].root;
        var b = allDestinations[index].origin;
        var c = allDestinations[index].destination;
        var d = `departureDate=${newDate}`;
        var e = allDestinations[index].trailDestination;
        var f = allDestinations[index].trailOrigin;
        var g = allDestinations[index].originDescription;
        var h = allDestinations[index].destinationDescription;
        var i = newDay;
        var j = newMonth;
        var k = newYear;


        allDatesAndDestinations.push({
            root: a,
            origin: b,
            destination: c,
            queryDate: d,
            trailDestination: e,
            trailOrigin: f,
            destinationDescription: h,
            originDescription: g,
            dBDay: i,
            dBMonth: j,
            dBYear: k,
        });


        if ((currentDay + 1) === numberOfDays) {
            readyToTriggerPuppteer++;



            //if (readyToTriggerPuppteer === 16) {
            getBusRide();
            
            //}

        }

    }
}



async function getBusRide() {
    /* eslint-disable no-await-in-loop */
    for (var index in allDatesAndDestinations) {

        var destinationDescription = allDatesAndDestinations[index].destinationDescription;
        var originDescription = allDatesAndDestinations[index].originDescription;
        var dBYear = allDatesAndDestinations[index].dBYear;
        var dBMonth = allDatesAndDestinations[index].dBMonth
        var dBDay = allDatesAndDestinations[index].dBDay;
       
        try {

            var browser = await puppeteer.launch({
                headless: true,
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });

            var page = await browser.newPage();

            page.setUserAgent(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
            );

            var url = allDatesAndDestinations[index].root + allDatesAndDestinations[index].queryDate + allDatesAndDestinations[index].destination + allDatesAndDestinations[index].trailDestination + allDatesAndDestinations[index].origin + allDatesAndDestinations[index].trailOrigin;
            
            await page.goto(url, {
                waitUntil: "networkidle0",
            });

            let busTravelData = await page.evaluate(() => {
                //price = a
                var a = document.querySelector('div[class="col-xs-4 ticket__price"] > span').innerText;
                var splitterA = a.split('.');
                var priceA = splitterA[0];
                var priceB = priceA.split('$');
                var Price = priceB[1];


                //time = b
                var b = document.querySelector('div[class="col-xs-8 ticket__time"]').innerText;
                var splitterB = b.split('\n');
                var bothTimesA = splitterB[0];
                var bothTimesB = bothTimesA.split('M');
                var leaveTime = bothTimesB[0]+'M';
                var arriveTime = bothTimesB[1]+'M';
           
              


                //originDestination = c
                var c = document.querySelector('div[class="col-sm-5 ticket__stops"]').innerText;
                var splitterC = c.split('\n');
                var Origin = splitterC[0];
                var Destination = splitterC[1];

                return {
                    Price,
                    leaveTime,
                    arriveTime,
                    Origin,
                    Destination,
                };

            });

            busResultsRef = db.ref(`busResultsRef/${originDescription}/${destinationDescription}/${dBYear}/${dBMonth}/${dBDay}/`);
            busResultsRef.update({
                busTravelData
            });

            
            console.log(busTravelData);
            console.log('\n\n\n');



        } catch (errorMsg) {
            console.log("queryErrorIs", errorMsg);
        }
    }
    /* eslint-enable no-await-in-loop */

    console.log('Finished!');
    return true;
}