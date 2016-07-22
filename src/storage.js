'use strict';
var AWS = require("aws-sdk");

var storage = (function() {
  var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  function Storage(session, data) {
    if (data) {
      this.data = data;
    } else {
      this.data = {
        events: {}
      };
    }
    this._session = session;
  }

  Storage.prototype = {
    save: function (callback) {
      this._session.attributes.currentStorage = this.data;
      dynamodb.putItem({
        TableName: 'DDayCounterUserData',
        Item: {
          CustomerId: {
            S: this._session.user.userId
          },
          Data: {
            S: JSON.stringify(this.data)
          }
        }
      }, function (err, data) {
        if (err) {
          console.log(err, err.stack);
          console.log("ERROR HERE!!!!!!");
        }
        if (callback) {
          console.log("AFTER SAVE, CALLBACK!!!!!!");
          callback();
        }
      });
    }
  };

  return {
    loadStorage: function (session, callback) {
      console.log(">>>>>>>>>>>>>>>inside loadStorage in storage.js!!");
      if (session.attributes.currentStorage) {
        console.log(">>>>>>>>>>>>>>>inside if conditional in storage.js!!");
        console.log('get storage from session=' + session.attributes.currentStorage);
        callback(new Storage(session, session.attributes.currentStorage));
        return;
      }
      dynamodb.getItem({
        TableName: 'DDayCounterUserData',
        Key: {
          CustomerId: {
            S: session.user.userId
          }
        }
      }, function (err, data) {
        var currentStorage;
        if (err) {
          console.log(">>>>>>>>>>>>",err, err.stack);
          currentStorage = new Storage(session);
          session.attributes.currentStorage = currentStorage.data;
          callback(currentStorage);
        } else if (data.Item === undefined) {
          currentStorage = new Storage(session);
          session.attributes.currentStorage = currentStorage.data;
          callback(currentStorage);
        } else {
          console.log('>>>>>>>>>>get Storage from dynamodb=' + data.Item.Data.S);
          currentStorage = new Storage(session, JSON.parse(data.Item.Data.S));
          session.attributes.currentStorage = currentStorage.data;
          callback(currentStorage);
        }
      });
    }
    // Add event, Delete event
  };
})();

module.exports = storage;
