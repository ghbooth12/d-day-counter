var DayCounter = function() {
  this.configDate = function(dateValue) {
    var dateArr = dateValue.split(' ');
    dateArr[0] = dateArr[0].toLowerCase();

    // Fix error when date is 2nd or 22nd
    if (dateValue.includes('second')) {
      if (dateArr.length === 2) {
        dateArr[1] = '2nd';
      } else if (dateArr.length === 3) {
        dateArr[1] = '22nd';
        dateArr.pop();
      }
    }
    return dateArr;
  };

  this.dateToObject = function(dateArr) {
    var err = false;
    var mm, dd;

    switch (dateArr[0]) {
      case 'january':   mm = 0;  break;
      case 'february':  mm = 1;  break;
      case 'march':     mm = 2;  break;
      case 'april':     mm = 3;  break;
      case 'may':       mm = 4;  break;
      case 'june':      mm = 5;  break;
      case 'july':      mm = 6;  break;
      case 'august':    mm = 7;  break;
      case 'september': mm = 8;  break;
      case 'october':   mm = 9;  break;
      case 'november':  mm = 10; break;
      case 'december':  mm = 11; break;
      default: err = true;
    }

    switch (dateArr[1]) {
      case '1st': case '1':
        dd = 1;  break;
      case '2nd': case '2':
        dd = 2;  break;
      case '3rd': case '3':
        dd = 3;  break;
      case '4th': case '4':
        dd = 4;  break;
      case '5th': case '5':
        dd = 5;  break;
      case '6th': case '6':
        dd = 6;  break;
      case '7th': case '7':
        dd = 7;  break;
      case '8th': case '8':
        dd = 8;  break;
      case '9th': case '9':
        dd = 9;  break;
      case '10th': case '10':
        dd = 10; break;
      case '11th': case '11':
        dd = 11; break;
      case '12th': case '12':
        dd = 12; break;
      case '13th': case '13':
        dd = 13; break;
      case '14th': case '14':
        dd = 14; break;
      case '15th': case '15':
        dd = 15; break;
      case '16th': case '16':
        dd = 16; break;
      case '17th': case '17':
        dd = 17; break;
      case '18th': case '18':
        dd = 18; break;
      case '19th': case '19':
        dd = 19; break;
      case '20th': case '20':
        dd = 20; break;
      case '21st': case '21':
        dd = 21; break;
      case '22nd': case '22':
        dd = 22; break;
      case '23rd': case '23':
        dd = 23; break;
      case '24th': case '24':
        dd = 24; break;
      case '25th': case '25':
        dd = 25; break;
      case '26th': case '26':
        dd = 26; break;
      case '27th': case '27':
        dd = 27; break;
      case '28th': case '28':
        dd = 28; break;
      case '29th': case '29':
        dd = 29; break;
      case '30th': case '30':
        dd = 30; break;
      case '31st': case '31':
        dd = 31; break;
      default:
        err = true;
    }

    if (err) {
      return false;
    } else {
      return new Date(2016, mm, dd);
    }
  };

  this.gapInDays = function(dateObj) {
    if (!dateObj) { return false; }

    var today = new Date();
    var gapInMs = dateObj - today;
    var msPerDay = 24 * 60 * 60 * 1000;
    var gap = Math.ceil(gapInMs / msPerDay);
    return gap;
  };
};

module.exports = DayCounter;
