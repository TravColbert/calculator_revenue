var formulas = {
  section1: function(vars) {
    /** Important vars:
     * avgsales
     * merchantservicecharge
     */
    var fixedLoanLength = 5;
    var fixedMerchantCharge = (18/100);
    var resultTable=[];
    vars.avgsales = parseFloat(vars.avgsales);
    vars.merchantservicecharge = parseFloat(vars.merchantservicecharge/100);
    var merchantServiceChargeAmnt = parseFloat(vars.merchantservicecharge*vars.avgsales);
    console.log("Merchant's charge (amnt): " + merchantServiceChargeAmnt);

    var fiveYearGross = compoundInterest(vars.avgsales,parseFloat(fixedMerchantCharge),fixedLoanLength);
    var oneYearGross = fiveYearGross/5;

    //var fiveYearNet = vars.avgsales*fixedLoanLength*12;
    //var fiveYearInterest = fiveYearGross-fiveYearNet;
    //var valueOfSeries = futureValueOfSeriesEnd(vars.avgsales,parseFloat(fixedMerchantCharge),fixedLoanLength);

    console.log("Five year GROSS @ 18% (amnt): " + fiveYearGross);
    console.log("One year GROSS: " + oneYearGross);
    //console.log("Five year NET @ 18% (amnt): " + fiveYearNet);
    //console.log("Five year interest @ 18% (amnt): " + fiveYearInterest);
    //console.log("Future value of series for 5 years: " + valueOfSeries);

    var oneYearPotential = oneYearGross + merchantServiceChargeAmnt;
    console.log("One year potential: " + oneYearPotential);
    /*
    var oneMonthPotential = oneYearPotential/60;
    console.log("Monthly potential: " + oneMonthPotential);
    */
    var calc3 = oneYearPotential * 12;
    console.log("Calc3: " + calc3);

    for(var c=1;c<21;c++) {
      var yearGross = calc3 * c;
      console.log("Year " + c + " potential: " + yearGross);
      resultTable.push(["Your profit potential per " + c + " years:",roundToCent(yearGross)]);
    }
    return resultTable;
  },
  section2: function(vars) {
    /** Critical vars:
     * sellprice
     * interestrate
     * financemonths
     * ??? Annual loss ??? TODO: Ask Scott what that's for
     */
    var resultTable=[];
    vars.sellprice = parseFloat(vars.sellprice);
    vars.interestrate = (parseFloat(vars.interestrate)/100);
    vars.financemonths = parseInt(vars.financemonths);

    var monthGross = compoundInterestPlusPrincipal(vars.sellprice,vars.interestrate,vars.financemonths);
    console.log("Month (Gross): " + monthGross);
    console.log("Month (Net): " + vars.sellprice);
    var diffGross = monthGross-vars.sellprice;
    console.log("Difference (Gross): " + diffGross);
    var diffMonthly = diffGross/vars.financemonths
    console.log("Difference (Monthly): " + diffMonthly);
    resultTable.push(["Your profit potential per month:",roundToCent(diffMonthly)]);

    for(var c=1;c<21;c++) {
      // This might be just a simple multiplier of monthAvg (above)
      var yearDiff = diffMonthly*(c*12);
      resultTable.push(["Your profit potential per " + c + " years:",roundToCent(yearDiff)]);
    }
    return resultTable;
  },
  section3: function(vars) {
    /** Critical vars:
     * sellprice
     * interestrate
     * financemonths
     * numunits
     * merchantservicecharge
     */


  }
};

/** Support Calculation Functions **/

/**
 * FV : future value
 * Pmt: Monthly payment
 * r  : interest rate
 * n  : number of years
 *
 * NOTES ON INTEREST RATES:
 *
 * There are year-based (e.g. APR), month-based or even day-based ineterest rates.
 * We use the functions below to convert from APR.
 */

var getMonthlyInterestFromAPR = function(val) {
  return (val/100)/12;
};

var getDailyInterestFromAPR = function(val) {
  return (val/100)/365;
};

var simpleInterest = function(pmt,r,n) {
  console.log("Simple interest - pmt: " + pmt + " rate: " + r + " months: " + n);
  return pmt*(r)*n;
}

var simpleInterestPlusPrincipal = function(pmt,r,n) {
  console.log("Simple interest + principal - pmt: " + pmt + " rate: " + r + " months: " + n);
  return pmt*(1+r)*n;
}

var compoundInterest = function(pmt,r,y) {
  console.log("Compound interest + principal - pmt: " + pmt + " rate: " + r + " years: " + y);
  return pmt*Math.pow(1+(r/12),(12*y));
}

var futureValueOfAnnuity = function(pmt,r,n) {
  console.log("Future Value of Annuity - pmt: " + pmt + " rate: " + r + " months: " + n);
  return pmt*((Math.pow((1+r),n)-1)/r);
}

var futureValueOfSeriesEnd = function(pmt,r,y) {
  console.log("Future Value of Series End of period - pmt: " + pmt + " rate: " + r + " years: " + y);
  return pmt*(Math.pow((1+(r/12)),(12*y)-1)/(r/12));
}

var futureValueOfSeriesBeginning = function(pmt,r,y) {
  console.log("Future Value of Series Beginning period - pmt: " + pmt + " rate: " + r + " years: " + y);
}
var roundToCent = function(val) {
  return Math.round(val*100)/100;
}
