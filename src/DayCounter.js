var DayCounter = function() {
  var today = new Date();

  this.configDate = function(dateValue) {
    var dateArr = dateValue.split('-');
    return dateArr;
  };

  this.dateToObject = function(dateArr) {
    var y, m, d;

    y = Number(dateArr[0]);
    m = Number(dateArr[1]) - 1;
    d = Number(dateArr[2]);

    return new Date(y, m, d);
  };

  this.weeksAndDays = function(dateObj) {
    var gapInMs = dateObj - today;
    var msPerDay = 24 * 60 * 60 * 1000;
    var inDays = Math.ceil(gapInMs / msPerDay);
    var inWeeks = Math.floor(inDays / 7);
    var remainingDays = inDays % 7;
    var weekStr, dayStr, output;

    if (inDays >= 1) {
      if (inWeeks === 1) {
        weekStr = inWeeks + " week";
      } else if (inWeeks > 1) {
        weekStr = inWeeks + " weeks";
      } else {
        weekStr = "";
      }

      if (remainingDays === 1) {
        dayStr = remainingDays + " day";
      } else if (remainingDays > 1) {
        dayStr = remainingDays + " days";
      } else {
        dayStr = "";
      }

      if (weekStr && dayStr) {
        output = weekStr + " and " + dayStr + " left until then.";
      } else {
        output = weekStr + dayStr + " left until then.";
      }
    } else {
      output = false;
    }

    return output;
  };
};

module.exports = DayCounter;
