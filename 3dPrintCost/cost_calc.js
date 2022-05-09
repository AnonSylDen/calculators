

const COOKIE_DAYS = 365;

var floatObjectWeight = "";
var floatPrintingTime = "";
var floatElectricTariff = "";
var floatPrinterPower = "";
var floatFilamentCost = "";
var floatPrinterPurchase = "";
var floatPrinterLife = "";
var floatPrinterUse = "";
var floatRepairRate = "";
var floatOtherCosts = "";
var floatFailureRate = "";

//=============================================================
// setCookie - set a cookie on the host device
//=============================================================
function setCookie(strCookieName, intCookieValue, intExpireDays)
{
  var dateExDate;
  
  // Set cookie with value and expiry date
  dateExDate = new Date();
  dateExDate.setDate(dateExDate.getDate() + intExpireDays);
  document.cookie=strCookieName + "=" + escape(intCookieValue) +
  ((intExpireDays == null) ? "" : ";expires=" + dateExDate.toGMTString());
}


//=============================================================
// getCookie - read a cookie from the host device
//=============================================================
function getCookie(strCookieName)
{
  var intCookieStart;
  var intCookieEnd;
  var strCookieValue;

  // Assume no cookie until found
  strCookieValue = "";

  // Extract cookie value if it exists
  if (document.cookie.length > 0)
  {
    intCookieStart = document.cookie.indexOf(strCookieName + "=");
    if (intCookieStart != -1)
    {
      intCookieStart = intCookieStart + strCookieName.length + 1;
      intCookieEnd = document.cookie.indexOf(";", intCookieStart);
      if (intCookieEnd == -1)
      {
        intCookieEnd = document.cookie.length;
      }
      strCookieValue = unescape(document.cookie.substring(intCookieStart, intCookieEnd));
    }
  }
  
  // Return cookie value
  return strCookieValue;
}


//=============================================================
// calcEnergy - returns electricity costs for object
//=============================================================
function calcEnergy()
{
  var floatEnergy;
  var floatKW;
  var floatPoundsHour;
  
  // Calculations based on spreadsheet
  floatKW = floatPrinterPower / 1000.0;
  floatPoundsHour = floatKW * floatElectricTariff;
  floatEnergy = floatPoundsHour * floatPrintingTime;
  
  // Return energy cost
  return floatEnergy;
}


//=============================================================
// calcFilament - returns filament costs for object
//=============================================================
function calcFilament()
{
  var floatFilament;
  
  // Calculations based on spreadsheet
  floatFilament = floatFilamentCost / 1000.0 * floatObjectWeight;
  
  // Return floatFilament cost
  return floatFilament;
}


//=============================================================
// calcLifetime - returns lifetime hours for object
//=============================================================
function calcLifetime()
{
  var floatLifetime;
  
  // Calculations based on spreadsheet
  floatLifetime = 365.0 * floatPrinterLife * floatPrinterUse;
  
  // Return depreciation cost
  return floatLifetime;
}


//=============================================================
// calcDepreciation - returns depreciation costs for object
//=============================================================
function calcDepreciation()
{
  var floatDepreciation;
  var floatLifetime;
  var floatDeprHr;
  
  // Calculations based on spreadsheet
  floatLifetime = calcLifetime();
  floatDeprHr = floatPrinterPurchase / floatLifetime;
  floatDepreciation = floatDeprHr * floatPrintingTime;
  
  // Return depreciation cost
  return floatDepreciation;
}


//=============================================================
// calcRepairs - returns repair costs for object
//=============================================================
function calcRepairs()
{
  var floatRepairs;
  var floatRepairsHr;
  
  // Calculations based on spreadsheet
  floatRepairsHr = (floatPrinterPurchase / 100.0 * floatRepairRate) / calcLifetime();
  floatRepairs = floatRepairsHr * floatPrintingTime;
  
  // Return repairs cost
  return floatRepairs;
}


