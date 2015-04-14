'use strict';

var isObject = function(obj) {
  return typeof obj === 'object';
};
var isFunction = function(fnc) {
  return typeof fnc === 'function';
};

/**
 * Query String Prototype Functions
 */
Array.prototype.toQueryString = function(/*prefix*/) {
  var str = '', i, p, ln = this.length, prefix = arguments.length ? arguments[0] : null;
  for (i = 0; i < ln; i++) {
    if (isFunction(this[i])) {
      continue;
    }
    if (str != '') {
      str += '&';
    }
    p = prefix ? prefix + '[' + i + ']' : i + '';
    if (isObject(this[i])) {
      str += this[i].toQueryString ? this[i].toQueryString(p) : Object.toQueryString(this[i], p);
    } else {
      str += p + '=' + encodeURI(this[i]);
    }
  }

  return str;
};

Object.toQueryString = function(obj/*, prefix*/) {
  var key, str = '', p, prefix = arguments.length > 1 ? arguments[1] : null;
  for (key in obj) {
    if (isFunction(obj[key]) || obj[key] == obj) {
      continue;
    }
    if (str != '') {
      str += '&';
    }
    p = prefix ? prefix + '.' + encodeURI(key) : encodeURI(key);
    if (obj[key] !== undefined && obj[key] !== null) {
      if (isFunction(obj[key].toQueryString)) {
        str += obj[key].toQueryString(p);
      } else {
        str += Object.toQueryString(obj[key], p);
      }
    } else {
      str += p + '=';
    }
  }
  return str;
};

String.prototype.toQueryString = Number.prototype.toQueryString = Boolean.prototype.toQueryString = function(key) {
  return key + '=' + encodeURI(this.valueOf());
};

window.toQueryString = function(obj) {
  if (obj) {
    if (obj.toQueryString) {
      return obj.toQueryString();
    } else if (isObject(obj)) {
      return Object.toQueryString(obj);
    }
  }
  return '';
};