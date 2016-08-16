var formulas = {
  /* Questions:
   * Are the interest rate fields APR's or monthly
   * if APR then its: val/12
   * otherwise its: val
   */
  section1: function(vars) {
    var resultTable=[];
    vars.avgsales = parseFloat(vars.avgsales);
    // The APR rate conversion may not be right?
    //vars.merchantservicecharge = getInterestFromAPR(parseFloat(vars.merchantservicecharge));
    vars.merchantservicecharge = (parseFloat(vars.merchantservicecharge)/100);
    //resultTable.push(["Your profit potential per month:",(vars.avgsales*vars.merchantservicecharge)]);

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
  }
};
