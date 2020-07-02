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

// business class route query variables
var NYCtoYYZ = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "/m/02_286.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "/m/0h7h6.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "Toronto",
    originDescription: "newYorkCity",

};
var YYZtoNYC = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "/m/0h7h6.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "/m/02_286.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "newYorkCity",
    originDescription: "Toronto",

};
var DCtoYYZ = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "/m/0rh6k.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "/m/0h7h6.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "Toronto",
    originDescription: "washingtonDC",

};
var YYZtoDC = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "/m/0h7h6.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "/m/0rh6k.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "washingtonDC",
    originDescription: "Toronto",

};
var PHLtoYYZ = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "PHL.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "/m/0h7h6.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "Toronto",
    originDescription: "Philadelphia",

};
var YYZtoPHL = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "/m/0h7h6.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "PHL.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "Philadelphia",
    originDescription: "Toronto",

};
var CHItoYYZ = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "/m/01_d4.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "/m/0h7h6.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "Toronto",
    originDescription: "Chicago",

};
var YYZtoCHI = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "/m/0h7h6.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "/m/01_d4.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "Chicago",
    originDescription: "Toronto",

};
var ATLtoYYZ = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "ATL.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "/m/0h7h6.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "Toronto",
    originDescription: "Atlanta",

};
var YYZtoATL = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "/m/0h7h6.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "ATL.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "Atlanta",
    originDescription: "Toronto",

};
var CLTtoYYZ = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "CLT.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "/m/0h7h6.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "Toronto",
    originDescription: "Charlotte",

};
var YYZtoCLT = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "/m/0h7h6.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "CLT.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "Charlotte",
    originDescription: "Toronto",

};


// economy class route query variables
var NYCtoYYZecn = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "/m/02_286.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "/m/0h7h6.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "economy",
    destinationDescription: "Toronto",
    originDescription: "newYorkCity",

};
var YYZtoNYCecn = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "/m/0h7h6.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "/m/02_286.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "economy",
    destinationDescription: "newYorkCity",
    originDescription: "Toronto",

};
var YULtoYYZecn = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "/m/052p7.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "/m/0h7h6.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:CAD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "economy",
    destinationDescription: "Toronto",
    originDescription: "Montreal",

};
var YYZtoYULecn = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "/m/0h7h6.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "/m/052p7.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:CAD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "economy",
    destinationDescription: "Montreal",
    originDescription: "Toronto",
};

//Orlando starts here
var YYZtoMCOecn = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "BUF.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "MCO.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:CAD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "economy",
    destinationDescription: "Orlando",
    originDescription: "Toronto",
};

var MCOtoYYZecn = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "MCO.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "BUF.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:CAD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "economy",
    destinationDescription: "Toronto",
    originDescription: "Orlando",
};

var BUFtoMCOecn = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "BUF.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "MCO.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "economy",
    destinationDescription: "Orlando",
    originDescription: "Buffalo",
};

var MCOtoBUFecn = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "MCO.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "BUF.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "economy",
    destinationDescription: "Buffalo",
    originDescription: "Orlando",
};

var NYCtoMCOecn = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "EWR.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "MCO.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "economy",
    destinationDescription: "Orlando",
    originDescription: "newYorkCity",
};

var MCOtoNYCecn = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "MCO.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "EWR.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "economy",
    destinationDescription: "newYorkCity",
    originDescription: "Orlando",
};

var CHItoMCOecn = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "ORD.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "MCO.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "economy",
    destinationDescription: "Orlando",
    originDescription: "Chicago",
};

var MCOtoCHIecn = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "MCO.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "ORD.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "economy",
    destinationDescription: "Chicago",
    originDescription: "Orlando",
};


var YYZtoMCO = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "BUF.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "MCO.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:CAD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "Orlando",
    originDescription: "Toronto",
};

var MCOtoYYZ = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "MCO.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "BUF.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:CAD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "Toronto",
    originDescription: "Orlando",
};

var BUFtoMCO = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "BUF.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "MCO.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "Orlando",
    originDescription: "Buffalo",
};

var MCOtoBUF = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "MCO.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "BUF.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "Buffalo",
    originDescription: "Orlando",
};

var NYCtoMCO = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "EWR.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "MCO.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "Orlando",
    originDescription: "newYorkCity",
};

var MCOtoNYC = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "MCO.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "EWR.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "newYorkCity",
    originDescription: "Orlando",
};

var CHItoMCO = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "ORD.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "MCO.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "Orlando",
    originDescription: "Chicago",
};

var MCOtoCHI = {
    root: "https://www.google.com/flights?hl=en#flt=",
    origin: "MCO.", // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
    destination: "ORD.", // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
    queryDate: `${yyyy}-${mm}-${dd}`, //YYYY-MM-DD
    oneCarryOnBagAndCurrency: ";b:1;c:USD", // CAD is ;c:CAD , USD is ;c:USD
    fareClass: ";e:1;sc:b;so:1;sd:1;t:f;tt:o", // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
    fareClassDescription: "business",
    destinationDescription: "Chicago",
    originDescription: "Orlando",
};


// Last ran Fri Oct 18 at 1:14am
// var allDestinations = [NYCtoYYZ];
// var allDestinations = [YYZtoNYC];
// var allDestinations = [DCtoYYZ];
// var allDestinations = [YYZtoDC];
// var allDestinations = [PHLtoYYZ];
// var allDestinations = [YYZtoPHL];
// var allDestinations = [CHItoYYZ];
// var allDestinations = [YYZtoCHI];
// var allDestinations = [ATLtoYYZ];
// var allDestinations = [YYZtoATL];
// var allDestinations = [CLTtoYYZ];
// var allDestinations = [YYZtoCLT];
// var allDestinations = [NYCtoYYZecn];
// var allDestinations = [YYZtoNYCecn];
// var allDestinations = [YULtoYYZecn];
// var allDestinations = [YYZtoYULecn];

