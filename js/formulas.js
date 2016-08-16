var formulas = {
  section1: function(vars) {
    /** Important vars:
     * avgsales
     * merchantservicecharge
     */
    var resultTable=[];
    vars.avgsales = parseFloat(vars.avgsales);
    //vars.merchantservicecharge = getInterestFromAPR(parseFloat(vars.merchantservicecharge));
    vars.merchantservicecharge = (parseFloat(vars.merchantservicecharge)/100);

    var monthGross = simpleInterestPlusPrincipal(vars.avgsales,vars.merchantservicecharge,1);
    console.log("Gross: " + monthGross);
    console.log("Net: " + vars.avgsales);
    console.log(monthGross-vars.avgsales);
    resultTable.push(["Your profit potential per month:",roundToCent(monthGross-vars.avgsales)]);

    /* These yearly calculations seem to be something like a 'future value of
     * annuity' calculation. Therefore:
     *
     * FV = Pmt * (((1 + r) ^ n) – 1)/r)
     * FV : future value
     * Pmt: Monthly payment
     * r  : interest rate
     * n  : number of periods (months)
     */
    for(var c=1;c<21;c++) {
      var yearGross = futureValueOfAnnuity(vars.avgsales,vars.merchantservicecharge,(c*12));
      var yearNet = vars.avgsales*(c*12);
      /*
      console.log("Gross: " + yearGross);
      console.log("Net: " + yearNet);
      console.log(yearGross-yearNet);
      */
      resultTable.push(["Your profit potential per " + c + " years:",roundToCent(yearGross-yearNet)]);
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
  }
};

/** Support Calculation Functions **/

/**
 * FV : future value
 * Pmt: Monthly payment
 * r  : interest rate
 * n  : number of periods (months)
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

var compoundInterestPlusPrincipal = function(pmt,r,n) {
  console.log("Compound interest + principal - pmt: " + pmt + " rate: " + r + " months: " + n);
  // refs[0]*Math.pow(1+((refs[1]/100)/refs[3]),(refs[2]*refs[3]));
  return pmt*Math.pow(1+(r/12),n);
}

var futureValueOfAnnuity = function(pmt,r,n) {
  console.log("Future Value of Annuity - pmt: " + pmt + " rate: " + r + " months: " + n);
  return pmt*((Math.pow((1+r),n)-1)/r);
};

var roundToCent = function(val) {
  return Math.round(val*100)/100;
}
