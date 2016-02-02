/* jshint node: true*/
'use strict';
var bcrypt = require('bcrypt');
var assert = require('assert');

var userList = [];

function User(username, password) {
  this.username = username;

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);

  this.password = hash;

 if(userList.length === 0) {
   // Add current object to userList array
   userList.push(this);
 } else {
    // Take the current username and compare it to all the other usernames
    var uniqueTest = function(obj) {
      return obj.username == username;
    };
    var uniqueName = userList.some(uniqueTest);

    assert(!uniqueName, 'This username is already taken.  Please use a different username.');

    if(!uniqueName) {
      // Add current object to userList array
      userList.push(this);
    }
  }
}

User.prototype.authenticate = function(pass) {
  return bcrypt.compareSync(pass, this.password);
};


User.find = function (userName) {
  var foundUser = userList.find(function(user) {
    return user.username == userName;
  });
  if(foundUser){
    return foundUser;
  } else {
    return null;
  }
};

User.authenticate = function(userName, userPass) {
  var userObj = User.find(userName);

  if(userObj !== null) {
    var authenticate = userObj.authenticate(userPass);
    if (authenticate){
      return userObj;
    } else {
      return false;
    }
  } else {
    return false;
  }
};


module.exports = User;