//Orlando starts here
// var allDestinations = [YYZtoMCO];
// var allDestinations = [MCOtoYYZ];
// var allDestinations = [BUFtoMCO];
// var allDestinations = [MCOtoBUF];
// var allDestinations = [NYCtoMCO];
// var allDestinations = [MCOtoNYC];
// var allDestinations = [CHItoMCO];
// var allDestinations = [MCOtoCHI];
// var allDestinations = [YYZtoMCOecn];
// var allDestinations = [MCOtoYYZecn];
// var allDestinations = [BUFtoMCOecn];
// var allDestinations = [MCOtoBUFecn];
// var allDestinations = [NYCtoMCOecn];
// var allDestinations = [MCOtoNYCecn];
// var allDestinations = [CHItoMCOecn];
// var allDestinations = [MCOtoCHIecn];


var allDatesAndDestinations = [];
var readyToTriggerPuppteer = 0;


for (var index in allDestinations) {


    queryOptions = allDestinations[index];

    // Control the number of days to gather information for.
    var numberOfDays = 93;

    for (var currentDay = 0; currentDay < numberOfDays; currentDay++) {

        var newDate = moment()
            .add(currentDay, "days")
            .format("YYYY-MM-DD");

            var newDay = moment()
            .add(currentDay, "days")
            .format("DD");

            var newYear = moment()
            .add(currentDay, "days")
            .format("YYYY");

            var newMonth = moment()
            .add(currentDay, "days")
            .format("MM");

        var a = allDestinations[index].root;
        var b = allDestinations[index].origin;
        var c = allDestinations[index].destination;
        var d = newDate;
        var e = allDestinations[index].oneCarryOnBagAndCurrency;
        var f = allDestinations[index].fareClass;
        var g = allDestinations[index].fareClassDescription;
        var h = allDestinations[index].destinationDescription;
        var i = allDestinations[index].originDescription;
        var j = newDay;
        var k = newMonth;
        var l = newYear;


        allDatesAndDestinations.push({
            root: a,
            origin: b, // montreal is /m/052p7 , new york is /m/02_286, toronto is /m/0h7h6
            destination: c, // montreal is /m/052p7. , new york is /m/02_286. , toronto is /m/0h7h6.
            queryDate: d, //YYYY-MM-DD
            oneCarryOnBagAndCurrency: e, // CAD is ;c:CAD , USD is ;c:USD
            fareClass: f, // economy is ";e:1;so:1;sd:1;t:f;tt:o" , business is ";e:1;sc:b;so:1;sd:1;t:f;tt:o"
            fareClassDescription: g,
            destinationDescription: h,
            originDescription: i,
            dBDay: j,
            dBMonth: k,
            dBYear: l,
        });


        if ((currentDay + 1) === numberOfDays) {
            readyToTriggerPuppteer++;



            //if (readyToTriggerPuppteer === 16) {
                getFlights();
            //}

        }

    }
}



async function getFlights() {
    /* eslint-disable no-await-in-loop */
    for (var index in allDatesAndDestinations) {

        var fareClassDescription = allDatesAndDestinations[index].fareClassDescription;
        var destinationDescription = allDatesAndDestinations[index].destinationDescription;
        var originDescription = allDatesAndDestinations[index].originDescription;
        var qryDt = allDatesAndDestinations[index].queryDate;
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


            var url = allDatesAndDestinations[index].root + allDatesAndDestinations[index].origin + allDatesAndDestinations[index].destination + allDatesAndDestinations[index].queryDate + allDatesAndDestinations[index].oneCarryOnBagAndCurrency + allDatesAndDestinations[index].fareClass;

            console.log(url);

            await page.goto(url, {
                waitUntil: "networkidle0",
            });

            var allFlights = await page.$$(".gws-flights-results__has-dominated > li");

            // const flightName = await allFlights[0].$eval("span", span => span.textContent);

            // this will provide the flight logo
            var flightAirlineLogo = await allFlights[0].$eval(
                ".gws-flights-results__airline-logo",
                element => "https:" + element.getAttribute("src")
            );
            // this gives me the specific price
            var price = await allFlights[0].$eval(
                ".gws-flights-results__price",
                div => div.textContent
            );
            var splitterA = price.split('$');
            var currency = splitterA[0].trim();
            var flightPrice = splitterA[1].trim();

            // this gives me the airports
            var flightAirports = await allFlights[0].$eval(
                ".gws-flights-results__airports",
                div => div.textContent
            );
            // this gives me the travel times
            var flightTimes = await allFlights[0].$eval(
                ".gws-flights-results__times",
                div => div.textContent
            );
            // this gives me the airlines
            var flightAirlines = await allFlights[0].$eval(
                ".gws-flights-results__carriers",
                div => div.textContent
            );

            var dayOfScheduledFlight = await (allDatesAndDestinations[index].queryDate);

            var flightResults = {
                flightAirlineLogo,
                flightAirlines,
                flightPrice,
                flightTimes,
                flightAirports,
                dayOfScheduledFlight,
                fareClassDescription,
                destinationDescription,
                originDescription,
                currency,
            };

            flightResultsRef = db.ref(`flightResultsRef/${originDescription}/${destinationDescription}/${fareClassDescription}/${dBYear}/${dBMonth}/${dBDay}/`);
            flightResultsRef.update({
                flightResults
            });

            console.log(flightResults);
            console.log('\n\n\n');



            await browser.close();


        } catch (errorMsg) {
            console.log("queryErrorIs", errorMsg);
        }
    }
    /* eslint-enable no-await-in-loop */

    console.log('Finished!');
    return true;
}