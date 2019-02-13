/*
 * liquidjs@6.4.3, https://github.com/harttle/liquidjs
 * (c) 2016-2019 harttle
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Liquid = factory());
}(this, function () { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var asyncToGenerator = function (fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  };

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  !function (global) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    var inModule = (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object";
    var runtime = global.regeneratorRuntime;
    if (runtime) {
      if (inModule) {
        // If regeneratorRuntime is defined globally and we're in a module,
        // make the exports object identical to regeneratorRuntime.
        module.exports = runtime;
      }
      // Don't bother evaluating the rest of this file if the runtime was
      // already defined globally.
      return;
    }

    // Define the runtime globally (as expected by generated code) as either
    // module.exports (if we're in a module) or a new, empty object.
    runtime = global.regeneratorRuntime = inModule ? module.exports : {};

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    runtime.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        prototype[method] = function (arg) {
          return this._invoke(method, arg);
        };
      });
    }

    runtime.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction ||
      // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    runtime.mark = function (genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    runtime.awrap = function (arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && hasOwn.call(value, "__await")) {
            return Promise.resolve(value.__await).then(function (value) {
              invoke("next", value, resolve, reject);
            }, function (err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return Promise.resolve(value).then(function (unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function (error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new Promise(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
        // Avoid propagating failures to Promises returned by later
        // invocations of the iterator.
        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    runtime.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    runtime.async = function (innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

      return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;
          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);
          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };
          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          if (delegate.iterator.return) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError("The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined;
        }
      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    Gp[toStringTagSymbol] = "Generator";

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function () {
      return this;
    };

    Gp.toString = function () {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    runtime.keys = function (object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1,
              next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    runtime.values = values;

    function doneResult() {
      return { value: undefined, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function reset(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined;
            }
          }
        }
      },

      stop: function stop() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function dispatchException(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined;
          }

          return !!caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function abrupt(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function complete(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function finish(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function _catch(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function delegateYield(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined;
        }

        return ContinueSentinel;
      }
    };
  }(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  function () {
    return this || (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" && self;
  }() || Function("return this")());

  var toStr = Object.prototype.toString;
  var arrToStr = Array.prototype.toString;

  /*
   * Checks if value is classified as a String primitive or object.
   * @param {any} value The value to check.
   * @return {Boolean} Returns true if value is a string, else false.
   */
  function isString(value) {
    return toStr.call(value) === '[object String]';
  }

  function isFunction(value) {
    return typeof value === 'function';
  }

  function stringify(value) {
    if (isNil(value)) return String(value);
    if (isFunction(value.to_liquid)) return stringify(value.to_liquid());
    if (isFunction(value.toLiquid)) return stringify(value.toLiquid());
    if (isFunction(value.to_s)) return value.to_s();
    if ([toStr, arrToStr].indexOf(value.toString) > -1) return defaultToString(value);
    if (isFunction(value.toString)) return value.toString();
    return toStr.call(value);
  }

  function defaultToString(value) {
    var cache = [];
    return JSON.stringify(value, function (key, value) {
      if (isObject(value)) {
        if (cache.indexOf(value) !== -1) {
          return;
        }
        cache.push(value);
      }
      return value;
    });
  }

  function create(proto) {
    return Object.create(proto);
  }

  function isNil(value) {
    return value === null || value === undefined;
  }

  function isArray(value) {
    // be compatible with IE 8
    return toStr.call(value) === '[object Array]';
  }

  /*
   * Iterates over own enumerable string keyed properties of an object and invokes iteratee for each property.
   * The iteratee is invoked with three arguments: (value, key, object).
   * Iteratee functions may exit iteration early by explicitly returning false.
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @return {Object} Returns object.
   */
  function forOwn(object, iteratee) {
    object = object || {};
    for (var k in object) {
      if (object.hasOwnProperty(k)) {
        if (iteratee(object[k], k, object) === false) break;
      }
    }
    return object;
  }

  /*
   * Assigns own enumerable string keyed properties of source objects to the destination object.
   * Source objects are applied from left to right.
   * Subsequent sources overwrite property assignments of previous sources.
   *
   * Note: This method mutates object and is loosely based on Object.assign.
   *
   * @param {Object} object The destination object.
   * @param {...Object} sources The source objects.
   * @return {Object} Returns object.
   */
  function assign(object) {
    object = isObject(object) ? object : {};
    var srcs = Array.prototype.slice.call(arguments, 1);
    srcs.forEach(function (src) {
      return Object.assign(object, src);
    });
    return object;
  }

  function last(arr) {
    return arr[arr.length - 1];
  }

  /*
   * Checks if value is the language type of Object.
   * (e.g. arrays, functions, objects, regexes, new Number(0), and new String(''))
   * @param {any} value The value to check.
   * @return {Boolean} Returns true if value is an object, else false.
   */
  function isObject(value) {
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    return value !== null && (type === 'object' || type === 'function');
  }

  /*
   * A function to create flexibly-numbered lists of integers,
   * handy for each and map loops. start, if omitted, defaults to 0; step defaults to 1.
   * Returns a list of integers from start (inclusive) to stop (exclusive),
   * incremented (or decremented) by step, exclusive.
   * Note that ranges that stop before they start are considered to be zero-length instead of
   * negative — if you'd like a negative range, use a negative step.
   */
  function range(start, stop, step) {
    if (arguments.length === 1) {
      stop = start;
      start = 0;
    }
    step = step || 1;

    var arr = [];
    for (var i = start; i < stop; i += step) {
      arr.push(i);
    }
    return arr;
  }

  // quote related
  var singleQuoted = /'[^']*'/;
  var doubleQuoted = /"[^"]*"/;
  var quoted = new RegExp(singleQuoted.source + '|' + doubleQuoted.source);
  var quoteBalanced = new RegExp('(?:' + quoted.source + '|[^\'"])*');

  // basic types
  var integer = /-?\d+/;
  var number = /-?\d+\.?\d*|\.?\d+/;
  var bool = /true|false/;

  // property access
  var identifier = /[\w-]+[?]?/;
  var subscript = new RegExp('\\[(?:' + quoted.source + '|[\\w-\\.]+)\\]');
  var literal = new RegExp('(?:' + quoted.source + '|' + bool.source + '|' + number.source + ')');
  var variable = new RegExp(identifier.source + '(?:\\.' + identifier.source + '|' + subscript.source + ')*');

  // range related
  var rangeLimit = new RegExp('(?:' + variable.source + '|' + number.source + ')');
  var range$1 = new RegExp('\\(' + rangeLimit.source + '\\.\\.' + rangeLimit.source + '\\)');
  var rangeCapture = new RegExp('\\((' + rangeLimit.source + ')\\.\\.(' + rangeLimit.source + ')\\)');

  var value = new RegExp('(?:' + variable.source + '|' + literal.source + '|' + range$1.source + ')');

  // hash related
  var hash = new RegExp('(?:' + identifier.source + ')\\s*:\\s*(?:' + value.source + ')');
  var hashCapture = new RegExp('(' + identifier.source + ')\\s*:\\s*(' + value.source + ')', 'g');

  // full match
  var tagLine = new RegExp('^\\s*(' + identifier.source + ')\\s*([\\s\\S]*)\\s*$');
  var literalLine = new RegExp('^' + literal.source + '$', 'i');
  var variableLine = new RegExp('^' + variable.source + '$');
  var numberLine = new RegExp('^' + number.source + '$');
  var boolLine = new RegExp('^' + bool.source + '$', 'i');
  var quotedLine = new RegExp('^' + quoted.source + '$');
  var rangeLine = new RegExp('^' + rangeCapture.source + '$');
  var integerLine = new RegExp('^' + integer.source + '$');

  // filter related
  var valueDeclaration = new RegExp('(?:' + identifier.source + '\\s*:\\s*)?' + value.source);
  var valueList = new RegExp(valueDeclaration.source + '(\\s*,\\s*' + valueDeclaration.source + ')*');
  var filter = new RegExp(identifier.source + '(?:\\s*:\\s*' + valueList.source + ')?', 'g');
  var filterCapture = new RegExp('(' + identifier.source + ')(?:\\s*:\\s*(' + valueList.source + '))?');
  var filterLine = new RegExp('^' + filterCapture.source + '$');

  var operators = [/\s+or\s+/, /\s+and\s+/, /==|!=|<=|>=|<|>|\s+contains\s+/];

  function isInteger(str) {
    return integerLine.test(str);
  }

  function isLiteral(str) {
    return literalLine.test(str);
  }

  function isVariable(str) {
    return variableLine.test(str);
  }

  function matchValue(str) {
    return value.exec(str);
  }

  function parseLiteral(str) {
    var res = str.match(numberLine);
    if (res) {
      return Number(str);
    }
    res = str.match(boolLine);
    if (res) {
      return str.toLowerCase() === 'true';
    }
    res = str.match(quotedLine);
    if (res) {
      return str.slice(1, -1);
    }
    throw new TypeError('cannot parse \'' + str + '\' as literal');
  }

  function initError() {
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  function initLiquidError(err, token) {
    initError.call(this);

    this.input = token.input;
    this.line = token.line;
    this.file = token.file;

    var context = mkContext(token.input, token.line);
    this.message = mkMessage(err.message, token);
    this.stack = context + '\n' + (this.stack || this.message) + (err.stack ? '\nFrom ' + err.stack : '');
  }

  function TokenizationError(message, token) {
    initLiquidError.call(this, { message: message }, token);
  }
  TokenizationError.prototype = create(Error.prototype);
  TokenizationError.prototype.constructor = TokenizationError;

  function ParseError(e, token) {
    assign(this, e);
    this.originalError = e;

    initLiquidError.call(this, e, token);
  }
  ParseError.prototype = create(Error.prototype);
  ParseError.prototype.constructor = ParseError;

  function RenderError(e, tpl) {
    // return the original render error
    if (e instanceof RenderError) {
      return e;
    }
    assign(this, e);
    this.originalError = e;

    initLiquidError.call(this, e, tpl.token);
  }
  RenderError.prototype = create(Error.prototype);
  RenderError.prototype.constructor = RenderError;

  function RenderBreakError(message) {
    initError.call(this);
    this.message = message + '';
  }
  RenderBreakError.prototype = create(Error.prototype);
  RenderBreakError.prototype.constructor = RenderBreakError;

  function AssertionError(message) {
    initError.call(this);
    this.message = message + '';
  }
  AssertionError.prototype = create(Error.prototype);
  AssertionError.prototype.constructor = AssertionError;

  function mkContext(input, line) {
    var lines = input.split('\n');
    var begin = Math.max(line - 2, 1);
    var end = Math.min(line + 3, lines.length);

    var context = range(begin, end + 1).map(function (l) {
      return [l === line ? '>> ' : '   ', align(l, end), '| ', lines[l - 1]].join('');
    }).join('\n');

    return context;
  }

  function align(n, max) {
    var length = (max + '').length;
    var str = n + '';
    var blank = Array(length - str.length).join(' ');
    return blank + str;
  }

  function mkMessage(msg, token) {
    msg = msg || '';
    if (token.file) {
      msg += ', file:' + token.file;
    }
    if (token.line) {
      msg += ', line:' + token.line;
    }
    return msg;
  }

  function assert (predicate, message) {
    if (!predicate) {
      message = message || 'expect ' + predicate + ' to be true';
      throw new AssertionError(message);
    }
  }

  var Scope = {
    getAll: function getAll() {
      return this.contexts.reduce(function (ctx, val) {
        return assign(ctx, val);
      }, create(null));
    },
    get: function get(path) {
      var _this = this;

      var paths = this.propertyAccessSeq(path);
      var scope = this.findContextFor(paths[0]) || last(this.contexts);
      return paths.reduce(function (value$$1, key) {
        return _this.readProperty(value$$1, key);
      }, scope);
    },
    set: function set(path, v) {
      var paths = this.propertyAccessSeq(path);
      var scope = this.findContextFor(paths[0]) || last(this.contexts);
      paths.some(function (key, i) {
        if (!isObject(scope)) {
          return true;
        }
        if (i === paths.length - 1) {
          scope[key] = v;
          return true;
        }
        if (undefined === scope[key]) {
          scope[key] = {};
        }
        scope = scope[key];
      });
    },
    unshift: function unshift(ctx) {
      return this.contexts.unshift(ctx);
    },
    push: function push(ctx) {
      return this.contexts.push(ctx);
    },
    pop: function pop(ctx) {
      if (!arguments.length) {
        return this.contexts.pop();
      }
      var i = this.contexts.findIndex(function (scope) {
        return scope === ctx;
      });
      if (i === -1) {
        throw new TypeError('scope not found, cannot pop');
      }
      return this.contexts.splice(i, 1)[0];
    },
    findContextFor: function findContextFor(key, filter$$1) {
      filter$$1 = filter$$1 || function () {
        return true;
      };
      for (var i = this.contexts.length - 1; i >= 0; i--) {
        var candidate = this.contexts[i];
        if (!filter$$1(candidate)) continue;
        if (key in candidate) {
          return candidate;
        }
      }
      return null;
    },
    readProperty: function readProperty(obj, key) {
      var val = void 0;
      if (isNil(obj)) {
        val = undefined;
      } else {
        obj = toLiquid(obj);
        val = key === 'size' ? readSize(obj) : obj[key];
        if (isFunction(obj.liquid_method_missing)) {
          val = obj.liquid_method_missing(key);
        }
      }
      if (isNil(val) && this.opts.strict_variables) {
        throw new TypeError('undefined variable: ' + key);
      }
      return val;
    },

    /*
     * Parse property access sequence from access string
     * @example
     * accessSeq("foo.bar")            // ['foo', 'bar']
     * accessSeq("foo['bar']")      // ['foo', 'bar']
     * accessSeq("foo['b]r']")      // ['foo', 'b]r']
     * accessSeq("foo[bar.coo]")    // ['foo', 'bar'], for bar.coo == 'bar'
     */
    propertyAccessSeq: function propertyAccessSeq(str) {
      str = String(str);
      var seq = [];
      var name = '';
      var j = void 0;
      var i = 0;
      while (i < str.length) {
        switch (str[i]) {
          case '[':
            push();

            var delemiter = str[i + 1];
            if (/['"]/.test(delemiter)) {
              // foo["bar"]
              j = str.indexOf(delemiter, i + 2);
              assert(j !== -1, 'unbalanced ' + delemiter + ': ' + str);
              name = str.slice(i + 2, j);
              push();
              i = j + 2;
            } else {
              // foo[bar.coo]
              j = matchRightBracket(str, i + 1);
              assert(j !== -1, 'unbalanced []: ' + str);
              name = str.slice(i + 1, j);
              if (!isInteger(name)) {
                // foo[bar] vs. foo[1]
                name = String(this.get(name));
              }
              push();
              i = j + 1;
            }
            break;
          case '.':
            // foo.bar, foo[0].bar
            push();
            i++;
            break;
          default:
            // foo.bar
            name += str[i];
            i++;
        }
      }
      push();

      if (!seq.length) {
        throw new TypeError('invalid path:"' + str + '"');
      }
      return seq;

      function push() {
        if (name.length) seq.push(name);
        name = '';
      }
    }
  };

  function toLiquid(obj) {
    if (isFunction(obj.to_liquid)) {
      return obj.to_liquid();
    }
    if (isFunction(obj.toLiquid)) {
      return obj.toLiquid();
    }
    return obj;
  }

  function readSize(obj) {
    if (!isNil(obj.size)) return obj.size;
    if (isArray(obj) || isString(obj)) return obj.length;
    return obj.size;
  }

  function matchRightBracket(str, begin) {
    var stack = 1; // count of '[' - count of ']'
    for (var i = begin; i < str.length; i++) {
      if (str[i] === '[') {
        stack++;
      }
      if (str[i] === ']') {
        stack--;
        if (stack === 0) {
          return i;
        }
      }
    }
    return -1;
  }

  function factory(ctx, opts) {
    var defaultOptions = {
      dynamicPartials: true,
      strict_variables: false,
      strict_filters: false,
      blocks: {},
      root: []
    };
    var scope = create(Scope);
    scope.opts = assign(defaultOptions, opts);
    scope.contexts = [ctx || {}];
    return scope;
  }

  function domResolve(root, path) {
    var base = document.createElement('base');
    base.href = root;

    var head = document.getElementsByTagName('head')[0];
    head.insertBefore(base, head.firstChild);

    var a = document.createElement('a');
    a.href = path;
    var resolved = a.href;
    head.removeChild(base);

    return resolved;
  }

  function resolve(filepath, root, options) {
    root = root || options.root;
    if (isArray(root)) {
      root = root[0];
    }
    if (root.length && last(root) !== '/') {
      root += '/';
    }
    var url = domResolve(root, filepath);
    return url.replace(/^(\w+:\/\/[^/]+)(\/[^?]+)/, function (str, origin, path) {
      var last$$1 = path.split('/').pop();
      if (/\.\w+$/.test(last$$1)) {
        return str;
      }
      return origin + path + options.extname;
    });
  }

  var read = function () {
    var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt('return', new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                  if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.responseText);
                  } else {
                    reject(new Error(xhr.statusText));
                  }
                };
                xhr.onerror = function () {
                  reject(new Error('An error occurred whilst receiving the response.'));
                };
                xhr.open('GET', url);
                xhr.send();
              }));

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function read(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  function whiteSpaceCtrl(tokens, options) {
    options = assign({ greedy: true }, options);
    var inRaw = false;

    tokens.forEach(function (token, i) {
      if (shouldTrimLeft(token, inRaw, options)) {
        trimLeft(tokens[i - 1], options.greedy);
      }

      if (token.type === 'tag' && token.name === 'raw') inRaw = true;
      if (token.type === 'tag' && token.name === 'endraw') inRaw = false;

      if (shouldTrimRight(token, inRaw, options)) {
        trimRight(tokens[i + 1], options.greedy);
      }
    });
  }

  function shouldTrimLeft(token, inRaw, options) {
    if (inRaw) return false;
    if (token.type === 'tag') return token.trim_left || options.trim_tag_left;
    if (token.type === 'value') return token.trim_left || options.trim_value_left;
  }

  function shouldTrimRight(token, inRaw, options) {
    if (inRaw) return false;
    if (token.type === 'tag') return token.trim_right || options.trim_tag_right;
    if (token.type === 'value') return token.trim_right || options.trim_value_right;
  }

  function trimLeft(token, greedy) {
    if (!token || token.type !== 'html') return;

    var rLeft = greedy ? /\s+$/g : /[\t\r ]*$/g;
    token.value = token.value.replace(rLeft, '');
  }

  function trimRight(token, greedy) {
    if (!token || token.type !== 'html') return;

    var rRight = greedy ? /^\s+/g : /^[\t\r ]*\n?/g;
    token.value = token.value.replace(rRight, '');
  }

  function parse(input, file, options) {
    assert(isString(input), 'illegal input');

    var rLiquid = /({%-?([\s\S]*?)-?%})|({{-?([\s\S]*?)-?}})/g;
    var currIndent = 0;
    var lineNumber = LineNumber(input);
    var lastMatchEnd = 0;
    var tokens = [];

    for (var match; match = rLiquid.exec(input); lastMatchEnd = rLiquid.lastIndex) {
      if (match.index > lastMatchEnd) {
        tokens.push(parseHTMLToken(lastMatchEnd, match.index));
      }
      tokens.push(match[1] ? parseTagToken(match[1], match[2].trim(), match.index) : parseValueToken(match[3], match[4].trim(), match.index));
    }
    if (input.length > lastMatchEnd) {
      tokens.push(parseHTMLToken(lastMatchEnd, input.length));
    }
    whiteSpaceCtrl(tokens, options);
    return tokens;

    function parseTagToken(raw, value$$1, pos) {
      var match = value$$1.match(tagLine);
      var token = {
        type: 'tag',
        indent: currIndent,
        line: lineNumber.get(pos),
        trim_left: raw.slice(0, 3) === '{%-',
        trim_right: raw.slice(-3) === '-%}',
        raw: raw,
        value: value$$1,
        input: input,
        file: file
      };
      if (!match) {
        throw new TokenizationError('illegal tag syntax', token);
      }
      token.name = match[1];
      token.args = match[2];
      return token;
    }

    function parseValueToken(raw, value$$1, pos) {
      return {
        type: 'value',
        line: lineNumber.get(pos),
        trim_left: raw.slice(0, 3) === '{{-',
        trim_right: raw.slice(-3) === '-}}',
        raw: raw,
        value: value$$1,
        input: input,
        file: file
      };
    }

    function parseHTMLToken(begin, end) {
      var htmlFragment = input.slice(begin, end);
      currIndent = last(htmlFragment.split('\n')).length;

      return {
        type: 'html',
        raw: htmlFragment,
        value: htmlFragment
      };
    }
  }

  function LineNumber(html) {
    var parsedLinesCount = 0;
    var lastMatchBegin = -1;

    return {
      get: function get(pos) {
        var lines = html.slice(lastMatchBegin + 1, pos).split('\n');
        parsedLinesCount += lines.length - 1;
        lastMatchBegin = pos;
        return parsedLinesCount + 1;
      }
    };
  }

  function Operators (isTruthy) {
    return {
      '==': function _(l, r) {
        return l === r;
      },
      '!=': function _(l, r) {
        return l !== r;
      },
      '>': function _(l, r) {
        return l !== null && r !== null && l > r;
      },
      '<': function _(l, r) {
        return l !== null && r !== null && l < r;
      },
      '>=': function _(l, r) {
        return l !== null && r !== null && l >= r;
      },
      '<=': function _(l, r) {
        return l !== null && r !== null && l <= r;
      },
      'contains': function contains(l, r) {
        if (!l) return false;
        if (typeof l.indexOf !== 'function') return false;
        return l.indexOf(r) > -1;
      },
      'and': function and(l, r) {
        return isTruthy(l) && isTruthy(r);
      },
      'or': function or(l, r) {
        return isTruthy(l) || isTruthy(r);
      }
    };
  }

  var operators$1 = Operators(isTruthy);

  function evalExp(exp, scope) {
    assert(scope, 'unable to evalExp: scope undefined');
    var operatorREs = operators;
    var match = void 0;
    for (var i = 0; i < operatorREs.length; i++) {
      var operatorRE = operatorREs[i];
      var expRE = new RegExp('^(' + quoteBalanced.source + ')(' + operatorRE.source + ')(' + quoteBalanced.source + ')$');
      if (match = exp.match(expRE)) {
        var l = evalExp(match[1], scope);
        var op = operators$1[match[2].trim()];
        var r = evalExp(match[3], scope);
        return op(l, r);
      }
    }

    if (match = exp.match(rangeLine)) {
      var low = evalValue(match[1], scope);
      var high = evalValue(match[2], scope);
      var range = [];
      for (var j = low; j <= high; j++) {
        range.push(j);
      }
      return range;
    }

    return evalValue(exp, scope);
  }

  function evalValue(str, scope) {
    str = str && str.trim();
    if (!str) return undefined;

    if (isLiteral(str)) {
      return parseLiteral(str);
    }
    if (isVariable(str)) {
      return scope.get(str);
    }
    throw new TypeError('cannot eval \'' + str + '\' as value');
  }

  function isTruthy(val) {
    return !isFalsy(val);
  }

  function isFalsy(val) {
    return val === false || undefined === val || val === null;
  }

  var render = {
    renderTemplates: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(templates, scope) {
        var renderTemplate = function () {
          var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(template) {
            var partial;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!(template.type === 'tag')) {
                      _context.next = 5;
                      break;
                    }

                    _context.next = 3;
                    return this.renderTag(template, scope);

                  case 3:
                    partial = _context.sent;
                    return _context.abrupt('return', partial === undefined ? '' : partial);

                  case 5:
                    if (!(template.type === 'value')) {
                      _context.next = 7;
                      break;
                    }

                    return _context.abrupt('return', this.renderValue(template, scope));

                  case 7:
                    return _context.abrupt('return', template.value);

                  case 8:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          return function renderTemplate(_x3) {
            return _ref2.apply(this, arguments);
          };
        }();

        var html, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, tpl;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                assert(scope, 'unable to evalTemplates: scope undefined');

                html = '';
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 5;
                _iterator = templates[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context2.next = 24;
                  break;
                }

                tpl = _step.value;
                _context2.prev = 9;
                _context2.next = 12;
                return renderTemplate.call(this, tpl);

              case 12:
                html += _context2.sent;
                _context2.next = 21;
                break;

              case 15:
                _context2.prev = 15;
                _context2.t0 = _context2['catch'](9);

                if (!(_context2.t0 instanceof RenderBreakError)) {
                  _context2.next = 20;
                  break;
                }

                _context2.t0.resolvedHTML = html;
                throw _context2.t0;

              case 20:
                throw new RenderError(_context2.t0, tpl);

              case 21:
                _iteratorNormalCompletion = true;
                _context2.next = 7;
                break;

              case 24:
                _context2.next = 30;
                break;

              case 26:
                _context2.prev = 26;
                _context2.t1 = _context2['catch'](5);
                _didIteratorError = true;
                _iteratorError = _context2.t1;

              case 30:
                _context2.prev = 30;
                _context2.prev = 31;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 33:
                _context2.prev = 33;

                if (!_didIteratorError) {
                  _context2.next = 36;
                  break;
                }

                throw _iteratorError;

              case 36:
                return _context2.finish(33);

              case 37:
                return _context2.finish(30);

              case 38:
                return _context2.abrupt('return', html);

              case 39:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[5, 26, 30, 38], [9, 15], [31,, 33, 37]]);
      }));

      function renderTemplates(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return renderTemplates;
    }(),

    renderTag: function () {
      var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(template, scope) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(template.name === 'continue')) {
                  _context3.next = 2;
                  break;
                }

                throw new RenderBreakError('continue');

              case 2:
                if (!(template.name === 'break')) {
                  _context3.next = 4;
                  break;
                }

                throw new RenderBreakError('break');

              case 4:
                return _context3.abrupt('return', template.render(scope));

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function renderTag(_x4, _x5) {
        return _ref3.apply(this, arguments);
      }

      return renderTag;
    }(),

    renderValue: function () {
      var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(template, scope) {
        var partial;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                partial = this.evalValue(template, scope);
                return _context4.abrupt('return', partial === undefined ? '' : stringify(partial));

              case 2:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function renderValue(_x6, _x7) {
        return _ref4.apply(this, arguments);
      }

      return renderValue;
    }(),

    evalValue: function evalValue$$1(template, scope) {
      assert(scope, 'unable to evalValue: scope undefined');
      return template.filters.reduce(function (prev, filter) {
        return filter.render(prev, scope);
      }, evalExp(template.initial, scope));
    }
  };

  function Render () {
    var instance = create(render);
    return instance;
  }

  function hash$1(markup, scope) {
    var obj = {};
    var match = void 0;
    hashCapture.lastIndex = 0;
    while (match = hashCapture.exec(markup)) {
      var k = match[1];
      var v = match[2];
      obj[k] = evalValue(v, scope);
    }
    return obj;
  }

  function Tag () {
    var tagImpls = {};

    var _tagInstance = {
      render: function () {
        var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(scope) {
          var obj, impl;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  obj = hash$1(this.token.args, scope);
                  impl = this.tagImpl;

                  if (!(typeof impl.render !== 'function')) {
                    _context.next = 4;
                    break;
                  }

                  return _context.abrupt('return', '');

                case 4:
                  return _context.abrupt('return', impl.render(scope, obj));

                case 5:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function render(_x) {
          return _ref.apply(this, arguments);
        }

        return render;
      }(),
      parse: function parse(token, tokens) {
        this.type = 'tag';
        this.token = token;
        this.name = token.name;

        var tagImpl = tagImpls[this.name];
        assert(tagImpl, 'tag ' + this.name + ' not found');
        this.tagImpl = create(tagImpl);
        if (this.tagImpl.parse) {
          this.tagImpl.parse(token, tokens);
        }
      }
    };

    function register(name, tag) {
      tagImpls[name] = tag;
    }

    function construct(token, tokens) {
      var instance = create(_tagInstance);
      instance.parse(token, tokens);
      return instance;
    }

    function clear() {
      tagImpls = {};
    }

    return {
      construct: construct,
      register: register,
      clear: clear
    };
  }

  var valueRE = new RegExp('' + value.source, 'g');

  function Filter (options) {
    options = assign({}, options);
    var filters = {};

    var _filterInstance = {
      render: function render(output, scope) {
        var args = this.args.map(function (arg) {
          return evalValue(arg, scope);
        });
        args.unshift(output);
        return this.filter.apply(null, args);
      },
      parse: function parse(str) {
        var match = filterLine.exec(str);
        assert(match, 'illegal filter: ' + str);

        var name = match[1];
        var argList = match[2] || '';
        var filter$$1 = filters[name];
        if (typeof filter$$1 !== 'function') {
          if (options.strict_filters) {
            throw new TypeError('undefined filter: ' + name);
          }
          this.name = name;
          this.filter = function (x) {
            return x;
          };
          this.args = [];
          return this;
        }

        var args = [];
        while (match = valueRE.exec(argList.trim())) {
          var v = match[0];
          var re = new RegExp(v + '\\s*:', 'g');
          var keyMatch = re.exec(match.input);
          var currentMatchIsKey = keyMatch && keyMatch.index === match.index;
          currentMatchIsKey ? args.push('\'' + v + '\'') : args.push(v);
        }

        this.name = name;
        this.filter = filter$$1;
        this.args = args;

        return this;
      }
    };

    function construct(str) {
      var instance = create(_filterInstance);
      return instance.parse(str);
    }

    function register(name, filter$$1) {
      filters[name] = filter$$1;
    }

    function clear() {
      filters = {};
    }

    return {
      construct: construct, register: register, clear: clear
    };
  }

  function Parser (Tag, Filter) {
    var stream = {
      init: function init(tokens) {
        this.tokens = tokens;
        this.handlers = {};
        return this;
      },
      on: function on(name, cb) {
        this.handlers[name] = cb;
        return this;
      },
      trigger: function trigger(event, arg) {
        var h = this.handlers[event];
        if (typeof h === 'function') {
          h(arg);
          return true;
        }
      },
      start: function start() {
        this.trigger('start');
        var token = void 0;
        while (!this.stopRequested && (token = this.tokens.shift())) {
          if (this.trigger('token', token)) continue;
          if (token.type === 'tag' && this.trigger('tag:' + token.name, token)) {
            continue;
          }
          var template = parseToken(token, this.tokens);
          this.trigger('template', template);
        }
        if (!this.stopRequested) this.trigger('end');
        return this;
      },
      stop: function stop() {
        this.stopRequested = true;
        return this;
      }
    };

    function parse(tokens) {
      var token = void 0;
      var templates = [];
      while (token = tokens.shift()) {
        templates.push(parseToken(token, tokens));
      }
      return templates;
    }

    function parseToken(token, tokens) {
      try {
        var tpl = null;
        if (token.type === 'tag') {
          tpl = parseTag(token, tokens);
        } else if (token.type === 'value') {
          tpl = parseValue(token.value);
        } else {
          // token.type === 'html'
          tpl = token;
        }
        tpl.token = token;
        return tpl;
      } catch (e) {
        throw new ParseError(e, token);
      }
    }

    function parseTag(token, tokens) {
      if (token.name === 'continue' || token.name === 'break') return token;
      return Tag.construct(token, tokens);
    }

    function parseValue(str) {
      var match = matchValue(str);
      assert(match, 'illegal value string: ' + str);

      var initial = match[0];
      str = str.substr(match.index + match[0].length);

      var filters = [];
      while (match = filter.exec(str)) {
        filters.push([match[0].trim()]);
      }

      return {
        type: 'value',
        initial: initial,
        filters: filters.map(function (str) {
          return Filter.construct(str);
        })
      };
    }

    function parseStream(tokens) {
      var s = create(stream);
      return s.init(tokens);
    }

    return {
      parse: parse,
      parseTag: parseTag,
      parseStream: parseStream,
      parseValue: parseValue
    };
  }

  /*
   * Call functions in serial until someone resolved.
   * @param {Array} iterable the array to iterate with.
   * @param {Array} iteratee returns a new promise.
   * The iteratee is invoked with three arguments: (value, index, iterable).
   */

  /*
   * Call functions in serial until someone rejected.
   * @param {Array} iterable the array to iterate with.
   * @param {Array} iteratee returns a new promise.
   * The iteratee is invoked with three arguments: (value, index, iterable).
   */
  function mapSeries(iterable, iteratee) {
    var ret = Promise.resolve('init');
    var result = [];
    iterable.forEach(function (item, idx) {
      ret = ret.then(function () {
        return iteratee(item, idx, iterable);
      }).then(function (x) {
        return result.push(x);
      });
    });
    return ret.then(function () {
      return result;
    });
  }

  function For (liquid, Liquid) {
    var render = function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(scope, hash$$1) {
        var _this2 = this;

        var collection, offset, limit, contexts, html, finished;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                collection = Liquid.evalExp(this.collection, scope);


                if (!isArray(collection)) {
                  if (isString(collection) && collection.length > 0) {
                    collection = [collection];
                  } else if (isObject(collection)) {
                    collection = Object.keys(collection).map(function (key) {
                      return [key, collection[key]];
                    });
                  }
                }

                if (!(!isArray(collection) || !collection.length)) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt('return', liquid.renderer.renderTemplates(this.elseTemplates, scope));

              case 4:
                offset = hash$$1.offset || 0;
                limit = hash$$1.limit === undefined ? collection.length : hash$$1.limit;


                collection = collection.slice(offset, offset + limit);
                if (this.reversed) collection.reverse();

                contexts = collection.map(function (item, i) {
                  var ctx = {};
                  ctx[_this2.variable] = item;
                  ctx.forloop = {
                    first: i === 0,
                    index: i + 1,
                    index0: i,
                    last: i === collection.length - 1,
                    length: collection.length,
                    rindex: collection.length - i,
                    rindex0: collection.length - i - 1
                  };
                  return ctx;
                });
                html = '';
                finished = false;
                _context2.next = 13;
                return mapSeries(contexts, function () {
                  var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(context) {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (!finished) {
                              _context.next = 2;
                              break;
                            }

                            return _context.abrupt('return');

                          case 2:

                            scope.push(context);
                            _context.prev = 3;
                            _context.next = 6;
                            return liquid.renderer.renderTemplates(_this2.templates, scope);

                          case 6:
                            html += _context.sent;
                            _context.next = 17;
                            break;

                          case 9:
                            _context.prev = 9;
                            _context.t0 = _context['catch'](3);

                            if (!(_context.t0 instanceof RenderBreakError)) {
                              _context.next = 16;
                              break;
                            }

                            html += _context.t0.resolvedHTML;
                            if (_context.t0.message === 'break') {
                              finished = true;
                            }
                            _context.next = 17;
                            break;

                          case 16:
                            throw _context.t0;

                          case 17:
                            scope.pop(context);

                          case 18:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _callee, _this2, [[3, 9]]);
                  }));

                  return function (_x3) {
                    return _ref2.apply(this, arguments);
                  };
                }());

              case 13:
                return _context2.abrupt('return', html);

              case 14:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function render(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();

    var RenderBreakError = Liquid.Types.RenderBreakError;
    var re = new RegExp('^(' + identifier.source + ')\\s+in\\s+' + ('(' + value.source + ')') + ('(?:\\s+' + hash.source + ')*') + '(?:\\s+(reversed))?' + ('(?:\\s+' + hash.source + ')*$'));

    liquid.registerTag('for', { parse: parse, render: render });

    function parse(tagToken, remainTokens) {
      var _this = this;

      var match = re.exec(tagToken.args);
      assert(match, 'illegal tag: ' + tagToken.raw);
      this.variable = match[1];
      this.collection = match[2];
      this.reversed = !!match[3];

      this.templates = [];
      this.elseTemplates = [];

      var p = void 0;
      var stream = liquid.parser.parseStream(remainTokens).on('start', function () {
        return p = _this.templates;
      }).on('tag:else', function () {
        return p = _this.elseTemplates;
      }).on('tag:endfor', function () {
        return stream.stop();
      }).on('template', function (tpl) {
        return p.push(tpl);
      }).on('end', function () {
        throw new Error('tag ' + tagToken.raw + ' not closed');
      });

      stream.start();
    }
  }

  function Assign (liquid, Liquid) {
    var re = new RegExp('(' + identifier.source + ')\\s*=([^]*)');
    var AssignScope = Liquid.Types.AssignScope;


    liquid.registerTag('assign', {
      parse: function parse(token) {
        var match = token.args.match(re);
        assert(match, 'illegal token ' + token.raw);
        this.key = match[1];
        this.value = match[2];
      },
      render: function render(scope) {
        var ctx = create(AssignScope);
        ctx[this.key] = liquid.evalValue(this.value, scope);
        scope.push(ctx);
        return Promise.resolve('');
      }
    });
  }

  function Capture (liquid, Liquid) {
    var re = new RegExp('(' + identifier.source + ')');
    var CaptureScope = Liquid.Types.CaptureScope;


    liquid.registerTag('capture', {
      parse: function parse(tagToken, remainTokens) {
        var _this = this;

        var match = tagToken.args.match(re);
        assert(match, tagToken.args + ' not valid identifier');

        this.variable = match[1];
        this.templates = [];

        var stream = liquid.parser.parseStream(remainTokens);
        stream.on('tag:endcapture', function (token) {
          return stream.stop();
        }).on('template', function (tpl) {
          return _this.templates.push(tpl);
        }).on('end', function (x) {
          throw new Error('tag ' + tagToken.raw + ' not closed');
        });
        stream.start();
      },
      render: function () {
        var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(scope, hash$$1) {
          var html, ctx;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return liquid.renderer.renderTemplates(this.templates, scope);

                case 2:
                  html = _context.sent;
                  ctx = create(CaptureScope);

                  ctx[this.variable] = html;
                  scope.push(ctx);

                case 6:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function render(_x, _x2) {
          return _ref.apply(this, arguments);
        }

        return render;
      }()
    });
  }

  function Case (liquid, Liquid) {
    liquid.registerTag('case', {

      parse: function parse(tagToken, remainTokens) {
        var _this = this;

        this.cond = tagToken.args;
        this.cases = [];
        this.elseTemplates = [];

        var p = [];
        var stream = liquid.parser.parseStream(remainTokens).on('tag:when', function (token) {
          _this.cases.push({
            val: token.args,
            templates: p = []
          });
        }).on('tag:else', function () {
          return p = _this.elseTemplates;
        }).on('tag:endcase', function (token) {
          return stream.stop();
        }).on('template', function (tpl) {
          return p.push(tpl);
        }).on('end', function (x) {
          throw new Error('tag ' + tagToken.raw + ' not closed');
        });

        stream.start();
      },

      render: function render(scope, hash) {
        for (var i = 0; i < this.cases.length; i++) {
          var branch = this.cases[i];
          var val = Liquid.evalExp(branch.val, scope);
          var cond = Liquid.evalExp(this.cond, scope);
          if (val === cond) {
            return liquid.renderer.renderTemplates(branch.templates, scope);
          }
        }
        return liquid.renderer.renderTemplates(this.elseTemplates, scope);
      }
    });
  }

  function Comment (liquid) {
    liquid.registerTag('comment', {
      parse: function parse(tagToken, remainTokens) {
        var stream = liquid.parser.parseStream(remainTokens);
        stream.on('token', function (token) {
          if (token.name === 'endcomment') stream.stop();
        }).on('end', function (x) {
          throw new Error('tag ' + tagToken.raw + ' not closed');
        });
        stream.start();
      }
    });
  }

  var staticFileRE = /[^\s,]+/;

  function Include (liquid, Liquid) {
    var withRE = new RegExp('with\\s+(' + value.source + ')');

    liquid.registerTag('include', {
      parse: function parse(token) {
        var match = staticFileRE.exec(token.args);
        if (match) {
          this.staticValue = match[0];
        }

        match = value.exec(token.args);
        if (match) {
          this.value = match[0];
        }

        match = withRE.exec(token.args);
        if (match) {
          this.with = match[1];
        }
      },
      render: function () {
        var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(scope, hash$$1) {
          var filepath, template, originBlocks, originBlockMode, templates, html;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  filepath = void 0;

                  if (!scope.opts.dynamicPartials) {
                    _context.next = 12;
                    break;
                  }

                  if (!quotedLine.exec(this.value)) {
                    _context.next = 9;
                    break;
                  }

                  template = this.value.slice(1, -1);
                  _context.next = 6;
                  return liquid.parseAndRender(template, scope.getAll(), scope.opts);

                case 6:
                  filepath = _context.sent;
                  _context.next = 10;
                  break;

                case 9:
                  filepath = Liquid.evalValue(this.value, scope);

                case 10:
                  _context.next = 13;
                  break;

                case 12:
                  filepath = this.staticValue;

                case 13:
                  assert(filepath, 'cannot include with empty filename');

                  originBlocks = scope.opts.blocks;
                  originBlockMode = scope.opts.blockMode;


                  scope.opts.blocks = {};
                  scope.opts.blockMode = 'output';
                  if (this.with) {
                    hash$$1[filepath] = Liquid.evalValue(this.with, scope);
                  }
                  _context.next = 21;
                  return liquid.getTemplate(filepath, scope.opts.root);

                case 21:
                  templates = _context.sent;

                  scope.push(hash$$1);
                  _context.next = 25;
                  return liquid.renderer.renderTemplates(templates, scope);

                case 25:
                  html = _context.sent;

                  scope.pop(hash$$1);
                  scope.opts.blocks = originBlocks;
                  scope.opts.blockMode = originBlockMode;
                  return _context.abrupt('return', html);

                case 30:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function render(_x, _x2) {
          return _ref.apply(this, arguments);
        }

        return render;
      }()
    });
  }

  function Decrement (liquid, Liquid) {
    var _Liquid$Types = Liquid.Types,
        CaptureScope = _Liquid$Types.CaptureScope,
        AssignScope = _Liquid$Types.AssignScope,
        DecrementScope = _Liquid$Types.DecrementScope;


    liquid.registerTag('decrement', {
      parse: function parse(token) {
        var match = token.args.match(identifier);
        assert(match, 'illegal identifier ' + token.args);
        this.variable = match[0];
      },
      render: function render(scope, hash$$1) {
        var context = scope.findContextFor(this.variable, function (ctx) {
          var proto = Object.getPrototypeOf(ctx);
          return proto !== CaptureScope && proto !== AssignScope;
        });
        if (!context) {
          context = create(DecrementScope);
          scope.unshift(context);
        }
        if (typeof context[this.variable] !== 'number') {
          context[this.variable] = 0;
        }
        return --context[this.variable];
      }
    });
  }

  function Cycle (liquid, Liquid) {
    var groupRE = new RegExp('^(?:(' + value.source + ')\\s*:\\s*)?(.*)$');
    var candidatesRE = new RegExp(value.source, 'g');

    liquid.registerTag('cycle', {

      parse: function parse(tagToken, remainTokens) {
        var match = groupRE.exec(tagToken.args);
        assert(match, 'illegal tag: ' + tagToken.raw);

        this.group = match[1] || '';
        var candidates = match[2];

        this.candidates = [];

        while (match = candidatesRE.exec(candidates)) {
          this.candidates.push(match[0]);
        }
        assert(this.candidates.length, 'empty candidates: ' + tagToken.raw);
      },

      render: function render(scope, hash$$1) {
        var group = Liquid.evalValue(this.group, scope);
        var fingerprint = 'cycle:' + group + ':' + this.candidates.join(',');

        var groups = scope.opts.groups = scope.opts.groups || {};
        var idx = groups[fingerprint];

        if (idx === undefined) {
          idx = groups[fingerprint] = 0;
        }

        var candidate = this.candidates[idx];
        idx = (idx + 1) % this.candidates.length;
        groups[fingerprint] = idx;

        return Liquid.evalValue(candidate, scope);
      }
    });
  }

  function If (liquid, Liquid) {
    liquid.registerTag('if', {

      parse: function parse(tagToken, remainTokens) {
        var _this = this;

        this.branches = [];
        this.elseTemplates = [];

        var p = void 0;
        var stream = liquid.parser.parseStream(remainTokens).on('start', function () {
          return _this.branches.push({
            cond: tagToken.args,
            templates: p = []
          });
        }).on('tag:elsif', function (token) {
          _this.branches.push({
            cond: token.args,
            templates: p = []
          });
        }).on('tag:else', function () {
          return p = _this.elseTemplates;
        }).on('tag:endif', function (token) {
          return stream.stop();
        }).on('template', function (tpl) {
          return p.push(tpl);
        }).on('end', function (x) {
          throw new Error('tag ' + tagToken.raw + ' not closed');
        });

        stream.start();
      },

      render: function render(scope, hash) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.branches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var branch = _step.value;

            var cond = Liquid.evalExp(branch.cond, scope);
            if (Liquid.isTruthy(cond)) {
              return liquid.renderer.renderTemplates(branch.templates, scope);
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return liquid.renderer.renderTemplates(this.elseTemplates, scope);
      }
    });
  }

  function Increment (liquid, Liquid) {
    var _Liquid$Types = Liquid.Types,
        CaptureScope = _Liquid$Types.CaptureScope,
        AssignScope = _Liquid$Types.AssignScope,
        IncrementScope = _Liquid$Types.IncrementScope;


    liquid.registerTag('increment', {
      parse: function parse(token) {
        var match = token.args.match(identifier);
        assert(match, 'illegal identifier ' + token.args);
        this.variable = match[0];
      },
      render: function render(scope, hash$$1) {
        var context = scope.findContextFor(this.variable, function (ctx) {
          var proto = Object.getPrototypeOf(ctx);
          return proto !== CaptureScope && proto !== AssignScope;
        });
        if (!context) {
          context = create(IncrementScope);
          scope.unshift(context);
        }
        if (typeof context[this.variable] !== 'number') {
          context[this.variable] = 0;
        }
        var val = context[this.variable];
        context[this.variable]++;
        return val;
      }
    });
  }

  /*
   * blockMode:
   * * "store": store rendered html into blocks
   * * "output": output rendered html
   */

  function Layout (liquid, Liquid) {
    var staticFileRE = /\S+/;

    liquid.registerTag('layout', {
      parse: function parse(token, remainTokens) {
        var match = staticFileRE.exec(token.args);
        if (match) {
          this.staticLayout = match[0];
        }

        match = value.exec(token.args);
        if (match) {
          this.layout = match[0];
        }

        this.tpls = liquid.parser.parse(remainTokens);
      },
      render: function () {
        var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(scope, hash$$1) {
          var layout, html, templates, partial;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  layout = scope.opts.dynamicPartials ? Liquid.evalValue(this.layout, scope) : this.staticLayout;

                  assert(layout, 'cannot apply layout with empty filename');

                  // render the remaining tokens immediately
                  scope.opts.blockMode = 'store';
                  _context.next = 5;
                  return liquid.renderer.renderTemplates(this.tpls, scope);

                case 5:
                  html = _context.sent;

                  if (scope.opts.blocks[''] === undefined) {
                    scope.opts.blocks[''] = html;
                  }
                  _context.next = 9;
                  return liquid.getTemplate(layout, scope.opts.root);

                case 9:
                  templates = _context.sent;

                  scope.push(hash$$1);
                  scope.opts.blockMode = 'output';
                  _context.next = 14;
                  return liquid.renderer.renderTemplates(templates, scope);

                case 14:
                  partial = _context.sent;

                  scope.pop(hash$$1);
                  return _context.abrupt('return', partial);

                case 17:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function render(_x, _x2) {
          return _ref.apply(this, arguments);
        }

        return render;
      }()
    });

    liquid.registerTag('block', {
      parse: function parse(token, remainTokens) {
        var _this = this;

        var match = /\w+/.exec(token.args);
        this.block = match ? match[0] : '';

        this.tpls = [];
        var stream = liquid.parser.parseStream(remainTokens).on('tag:endblock', function () {
          return stream.stop();
        }).on('template', function (tpl) {
          return _this.tpls.push(tpl);
        }).on('end', function () {
          throw new Error('tag ' + token.raw + ' not closed');
        });
        stream.start();
      },
      render: function () {
        var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(scope) {
          var childDefined, html;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  childDefined = scope.opts.blocks[this.block];

                  if (!(childDefined !== undefined)) {
                    _context2.next = 5;
                    break;
                  }

                  _context2.t0 = childDefined;
                  _context2.next = 8;
                  break;

                case 5:
                  _context2.next = 7;
                  return liquid.renderer.renderTemplates(this.tpls, scope);

                case 7:
                  _context2.t0 = _context2.sent;

                case 8:
                  html = _context2.t0;

                  if (!(scope.opts.blockMode === 'store')) {
                    _context2.next = 12;
                    break;
                  }

                  scope.opts.blocks[this.block] = html;
                  return _context2.abrupt('return', '');

                case 12:
                  return _context2.abrupt('return', html);

                case 13:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function render(_x3) {
          return _ref2.apply(this, arguments);
        }

        return render;
      }()
    });
  }

  function Raw (liquid) {
    liquid.registerTag('raw', {
      parse: function parse(tagToken, remainTokens) {
        var _this = this;

        this.tokens = [];

        var stream = liquid.parser.parseStream(remainTokens);
        stream.on('token', function (token) {
          if (token.name === 'endraw') stream.stop();else _this.tokens.push(token);
        }).on('end', function () {
          throw new Error('tag ' + tagToken.raw + ' not closed');
        });
        stream.start();
      },
      render: function render(scope, hash) {
        return this.tokens.map(function (token) {
          return token.raw;
        }).join('');
      }
    });
  }

  function Tablerow (liquid, Liquid) {
    var re = new RegExp('^(' + identifier.source + ')\\s+in\\s+' + ('(' + value.source + ')') + ('(?:\\s+' + hash.source + ')*$'));

    liquid.registerTag('tablerow', {

      parse: function parse(tagToken, remainTokens) {
        var _this = this;

        var match = re.exec(tagToken.args);
        assert(match, 'illegal tag: ' + tagToken.raw);

        this.variable = match[1];
        this.collection = match[2];
        this.templates = [];

        var p = void 0;
        var stream = liquid.parser.parseStream(remainTokens).on('start', function () {
          return p = _this.templates;
        }).on('tag:endtablerow', function (token) {
          return stream.stop();
        }).on('template', function (tpl) {
          return p.push(tpl);
        }).on('end', function () {
          throw new Error('tag ' + tagToken.raw + ' not closed');
        });

        stream.start();
      },

      render: function () {
        var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(scope, hash$$1) {
          var _this2 = this;

          var collection, offset, limit, cols, contexts, row, html;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  collection = Liquid.evalExp(this.collection, scope) || [];
                  offset = hash$$1.offset || 0;
                  limit = hash$$1.limit === undefined ? collection.length : hash$$1.limit;


                  collection = collection.slice(offset, offset + limit);
                  cols = hash$$1.cols || collection.length;
                  contexts = collection.map(function (item, i) {
                    var ctx = {};
                    ctx[_this2.variable] = item;
                    return ctx;
                  });
                  row = void 0;
                  html = '';
                  _context2.next = 10;
                  return mapSeries(contexts, function () {
                    var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(context, idx) {
                      var col;
                      return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              row = Math.floor(idx / cols) + 1;
                              col = idx % cols + 1;

                              if (col === 1) {
                                if (row !== 1) {
                                  html += '</tr>';
                                }
                                html += '<tr class="row' + row + '">';
                              }

                              html += '<td class="col' + col + '">';
                              scope.push(context);
                              _context.next = 7;
                              return liquid.renderer.renderTemplates(_this2.templates, scope);

                            case 7:
                              html += _context.sent;

                              html += '</td>';
                              scope.pop(context);
                              return _context.abrupt('return', html);

                            case 11:
                            case 'end':
                              return _context.stop();
                          }
                        }
                      }, _callee, _this2);
                    }));

                    return function (_x3, _x4) {
                      return _ref2.apply(this, arguments);
                    };
                  }());

                case 10:
                  if (row > 0) {
                    html += '</tr>';
                  }
                  return _context2.abrupt('return', html);

                case 12:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function render(_x, _x2) {
          return _ref.apply(this, arguments);
        }

        return render;
      }()
    });
  }

  function Unless (liquid, Liquid) {
    liquid.registerTag('unless', {
      parse: function parse(tagToken, remainTokens) {
        var _this = this;

        this.templates = [];
        this.elseTemplates = [];
        var p = void 0;
        var stream = liquid.parser.parseStream(remainTokens).on('start', function (x) {
          p = _this.templates;
          _this.cond = tagToken.args;
        }).on('tag:else', function () {
          return p = _this.elseTemplates;
        }).on('tag:endunless', function (token) {
          return stream.stop();
        }).on('template', function (tpl) {
          return p.push(tpl);
        }).on('end', function (x) {
          throw new Error('tag ' + tagToken.raw + ' not closed');
        });

        stream.start();
      },

      render: function render(scope, hash) {
        var cond = Liquid.evalExp(this.cond, scope);
        return Liquid.isFalsy(cond) ? liquid.renderer.renderTemplates(this.templates, scope) : liquid.renderer.renderTemplates(this.elseTemplates, scope);
      }
    });
  }

  function tags (engine, Liquid) {
    Assign(engine, Liquid);
    Capture(engine, Liquid);
    Case(engine, Liquid);
    Comment(engine, Liquid);
    Cycle(engine, Liquid);
    Decrement(engine, Liquid);
    For(engine, Liquid);
    If(engine, Liquid);
    Include(engine, Liquid);
    Increment(engine, Liquid);
    Layout(engine, Liquid);
    Raw(engine, Liquid);
    Tablerow(engine, Liquid);
    Unless(engine, Liquid);
  }

  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var monthNamesShort = monthNames.map(abbr);
  var dayNamesShort = dayNames.map(abbr);
  var suffixes = {
    1: 'st',
    2: 'nd',
    3: 'rd',
    'default': 'th'
  };

  function abbr(str) {
    return str.slice(0, 3);
  }

  // prototype extensions
  var _date = {
    daysInMonth: function daysInMonth(d) {
      var feb = _date.isLeapYear(d) ? 29 : 28;
      return [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    },

    getDayOfYear: function getDayOfYear(d) {
      var num = 0;
      for (var i = 0; i < d.getMonth(); ++i) {
        num += _date.daysInMonth(d)[i];
      }
      return num + d.getDate();
    },

    // Startday is an integer of which day to start the week measuring from
    // TODO: that comment was retarted. fix it.
    getWeekOfYear: function getWeekOfYear(d, startDay) {
      // Skip to startDay of this week
      var now = this.getDayOfYear(d) + (startDay - d.getDay());
      // Find the first startDay of the year
      var jan1 = new Date(d.getFullYear(), 0, 1);
      var then = 7 - jan1.getDay() + startDay;
      return _number.pad(Math.floor((now - then) / 7) + 1, 2);
    },

    isLeapYear: function isLeapYear(d) {
      var year = d.getFullYear();
      return !!((year & 3) === 0 && (year % 100 || year % 400 === 0 && year));
    },

    getSuffix: function getSuffix(d) {
      var str = d.getDate().toString();
      var index = parseInt(str.slice(-1));
      return suffixes[index] || suffixes['default'];
    },

    century: function century(d) {
      return parseInt(d.getFullYear().toString().substring(0, 2), 10);
    }
  };

  var _number = {
    pad: function pad(value, size, ch) {
      if (!ch) ch = '0';
      var result = value.toString();
      var pad = size - result.length;

      while (pad-- > 0) {
        result = ch + result;
      }

      return result;
    }
  };

  var formatCodes = {
    a: function a(d) {
      return dayNamesShort[d.getDay()];
    },
    A: function A(d) {
      return dayNames[d.getDay()];
    },
    b: function b(d) {
      return monthNamesShort[d.getMonth()];
    },
    B: function B(d) {
      return monthNames[d.getMonth()];
    },
    c: function c(d) {
      return d.toLocaleString();
    },
    C: function C(d) {
      return _date.century(d);
    },
    d: function d(_d) {
      return _number.pad(_d.getDate(), 2);
    },
    e: function e(d) {
      return _number.pad(d.getDate(), 2, ' ');
    },
    H: function H(d) {
      return _number.pad(d.getHours(), 2);
    },
    I: function I(d) {
      return _number.pad(d.getHours() % 12 || 12, 2);
    },
    j: function j(d) {
      return _number.pad(_date.getDayOfYear(d), 3);
    },
    k: function k(d) {
      return _number.pad(d.getHours(), 2, ' ');
    },
    l: function l(d) {
      return _number.pad(d.getHours() % 12 || 12, 2, ' ');
    },
    L: function L(d) {
      return _number.pad(d.getMilliseconds(), 3);
    },
    m: function m(d) {
      return _number.pad(d.getMonth() + 1, 2);
    },
    M: function M(d) {
      return _number.pad(d.getMinutes(), 2);
    },
    p: function p(d) {
      return d.getHours() < 12 ? 'AM' : 'PM';
    },
    P: function P(d) {
      return d.getHours() < 12 ? 'am' : 'pm';
    },
    q: function q(d) {
      return _date.getSuffix(d);
    },
    s: function s(d) {
      return Math.round(d.valueOf() / 1000);
    },
    S: function S(d) {
      return _number.pad(d.getSeconds(), 2);
    },
    u: function u(d) {
      return d.getDay() || 7;
    },
    U: function U(d) {
      return _date.getWeekOfYear(d, 0);
    },
    w: function w(d) {
      return d.getDay();
    },
    W: function W(d) {
      return _date.getWeekOfYear(d, 1);
    },
    x: function x(d) {
      return d.toLocaleDateString();
    },
    X: function X(d) {
      return d.toLocaleTimeString();
    },
    y: function y(d) {
      return d.getFullYear().toString().substring(2, 4);
    },
    Y: function Y(d) {
      return d.getFullYear();
    },
    z: function z(d) {
      var tz = d.getTimezoneOffset() / 60 * 100;
      return (tz > 0 ? '-' : '+') + _number.pad(Math.abs(tz), 4);
    },
    '%': function _() {
      return '%';
    }
  };
  formatCodes.h = formatCodes.b;
  formatCodes.N = formatCodes.L;

  function strftime (d, format) {
    var output = '';
    var remaining = format;

    while (true) {
      var r = /%./g;
      var results = r.exec(remaining);

      // No more format codes. Add the remaining text and return
      if (!results) {
        return output + remaining;
      }

      // Add the preceding text
      output += remaining.slice(0, r.lastIndex - 2);
      remaining = remaining.slice(r.lastIndex);

      // Add the format code
      var ch = results[0].charAt(1);
      var func = formatCodes[ch];
      output += func ? func.call(this, d) : '%' + ch;
    }
  }

  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&#34;',
    "'": '&#39;'
  };
  var unescapeMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&#34;': '"',
    '&#39;': "'"
  };

  var filters = {
    'abs': function abs(v) {
      return Math.abs(v);
    },
    'append': function append(v, arg) {
      return v + arg;
    },
    'capitalize': function capitalize(str) {
      return stringify$1(str).charAt(0).toUpperCase() + str.slice(1);
    },
    'ceil': function ceil(v) {
      return Math.ceil(v);
    },
    'concat': function concat(v, arg) {
      return Array.prototype.concat.call(v, arg);
    },
    'date': function date(v, arg) {
      var date = v;
      if (v === 'now') {
        date = new Date();
      } else if (isString(v)) {
        date = new Date(v);
      }
      return isValidDate(date) ? strftime(date, arg) : v;
    },
    'default': function _default(v, arg) {
      return isTruthy(v) ? v : arg;
    },
    'divided_by': function divided_by(v, arg) {
      return v / arg;
    },
    'downcase': function downcase(v) {
      return v.toLowerCase();
    },
    'escape': escape,

    'escape_once': function escape_once(str) {
      return escape(unescape(str));
    },
    'first': function first(v) {
      return v[0];
    },
    'floor': function floor(v) {
      return Math.floor(v);
    },
    'join': function join(v, arg) {
      return v.join(arg === undefined ? ' ' : arg);
    },
    'last': function last$$1(v) {
      return last(v);
    },
    'lstrip': function lstrip(v) {
      return stringify$1(v).replace(/^\s+/, '');
    },
    'map': function map(arr, arg) {
      return arr.map(function (v) {
        return v[arg];
      });
    },
    'minus': bindFixed(function (v, arg) {
      return v - arg;
    }),
    'modulo': bindFixed(function (v, arg) {
      return v % arg;
    }),
    'newline_to_br': function newline_to_br(v) {
      return v.replace(/\n/g, '<br />');
    },
    'plus': bindFixed(function (v, arg) {
      return Number(v) + Number(arg);
    }),
    'prepend': function prepend(v, arg) {
      return arg + v;
    },
    'remove': function remove(v, arg) {
      return v.split(arg).join('');
    },
    'remove_first': function remove_first(v, l) {
      return v.replace(l, '');
    },
    'replace': function replace(v, pattern, replacement) {
      return stringify$1(v).split(pattern).join(replacement);
    },
    'replace_first': function replace_first(v, arg1, arg2) {
      return stringify$1(v).replace(arg1, arg2);
    },
    'reverse': function reverse(v) {
      return v.reverse();
    },
    'round': function round(v, arg) {
      var amp = Math.pow(10, arg || 0);
      return Math.round(v * amp, arg) / amp;
    },
    'rstrip': function rstrip(str) {
      return stringify$1(str).replace(/\s+$/, '');
    },
    'size': function size(v) {
      return v.length;
    },
    'slice': function slice(v, begin, length) {
      if (length === undefined) length = 1;
      return v.slice(begin, begin + length);
    },
    'sort': function sort(v, arg) {
      return v.sort(arg);
    },
    'split': function split(v, arg) {
      return stringify$1(v).split(arg);
    },
    'strip': function strip(v) {
      return stringify$1(v).trim();
    },
    'strip_html': function strip_html(v) {
      return stringify$1(v).replace(/<script.*?<\/script>|<!--.*?-->|<style.*?<\/style>|<.*?>/g, '');
    },
    'strip_newlines': function strip_newlines(v) {
      return stringify$1(v).replace(/\n/g, '');
    },
    'times': function times(v, arg) {
      return v * arg;
    },
    'truncate': function truncate(v, l, o) {
      v = stringify$1(v);
      o = o === undefined ? '...' : o;
      l = l || 16;
      if (v.length <= l) return v;
      return v.substr(0, l - o.length) + o;
    },
    'truncatewords': function truncatewords(v, l, o) {
      if (o === undefined) o = '...';
      var arr = v.split(' ');
      var ret = arr.slice(0, l).join(' ');
      if (arr.length > l) ret += o;
      return ret;
    },
    'uniq': function uniq$$1(arr) {
      var u = {};
      return (arr || []).filter(function (val) {
        if (u.hasOwnProperty(val)) {
          return false;
        }
        u[val] = true;
        return true;
      });
    },
    'upcase': function upcase(str) {
      return stringify$1(str).toUpperCase();
    },
    'url_decode': function url_decode(x) {
      return x.split('+').map(decodeURIComponent).join(' ');
    },
    'url_encode': function url_encode(x) {
      return x.split(' ').map(encodeURIComponent).join('+');
    }
  };

  function escape(str) {
    return stringify$1(str).replace(/&|<|>|"|'/g, function (m) {
      return escapeMap[m];
    });
  }

  function unescape(str) {
    return stringify$1(str).replace(/&(amp|lt|gt|#34|#39);/g, function (m) {
      return unescapeMap[m];
    });
  }

  function getFixed(v) {
    var p = (v + '').split('.');
    return p.length > 1 ? p[1].length : 0;
  }

  function getMaxFixed(l, r) {
    return Math.max(getFixed(l), getFixed(r));
  }

  function stringify$1(obj) {
    return obj + '';
  }

  function bindFixed(cb) {
    return function (l, r) {
      var f = getMaxFixed(l, r);
      return cb(l, r).toFixed(f);
    };
  }

  function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
  }

  function registerAll(liquid) {
    return forOwn(filters, function (func, name) {
      return liquid.registerFilter(name, func);
    });
  }

  registerAll.filters = filters;

  var _engine = {
    init: function init(tag, filter, options) {
      if (options.cache) {
        this.cache = {};
      }
      this.options = options;
      this.tag = tag;
      this.filter = filter;
      this.parser = Parser(tag, filter);
      this.renderer = Render();

      tags(this, Liquid);
      registerAll(this, Liquid);

      return this;
    },
    parse: function parse$$1(html, filepath) {
      var tokens = parse(html, filepath, this.options);
      return this.parser.parse(tokens);
    },
    render: function render(tpl, ctx, opts) {
      opts = assign({}, this.options, opts);
      var scope = factory(ctx, opts);
      return this.renderer.renderTemplates(tpl, scope);
    },
    parseAndRender: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(html, ctx, opts) {
        var tpl;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.parse(html);

              case 2:
                tpl = _context.sent;
                return _context.abrupt('return', this.render(tpl, ctx, opts));

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function parseAndRender(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return parseAndRender;
    }(),
    getTemplate: function () {
      var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(file, root) {
        var _this = this;

        var filepath;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return resolve(file, root, this.options);

              case 2:
                filepath = _context3.sent;
                return _context3.abrupt('return', this.respectCache(filepath, asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                  var str;
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return read(filepath);

                        case 2:
                          str = _context2.sent;
                          return _context2.abrupt('return', _this.parse(str, filepath));

                        case 4:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, _this);
                }))));

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getTemplate(_x4, _x5) {
        return _ref2.apply(this, arguments);
      }

      return getTemplate;
    }(),
    renderFile: function () {
      var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(file, ctx, opts) {
        var templates;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                opts = assign({}, opts);
                _context4.next = 3;
                return this.getTemplate(file, opts.root);

              case 3:
                templates = _context4.sent;
                return _context4.abrupt('return', this.render(templates, ctx, opts));

              case 5:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function renderFile(_x6, _x7, _x8) {
        return _ref4.apply(this, arguments);
      }

      return renderFile;
    }(),
    respectCache: function () {
      var _ref5 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(key, getter) {
        var cacheEnabled, value;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                cacheEnabled = this.options.cache;

                if (!(cacheEnabled && this.cache[key])) {
                  _context5.next = 3;
                  break;
                }

                return _context5.abrupt('return', this.cache[key]);

              case 3:
                _context5.next = 5;
                return getter();

              case 5:
                value = _context5.sent;

                if (cacheEnabled) {
                  this.cache[key] = value;
                }
                return _context5.abrupt('return', value);

              case 8:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function respectCache(_x9, _x10) {
        return _ref5.apply(this, arguments);
      }

      return respectCache;
    }(),
    evalValue: function evalValue$$1(str, scope) {
      var tpl = this.parser.parseValue(str.trim());
      return this.renderer.evalValue(tpl, scope);
    },
    registerFilter: function registerFilter(name, filter) {
      return this.filter.register(name, filter);
    },
    registerTag: function registerTag(name, tag) {
      return this.tag.register(name, tag);
    },
    plugin: function plugin(_plugin) {
      return _plugin.call(this, Liquid);
    },
    express: function express(opts) {
      opts = opts || {};
      var self = this;
      return function (filePath, ctx, cb) {
        assert(isArray(this.root) || isString(this.root), 'illegal views root, are you using express.js?');
        opts.root = this.root;
        self.renderFile(filePath, ctx, opts).then(function (html) {
          return cb(null, html);
        }, cb);
      };
    }
  };

  function normalizeStringArray(value) {
    if (isArray(value)) return value;
    if (isString(value)) return [value];
    throw new TypeError('illegal root: ' + value);
  }

  function Liquid(options) {
    options = assign({
      root: ['.'],
      cache: false,
      extname: '',
      dynamicPartials: true,
      trim_tag_right: false,
      trim_tag_left: false,
      trim_value_right: false,
      trim_value_left: false,
      greedy: true,
      strict_filters: false,
      strict_variables: false
    }, options);
    options.root = normalizeStringArray(options.root);

    var engine = create(_engine);
    engine.init(Tag(), Filter(options), options);
    return engine;
  }

  Liquid.default = Liquid;
  Liquid.isTruthy = isTruthy;
  Liquid.isFalsy = isFalsy;
  Liquid.evalExp = evalExp;
  Liquid.evalValue = evalValue;
  Liquid.Types = {
    ParseError: ParseError,
    TokenizationError: TokenizationError,
    RenderBreakError: RenderBreakError,
    AssertionError: AssertionError,
    AssignScope: {},
    CaptureScope: {},
    IncrementScope: {},
    DecrementScope: {}
  };

  return Liquid;

}));
//# sourceMappingURL=liquid.js.map
