var animSpeed = 200;
var result;

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

var getInterestFromAPR = function(val) {
  return (val/100)/12;
};

var simpleInterest = function(pmt,r,n) {
  console.log("Simple interest - pmt: " + pmt + " rate: " + r + " months: " + n);
  return pmt*(r)*n;
}

var simpleInterestPlusPrincipal = function(pmt,r,n) {
  console.log("Simple interest + principal - pmt: " + pmt + " rate: " + r + " months: " + n);
  return pmt*(1+r)*n;
}

var futureValueOfAnnuity = function(pmt,r,n) {
  console.log("Future Value of Annuity - pmt: " + pmt + " rate: " + r + " months: " + n);
  return pmt*((Math.pow((1+r),n)-1)/r);
};

var roundToCent = function(val) {
  return Math.round(val*100)/100;
}

var initLayout = function() {
  // if you use a layout toolkit like Skel you can put its init here
}

var initLinks = function() {
  $(".navitem").click(function() {
    var linkTo = $(this).attr("linkto");
    swapSection(linkTo);
  });

  $(".btn-calculate").click(function() {
    var currentSection = $(this).parents("section").attr("id");
    //var linkTo = currentSection + "calculation";
    // Calculate the formula here
    calculateFormula(currentSection);
    swapSection(currentSection + "calculation");
  });
}

var initFields = function() {
  $(".interestfield").blur(function() {
    validateInterestField(this);
  });
  $(".moneyfield").blur(function() {
    validateMoneyField(this);
  });
}

var validateInterestField = function(element) {
  var val = $(element).val() || null;
  if(!isValidInterestVal(val)) {
    $(element).addClass("error");
    $(element).focus();
  } else {
    $(element).removeClass("error");
    $(element).addClass("success");
  }
}

var validateMoneyField = function(element) {
  var val = $(element).val() || null;
  if(!isValidMoneyVal(val)) {
    $(element).addClass("error");
    $(element).focus();
  } else {
    $(element).removeClass("error");
    $(element).addClass("success");
  }
}

var isValidMoneyVal = function(val) {
  if(val===null || val=="" || val===undefined) return false;
  return true;
}

var isValidInterestVal = function(val) {
  if(val===null || val=="" || val===undefined) return false;
  return true;
}

var activateSection = function(section) {
  if($("section.active").attr("id")!=section) {
    $("section.active").removeClass("active");
    $("section#" + section).addClass("active");
  }
  $("section.active").animate(
    {opacity:1},
    animSpeed,
    "swing"
  );
}

var swapSection = function(section) {
  var currentActiveSectionId = $("section.active").attr("id");
  if(currentActiveSectionId == section) return true;
  $("section.active").animate(
    {opacity:0},
    animSpeed,
    "swing",
    function() {
      activateSection(section)
    }
  );
}

var calculateFormula = function(section) {
  // Holds the parameters pulled from the form
  var vars = {};

  // Pull field values from form
  console.log("Got section: " + section);
  $("#" + section + " input").each(function() {
    console.log("Input: " + $(this).attr("id"));
    var param = $(this).attr("id");
    vars[param] = $(this).val();
  });

  console.log(JSON.stringify(vars));
  /* Perform calculation. 'result' should be an object with references to each
   * field that will be filled-out on the next screen
   */
  result = calculate(section,vars);
  // Prepare object used to fill-in next section
  var resultTable = $("section#" + section + "calculation table").get();
  $(resultTable).empty();
  for(var c=0; c<result.length; c++) {
    $(resultTable).append("<tr id=\"" + c + "\"><td>" + result[c][0] + "</td><td class=\"loss\">" + result[c][1] + "</td></tr>");
  }
  $("tr").click(function() {
    var lossValue=$(this).children("td.loss").html();
    console.log(lossValue + " " + section);
    showLossValue(lossValue,section);
  })
}

var calculate = function(section,vars) {
  return formulas[section](vars)
}

var showLossValue = function(val,section) {
  $("#" + section + "calculation #potentialprofit").val(val);
}

$(document).ready(function() {
  initLayout();
  initLinks();
  initFields();
  activateSection("home");
})
