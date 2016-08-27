var animSpeed = 200;
var result;

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

var initButtons = function() {
  $(".choicefield .prefix").addClass("btn navbtn");
  $(".choicefield .suffix").addClass("btn navbtn");
  $(".choicefield .navbtn").click(function() {
    $(this).addClass("selected");
    $(this).siblings().removeClass("selected");
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
  $(resultTable).append("<caption>Profit Potential</caption>");
  $(resultTable).append("<tr id=\"" + c + "\"><th class=\"years\">Year</th><th class=\"loss\">Potential</th></tr>");
  for(var c=0; c<result.length; c++) {
    $(resultTable).append("<tr id=\"" + c + "\"><td class=\"years\">" + result[c][0] + "</td><td class=\"loss\">" + result[c][1] + "</td></tr>");
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
  initButtons();
  activateSection("home");
})
