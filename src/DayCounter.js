var DayCounter = function() {
  var today = new Date();

  this.configDate = function(dateValue) {
    var dateArr = dateValue.split(' ');
    dateArr[0] = dateArr[0].toLowerCase();

    // Fix error when date is 2nd or 22nd
    if (dateArr[1] === 'second'){
      dateArr[1] = '2nd';
    } else if (dateArr[1] === '20' && dateArr[2] === 'second') {
      dateArr[1] = '22nd';
      dateArr.splice(2, 1);
    }

    if (dateArr.length === 2) {
      dateArr.push(today.getFullYear());
    }

    return dateArr;
  };

  this.dateToObject = function(dateArr) {
    var err = false;
    var y, m, d;

    y = dateArr[2];

    switch (dateArr[0]) {
      case 'january':   m = 0;  break;
      case 'february':  m = 1;  break;
      case 'march':     m = 2;  break;
      case 'april':     m = 3;  break;
      case 'may':       m = 4;  break;
      case 'june':      m = 5;  break;
      case 'july':      m = 6;  break;
      case 'august':    m = 7;  break;
      case 'september': m = 8;  break;
      case 'october':   m = 9;  break;
      case 'november':  m = 10; break;
      case 'december':  m = 11; break;
      default: err = true;
    }

    switch (dateArr[1]) {
      case '1st': case '1':
        d = 1;  break;
      case '2nd': case '2':
        d = 2;  break;
      case '3rd': case '3':
        d = 3;  break;
      case '4th': case '4':
        d = 4;  break;
      case '5th': case '5':
        d = 5;  break;
      case '6th': case '6':
        d = 6;  break;
      case '7th': case '7':
        d = 7;  break;
      case '8th': case '8':
        d = 8;  break;
      case '9th': case '9':
        d = 9;  break;
      case '10th': case '10':
        d = 10; break;
      case '11th': case '11':
        d = 11; break;
      case '12th': case '12':
        d = 12; break;
      case '13th': case '13':
        d = 13; break;
      case '14th': case '14':
        d = 14; break;
      case '15th': case '15':
        d = 15; break;
      case '16th': case '16':
        d = 16; break;
      case '17th': case '17':
        d = 17; break;
      case '18th': case '18':
        d = 18; break;
      case '19th': case '19':
        d = 19; break;
      case '20th': case '20':
        d = 20; break;
      case '21st': case '21':
        d = 21; break;
      case '22nd': case '22':
        d = 22; break;
      case '23rd': case '23':
        d = 23; break;
      case '24th': case '24':
        d = 24; break;
      case '25th': case '25':
        d = 25; break;
      case '26th': case '26':
        d = 26; break;
      case '27th': case '27':
        d = 27; break;
      case '28th': case '28':
        d = 28; break;
      case '29th': case '29':
        d = 29; break;
      case '30th': case '30':
        d = 30; break;
      case '31st': case '31':
        d = 31; break;
      default:
        err = true;
    }

    if (err) {
      return false;
    } else {
      return new Date(y, m, d);
    }
  };

  this.weeksAndDays = function(dateObj, dateStr) {
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
        output = weekStr + " and " + dayStr + " left until " + dateStr + ".";
      } else {
        output = weekStr + dayStr + " left until " + dateStr + ".";
      }
    } else {
      output = "Please tell me a future date.";
    }

    return output;
  };
};

module.exports = DayCounter;