//=============================================================
// calcOther - returns other costs for object
//=============================================================
function calcOther()
{
  var floatOther;
  
  // Calculations based on spreadsheet
  floatOther = floatOtherCosts;
  
  // Return other cost
  return floatOther;
}


//=============================================================
// calcTotalNotFailures - returns cost besides floatFailures for object
//=============================================================
function calcTotalNotFailures()
{
  var floatTotalNotFailures;

  // Calculate total costs before failures
  floatTotalNotFailures = calcEnergy() +
                          calcFilament() +
                          calcDepreciation() +
                          calcRepairs() +
                          calcOther();
 
  // Return total costs before failures
  return floatTotalNotFailures;
}


//=============================================================
// calcFailures - returns failure costs for object
//=============================================================
function calcFailures()
{
  var floatFailures;
  
  // Calculations based on spreadsheet
  floatFailures = calcTotalNotFailures() / 100.0 * floatFailureRate;
  
  // Return floatOther cost
  return floatFailures;
}


//=============================================================
// grabInputs - saves input values as globals and cookies
//=============================================================
function grabInputs()
{
  // Copy all inputs to global variables
  floatObjectWeight    = Number(document.getElementById('object weight').value);
  floatPrintingTime    = Number(document.getElementById('printing time').value);
  floatElectricTariff  = Number(document.getElementById('electric tariff').value);
  floatPrinterPower    = Number(document.getElementById('printer power').value);
  floatFilamentCost    = Number(document.getElementById('filament cost').value);
  floatPrinterPurchase = Number(document.getElementById('printer purchase').value);
  floatPrinterLife     = Number(document.getElementById('printer life').value);
  floatPrinterUse      = Number(document.getElementById('printer use').value);
  floatRepairRate      = Number(document.getElementById('repair rate').value);
  floatOtherCosts      = Number(document.getElementById('other costs').value);
  floatFailureRate     = Number(document.getElementById('failure rate').value);
}


//=============================================================
// inputsValid - validate all inputs
//=============================================================
function inputsValid()
{
  var boolIsInvalid;

  // Check whether ALL inputs are valid numbers
  boolIsInvalid =
    isNaN(floatObjectWeight) ||
    isNaN(floatPrintingTime) ||
    isNaN(floatElectricTariff) ||
    isNaN(floatPrinterPower) ||
    isNaN(floatFilamentCost) ||
    isNaN(floatPrinterPurchase) ||
    isNaN(floatPrinterLife) ||
    isNaN(floatPrinterUse) ||
    isNaN(floatRepairRate) ||
    isNaN(floatOtherCosts) ||
    isNaN(floatFailureRate);
    
  // Return true only if all inputs are valid
  return !(boolIsInvalid);
}


//=============================================================
// calcTotal - returns total costs based on variables, not inputs
//=============================================================
function calcTotal()
{
  var floatTotal = 0.0;

  // If inputs are valid, calc total, else alert user  
  if (inputsValid())
  {
    floatTotal = calcTotalNotFailures() + calcFailures();
  }
  else
  {
    alert("Some input fields contain non-numeric values (ie, letters or symbols). Please correct them, then re-calculate!");
  }
  
  // Return the total
  return floatTotal;
}


//=============================================================
// displayTotal - displays total costs for object
//=============================================================
function displayTotal()
{
  var floatTotal;

  // Copy inputs to global variables
  grabInputs();
  
  // Save all inputs as cookies
  saveCookies()
  
  // Calculate total
  floatTotal = calcTotal();
  
  // Only display new total if inputs were valid
  if (inputsValid())
  {
    document.getElementById('total cost').value = floatTotal.toFixed(2);
  }
}


//=============================================================
// resetDefaults - reset all input values to defaults
//=============================================================
function resetDefaults()
{
  // Set all input variables to default values
  floatObjectWeight    = "100";
  floatPrintingTime    = "5";
  floatElectricTariff  = "0.0568";
  floatPrinterPower    = "50";
  floatFilamentCost    = "34.19";
  floatPrinterPurchase = "1576";
  floatPrinterLife     = "3";
  floatPrinterUse      = "2";
  floatRepairRate      = "10";
  floatOtherCosts      = "0.1";
  floatFailureRate     = "10";
}


