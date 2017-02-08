(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DragDropContainer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _DragDropGhost = require('./DragDropGhost');

var _DragDropGhost2 = _interopRequireDefault(_DragDropGhost);

/**
 * A container for dragging an element and dropping it on a target.
 */

var DragDropContainer = (function (_React$Component) {
  _inherits(DragDropContainer, _React$Component);

  function DragDropContainer(props) {
    _classCallCheck(this, DragDropContainer);

    _get(Object.getPrototypeOf(DragDropContainer.prototype), 'constructor', this).call(this, props);
    this.state = {
      'clickX': 0,
      'clickY': 0,
      'left': 0,
      'top': 0,
      'clicked': false,
      'dragging': false,
      'dragged': false
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.startDrag = this.startDrag.bind(this);

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.drag = this.drag.bind(this);

    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.drop = this.drop.bind(this);

    // the DOM elem we're dragging, and the elements we're dragging over
    this.dragElem = null;
    this.currentTarget = null;
    this.prevTarget = null;
  }

  _createClass(DragDropContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // figure out what we're going to drag
      if (this.props.dragGhost) {
        this.dragElem = this.refs['drag_ghost'].refs['the_ghost'];
      } else {
        this.dragElem = this.refs['drag_container'];
      }
      // capture events
      var elem = this.refs['drag_container'];
      if (this.props.dragHandleClassName) {
        var elems = elem.getElementsByClassName(this.props.dragHandleClassName);
        for (var i = 0; i < elems.length; i++) {
          this.addListeners(elems[i]);
        }
      } else {
        this.addListeners(elem);
      }
    }
  }, {
    key: 'addListeners',
    value: function addListeners(elem) {
      var _this = this;

      elem.addEventListener('mousedown', function (e) {
        _this.handleMouseDown(e);
      }, false);
      elem.addEventListener('touchstart', function (e) {
        _this.handleTouchStart(e);
      }, false);
    }
  }, {
    key: 'createEvent',
    value: function createEvent(eventName, x, y) {
      var _this2 = this;

      var evt;
      if (typeof window.CustomEvent !== 'function') {
        // we are in IE 11 and must use old-style method of creating event
        evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(eventName, true, true, {});
      } else {
        evt = new CustomEvent(eventName, { 'bubbles': true, 'cancelable': true });
      }
      // Add dragData to the event and make it accessible through HTML5-style dataTransfer object
      // via method: event.dataTransfer.getData()  and property:  event.dataTransfer.types
      evt.dataTransfer = {
        'getData': function getData(arg) {
          return arg === _this2.props.dataKey ? _this2.props.dragData : undefined;
        },
        'types': [this.props.dataKey]
      };
      // Also throw in a bonus reference to this element, which you can use (for example) to
      // delete or hide this thing after a successful drop
      evt.sourceElement = this.refs['drag_container'];
      return evt;
    }
  }, {
    key: 'setCurrentTarget',
    value: function setCurrentTarget(x, y) {
      // drop the z-index to get this elem out of the way, figure out what we're dragging over, then reset the z index
      this.dragElem.style.zIndex = -1;
      var target = document.elementFromPoint(x, y) || document.body;
      this.dragElem.style.zIndex = this.props.zIndex;
      // prevent it from selecting itself as the target
      this.currentTarget = this.dragElem.contains(target) ? document.body : target;
    }
  }, {
    key: 'generateEnterLeaveEvents',
    value: function generateEnterLeaveEvents(x, y) {
      // generate events as we enter and leave elements while dragging
      this.setCurrentTarget(x, y);
      if (this.currentTarget !== this.prevTarget) {
        if (this.prevTarget) {
          this.prevTarget.dispatchEvent(this.createEvent(this.props.customEventNameDragLeave, x, y));
        }
        if (this.currentTarget) {
          this.currentTarget.dispatchEvent(this.createEvent(this.props.customEventNameDragEnter, x, y));
        }
      }
      this.prevTarget = this.currentTarget;
    }
  }, {
    key: 'generateDropEvent',
    value: function generateDropEvent(x, y) {
      // generate a drop event in whatever we're currently dragging over
      this.setCurrentTarget(x, y);
      this.currentTarget.dispatchEvent(this.createEvent(this.props.customEventNameDrop, x, y));
    }

    // Start the Drag
  }, {
    key: 'handleMouseDown',
    value: function handleMouseDown(e) {
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
      this.startDrag(e.clientX, e.clientY);
    }
  }, {
    key: 'handleTouchStart',
    value: function handleTouchStart(e) {
      document.addEventListener('touchmove', this.handleTouchMove);
      document.addEventListener('touchend', this.handleTouchEnd);
      this.startDrag(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    }
  }, {
    key: 'startDrag',
    value: function startDrag(x, y) {
      this.setState({
        'clicked': true,
        'clickX': x - this.state.left,
        'clickY': y - this.state.top
      });
      this.props.onStartDrag(this.props.dragData);
    }

    // During Drag
  }, {
    key: 'handleMouseMove',
    value: function handleMouseMove(e) {
      e.preventDefault();
      if (this.state.clicked) {
        this.drag(e.clientX, e.clientY);
      }
    }
  }, {
    key: 'handleTouchMove',
    value: function handleTouchMove(e) {
      e.preventDefault();
      if (this.state.clicked) {
        this.drag(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
      }
    }
  }, {
    key: 'drag',
    value: function drag(x, y) {
      // drop the z-index, figure out what element we're dragging over, then reset the z index
      this.generateEnterLeaveEvents(x, y);
      this.setState({
        dragging: true,
        left: x - this.state.clickX,
        top: y - this.state.clickY
      });
      this.props.onDragging(this.props.dragData, this.currentTarget, x, y);
    }

    // Drop
  }, {
    key: 'handleMouseUp',
    value: function handleMouseUp(e) {
      this.setState({ clicked: false });
      if (this.state.dragging) {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        this.drop(e.clientX, e.clientY);
      }
    }
  }, {
    key: 'handleTouchEnd',
    value: function handleTouchEnd(e) {
      this.setState({ clicked: false });
      if (this.state.dragging) {
        document.removeEventListener('touchmove', this.handleTouchMove);
        document.removeEventListener('touchend', this.handleTouchEnd);
        this.drop(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
      }
    }
  }, {
    key: 'drop',
    value: function drop(x, y) {
      this.generateDropEvent(x, y);
      if (this.props.returnToBase) {
        this.setState({ left: 0, top: 0, dragging: false });
      } else {
        this.setState({ dragged: true, dragging: false });
      }
      this.props.onEndDrag(this.props.dragData, this.currentTarget, x, y);
    }
  }, {
    key: 'render',
    value: function render() {
      var styles = {
        'position': 'relative'
      };

      var ghost = '';
      if (this.props.dragGhost) {
        // dragging will be applied to the "ghost" element
        ghost = _react2['default'].createElement(
          _DragDropGhost2['default'],
          { dragging: this.state.dragging, left: this.state.left, top: this.state.top, zIndex: this.props.zIndex, ref: 'drag_ghost' },
          this.props.dragGhost
        );
      } else {
        // dragging will be applied to the DragDropContainer itself
        styles['left'] = this.state.left;
        styles['top'] = this.state.top;
        styles['zIndex'] = this.state.dragging || this.state.dragged ? this.props.zIndex : 'inherit';
      }
      return _react2['default'].createElement(
        'div',
        { style: styles, ref: 'drag_container' },
        this.props.children,
        ghost
      );
    }
  }]);

  return DragDropContainer;
})(_react2['default'].Component);

DragDropContainer.propTypes = {
  children: _react2['default'].PropTypes.any, // just for the linter

  // You can customize these to make it easy for your target to spot the events it's interested in
  customEventNameDragEnter: _react2['default'].PropTypes.string,
  customEventNameDragLeave: _react2['default'].PropTypes.string,
  customEventNameDrop: _react2['default'].PropTypes.string,

  // The key that the target will use to retrieve dragData from the event with event.dataTransfer.getData([dataKey])
  dataKey: _react2['default'].PropTypes.string,

  // We will pass a stringified version of this object to the target when you drag or drop over it
  dragData: _react2['default'].PropTypes.object,

  // If provided, we'll drag this instead of the actual object
  dragGhost: _react2['default'].PropTypes.node,

  dragHandleClassName: _react2['default'].PropTypes.string,

  // callbacks (optional):
  onDragging: _react2['default'].PropTypes.func,
  onEndDrag: _react2['default'].PropTypes.func,
  onStartDrag: _react2['default'].PropTypes.func,

  // If false, then object will not return to its starting point after you let go of it
  returnToBase: _react2['default'].PropTypes.bool,

  // Defaults to 1000 while dragging, but you can customize it
  zIndex: _react2['default'].PropTypes.number
};

DragDropContainer.defaultProps = {
  onStartDrag: function onStartDrag() {},
  onDragging: function onDragging() {},
  onEndDrag: function onEndDrag() {},
  dragData: {},
  dataKey: 'data',
  returnToBase: true,
  customEventNameDragEnter: 'dragEnter',
  customEventNameDragLeave: 'dragLeave',
  customEventNameDrop: 'drop',
  zIndex: 1000
};

exports['default'] = DragDropContainer;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./DragDropGhost":2}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

/**
 * Optional "ghost" node for dragging with DragDropContainer
 */

var DragDropGhost = (function (_React$Component) {
  _inherits(DragDropGhost, _React$Component);

  function DragDropGhost() {
    _classCallCheck(this, DragDropGhost);

    _get(Object.getPrototypeOf(DragDropGhost.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DragDropGhost, [{
    key: 'render',
    value: function render() {
      var styles = {
        'position': 'absolute',
        'zIndex': this.props.zIndex,
        'left': this.props.left,
        'top': this.props.top,
        'display': this.props.dragging ? 'block' : 'none'
      };
      return _react2['default'].createElement(
        'div',
        { style: styles, ref: 'the_ghost' },
        this.props.children
      );
    }
  }]);

  return DragDropGhost;
})(_react2['default'].Component);

DragDropGhost.propTypes = {
  children: _react2['default'].PropTypes.any,
  display: _react2['default'].PropTypes.string,
  dragging: _react2['default'].PropTypes.bool,
  left: _react2['default'].PropTypes.number,
  top: _react2['default'].PropTypes.number,
  zIndex: _react2['default'].PropTypes.number
};

exports['default'] = DragDropGhost;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});