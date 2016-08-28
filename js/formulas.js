var formulas = {
  section1: function(vars) {
    /** Important vars:
     * avgsales
     * merchantservicecharge
     */
    var fixedLoanLength = 5;
    var dailyInterestRate = getDailyInterestFromAPR(18);
    var monthlyInterestRate = getMonthlyInterestFromAPR(18);
    var resultTable=[];
    vars.avgsales = parseFloat(vars.avgsales);
    vars.merchantservicecharge = parseFloat(vars.merchantservicecharge/100);
    var merchantServiceChargeAmnt = parseFloat(vars.merchantservicecharge*vars.avgsales);
    console.log("Merchant's charge (amnt): " + merchantServiceChargeAmnt);

    /* DAILY COMPOUNDED INTEREST: */
    var dailyTotalPayment = roundToCent(loanPayment(vars.avgsales,parseFloat(dailyInterestRate),(fixedLoanLength*365.25)));
    console.log("Daily payment: " + dailyTotalPayment + " = " + (dailyTotalPayment*30) + "/mo");
    /* MONTHLY COMPOUNED INTEREST: */
    var monthlyTotalPayment = loanPayment(vars.avgsales,parseFloat(monthlyInterestRate),(fixedLoanLength*12));
    //var monthlyTotalPayment = dailyTotalPayment*30;
    console.log("Monthly payment: " + monthlyTotalPayment);
    //var yearlyTotalPayment = dailyTotalPayment*356.25;
    var yearlyTotalPayment = monthlyTotalPayment * 12;
    console.log("Yearly payment: " + yearlyTotalPayment + " (daily compounding: " + dailyTotalPayment*365.25 + ")");
    //var fiveYearTotalPayment = dailyTotalPayment*5*356.25;
    var fiveYearTotalPayment = yearlyTotalPayment*5;
    console.log("Five year payment: " + fiveYearTotalPayment);
    var fiveYearTotalInterest = fiveYearTotalPayment-vars.avgsales;
    console.log("Five year total interest: " + fiveYearTotalInterest);
    //var totalFiveYearPro = fiveYearGross-vars.avgsales;
    //var fiveYearGross = compoundInterest(vars.avgsales,parseFloat(fixedMerchantCharge),fixedLoanLength);

    //var fiveYearNet = vars.avgsales*fixedLoanLength*12;
    //var fiveYearInterest = fiveYearGross-fiveYearNet;
    //var valueOfSeries = futureValueOfSeriesEnd(vars.avgsales,parseFloat(fixedMerchantCharge),fixedLoanLength);

    //console.log("Five year GROSS @ 18% (amnt): " + fiveYearGross);
    //console.log("Five year INTEREST: " + totalFiveYearInterest);
    //console.log("Five year NET @ 18% (amnt): " + fiveYearNet);
    //console.log("Five year interest @ 18% (amnt): " + fiveYearInterest);
    //console.log("Future value of series for 5 years: " + valueOfSeries);

    //var oneYearPotential = totalFiveYearInterest + merchantServiceChargeAmnt;
    //console.log("One year potential: " + oneYearPotential);
    /*
    var oneMonthPotential = oneYearPotential/60;
    console.log("Monthly potential: " + oneMonthPotential);
    */

    var calc2 = fiveYearTotalInterest + merchantServiceChargeAmnt;
    console.log("Calculation #2: " + calc2);
    var calc3 = calc2 * 12;
    console.log("Calculation #3: " + calc3);

    for(var c=1;c<21;c++) {
      var yearGross = calc3 * c;
      console.log("Year " + c + " potential: " + yearGross);
      resultTable.push(["Your profit potential per " + c + " years:",roundToCent(yearGross)]);
    }
    return resultTable;
  },
  section2: function(vars) {
    /** Critical vars:
     * 1 - productprice
     * 2 - productfinanceprice
     * 3 - interestrate
     * 4 - financemonths
     * 5 - avgunits
     * 6 - merchantservicecharge
     */
    var dailyInterestRate = getDailyInterestFromAPR(vars.interestrate);
    var monthlyInterestRate = getMonthlyInterestFromAPR(vars.interestrate);
    var resultTable=[];
    vars.avgsales = parseFloat(vars.avgsales);
    vars.merchantservicecharge = parseFloat(vars.merchantservicecharge/100);

    /* CALCULATION #1 */
    console.log("Product finance price: " + vars.productfinanceprice + " Product price: " + vars.productprice);
    var calc1 = vars.productfinanceprice - vars.productprice;
    console.log("CALC #1: " + calc1);

    /* CALCULATION #2 */
    var periodicLoanPayment = loanPayment(vars.productfinanceprice,parseFloat(dailyInterestRate),(vars.financemonths*30.43));
    console.log("Periodic Loan Payment: " + periodicLoanPayment);
    var totalLoanPayment = periodicLoanPayment*vars.financemonths*30.43;
    console.log("Total Loan Payment: " + totalLoanPayment);
    var calc2a = totalLoanPayment-vars.productprice;
    var calc2b = calc2a + calc1;
    console.log("CALC #2a: " + calc2a);
    console.log("CALC #2b: " + calc2b);

    /* CALCULATION #3 */
    var calc3 = calc2a * vars.avgunits;
    console.log("CALC #3: " + calc3);

    /* CALCULATION #4 */
    var calc4 = calc3 * 12;
    console.log("CALC #4: " + calc4);

    for(var c=1;c<21;c++) {
      /* CALCULATION #5 */
      console.log("Year " + c + " potential: " + (calc4*c));
      resultTable.push(["Your profit potential per " + c + " years:",roundToCent(calc4*c)]);
    }
    return resultTable;
  },
  section3: function(vars) {
    /** Critical vars:
     * 1 - productprice
     * 2 - productfinanceprice
     * 3 - interestrate
     * 4 - financemonths
     * 5 - avgunits
     * 6 - merchantservicecharge
     */
    var dailyInterestRate = getDailyInterestFromAPR(vars.interestrate);
    var monthlyInterestRate = getMonthlyInterestFromAPR(vars.interestrate);
    var resultTable=[];
    vars.avgsales = parseFloat(vars.avgsales);
    //vars.merchantservicecharge = parseFloat(vars.merchantservicecharge/100);

    /* CALCULATION #1 */
    console.log("Product finance price: " + vars.productfinanceprice + " Product price: " + vars.productprice + " Merchant charge: " + vars.merchantservicecharge + " Service Charge type: " + vars.merchantservicechargechoice);
    var calc1;
    if(vars.merchantservicechargechoice=="%") {
      console.log("Calculating by percentage: " + vars.merchantservicecharge/100);
      calc1 = vars.productprice*(vars.merchantservicecharge/100);
    } else {
      calc1 = vars.productfinanceprice - vars.productprice + vars.merchantservicecharge;
    }
    console.log("CALC #1: " + calc1);

    /* CALCULATION #2 */
    var periodicLoanPayment = loanPayment(vars.productfinanceprice,parseFloat(dailyInterestRate),(vars.financemonths*30.43));
    console.log("Periodic Loan Payment: " + periodicLoanPayment);
    console.log("Monthly payment: " + periodicLoanPayment*30.43);
    var totalLoanPayment = periodicLoanPayment*vars.financemonths*30.43;
    console.log("Total Loan Payment: " + totalLoanPayment);
    var calc2a = totalLoanPayment-vars.productprice;
    console.log("CALC #2a: " + calc2a);
    var calc2b = calc2a + calc1;
    console.log("CALC #2b: " + calc2b);

    /* CALCULATION #3 */
    var calc3 = calc2a * vars.avgunits;
    console.log("CALC #3: " + calc3);

    /* CALCULATION #4 */
    var calc4 = calc3 * 12;
    console.log("CALC #4: " + calc4);

    for(var c=1;c<21;c++) {
      /* CALCULATION #5 */
      console.log("Year " + c + " potential: " + (calc4*c));
      resultTable.push(["Your profit potential per " + c + " years:",roundToCent(calc4*c)]);
    }
    return resultTable;
  },
  section4: function(vars) {
    /** Critical vars:
     * 1 - numcustomers
     * 2 - collactionsamnt
     * 3 - merchantservicecharge
     * 4 - customeravgspending
     */
    var dailyInterestRate = getDailyInterestFromAPR(18);
    var resultTable=[];
    /*
    var monthlyInterestRate = getMonthlyInterestFromAPR(vars.interestrate);
    vars.avgsales = parseFloat(vars.avgsales);
    vars.merchantservicecharge = parseFloat(vars.merchantservicecharge/100);
    */

    /* CALCULATION #1 */
    console.log("Collections amount: " + vars.collectionsamnt + " Customers: " + vars.numcustomers);
    var calc1 = vars.collectionsamnt/vars.numcustomers;
    console.log("CALC #1: " + calc1);

    /* CALCULATION #2 */
    var calc2;
    if(vars.merchantservicechargechoice=="%") {
      calc2 = calc1*(vars.merchantservicecharge/100);
    } else {
      calc2 = calc1-vars.merchantservicecharge;
    }
    console.log("CALC #2: " + calc2);

    /* CALCULATION #3 */
    var periodicLoanPayment = loanPayment(calc1,parseFloat(dailyInterestRate),(36*30.43));
    console.log("Periodic Loan Payment: " + periodicLoanPayment);
    console.log("Monthly payment: " + periodicLoanPayment*30.43);
    var calc3 = periodicLoanPayment*36*30.43;
    console.log("Total Loan Payment: " + calc3);

    /* CALCULATION #4 */
    var calc4 = calc3*vars.numcustomers;
    console.log("CALC4 #4: " + calc4);

    /* CALCULATION #5 */
    var calc5 = vars.customeravgspending*calc1;
    console.log("CALC #5: " + calc5);

    for(var c=1;c<21;c++) {
      /* CALCULATION #6 */
      var calc6 = roundToCent(calc4*c);
      console.log("Year " + c + " potential: " + calc6);
      resultTable.push(["Your profit potential per " + c + " years:",calc6]);
    }
    return resultTable;
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
  return (val/12)/100;
};

var getDailyInterestFromAPR = function(val) {
  return (val/365.25)/100;
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

var loanPayment = function(pmt,r,y) {
  console.log("Loan payment - pmt: " + pmt + " rate: " + r + " time: " + y);

  return pmt*r/(1-(Math.pow(1/(1 + r),y)));
  // This one reports ~20$ less per year
  //return (r*pmt)/(1-Math.pow((1+r),-1*y));
  // This one returns EXACTLY the same as above
  //return (r+(r/(Math.pow((1+r),y)-1)))*pmt;
  // Likewise this one:
  //return r*pmt*Math.pow((1+r),y)/((Math.pow((1+r),y))-1);
  // This one reports $20 less per month...
  //return pmt*(r+r/Math.pow((1+r),(y)-1));
  //return r*pmt*Math.pow((1+r),y)/((Math.pow((1+r),y))-1);

}

var roundToCent = function(val) {
  return Math.ceil(val*100)/100;
  //return Math.round(val*100)/100;
}