//=============================================================
// displayValues - outputs all global values to the screen
//=============================================================
function displayValues()
{
  // Output all global values to the screen
  document.getElementById('object weight').value = floatObjectWeight;
  document.getElementById('printing time').value = floatPrintingTime;
  document.getElementById('electric tariff').value = floatElectricTariff;
  document.getElementById('printer power').value = floatPrinterPower;
  document.getElementById('filament cost').value = floatFilamentCost;
  document.getElementById('printer purchase').value = floatPrinterPurchase;
  document.getElementById('printer life').value = floatPrinterLife;
  document.getElementById('printer use').value = floatPrinterUse;
  document.getElementById('repair rate').value = floatRepairRate;
  document.getElementById('other costs').value = floatOtherCosts;
  document.getElementById('failure rate').value = floatFailureRate;
  displayTotal();
}


//=============================================================
// saveCookies - saves all input variables as cookies
//=============================================================
function saveCookies()
{
  setCookie("floatObjectWeight", floatObjectWeight, COOKIE_DAYS);
  setCookie("floatPrintingTime", floatPrintingTime, COOKIE_DAYS);
  setCookie("floatElectricTariff", floatElectricTariff, COOKIE_DAYS);
  setCookie("floatPrinterPower", floatPrinterPower, COOKIE_DAYS);
  setCookie("floatFilamentCost", floatFilamentCost, COOKIE_DAYS);
  setCookie("floatPrinterPurchase", floatPrinterPurchase, COOKIE_DAYS);
  setCookie("floatPrinterLife", floatPrinterLife, COOKIE_DAYS);
  setCookie("floatPrinterUse", floatPrinterUse, COOKIE_DAYS);
  setCookie("floatRepairRate", floatRepairRate, COOKIE_DAYS);
  setCookie("floatOtherCosts", floatOtherCosts, COOKIE_DAYS);
  setCookie("floatFailureRate", floatFailureRate, COOKIE_DAYS);
}


//=============================================================
// loadCookies - loads all input variables from cookies
//=============================================================
function loadCookies()
{
  floatObjectWeight = getCookie("floatObjectWeight");
  floatPrintingTime = getCookie("floatPrintingTime");
  floatElectricTariff = getCookie("floatElectricTariff");
  floatPrinterPower = getCookie("floatPrinterPower");
  floatFilamentCost = getCookie("floatFilamentCost");
  floatPrinterPurchase = getCookie("floatPrinterPurchase");
  floatPrinterLife = getCookie("floatPrinterLife");
  floatPrinterUse = getCookie("floatPrinterUse");
  floatRepairRate = getCookie("floatRepairRate");
  floatOtherCosts = getCookie("floatOtherCosts");
  floatFailureRate = getCookie("floatFailureRate");
}


//=============================================================
// deleteCookies - deletes all cookies for testing
//=============================================================
function deleteCookies()
{
  setCookie("floatObjectWeight", "");
  setCookie("floatPrintingTime", "");
  setCookie("floatElectricTariff", "");
  setCookie("floatPrinterPower", "");
  setCookie("floatFilamentCost", "");
  setCookie("floatPrinterPurchase", "");
  setCookie("floatPrinterLife", "");
  setCookie("floatPrinterUse", "");
  setCookie("floatRepairRate", "");
  setCookie("floatOtherCosts", "");
  setCookie("floatFailureRate", "");
}


//=============================================================
// afterPageLoad - called after the page loads
//=============================================================
function afterPageLoad()
{

  // If we have cookies saved then load them all
  if (getCookie("floatObjectWeight") != "")
  {
    loadCookies();
  }
  
  // Else if no cookies saves load default values
  else
  {
    resetDefaults();
  }
  
  // Display values to user
  displayValues();
}

