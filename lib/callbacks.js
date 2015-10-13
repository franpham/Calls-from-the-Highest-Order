"use strict";

function wait(seconds, callback) {
  setTimeout(callback, seconds * 1000);
}

function repeat (times, callback) {
  for (var i = 0; i < times; i++) {
    callback(i);
  }
}

function User () {
}
var peeps = require('./datastore.js').User;


User.find = function(query, callback) {
  var schema = {'id': 'number', 'name': 'string', 'mood': 'string'};
  var keys = Object.keys(query);    // grabbing id;
  var users = [];
  var hasKeys = keys.every(function(key) {
    return schema[key] ? true : false;
  });
  if (!hasKeys) {
    return callback(new RangeError(keys[keys.length - 1] + ' is not a property of User'), users);
  }
  var hasTypes = keys.every(function(key) {
    return schema[key] === typeof query[key];
  });
  if (!hasTypes) {
    var key = keys[keys.length - 1];
    return callback(new TypeError(query[key] + ' is a "string", expected: ' + schema[key]), users);
  }
  peeps.forEach(function(user) {
    var matched = keys.every(function(key) {
      return user[key] === query[key] ? true : false;
    });
    if (matched)
      users.push(user);
  });
  callback(null, users);
};

User.find({ id: 2 }, function(error, users) {
  if (error)
    throw error;
  console.log('users ' + users);
});

User.find({ happy: true, iKnowIt: true }, function(error, users) {
  if (error)
    console.log(error.name + ':' + error.message);
  console.log('users ' + users);
});

User.find({ id: 4, name: 'davinci' }, function(error, users) {
  if (error)
    throw error;
  console.log('users ' + users);
});

// console.log('wait 3 started');
// wait(3, function() {
//   console.log('wait 3 done');
// });

// repeat(10, function(it) {
//   console.log(100 + it);
// });

// wait(4, function() {
//   repeat(2, function(i) {
//     console.log('repeating for i ' + i);
//     wait(i * 3, function() {
//       repeat(3, function(j) {
//         console.log('i ' + i + ' j ' + j);
//       });
//     });
//   });
// });

module.exports = {
  wait : wait,
  repeat : repeat,
  User : User
};