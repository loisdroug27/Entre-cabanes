var Prototype = {
    Version: "1.6.1",
    Browser: (function() {
        var b = navigator.userAgent;
        var a = Object.prototype.toString.call(window.opera) == "[object Opera]";
        return {
            IE: !!window.attachEvent && !a,
            Opera: a,
            WebKit: b.indexOf("AppleWebKit/") > -1,
            Gecko: b.indexOf("Gecko") > -1 && b.indexOf("KHTML") === -1,
            MobileSafari: /Apple.*Mobile.*Safari/.test(b)
        }
    })(),
    BrowserFeatures: {
        XPath: !!document.evaluate,
        SelectorsAPI: !!document.querySelector,
        ElementExtensions: (function() {
            var a = window.Element || window.HTMLElement;
            return !!(a && a.prototype)
        })(),
        SpecificElementExtensions: (function() {
            if (typeof window.HTMLDivElement !== "undefined") {
                return true
            }
            var c = document.createElement("div");
            var b = document.createElement("form");
            var a = false;
            if (c.__proto__ && (c.__proto__ !== b.__proto__)) {
                a = true
            }
            c = b = null;
            return a
        })()
    },
    ScriptFragment: "<script[^>]*>([\\S\\s]*?)<\/script>",
    JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
    emptyFunction: function() {},
    K: function(a) {
        return a
    }
};
if (Prototype.Browser.MobileSafari) {
    Prototype.BrowserFeatures.SpecificElementExtensions = false
}
var Abstract = {};
var Try = {
    these: function() {
        var c;
        for (var b = 0, d = arguments.length; b < d; b++) {
            var a = arguments[b];
            try {
                c = a();
                break
            } catch (f) {}
        }
        return c
    }
};
var Class = (function() {
    function a() {}

    function b() {
        var g = null,
            f = $A(arguments);
        if (Object.isFunction(f[0])) {
            g = f.shift()
        }

        function d() {
            this.initialize.apply(this, arguments)
        }
        Object.extend(d, Class.Methods);
        d.superclass = g;
        d.subclasses = [];
        if (g) {
            a.prototype = g.prototype;
            d.prototype = new a;
            g.subclasses.push(d)
        }
        for (var e = 0; e < f.length; e++) {
            d.addMethods(f[e])
        }
        if (!d.prototype.initialize) {
            d.prototype.initialize = Prototype.emptyFunction
        }
        d.prototype.constructor = d;
        return d
    }

    function c(k) {
        var f = this.superclass && this.superclass.prototype;
        var e = Object.keys(k);
        if (!Object.keys({
                toString: true
            }).length) {
            if (k.toString != Object.prototype.toString) {
                e.push("toString")
            }
            if (k.valueOf != Object.prototype.valueOf) {
                e.push("valueOf")
            }
        }
        for (var d = 0, g = e.length; d < g; d++) {
            var j = e[d],
                h = k[j];
            if (f && Object.isFunction(h) && h.argumentNames().first() == "$super") {
                var l = h;
                h = (function(n) {
                    return function() {
                        return f[n].apply(this, arguments)
                    }
                })(j).wrap(l);
                h.valueOf = l.valueOf.bind(l);
                h.toString = l.toString.bind(l)
            }
            this.prototype[j] = h
        }
        return this
    }
    return {
        create: b,
        Methods: {
            addMethods: c
        }
    }
})();
(function() {
    var d = Object.prototype.toString;

    function j(r, t) {
        for (var s in t) {
            r[s] = t[s]
        }
        return r
    }

    function m(r) {
        try {
            if (e(r)) {
                return "undefined"
            }
            if (r === null) {
                return "null"
            }
            return r.inspect ? r.inspect() : String(r)
        } catch (s) {
            if (s instanceof RangeError) {
                return "..."
            }
            throw s
        }
    }

    function l(r) {
        var t = typeof r;
        switch (t) {
            case "undefined":
            case "function":
            case "unknown":
                return;
            case "boolean":
                return r.toString()
        }
        if (r === null) {
            return "null"
        }
        if (r.toJSON) {
            return r.toJSON()
        }
        if (h(r)) {
            return
        }
        var s = [];
        for (var v in r) {
            var u = l(r[v]);
            if (!e(u)) {
                s.push(v.toJSON() + ": " + u)
            }
        }
        return "{" + s.join(", ") + "}"
    }

    function c(r) {
        return $H(r).toQueryString()
    }

    function f(r) {
        return r && r.toHTML ? r.toHTML() : String.interpret(r)
    }

    function p(r) {
        var s = [];
        for (var t in r) {
            s.push(t)
        }
        return s
    }

    function n(r) {
        var s = [];
        for (var t in r) {
            s.push(r[t])
        }
        return s
    }

    function k(r) {
        return j({}, r)
    }

    function h(r) {
        return !!(r && r.nodeType == 1)
    }

    function g(r) {
        return d.call(r) == "[object Array]"
    }

    function q(r) {
        return r instanceof Hash
    }

    function b(r) {
        return typeof r === "function"
    }

    function a(r) {
        return d.call(r) == "[object String]"
    }

    function o(r) {
        return d.call(r) == "[object Number]"
    }

    function e(r) {
        return typeof r === "undefined"
    }
    j(Object, {
        extend: j,
        inspect: m,
        toJSON: l,
        toQueryString: c,
        toHTML: f,
        keys: p,
        values: n,
        clone: k,
        isElement: h,
        isArray: g,
        isHash: q,
        isFunction: b,
        isString: a,
        isNumber: o,
        isUndefined: e
    })
})();
Object.extend(Function.prototype, (function() {
    var l = Array.prototype.slice;

    function d(p, m) {
        var o = p.length,
            n = m.length;
        while (n--) {
            p[o + n] = m[n]
        }
        return p
    }

    function j(n, m) {
        n = l.call(n, 0);
        return d(n, m)
    }

    function g() {
        var m = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, "").replace(/\s+/g, "").split(",");
        return m.length == 1 && !m[0] ? [] : m
    }

    function h(o) {
        if (arguments.length < 2 && Object.isUndefined(arguments[0])) {
            return this
        }
        var m = this,
            n = l.call(arguments, 1);
        return function() {
            var p = j(n, arguments);
            return m.apply(o, p)
        }
    }

    function f(o) {
        var m = this,
            n = l.call(arguments, 1);
        return function(q) {
            var p = d([q || window.event], n);
            return m.apply(o, p)
        }
    }

    function k() {
        if (!arguments.length) {
            return this
        }
        var m = this,
            n = l.call(arguments, 0);
        return function() {
            var o = j(n, arguments);
            return m.apply(this, o)
        }
    }

    function e(o) {
        var m = this,
            n = l.call(arguments, 1);
        o = o * 1000;
        return window.setTimeout(function() {
            return m.apply(m, n)
        }, o)
    }

    function a() {
        var m = d([0.01], arguments);
        return this.delay.apply(this, m)
    }

    function c(n) {
        var m = this;
        return function() {
            var o = d([m.bind(this)], arguments);
            return n.apply(this, o)
        }
    }

    function b() {
        if (this._methodized) {
            return this._methodized
        }
        var m = this;
        return this._methodized = function() {
            var n = d([this], arguments);
            return m.apply(null, n)
        }
    }
    return {
        argumentNames: g,
        bind: h,
        bindAsEventListener: f,
        curry: k,
        delay: e,
        defer: a,
        wrap: c,
        methodize: b
    }
})());
Date.prototype.toJSON = function() {
    return '"' + this.getUTCFullYear() + "-" + (this.getUTCMonth() + 1).toPaddedString(2) + "-" + this.getUTCDate().toPaddedString(2) + "T" + this.getUTCHours().toPaddedString(2) + ":" + this.getUTCMinutes().toPaddedString(2) + ":" + this.getUTCSeconds().toPaddedString(2) + 'Z"'
};
RegExp.prototype.match = RegExp.prototype.test;
RegExp.escape = function(a) {
    return String(a).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
};
var PeriodicalExecuter = Class.create({
    initialize: function(b, a) {
        this.callback = b;
        this.frequency = a;
        this.currentlyExecuting = false;
        this.registerCallback()
    },
    registerCallback: function() {
        this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000)
    },
    execute: function() {
        this.callback(this)
    },
    stop: function() {
        if (!this.timer) {
            return
        }
        clearInterval(this.timer);
        this.timer = null
    },
    onTimerEvent: function() {
        if (!this.currentlyExecuting) {
            try {
                this.currentlyExecuting = true;
                this.execute();
                this.currentlyExecuting = false
            } catch (a) {
                this.currentlyExecuting = false;
                throw a
            }
        }
    }
});
Object.extend(String, {
    interpret: function(a) {
        return a == null ? "" : String(a)
    },
    specialChar: {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        "\\": "\\\\"
    }
});
Object.extend(String.prototype, (function() {
    function prepareReplacement(replacement) {
        if (Object.isFunction(replacement)) {
            return replacement
        }
        var template = new Template(replacement);
        return function(match) {
            return template.evaluate(match)
        }
    }

    function gsub(pattern, replacement) {
        var result = "",
            source = this,
            match;
        replacement = prepareReplacement(replacement);
        if (Object.isString(pattern)) {
            pattern = RegExp.escape(pattern)
        }
        if (!(pattern.length || pattern.source)) {
            replacement = replacement("");
            return replacement + source.split("").join(replacement) + replacement
        }
        while (source.length > 0) {
            if (match = source.match(pattern)) {
                result += source.slice(0, match.index);
                result += String.interpret(replacement(match));
                source = source.slice(match.index + match[0].length)
            } else {
                result += source, source = ""
            }
        }
        return result
    }

    function sub(pattern, replacement, count) {
        replacement = prepareReplacement(replacement);
        count = Object.isUndefined(count) ? 1 : count;
        return this.gsub(pattern, function(match) {
            if (--count < 0) {
                return match[0]
            }
            return replacement(match)
        })
    }

    function scan(pattern, iterator) {
        this.gsub(pattern, iterator);
        return String(this)
    }

    function truncate(length, truncation) {
        length = length || 30;
        truncation = Object.isUndefined(truncation) ? "..." : truncation;
        return this.length > length ? this.slice(0, length - truncation.length) + truncation : String(this)
    }

    function strip() {
        return this.replace(/^\s+/, "").replace(/\s+$/, "")
    }

    function stripTags() {
        return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, "")
    }

    function stripScripts() {
        return this.replace(new RegExp(Prototype.ScriptFragment, "img"), "")
    }

    function extractScripts() {
        var matchAll = new RegExp(Prototype.ScriptFragment, "img");
        var matchOne = new RegExp(Prototype.ScriptFragment, "im");
        return (this.match(matchAll) || []).map(function(scriptTag) {
            return (scriptTag.match(matchOne) || ["", ""])[1]
        })
    }

    function evalScripts() {
        return this.extractScripts().map(function(script) {
            return eval(script)
        })
    }

    function escapeHTML() {
        return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }

    function unescapeHTML() {
        return this.stripTags().replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    }

    function toQueryParams(separator) {
        var match = this.strip().match(/([^?#]*)(#.*)?$/);
        if (!match) {
            return {}
        }
        return match[1].split(separator || "&").inject({}, function(hash, pair) {
            if ((pair = pair.split("="))[0]) {
                var key = decodeURIComponent(pair.shift());
                var value = pair.length > 1 ? pair.join("=") : pair[0];
                if (value != undefined) {
                    value = decodeURIComponent(value)
                }
                if (key in hash) {
                    if (!Object.isArray(hash[key])) {
                        hash[key] = [hash[key]]
                    }
                    hash[key].push(value)
                } else {
                    hash[key] = value
                }
            }
            return hash
        })
    }

    function toArray() {
        return this.split("")
    }

    function succ() {
        return this.slice(0, this.length - 1) + String.fromCharCode(this.charCodeAt(this.length - 1) + 1)
    }

    function times(count) {
        return count < 1 ? "" : new Array(count + 1).join(this)
    }

    function camelize() {
        var parts = this.split("-"),
            len = parts.length;
        if (len == 1) {
            return parts[0]
        }
        var camelized = this.charAt(0) == "-" ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1) : parts[0];
        for (var i = 1; i < len; i++) {
            camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1)
        }
        return camelized
    }

    function capitalize() {
        return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase()
    }

    function underscore() {
        return this.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/-/g, "_").toLowerCase()
    }

    function dasherize() {
        return this.replace(/_/g, "-")
    }

    function inspect(useDoubleQuotes) {
        var escapedString = this.replace(/[\x00-\x1f\\]/g, function(character) {
            if (character in String.specialChar) {
                return String.specialChar[character]
            }
            return "\\u00" + character.charCodeAt().toPaddedString(2, 16)
        });
        if (useDoubleQuotes) {
            return '"' + escapedString.replace(/"/g, '\\"') + '"'
        }
        return "'" + escapedString.replace(/'/g, "\\'") + "'"
    }

    function toJSON() {
        return this.inspect(true)
    }

    function unfilterJSON(filter) {
        return this.replace(filter || Prototype.JSONFilter, "$1")
    }

    function isJSON() {
        var str = this;
        if (str.blank()) {
            return false
        }
        str = this.replace(/\\./g, "@").replace(/"[^"\\\n\r]*"/g, "");
        return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str)
    }

    function evalJSON(sanitize) {
        var json = this.unfilterJSON();
        try {
            if (!sanitize || json.isJSON()) {
                return eval("(" + json + ")")
            }
        } catch (e) {}
        throw new SyntaxError("Badly formed JSON string: " + this.inspect())
    }

    function include(pattern) {
        return this.indexOf(pattern) > -1
    }

    function startsWith(pattern) {
        return this.indexOf(pattern) === 0
    }

    function endsWith(pattern) {
        var d = this.length - pattern.length;
        return d >= 0 && this.lastIndexOf(pattern) === d
    }

    function empty() {
        return this == ""
    }

    function blank() {
        return /^\s*$/.test(this)
    }

    function interpolate(object, pattern) {
        return new Template(this, pattern).evaluate(object)
    }
    return {
        gsub: gsub,
        sub: sub,
        scan: scan,
        truncate: truncate,
        strip: String.prototype.trim ? String.prototype.trim : strip,
        stripTags: stripTags,
        stripScripts: stripScripts,
        extractScripts: extractScripts,
        evalScripts: evalScripts,
        escapeHTML: escapeHTML,
        unescapeHTML: unescapeHTML,
        toQueryParams: toQueryParams,
        parseQuery: toQueryParams,
        toArray: toArray,
        succ: succ,
        times: times,
        camelize: camelize,
        capitalize: capitalize,
        underscore: underscore,
        dasherize: dasherize,
        inspect: inspect,
        toJSON: toJSON,
        unfilterJSON: unfilterJSON,
        isJSON: isJSON,
        evalJSON: evalJSON,
        include: include,
        startsWith: startsWith,
        endsWith: endsWith,
        empty: empty,
        blank: blank,
        interpolate: interpolate
    }
})());
var Template = Class.create({
    initialize: function(a, b) {
        this.template = a.toString();
        this.pattern = b || Template.Pattern
    },
    evaluate: function(a) {
        if (a && Object.isFunction(a.toTemplateReplacements)) {
            a = a.toTemplateReplacements()
        }
        return this.template.gsub(this.pattern, function(d) {
            if (a == null) {
                return (d[1] + "")
            }
            var f = d[1] || "";
            if (f == "\\") {
                return d[2]
            }
            var b = a,
                g = d[3];
            var e = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
            d = e.exec(g);
            if (d == null) {
                return f
            }
            while (d != null) {
                var c = d[1].startsWith("[") ? d[2].replace(/\\\\]/g, "]") : d[1];
                b = b[c];
                if (null == b || "" == d[3]) {
                    break
                }
                g = g.substring("[" == d[3] ? d[1].length : d[0].length);
                d = e.exec(g)
            }
            return f + String.interpret(b)
        })
    }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
var $break = {};
var Enumerable = (function() {
    function c(z, y) {
        var x = 0;
        try {
            this._each(function(B) {
                z.call(y, B, x++)
            })
        } catch (A) {
            if (A != $break) {
                throw A
            }
        }
        return this
    }

    function s(A, z, y) {
        var x = -A,
            B = [],
            C = this.toArray();
        if (A < 1) {
            return C
        }
        while ((x += A) < C.length) {
            B.push(C.slice(x, x + A))
        }
        return B.collect(z, y)
    }

    function b(z, y) {
        z = z || Prototype.K;
        var x = true;
        this.each(function(B, A) {
            x = x && !!z.call(y, B, A);
            if (!x) {
                throw $break
            }
        });
        return x
    }

    function j(z, y) {
        z = z || Prototype.K;
        var x = false;
        this.each(function(B, A) {
            if (x = !!z.call(y, B, A)) {
                throw $break
            }
        });
        return x
    }

    function k(z, y) {
        z = z || Prototype.K;
        var x = [];
        this.each(function(B, A) {
            x.push(z.call(y, B, A))
        });
        return x
    }

    function u(z, y) {
        var x;
        this.each(function(B, A) {
            if (z.call(y, B, A)) {
                x = B;
                throw $break
            }
        });
        return x
    }

    function h(z, y) {
        var x = [];
        this.each(function(B, A) {
            if (z.call(y, B, A)) {
                x.push(B)
            }
        });
        return x
    }

    function g(A, z, y) {
        z = z || Prototype.K;
        var x = [];
        if (Object.isString(A)) {
            A = new RegExp(RegExp.escape(A))
        }
        this.each(function(C, B) {
            if (A.match(C)) {
                x.push(z.call(y, C, B))
            }
        });
        return x
    }

    function a(x) {
        if (Object.isFunction(this.indexOf)) {
            if (this.indexOf(x) != -1) {
                return true
            }
        }
        var y = false;
        this.each(function(z) {
            if (z == x) {
                y = true;
                throw $break
            }
        });
        return y
    }

    function r(y, x) {
        x = Object.isUndefined(x) ? null : x;
        return this.eachSlice(y, function(z) {
            while (z.length < y) {
                z.push(x)
            }
            return z
        })
    }

    function m(x, z, y) {
        this.each(function(B, A) {
            x = z.call(y, x, B, A)
        });
        return x
    }

    function w(y) {
        var x = $A(arguments).slice(1);
        return this.map(function(z) {
            return z[y].apply(z, x)
        })
    }

    function q(z, y) {
        z = z || Prototype.K;
        var x;
        this.each(function(B, A) {
            B = z.call(y, B, A);
            if (x == null || B >= x) {
                x = B
            }
        });
        return x
    }

    function o(z, y) {
        z = z || Prototype.K;
        var x;
        this.each(function(B, A) {
            B = z.call(y, B, A);
            if (x == null || B < x) {
                x = B
            }
        });
        return x
    }

    function e(A, y) {
        A = A || Prototype.K;
        var z = [],
            x = [];
        this.each(function(C, B) {
            (A.call(y, C, B) ? z : x).push(C)
        });
        return [z, x]
    }

    function f(y) {
        var x = [];
        this.each(function(z) {
            x.push(z[y])
        });
        return x
    }

    function d(z, y) {
        var x = [];
        this.each(function(B, A) {
            if (!z.call(y, B, A)) {
                x.push(B)
            }
        });
        return x
    }

    function n(y, x) {
        return this.map(function(A, z) {
            return {
                value: A,
                criteria: y.call(x, A, z)
            }
        }).sort(function(C, B) {
            var A = C.criteria,
                z = B.criteria;
            return A < z ? -1 : A > z ? 1 : 0
        }).pluck("value")
    }

    function p() {
        return this.map()
    }

    function t() {
        var y = Prototype.K,
            x = $A(arguments);
        if (Object.isFunction(x.last())) {
            y = x.pop()
        }
        var z = [this].concat(x).map($A);
        return this.map(function(B, A) {
            return y(z.pluck(A))
        })
    }

    function l() {
        return this.toArray().length
    }

    function v() {
        return "#<Enumerable:" + this.toArray().inspect() + ">"
    }
    return {
        each: c,
        eachSlice: s,
        all: b,
        every: b,
        any: j,
        some: j,
        collect: k,
        map: k,
        detect: u,
        findAll: h,
        select: h,
        filter: h,
        grep: g,
        include: a,
        member: a,
        inGroupsOf: r,
        inject: m,
        invoke: w,
        max: q,
        min: o,
        partition: e,
        pluck: f,
        reject: d,
        sortBy: n,
        toArray: p,
        entries: p,
        zip: t,
        size: l,
        inspect: v,
        find: u
    }
})();

function $A(c) {
    if (!c) {
        return []
    }
    if ("toArray" in Object(c)) {
        return c.toArray()
    }
    var b = c.length || 0,
        a = new Array(b);
    while (b--) {
        a[b] = c[b]
    }
    return a
}

function $w(a) {
    if (!Object.isString(a)) {
        return []
    }
    a = a.strip();
    return a ? a.split(/\s+/) : []
}
Array.from = $A;
(function() {
    var t = Array.prototype,
        n = t.slice,
        p = t.forEach;

    function b(x) {
        for (var w = 0, y = this.length; w < y; w++) {
            x(this[w])
        }
    }
    if (!p) {
        p = b
    }

    function m() {
        this.length = 0;
        return this
    }

    function d() {
        return this[0]
    }

    function g() {
        return this[this.length - 1]
    }

    function j() {
        return this.select(function(w) {
            return w != null
        })
    }

    function v() {
        return this.inject([], function(x, w) {
            if (Object.isArray(w)) {
                return x.concat(w.flatten())
            }
            x.push(w);
            return x
        })
    }

    function h() {
        var w = n.call(arguments, 0);
        return this.select(function(x) {
            return !w.include(x)
        })
    }

    function f(w) {
        return (w !== false ? this : this.toArray())._reverse()
    }

    function l(w) {
        return this.inject([], function(z, y, x) {
            if (0 == x || (w ? z.last() != y : !z.include(y))) {
                z.push(y)
            }
            return z
        })
    }

    function q(w) {
        return this.uniq().findAll(function(x) {
            return w.detect(function(y) {
                return x === y
            })
        })
    }

    function r() {
        return n.call(this, 0)
    }

    function k() {
        return this.length
    }

    function u() {
        return "[" + this.map(Object.inspect).join(", ") + "]"
    }

    function s() {
        var w = [];
        this.each(function(x) {
            var y = Object.toJSON(x);
            if (!Object.isUndefined(y)) {
                w.push(y)
            }
        });
        return "[" + w.join(", ") + "]"
    }

    function a(y, w) {
        w || (w = 0);
        var x = this.length;
        if (w < 0) {
            w = x + w
        }
        for (; w < x; w++) {
            if (this[w] === y) {
                return w
            }
        }
        return -1
    }

    function o(x, w) {
        w = isNaN(w) ? this.length : (w < 0 ? this.length + w : w) + 1;
        var y = this.slice(0, w).reverse().indexOf(x);
        return (y < 0) ? y : w - y - 1
    }

    function c() {
        var B = n.call(this, 0),
            z;
        for (var x = 0, y = arguments.length; x < y; x++) {
            z = arguments[x];
            if (Object.isArray(z) && !("callee" in z)) {
                for (var w = 0, A = z.length; w < A; w++) {
                    B.push(z[w])
                }
            } else {
                B.push(z)
            }
        }
        return B
    }
    Object.extend(t, Enumerable);
    if (!t._reverse) {
        t._reverse = t.reverse
    }
    Object.extend(t, {
        _each: p,
        clear: m,
        first: d,
        last: g,
        compact: j,
        flatten: v,
        without: h,
        reverse: f,
        uniq: l,
        intersect: q,
        clone: r,
        toArray: r,
        size: k,
        inspect: u,
        toJSON: s
    });
    var e = (function() {
        return [].concat(arguments)[0][0] !== 1
    })(1, 2);
    if (e) {
        t.concat = c
    }
    if (!t.indexOf) {
        t.indexOf = a
    }
    if (!t.lastIndexOf) {
        t.lastIndexOf = o
    }
})();

function $H(a) {
    return new Hash(a)
}
var Hash = Class.create(Enumerable, (function() {
    function e(r) {
        this._object = Object.isHash(r) ? r.toObject() : Object.clone(r)
    }

    function f(s) {
        for (var r in this._object) {
            var t = this._object[r],
                u = [r, t];
            u.key = r;
            u.value = t;
            s(u)
        }
    }

    function l(r, s) {
        return this._object[r] = s
    }

    function c(r) {
        if (this._object[r] !== Object.prototype[r]) {
            return this._object[r]
        }
    }

    function o(r) {
        var s = this._object[r];
        delete this._object[r];
        return s
    }

    function q() {
        return Object.clone(this._object)
    }

    function p() {
        return this.pluck("key")
    }

    function n() {
        return this.pluck("value")
    }

    function g(s) {
        var r = this.detect(function(t) {
            return t.value === s
        });
        return r && r.key
    }

    function j(r) {
        return this.clone().update(r)
    }

    function d(r) {
        return new Hash(r).inject(this, function(s, t) {
            s.set(t.key, t.value);
            return s
        })
    }

    function b(r, s) {
        if (Object.isUndefined(s)) {
            return r
        }
        return r + "=" + encodeURIComponent(String.interpret(s))
    }

    function a() {
        return this.inject([], function(t, u) {
            var s = encodeURIComponent(u.key),
                r = u.value;
            if (r && typeof r == "object") {
                if (Object.isArray(r)) {
                    return t.concat(r.map(b.curry(s)))
                }
            } else {
                t.push(b(s, r))
            }
            return t
        }).join("&")
    }

    function m() {
        return "#<Hash:{" + this.map(function(r) {
            return r.map(Object.inspect).join(": ")
        }).join(", ") + "}>"
    }

    function k() {
        return Object.toJSON(this.toObject())
    }

    function h() {
        return new Hash(this)
    }
    return {
        initialize: e,
        _each: f,
        set: l,
        get: c,
        unset: o,
        toObject: q,
        toTemplateReplacements: q,
        keys: p,
        values: n,
        index: g,
        merge: j,
        update: d,
        toQueryString: a,
        inspect: m,
        toJSON: k,
        clone: h
    }
})());
Hash.from = $H;
Object.extend(Number.prototype, (function() {
    function d() {
        return this.toPaddedString(2, 16)
    }

    function e() {
        return this + 1
    }

    function a(l, k) {
        $R(0, this, true).each(l, k);
        return this
    }

    function b(m, l) {
        var k = this.toString(l || 10);
        return "0".times(m - k.length) + k
    }

    function f() {
        return isFinite(this) ? this.toString() : "null"
    }

    function j() {
        return Math.abs(this)
    }

    function h() {
        return Math.round(this)
    }

    function g() {
        return Math.ceil(this)
    }

    function c() {
        return Math.floor(this)
    }
    return {
        toColorPart: d,
        succ: e,
        times: a,
        toPaddedString: b,
        toJSON: f,
        abs: j,
        round: h,
        ceil: g,
        floor: c
    }
})());

function $R(c, a, b) {
    return new ObjectRange(c, a, b)
}
var ObjectRange = Class.create(Enumerable, (function() {
    function b(f, d, e) {
        this.start = f;
        this.end = d;
        this.exclusive = e
    }

    function c(d) {
        var e = this.start;
        while (this.include(e)) {
            d(e);
            e = e.succ()
        }
    }

    function a(d) {
        if (d < this.start) {
            return false
        }
        if (this.exclusive) {
            return d < this.end
        }
        return d <= this.end
    }
    return {
        initialize: b,
        _each: c,
        include: a
    }
})());
var Ajax = {
    getTransport: function() {
        return Try.these(function() {
            return new XMLHttpRequest()
        }, function() {
            return new ActiveXObject("Msxml2.XMLHTTP")
        }, function() {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }) || false
    },
    activeRequestCount: 0
};
Ajax.Responders = {
    responders: [],
    _each: function(a) {
        this.responders._each(a)
    },
    register: function(a) {
        if (!this.include(a)) {
            this.responders.push(a)
        }
    },
    unregister: function(a) {
        this.responders = this.responders.without(a)
    },
    dispatch: function(d, b, c, a) {
        this.each(function(f) {
            if (Object.isFunction(f[d])) {
                try {
                    f[d].apply(f, [b, c, a])
                } catch (g) {}
            }
        })
    }
};
Object.extend(Ajax.Responders, Enumerable);
Ajax.Responders.register({
    onCreate: function() {
        Ajax.activeRequestCount++
    },
    onComplete: function() {
        Ajax.activeRequestCount--
    }
});
Ajax.Base = Class.create({
    initialize: function(a) {
        this.options = {
            method: "post",
            asynchronous: true,
            contentType: "application/x-www-form-urlencoded",
            encoding: "UTF-8",
            parameters: "",
            evalJSON: true,
            evalJS: true
        };
        Object.extend(this.options, a || {});
        this.options.method = this.options.method.toLowerCase();
        if (Object.isString(this.options.parameters)) {
            this.options.parameters = this.options.parameters.toQueryParams()
        } else {
            if (Object.isHash(this.options.parameters)) {
                this.options.parameters = this.options.parameters.toObject()
            }
        }
    }
});
Ajax.Request = Class.create(Ajax.Base, {
    _complete: false,
    initialize: function($super, b, a) {
        $super(a);
        this.transport = Ajax.getTransport();
        this.request(b)
    },
    request: function(b) {
        this.url = b;
        this.method = this.options.method;
        var d = Object.clone(this.options.parameters);
        if (!["get", "post"].include(this.method)) {
            d._method = this.method;
            this.method = "post"
        }
        this.parameters = d;
        if (d = Object.toQueryString(d)) {
            if (this.method == "get") {
                this.url += (this.url.include("?") ? "&" : "?") + d
            } else {
                if (/Konqueror|Safari|KHTML/.test(navigator.userAgent)) {
                    d += "&_="
                }
            }
        }
        try {
            var a = new Ajax.Response(this);
            if (this.options.onCreate) {
                this.options.onCreate(a)
            }
            Ajax.Responders.dispatch("onCreate", this, a);
            this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);
            if (this.options.asynchronous) {
                this.respondToReadyState.bind(this).defer(1)
            }
            this.transport.onreadystatechange = this.onStateChange.bind(this);
            this.setRequestHeaders();
            this.body = this.method == "post" ? (this.options.postBody || d) : null;
            this.transport.send(this.body);
            if (!this.options.asynchronous && this.transport.overrideMimeType) {
                this.onStateChange()
            }
        } catch (c) {
            this.dispatchException(c)
        }
    },
    onStateChange: function() {
        var a = this.transport.readyState;
        if (a > 1 && !((a == 4) && this._complete)) {
            this.respondToReadyState(this.transport.readyState)
        }
    },
    setRequestHeaders: function() {
        var e = {
            "X-Requested-With": "XMLHttpRequest",
            "X-Prototype-Version": Prototype.Version,
            Accept: "text/javascript, text/html, application/xml, text/xml, */*"
        };
        if (this.method == "post") {
            e["Content-type"] = this.options.contentType + (this.options.encoding ? "; charset=" + this.options.encoding : "");
            if (this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005) {
                e.Connection = "close"
            }
        }
        if (typeof this.options.requestHeaders == "object") {
            var c = this.options.requestHeaders;
            if (Object.isFunction(c.push)) {
                for (var b = 0, d = c.length; b < d; b += 2) {
                    e[c[b]] = c[b + 1]
                }
            } else {
                $H(c).each(function(f) {
                    e[f.key] = f.value
                })
            }
        }
        for (var a in e) {
            this.transport.setRequestHeader(a, e[a])
        }
    },
    success: function() {
        var a = this.getStatus();
        return !a || (a >= 200 && a < 300)
    },
    getStatus: function() {
        try {
            return this.transport.status || 0
        } catch (a) {
            return 0
        }
    },
    respondToReadyState: function(a) {
        var c = Ajax.Request.Events[a],
            b = new Ajax.Response(this);
        if (c == "Complete") {
            try {
                this._complete = true;
                (this.options["on" + b.status] || this.options["on" + (this.success() ? "Success" : "Failure")] || Prototype.emptyFunction)(b, b.headerJSON)
            } catch (d) {
                this.dispatchException(d)
            }
            var f = b.getHeader("Content-type");
            if (this.options.evalJS == "force" || (this.options.evalJS && this.isSameOrigin() && f && f.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i))) {
                this.evalResponse()
            }
        }
        try {
            (this.options["on" + c] || Prototype.emptyFunction)(b, b.headerJSON);
            Ajax.Responders.dispatch("on" + c, this, b, b.headerJSON)
        } catch (d) {
            this.dispatchException(d)
        }
        if (c == "Complete") {
            this.transport.onreadystatechange = Prototype.emptyFunction
        }
    },
    isSameOrigin: function() {
        var a = this.url.match(/^\s*https?:\/\/[^\/]*/);
        return !a || (a[0] == "#{protocol}//#{domain}#{port}".interpolate({
            protocol: location.protocol,
            domain: document.domain,
            port: location.port ? ":" + location.port : ""
        }))
    },
    getHeader: function(a) {
        try {
            return this.transport.getResponseHeader(a) || null
        } catch (b) {
            return null
        }
    },
    evalResponse: function() {
        try {
            return eval((this.transport.responseText || "").unfilterJSON())
        } catch (e) {
            this.dispatchException(e)
        }
    },
    dispatchException: function(a) {
        (this.options.onException || Prototype.emptyFunction)(this, a);
        Ajax.Responders.dispatch("onException", this, a)
    }
});
Ajax.Request.Events = ["Uninitialized", "Loading", "Loaded", "Interactive", "Complete"];
Ajax.Response = Class.create({
    initialize: function(c) {
        this.request = c;
        var d = this.transport = c.transport,
            a = this.readyState = d.readyState;
        if ((a > 2 && !Prototype.Browser.IE) || a == 4) {
            this.status = this.getStatus();
            this.statusText = this.getStatusText();
            this.responseText = String.interpret(d.responseText);
            this.headerJSON = this._getHeaderJSON()
        }
        if (a == 4) {
            var b = d.responseXML;
            this.responseXML = Object.isUndefined(b) ? null : b;
            this.responseJSON = this._getResponseJSON()
        }
    },
    status: 0,
    statusText: "",
    getStatus: Ajax.Request.prototype.getStatus,
    getStatusText: function() {
        try {
            return this.transport.statusText || ""
        } catch (a) {
            return ""
        }
    },
    getHeader: Ajax.Request.prototype.getHeader,
    getAllHeaders: function() {
        try {
            return this.getAllResponseHeaders()
        } catch (a) {
            return null
        }
    },
    getResponseHeader: function(a) {
        return this.transport.getResponseHeader(a)
    },
    getAllResponseHeaders: function() {
        return this.transport.getAllResponseHeaders()
    },
    _getHeaderJSON: function() {
        var a = this.getHeader("X-JSON");
        if (!a) {
            return null
        }
        a = decodeURIComponent(escape(a));
        try {
            return a.evalJSON(this.request.options.sanitizeJSON || !this.request.isSameOrigin())
        } catch (b) {
            this.request.dispatchException(b)
        }
    },
    _getResponseJSON: function() {
        var a = this.request.options;
        if (!a.evalJSON || (a.evalJSON != "force" && !(this.getHeader("Content-type") || "").include("application/json")) || this.responseText.blank()) {
            return null
        }
        try {
            return this.responseText.evalJSON(a.sanitizeJSON || !this.request.isSameOrigin())
        } catch (b) {
            this.request.dispatchException(b)
        }
    }
});
Ajax.Updater = Class.create(Ajax.Request, {
    initialize: function($super, a, c, b) {
        this.container = {
            success: (a.success || a),
            failure: (a.failure || (a.success ? null : a))
        };
        b = Object.clone(b);
        var d = b.onComplete;
        b.onComplete = (function(e, f) {
            this.updateContent(e.responseText);
            if (Object.isFunction(d)) {
                d(e, f)
            }
        }).bind(this);
        $super(c, b)
    },
    updateContent: function(d) {
        var c = this.container[this.success() ? "success" : "failure"],
            a = this.options;
        if (!a.evalScripts) {
            d = d.stripScripts()
        }
        if (c = $(c)) {
            if (a.insertion) {
                if (Object.isString(a.insertion)) {
                    var b = {};
                    b[a.insertion] = d;
                    c.insert(b)
                } else {
                    a.insertion(c, d)
                }
            } else {
                c.update(d)
            }
        }
    }
});
Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
    initialize: function($super, a, c, b) {
        $super(b);
        this.onComplete = this.options.onComplete;
        this.frequency = (this.options.frequency || 2);
        this.decay = (this.options.decay || 1);
        this.updater = {};
        this.container = a;
        this.url = c;
        this.start()
    },
    start: function() {
        this.options.onComplete = this.updateComplete.bind(this);
        this.onTimerEvent()
    },
    stop: function() {
        this.updater.options.onComplete = undefined;
        clearTimeout(this.timer);
        (this.onComplete || Prototype.emptyFunction).apply(this, arguments)
    },
    updateComplete: function(a) {
        if (this.options.decay) {
            this.decay = (a.responseText == this.lastText ? this.decay * this.options.decay : 1);
            this.lastText = a.responseText
        }
        this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency)
    },
    onTimerEvent: function() {
        this.updater = new Ajax.Updater(this.container, this.url, this.options)
    }
});

function $(b) {
    if (arguments.length > 1) {
        for (var a = 0, d = [], c = arguments.length; a < c; a++) {
            d.push($(arguments[a]))
        }
        return d
    }
    if (Object.isString(b)) {
        b = document.getElementById(b)
    }
    return Element.extend(b)
}
if (Prototype.BrowserFeatures.XPath) {
    document._getElementsByXPath = function(f, a) {
        var c = [];
        var e = document.evaluate(f, $(a) || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var b = 0, d = e.snapshotLength; b < d; b++) {
            c.push(Element.extend(e.snapshotItem(b)))
        }
        return c
    }
}
if (!window.Node) {
    var Node = {}
}
if (!Node.ELEMENT_NODE) {
    Object.extend(Node, {
        ELEMENT_NODE: 1,
        ATTRIBUTE_NODE: 2,
        TEXT_NODE: 3,
        CDATA_SECTION_NODE: 4,
        ENTITY_REFERENCE_NODE: 5,
        ENTITY_NODE: 6,
        PROCESSING_INSTRUCTION_NODE: 7,
        COMMENT_NODE: 8,
        DOCUMENT_NODE: 9,
        DOCUMENT_TYPE_NODE: 10,
        DOCUMENT_FRAGMENT_NODE: 11,
        NOTATION_NODE: 12
    })
}(function(c) {
    var b = (function() {
        var f = document.createElement("form");
        var e = document.createElement("input");
        var d = document.documentElement;
        e.setAttribute("name", "test");
        f.appendChild(e);
        d.appendChild(f);
        var g = f.elements ? (typeof f.elements.test == "undefined") : null;
        d.removeChild(f);
        f = e = null;
        return g
    })();
    var a = c.Element;
    c.Element = function(f, e) {
        e = e || {};
        f = f.toLowerCase();
        var d = Element.cache;
        if (b && e.name) {
            f = "<" + f + ' name="' + e.name + '">';
            delete e.name;
            return Element.writeAttribute(document.createElement(f), e)
        }
        if (!d[f]) {
            d[f] = Element.extend(document.createElement(f))
        }
        return Element.writeAttribute(d[f].cloneNode(false), e)
    };
    Object.extend(c.Element, a || {});
    if (a) {
        c.Element.prototype = a.prototype
    }
})(this);
Element.cache = {};
Element.idCounter = 1;
Element.Methods = {
    visible: function(a) {
        return $(a).style.display != "none"
    },
    toggle: function(a) {
        a = $(a);
        Element[Element.visible(a) ? "hide" : "show"](a);
        return a
    },
    hide: function(a) {
        a = $(a);
        a.style.display = "none";
        return a
    },
    show: function(a) {
        a = $(a);
        a.style.display = "";
        return a
    },
    remove: function(a) {
        a = $(a);
        a.parentNode.removeChild(a);
        return a
    },
    update: (function() {
        var b = (function() {
            var e = document.createElement("select"),
                f = true;
            e.innerHTML = '<option value="test">test</option>';
            if (e.options && e.options[0]) {
                f = e.options[0].nodeName.toUpperCase() !== "OPTION"
            }
            e = null;
            return f
        })();
        var a = (function() {
            try {
                var f = document.createElement("table");
                if (f && f.tBodies) {
                    f.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
                    var h = typeof f.tBodies[0] == "undefined";
                    f = null;
                    return h
                }
            } catch (g) {
                return true
            }
        })();
        var d = (function() {
            var f = document.createElement("script"),
                h = false;
            try {
                f.appendChild(document.createTextNode(""));
                h = !f.firstChild || f.firstChild && f.firstChild.nodeType !== 3
            } catch (g) {
                h = true
            }
            f = null;
            return h
        })();

        function c(f, g) {
            f = $(f);
            if (g && g.toElement) {
                g = g.toElement()
            }
            if (Object.isElement(g)) {
                return f.update().insert(g)
            }
            g = Object.toHTML(g);
            var e = f.tagName.toUpperCase();
            if (e === "SCRIPT" && d) {
                f.text = g;
                return f
            }
            if (b || a) {
                if (e in Element._insertionTranslations.tags) {
                    while (f.firstChild) {
                        f.removeChild(f.firstChild)
                    }
                    Element._getContentFromAnonymousElement(e, g.stripScripts()).each(function(h) {
                        f.appendChild(h)
                    })
                } else {
                    f.innerHTML = g.stripScripts()
                }
            } else {
                f.innerHTML = g.stripScripts()
            }
            g.evalScripts.bind(g).defer();
            return f
        }
        return c
    })(),
    replace: function(b, c) {
        b = $(b);
        if (c && c.toElement) {
            c = c.toElement()
        } else {
            if (!Object.isElement(c)) {
                c = Object.toHTML(c);
                var a = b.ownerDocument.createRange();
                a.selectNode(b);
                c.evalScripts.bind(c).defer();
                c = a.createContextualFragment(c.stripScripts())
            }
        }
        b.parentNode.replaceChild(c, b);
        return b
    },
    insert: function(c, e) {
        c = $(c);
        if (Object.isString(e) || Object.isNumber(e) || Object.isElement(e) || (e && (e.toElement || e.toHTML))) {
            e = {
                bottom: e
            }
        }
        var d, f, b, g;
        for (var a in e) {
            d = e[a];
            a = a.toLowerCase();
            f = Element._insertionTranslations[a];
            if (d && d.toElement) {
                d = d.toElement()
            }
            if (Object.isElement(d)) {
                f(c, d);
                continue
            }
            d = Object.toHTML(d);
            b = ((a == "before" || a == "after") ? c.parentNode : c).tagName.toUpperCase();
            g = Element._getContentFromAnonymousElement(b, d.stripScripts());
            if (a == "top" || a == "after") {
                g.reverse()
            }
            g.each(f.curry(c));
            d.evalScripts.bind(d).defer()
        }
        return c
    },
    wrap: function(b, c, a) {
        b = $(b);
        if (Object.isElement(c)) {
            $(c).writeAttribute(a || {})
        } else {
            if (Object.isString(c)) {
                c = new Element(c, a)
            } else {
                c = new Element("div", c)
            }
        }
        if (b.parentNode) {
            b.parentNode.replaceChild(c, b)
        }
        c.appendChild(b);
        return c
    },
    inspect: function(b) {
        b = $(b);
        var a = "<" + b.tagName.toLowerCase();
        $H({
            id: "id",
            className: "class"
        }).each(function(f) {
            var e = f.first(),
                c = f.last();
            var d = (b[e] || "").toString();
            if (d) {
                a += " " + c + "=" + d.inspect(true)
            }
        });
        return a + ">"
    },
    recursivelyCollect: function(a, c) {
        a = $(a);
        var b = [];
        while (a = a[c]) {
            if (a.nodeType == 1) {
                b.push(Element.extend(a))
            }
        }
        return b
    },
    ancestors: function(a) {
        return Element.recursivelyCollect(a, "parentNode")
    },
    descendants: function(a) {
        return Element.select(a, "*")
    },
    firstDescendant: function(a) {
        a = $(a).firstChild;
        while (a && a.nodeType != 1) {
            a = a.nextSibling
        }
        return $(a)
    },
    immediateDescendants: function(a) {
        if (!(a = $(a).firstChild)) {
            return []
        }
        while (a && a.nodeType != 1) {
            a = a.nextSibling
        }
        if (a) {
            return [a].concat($(a).nextSiblings())
        }
        return []
    },
    previousSiblings: function(a) {
        return Element.recursivelyCollect(a, "previousSibling")
    },
    nextSiblings: function(a) {
        return Element.recursivelyCollect(a, "nextSibling")
    },
    siblings: function(a) {
        a = $(a);
        return Element.previousSiblings(a).reverse().concat(Element.nextSiblings(a))
    },
    match: function(b, a) {
        if (Object.isString(a)) {
            a = new Selector(a)
        }
        return a.match($(b))
    },
    up: function(b, d, a) {
        b = $(b);
        if (arguments.length == 1) {
            return $(b.parentNode)
        }
        var c = Element.ancestors(b);
        return Object.isNumber(d) ? c[d] : Selector.findElement(c, d, a)
    },
    down: function(b, c, a) {
        b = $(b);
        if (arguments.length == 1) {
            return Element.firstDescendant(b)
        }
        return Object.isNumber(c) ? Element.descendants(b)[c] : Element.select(b, c)[a || 0]
    },
    previous: function(b, d, a) {
        b = $(b);
        if (arguments.length == 1) {
            return $(Selector.handlers.previousElementSibling(b))
        }
        var c = Element.previousSiblings(b);
        return Object.isNumber(d) ? c[d] : Selector.findElement(c, d, a)
    },
    next: function(c, d, b) {
        c = $(c);
        if (arguments.length == 1) {
            return $(Selector.handlers.nextElementSibling(c))
        }
        var a = Element.nextSiblings(c);
        return Object.isNumber(d) ? a[d] : Selector.findElement(a, d, b)
    },
    select: function(b) {
        var a = Array.prototype.slice.call(arguments, 1);
        return Selector.findChildElements(b, a)
    },
    adjacent: function(b) {
        var a = Array.prototype.slice.call(arguments, 1);
        return Selector.findChildElements(b.parentNode, a).without(b)
    },
    identify: function(a) {
        a = $(a);
        var b = Element.readAttribute(a, "id");
        if (b) {
            return b
        }
        do {
            b = "anonymous_element_" + Element.idCounter++
        } while ($(b));
        Element.writeAttribute(a, "id", b);
        return b
    },
    readAttribute: function(c, a) {
        c = $(c);
        if (Prototype.Browser.IE) {
            var b = Element._attributeTranslations.read;
            if (b.values[a]) {
                return b.values[a](c, a)
            }
            if (b.names[a]) {
                a = b.names[a]
            }
            if (a.include(":")) {
                return (!c.attributes || !c.attributes[a]) ? null : c.attributes[a].value
            }
        }
        return c.getAttribute(a)
    },
    writeAttribute: function(e, c, f) {
        e = $(e);
        var b = {},
            d = Element._attributeTranslations.write;
        if (typeof c == "object") {
            b = c
        } else {
            b[c] = Object.isUndefined(f) ? true : f
        }
        for (var a in b) {
            c = d.names[a] || a;
            f = b[a];
            if (d.values[a]) {
                c = d.values[a](e, f)
            }
            if (f === false || f === null) {
                e.removeAttribute(c)
            } else {
                if (f === true) {
                    e.setAttribute(c, c)
                } else {
                    e.setAttribute(c, f)
                }
            }
        }
        return e
    },
    getHeight: function(a) {
        return Element.getDimensions(a).height
    },
    getWidth: function(a) {
        return Element.getDimensions(a).width
    },
    classNames: function(a) {
        return new Element.ClassNames(a)
    },
    hasClassName: function(a, b) {
        if (!(a = $(a))) {
            return
        }
        var c = a.className;
        return (c.length > 0 && (c == b || new RegExp("(^|\\s)" + b + "(\\s|$)").test(c)))
    },
    addClassName: function(a, b) {
        if (!(a = $(a))) {
            return
        }
        if (!Element.hasClassName(a, b)) {
            a.className += (a.className ? " " : "") + b
        }
        return a
    },
    removeClassName: function(a, b) {
        if (!(a = $(a))) {
            return
        }
        a.className = a.className.replace(new RegExp("(^|\\s+)" + b + "(\\s+|$)"), " ").strip();
        return a
    },
    toggleClassName: function(a, b) {
        if (!(a = $(a))) {
            return
        }
        return Element[Element.hasClassName(a, b) ? "removeClassName" : "addClassName"](a, b)
    },
    cleanWhitespace: function(b) {
        b = $(b);
        var c = b.firstChild;
        while (c) {
            var a = c.nextSibling;
            if (c.nodeType == 3 && !/\S/.test(c.nodeValue)) {
                b.removeChild(c)
            }
            c = a
        }
        return b
    },
    empty: function(a) {
        return $(a).innerHTML.blank()
    },
    descendantOf: function(b, a) {
        b = $(b), a = $(a);
        if (b.compareDocumentPosition) {
            return (b.compareDocumentPosition(a) & 8) === 8
        }
        if (a.contains) {
            return a.contains(b) && a !== b
        }
        while (b = b.parentNode) {
            if (b == a) {
                return true
            }
        }
        return false
    },
    scrollTo: function(a) {
        a = $(a);
        var b = Element.cumulativeOffset(a);
        window.scrollTo(b[0], b[1]);
        return a
    },
    getStyle: function(b, c) {
        b = $(b);
        c = c == "float" ? "cssFloat" : c.camelize();
        var d = b.style[c];
        if (!d || d == "auto") {
            var a = document.defaultView.getComputedStyle(b, null);
            d = a ? a[c] : null
        }
        if (c == "opacity") {
            return d ? parseFloat(d) : 1
        }
        return d == "auto" ? null : d
    },
    getOpacity: function(a) {
        return $(a).getStyle("opacity")
    },
    setStyle: function(b, c) {
        b = $(b);
        var e = b.style,
            a;
        if (Object.isString(c)) {
            b.style.cssText += ";" + c;
            return c.include("opacity") ? b.setOpacity(c.match(/opacity:\s*(\d?\.?\d*)/)[1]) : b
        }
        for (var d in c) {
            if (d == "opacity") {
                b.setOpacity(c[d])
            } else {
                e[(d == "float" || d == "cssFloat") ? (Object.isUndefined(e.styleFloat) ? "cssFloat" : "styleFloat") : d] = c[d]
            }
        }
        return b
    },
    setOpacity: function(a, b) {
        a = $(a);
        a.style.opacity = (b == 1 || b === "") ? "" : (b < 0.00001) ? 0 : b;
        return a
    },
    getDimensions: function(c) {
        c = $(c);
        var g = Element.getStyle(c, "display");
        if (g != "none" && g != null) {
            return {
                width: c.offsetWidth,
                height: c.offsetHeight
            }
        }
        var b = c.style;
        var f = b.visibility;
        var d = b.position;
        var a = b.display;
        b.visibility = "hidden";
        if (d != "fixed") {
            b.position = "absolute"
        }
        b.display = "block";
        var h = c.clientWidth;
        var e = c.clientHeight;
        b.display = a;
        b.position = d;
        b.visibility = f;
        return {
            width: h,
            height: e
        }
    },
    makePositioned: function(a) {
        a = $(a);
        var b = Element.getStyle(a, "position");
        if (b == "static" || !b) {
            a._madePositioned = true;
            a.style.position = "relative";
            if (Prototype.Browser.Opera) {
                a.style.top = 0;
                a.style.left = 0
            }
        }
        return a
    },
    undoPositioned: function(a) {
        a = $(a);
        if (a._madePositioned) {
            a._madePositioned = undefined;
            a.style.position = a.style.top = a.style.left = a.style.bottom = a.style.right = ""
        }
        return a
    },
    makeClipping: function(a) {
        a = $(a);
        if (a._overflow) {
            return a
        }
        a._overflow = Element.getStyle(a, "overflow") || "auto";
        if (a._overflow !== "hidden") {
            a.style.overflow = "hidden"
        }
        return a
    },
    undoClipping: function(a) {
        a = $(a);
        if (!a._overflow) {
            return a
        }
        a.style.overflow = a._overflow == "auto" ? "" : a._overflow;
        a._overflow = null;
        return a
    },
    cumulativeOffset: function(b) {
        var a = 0,
            c = 0;
        do {
            a += b.offsetTop || 0;
            c += b.offsetLeft || 0;
            b = b.offsetParent
        } while (b);
        return Element._returnOffset(c, a)
    },
    positionedOffset: function(b) {
        var a = 0,
            d = 0;
        do {
            a += b.offsetTop || 0;
            d += b.offsetLeft || 0;
            b = b.offsetParent;
            if (b) {
                if (b.tagName.toUpperCase() == "BODY") {
                    break
                }
                var c = Element.getStyle(b, "position");
                if (c !== "static") {
                    break
                }
            }
        } while (b);
        return Element._returnOffset(d, a)
    },
    absolutize: function(b) {
        b = $(b);
        if (Element.getStyle(b, "position") == "absolute") {
            return b
        }
        var d = Element.positionedOffset(b);
        var f = d[1];
        var e = d[0];
        var c = b.clientWidth;
        var a = b.clientHeight;
        b._originalLeft = e - parseFloat(b.style.left || 0);
        b._originalTop = f - parseFloat(b.style.top || 0);
        b._originalWidth = b.style.width;
        b._originalHeight = b.style.height;
        b.style.position = "absolute";
        b.style.top = f + "px";
        b.style.left = e + "px";
        b.style.width = c + "px";
        b.style.height = a + "px";
        return b
    },
    relativize: function(a) {
        a = $(a);
        if (Element.getStyle(a, "position") == "relative") {
            return a
        }
        a.style.position = "relative";
        var c = parseFloat(a.style.top || 0) - (a._originalTop || 0);
        var b = parseFloat(a.style.left || 0) - (a._originalLeft || 0);
        a.style.top = c + "px";
        a.style.left = b + "px";
        a.style.height = a._originalHeight;
        a.style.width = a._originalWidth;
        return a
    },
    cumulativeScrollOffset: function(b) {
        var a = 0,
            c = 0;
        do {
            a += b.scrollTop || 0;
            c += b.scrollLeft || 0;
            b = b.parentNode
        } while (b);
        return Element._returnOffset(c, a)
    },
    getOffsetParent: function(a) {
        if (a.offsetParent) {
            return $(a.offsetParent)
        }
        if (a == document.body) {
            return $(a)
        }
        while ((a = a.parentNode) && a != document.body) {
            if (Element.getStyle(a, "position") != "static") {
                return $(a)
            }
        }
        return $(document.body)
    },
    viewportOffset: function(d) {
        var a = 0,
            c = 0;
        var b = d;
        do {
            a += b.offsetTop || 0;
            c += b.offsetLeft || 0;
            if (b.offsetParent == document.body && Element.getStyle(b, "position") == "absolute") {
                break
            }
        } while (b = b.offsetParent);
        b = d;
        do {
            if (!Prototype.Browser.Opera || (b.tagName && (b.tagName.toUpperCase() == "BODY"))) {
                a -= b.scrollTop || 0;
                c -= b.scrollLeft || 0
            }
        } while (b = b.parentNode);
        return Element._returnOffset(c, a)
    },
    clonePosition: function(b, d) {
        var a = Object.extend({
            setLeft: true,
            setTop: true,
            setWidth: true,
            setHeight: true,
            offsetTop: 0,
            offsetLeft: 0
        }, arguments[2] || {});
        d = $(d);
        var e = Element.viewportOffset(d);
        b = $(b);
        var f = [0, 0];
        var c = null;
        if (Element.getStyle(b, "position") == "absolute") {
            c = Element.getOffsetParent(b);
            f = Element.viewportOffset(c)
        }
        if (c == document.body) {
            f[0] -= document.body.offsetLeft;
            f[1] -= document.body.offsetTop
        }
        if (a.setLeft) {
            b.style.left = (e[0] - f[0] + a.offsetLeft) + "px"
        }
        if (a.setTop) {
            b.style.top = (e[1] - f[1] + a.offsetTop) + "px"
        }
        if (a.setWidth) {
            b.style.width = d.offsetWidth + "px"
        }
        if (a.setHeight) {
            b.style.height = d.offsetHeight + "px"
        }
        return b
    }
};
Object.extend(Element.Methods, {
    getElementsBySelector: Element.Methods.select,
    childElements: Element.Methods.immediateDescendants
});
Element._attributeTranslations = {
    write: {
        names: {
            className: "class",
            htmlFor: "for"
        },
        values: {}
    }
};
if (Prototype.Browser.Opera) {
    Element.Methods.getStyle = Element.Methods.getStyle.wrap(function(d, b, c) {
        switch (c) {
            case "left":
            case "top":
            case "right":
            case "bottom":
                if (d(b, "position") === "static") {
                    return null
                }
            case "height":
            case "width":
                if (!Element.visible(b)) {
                    return null
                }
                var e = parseInt(d(b, c), 10);
                if (e !== b["offset" + c.capitalize()]) {
                    return e + "px"
                }
                var a;
                if (c === "height") {
                    a = ["border-top-width", "padding-top", "padding-bottom", "border-bottom-width"]
                } else {
                    a = ["border-left-width", "padding-left", "padding-right", "border-right-width"]
                }
                return a.inject(e, function(f, g) {
                    var h = d(b, g);
                    return h === null ? f : f - parseInt(h, 10)
                }) + "px";
            default:
                return d(b, c)
        }
    });
    Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(function(c, a, b) {
        if (b === "title") {
            return a.title
        }
        return c(a, b)
    })
} else {
    if (Prototype.Browser.IE) {
        Element.Methods.getOffsetParent = Element.Methods.getOffsetParent.wrap(function(c, b) {
            b = $(b);
            try {
                b.offsetParent
            } catch (f) {
                return $(document.body)
            }
            var a = b.getStyle("position");
            if (a !== "static") {
                return c(b)
            }
            b.setStyle({
                position: "relative"
            });
            var d = c(b);
            b.setStyle({
                position: a
            });
            return d
        });
        $w("positionedOffset viewportOffset").each(function(a) {
            Element.Methods[a] = Element.Methods[a].wrap(function(f, c) {
                c = $(c);
                try {
                    c.offsetParent
                } catch (h) {
                    return Element._returnOffset(0, 0)
                }
                var b = c.getStyle("position");
                if (b !== "static") {
                    return f(c)
                }
                var d = c.getOffsetParent();
                if (d && d.getStyle("position") === "fixed") {
                    d.setStyle({
                        zoom: 1
                    })
                }
                c.setStyle({
                    position: "relative"
                });
                var g = f(c);
                c.setStyle({
                    position: b
                });
                return g
            })
        });
        Element.Methods.cumulativeOffset = Element.Methods.cumulativeOffset.wrap(function(b, a) {
            try {
                a.offsetParent
            } catch (c) {
                return Element._returnOffset(0, 0)
            }
            return b(a)
        });
        Element.Methods.getStyle = function(a, b) {
            a = $(a);
            b = (b == "float" || b == "cssFloat") ? "styleFloat" : b.camelize();
            var c = a.style[b];
            if (!c && a.currentStyle) {
                c = a.currentStyle[b]
            }
            if (b == "opacity") {
                if (c = (a.getStyle("filter") || "").match(/alpha\(opacity=(.*)\)/)) {
                    if (c[1]) {
                        return parseFloat(c[1]) / 100
                    }
                }
                return 1
            }
            if (c == "auto") {
                if ((b == "width" || b == "height") && (a.getStyle("display") != "none")) {
                    return a["offset" + b.capitalize()] + "px"
                }
                return null
            }
            return c
        };
        Element.Methods.setOpacity = function(b, e) {
            function f(g) {
                return g.replace(/alpha\([^\)]*\)/gi, "")
            }
            b = $(b);
            var a = b.currentStyle;
            if ((a && !a.hasLayout) || (!a && b.style.zoom == "normal")) {
                b.style.zoom = 1
            }
            var d = b.getStyle("filter"),
                c = b.style;
            if (e == 1 || e === "") {
                (d = f(d)) ? c.filter = d: c.removeAttribute("filter");
                return b
            } else {
                if (e < 0.00001) {
                    e = 0
                }
            }
            c.filter = f(d) + "alpha(opacity=" + (e * 100) + ")";
            return b
        };
        Element._attributeTranslations = (function() {
            var b = "className";
            var a = "for";
            var c = document.createElement("div");
            c.setAttribute(b, "x");
            if (c.className !== "x") {
                c.setAttribute("class", "x");
                if (c.className === "x") {
                    b = "class"
                }
            }
            c = null;
            c = document.createElement("label");
            c.setAttribute(a, "x");
            if (c.htmlFor !== "x") {
                c.setAttribute("htmlFor", "x");
                if (c.htmlFor === "x") {
                    a = "htmlFor"
                }
            }
            c = null;
            return {
                read: {
                    names: {
                        "class": b,
                        className: b,
                        "for": a,
                        htmlFor: a
                    },
                    values: {
                        _getAttr: function(d, e) {
                            return d.getAttribute(e)
                        },
                        _getAttr2: function(d, e) {
                            return d.getAttribute(e, 2)
                        },
                        _getAttrNode: function(d, f) {
                            var e = d.getAttributeNode(f);
                            return e ? e.value : ""
                        },
                        _getEv: (function() {
                            var d = document.createElement("div");
                            d.onclick = Prototype.emptyFunction;
                            var g = d.getAttribute("onclick");
                            var e;
                            if (String(g).indexOf("{") > -1) {
                                e = function(f, h) {
                                    h = f.getAttribute(h);
                                    if (!h) {
                                        return null
                                    }
                                    h = h.toString();
                                    h = h.split("{")[1];
                                    h = h.split("}")[0];
                                    return h.strip()
                                }
                            } else {
                                if (g === "") {
                                    e = function(f, h) {
                                        h = f.getAttribute(h);
                                        if (!h) {
                                            return null
                                        }
                                        return h.strip()
                                    }
                                }
                            }
                            d = null;
                            return e
                        })(),
                        _flag: function(d, e) {
                            return $(d).hasAttribute(e) ? e : null
                        },
                        style: function(d) {
                            return d.style.cssText.toLowerCase()
                        },
                        title: function(d) {
                            return d.title
                        }
                    }
                }
            }
        })();
        Element._attributeTranslations.write = {
            names: Object.extend({
                cellpadding: "cellPadding",
                cellspacing: "cellSpacing"
            }, Element._attributeTranslations.read.names),
            values: {
                checked: function(a, b) {
                    a.checked = !!b
                },
                style: function(a, b) {
                    a.style.cssText = b ? b : ""
                }
            }
        };
        Element._attributeTranslations.has = {};
        $w("colSpan rowSpan vAlign dateTime accessKey tabIndex encType maxLength readOnly longDesc frameBorder").each(function(a) {
            Element._attributeTranslations.write.names[a.toLowerCase()] = a;
            Element._attributeTranslations.has[a.toLowerCase()] = a
        });
        (function(a) {
            Object.extend(a, {
                href: a._getAttr2,
                src: a._getAttr2,
                type: a._getAttr,
                action: a._getAttrNode,
                disabled: a._flag,
                checked: a._flag,
                readonly: a._flag,
                multiple: a._flag,
                onload: a._getEv,
                onunload: a._getEv,
                onclick: a._getEv,
                ondblclick: a._getEv,
                onmousedown: a._getEv,
                onmouseup: a._getEv,
                onmouseover: a._getEv,
                onmousemove: a._getEv,
                onmouseout: a._getEv,
                onfocus: a._getEv,
                onblur: a._getEv,
                onkeypress: a._getEv,
                onkeydown: a._getEv,
                onkeyup: a._getEv,
                onsubmit: a._getEv,
                onreset: a._getEv,
                onselect: a._getEv,
                onchange: a._getEv
            })
        })(Element._attributeTranslations.read.values);
        if (Prototype.BrowserFeatures.ElementExtensions) {
            (function() {
                function a(e) {
                    var b = e.getElementsByTagName("*"),
                        d = [];
                    for (var c = 0, f; f = b[c]; c++) {
                        if (f.tagName !== "!") {
                            d.push(f)
                        }
                    }
                    return d
                }
                Element.Methods.down = function(c, d, b) {
                    c = $(c);
                    if (arguments.length == 1) {
                        return c.firstDescendant()
                    }
                    return Object.isNumber(d) ? a(c)[d] : Element.select(c, d)[b || 0]
                }
            })()
        }
    } else {
        if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
            Element.Methods.setOpacity = function(a, b) {
                a = $(a);
                a.style.opacity = (b == 1) ? 0.999999 : (b === "") ? "" : (b < 0.00001) ? 0 : b;
                return a
            }
        } else {
            if (Prototype.Browser.WebKit) {
                Element.Methods.setOpacity = function(a, b) {
                    a = $(a);
                    a.style.opacity = (b == 1 || b === "") ? "" : (b < 0.00001) ? 0 : b;
                    if (b == 1) {
                        if (a.tagName.toUpperCase() == "IMG" && a.width) {
                            a.width++;
                            a.width--
                        } else {
                            try {
                                var d = document.createTextNode(" ");
                                a.appendChild(d);
                                a.removeChild(d)
                            } catch (c) {}
                        }
                    }
                    return a
                };
                Element.Methods.cumulativeOffset = function(b) {
                    var a = 0,
                        c = 0;
                    do {
                        a += b.offsetTop || 0;
                        c += b.offsetLeft || 0;
                        if (b.offsetParent == document.body) {
                            if (Element.getStyle(b, "position") == "absolute") {
                                break
                            }
                        }
                        b = b.offsetParent
                    } while (b);
                    return Element._returnOffset(c, a)
                }
            }
        }
    }
}
if ("outerHTML" in document.documentElement) {
    Element.Methods.replace = function(c, e) {
        c = $(c);
        if (e && e.toElement) {
            e = e.toElement()
        }
        if (Object.isElement(e)) {
            c.parentNode.replaceChild(e, c);
            return c
        }
        e = Object.toHTML(e);
        var d = c.parentNode,
            b = d.tagName.toUpperCase();
        if (Element._insertionTranslations.tags[b]) {
            var f = c.next();
            var a = Element._getContentFromAnonymousElement(b, e.stripScripts());
            d.removeChild(c);
            if (f) {
                a.each(function(g) {
                    d.insertBefore(g, f)
                })
            } else {
                a.each(function(g) {
                    d.appendChild(g)
                })
            }
        } else {
            c.outerHTML = e.stripScripts()
        }
        e.evalScripts.bind(e).defer();
        return c
    }
}
Element._returnOffset = function(b, c) {
    var a = [b, c];
    a.left = b;
    a.top = c;
    return a
};
Element._getContentFromAnonymousElement = function(c, b) {
    var d = new Element("div"),
        a = Element._insertionTranslations.tags[c];
    if (a) {
        d.innerHTML = a[0] + b + a[1];
        a[2].times(function() {
            d = d.firstChild
        })
    } else {
        d.innerHTML = b
    }
    return $A(d.childNodes)
};
Element._insertionTranslations = {
    before: function(a, b) {
        a.parentNode.insertBefore(b, a)
    },
    top: function(a, b) {
        a.insertBefore(b, a.firstChild)
    },
    bottom: function(a, b) {
        a.appendChild(b)
    },
    after: function(a, b) {
        a.parentNode.insertBefore(b, a.nextSibling)
    },
    tags: {
        TABLE: ["<table>", "</table>", 1],
        TBODY: ["<table><tbody>", "</tbody></table>", 2],
        TR: ["<table><tbody><tr>", "</tr></tbody></table>", 3],
        TD: ["<table><tbody><tr><td>", "</td></tr></tbody></table>", 4],
        SELECT: ["<select>", "</select>", 1]
    }
};
(function() {
    var a = Element._insertionTranslations.tags;
    Object.extend(a, {
        THEAD: a.TBODY,
        TFOOT: a.TBODY,
        TH: a.TD
    })
})();
Element.Methods.Simulated = {
    hasAttribute: function(a, c) {
        c = Element._attributeTranslations.has[c] || c;
        var b = $(a).getAttributeNode(c);
        return !!(b && b.specified)
    }
};
Element.Methods.ByTag = {};
Object.extend(Element, Element.Methods);
(function(a) {
    if (!Prototype.BrowserFeatures.ElementExtensions && a.__proto__) {
        window.HTMLElement = {};
        window.HTMLElement.prototype = a.__proto__;
        Prototype.BrowserFeatures.ElementExtensions = true
    }
    a = null
})(document.createElement("div"));
Element.extend = (function() {
    function c(g) {
        if (typeof window.Element != "undefined") {
            var j = window.Element.prototype;
            if (j) {
                var l = "_" + (Math.random() + "").slice(2);
                var h = document.createElement(g);
                j[l] = "x";
                var k = (h[l] !== "x");
                delete j[l];
                h = null;
                return k
            }
        }
        return false
    }

    function b(h, g) {
        for (var k in g) {
            var j = g[k];
            if (Object.isFunction(j) && !(k in h)) {
                h[k] = j.methodize()
            }
        }
    }
    var d = c("object");
    if (Prototype.BrowserFeatures.SpecificElementExtensions) {
        if (d) {
            return function(h) {
                if (h && typeof h._extendedByPrototype == "undefined") {
                    var g = h.tagName;
                    if (g && (/^(?:object|applet|embed)$/i.test(g))) {
                        b(h, Element.Methods);
                        b(h, Element.Methods.Simulated);
                        b(h, Element.Methods.ByTag[g.toUpperCase()])
                    }
                }
                return h
            }
        }
        return Prototype.K
    }
    var a = {},
        e = Element.Methods.ByTag;
    var f = Object.extend(function(j) {
        if (!j || typeof j._extendedByPrototype != "undefined" || j.nodeType != 1 || j == window) {
            return j
        }
        var g = Object.clone(a),
            h = j.tagName.toUpperCase();
        if (e[h]) {
            Object.extend(g, e[h])
        }
        b(j, g);
        j._extendedByPrototype = Prototype.emptyFunction;
        return j
    }, {
        refresh: function() {
            if (!Prototype.BrowserFeatures.ElementExtensions) {
                Object.extend(a, Element.Methods);
                Object.extend(a, Element.Methods.Simulated)
            }
        }
    });
    f.refresh();
    return f
})();
Element.hasAttribute = function(a, b) {
    if (a.hasAttribute) {
        return a.hasAttribute(b)
    }
    return Element.Methods.Simulated.hasAttribute(a, b)
};
Element.addMethods = function(c) {
    var j = Prototype.BrowserFeatures,
        d = Element.Methods.ByTag;
    if (!c) {
        Object.extend(Form, Form.Methods);
        Object.extend(Form.Element, Form.Element.Methods);
        Object.extend(Element.Methods.ByTag, {
            FORM: Object.clone(Form.Methods),
            INPUT: Object.clone(Form.Element.Methods),
            SELECT: Object.clone(Form.Element.Methods),
            TEXTAREA: Object.clone(Form.Element.Methods)
        })
    }
    if (arguments.length == 2) {
        var b = c;
        c = arguments[1]
    }
    if (!b) {
        Object.extend(Element.Methods, c || {})
    } else {
        if (Object.isArray(b)) {
            b.each(g)
        } else {
            g(b)
        }
    }

    function g(l) {
        l = l.toUpperCase();
        if (!Element.Methods.ByTag[l]) {
            Element.Methods.ByTag[l] = {}
        }
        Object.extend(Element.Methods.ByTag[l], c)
    }

    function a(n, m, l) {
        l = l || false;
        for (var p in n) {
            var o = n[p];
            if (!Object.isFunction(o)) {
                continue
            }
            if (!l || !(p in m)) {
                m[p] = o.methodize()
            }
        }
    }

    function e(o) {
        var l;
        var n = {
            OPTGROUP: "OptGroup",
            TEXTAREA: "TextArea",
            P: "Paragraph",
            FIELDSET: "FieldSet",
            UL: "UList",
            OL: "OList",
            DL: "DList",
            DIR: "Directory",
            H1: "Heading",
            H2: "Heading",
            H3: "Heading",
            H4: "Heading",
            H5: "Heading",
            H6: "Heading",
            Q: "Quote",
            INS: "Mod",
            DEL: "Mod",
            A: "Anchor",
            IMG: "Image",
            CAPTION: "TableCaption",
            COL: "TableCol",
            COLGROUP: "TableCol",
            THEAD: "TableSection",
            TFOOT: "TableSection",
            TBODY: "TableSection",
            TR: "TableRow",
            TH: "TableCell",
            TD: "TableCell",
            FRAMESET: "FrameSet",
            IFRAME: "IFrame"
        };
        if (n[o]) {
            l = "HTML" + n[o] + "Element"
        }
        if (window[l]) {
            return window[l]
        }
        l = "HTML" + o + "Element";
        if (window[l]) {
            return window[l]
        }
        l = "HTML" + o.capitalize() + "Element";
        if (window[l]) {
            return window[l]
        }
        var m = document.createElement(o);
        var p = m.__proto__ || m.constructor.prototype;
        m = null;
        return p
    }
    var h = window.HTMLElement ? HTMLElement.prototype : Element.prototype;
    if (j.ElementExtensions) {
        a(Element.Methods, h);
        a(Element.Methods.Simulated, h, true)
    }
    if (j.SpecificElementExtensions) {
        for (var k in Element.Methods.ByTag) {
            var f = e(k);
            if (Object.isUndefined(f)) {
                continue
            }
            a(d[k], f.prototype)
        }
    }
    Object.extend(Element, Element.Methods);
    delete Element.ByTag;
    if (Element.extend.refresh) {
        Element.extend.refresh()
    }
    Element.cache = {}
};
document.viewport = {
    getDimensions: function() {
        return {
            width: this.getWidth(),
            height: this.getHeight()
        }
    },
    getScrollOffsets: function() {
        return Element._returnOffset(window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)
    }
};
(function(b) {
    var g = Prototype.Browser,
        e = document,
        c, d = {};

    function a() {
        if (g.WebKit && !e.evaluate) {
            return document
        }
        if (g.Opera && window.parseFloat(window.opera.version()) < 9.5) {
            return document.body
        }
        return document.documentElement
    }

    function f(h) {
        if (!c) {
            c = a()
        }
        d[h] = "client" + h;
        b["get" + h] = function() {
            return c[d[h]]
        };
        return b["get" + h]()
    }
    b.getWidth = f.curry("Width");
    b.getHeight = f.curry("Height")
})(document.viewport);
Element.Storage = {
    UID: 1
};
Element.addMethods({
    getStorage: function(b) {
        if (!(b = $(b))) {
            return
        }
        var a;
        if (b === window) {
            a = 0
        } else {
            if (typeof b._prototypeUID === "undefined") {
                b._prototypeUID = [Element.Storage.UID++]
            }
            a = b._prototypeUID[0]
        }
        if (!Element.Storage[a]) {
            Element.Storage[a] = $H()
        }
        return Element.Storage[a]
    },
    store: function(b, a, c) {
        if (!(b = $(b))) {
            return
        }
        if (arguments.length === 2) {
            Element.getStorage(b).update(a)
        } else {
            Element.getStorage(b).set(a, c)
        }
        return b
    },
    retrieve: function(c, b, a) {
        if (!(c = $(c))) {
            return
        }
        var e = Element.getStorage(c),
            d = e.get(b);
        if (Object.isUndefined(d)) {
            e.set(b, a);
            d = a
        }
        return d
    },
    clone: function(c, a) {
        if (!(c = $(c))) {
            return
        }
        var e = c.cloneNode(a);
        e._prototypeUID = void 0;
        if (a) {
            var d = Element.select(e, "*"),
                b = d.length;
            while (b--) {
                d[b]._prototypeUID = void 0
            }
        }
        return Element.extend(e)
    }
});
var Selector = Class.create({
    initialize: function(a) {
        this.expression = a.strip();
        if (this.shouldUseSelectorsAPI()) {
            this.mode = "selectorsAPI"
        } else {
            if (this.shouldUseXPath()) {
                this.mode = "xpath";
                this.compileXPathMatcher()
            } else {
                this.mode = "normal";
                this.compileMatcher()
            }
        }
    },
    shouldUseXPath: (function() {
        var a = (function() {
            var e = false;
            if (document.evaluate && window.XPathResult) {
                var d = document.createElement("div");
                d.innerHTML = "<ul><li></li></ul><div><ul><li></li></ul></div>";
                var c = ".//*[local-name()='ul' or local-name()='UL']//*[local-name()='li' or local-name()='LI']";
                var b = document.evaluate(c, d, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                e = (b.snapshotLength !== 2);
                d = null
            }
            return e
        })();
        return function() {
            if (!Prototype.BrowserFeatures.XPath) {
                return false
            }
            var b = this.expression;
            if (Prototype.Browser.WebKit && (b.include("-of-type") || b.include(":empty"))) {
                return false
            }
            if ((/(\[[\w-]*?:|:checked)/).test(b)) {
                return false
            }
            if (a) {
                return false
            }
            return true
        }
    })(),
    shouldUseSelectorsAPI: function() {
        if (!Prototype.BrowserFeatures.SelectorsAPI) {
            return false
        }
        if (Selector.CASE_INSENSITIVE_CLASS_NAMES) {
            return false
        }
        if (!Selector._div) {
            Selector._div = new Element("div")
        }
        try {
            Selector._div.querySelector(this.expression)
        } catch (a) {
            return false
        }
        return true
    },
    compileMatcher: function() {
        var e = this.expression,
            ps = Selector.patterns,
            h = Selector.handlers,
            c = Selector.criteria,
            le, p, m, len = ps.length,
            name;
        if (Selector._cache[e]) {
            this.matcher = Selector._cache[e];
            return
        }
        this.matcher = ["this.matcher = function(root) {", "var r = root, h = Selector.handlers, c = false, n;"];
        while (e && le != e && (/\S/).test(e)) {
            le = e;
            for (var i = 0; i < len; i++) {
                p = ps[i].re;
                name = ps[i].name;
                if (m = e.match(p)) {
                    this.matcher.push(Object.isFunction(c[name]) ? c[name](m) : new Template(c[name]).evaluate(m));
                    e = e.replace(m[0], "");
                    break
                }
            }
        }
        this.matcher.push("return h.unique(n);\n}");
        eval(this.matcher.join("\n"));
        Selector._cache[this.expression] = this.matcher
    },
    compileXPathMatcher: function() {
        var h = this.expression,
            j = Selector.patterns,
            c = Selector.xpath,
            g, b, a = j.length,
            d;
        if (Selector._cache[h]) {
            this.xpath = Selector._cache[h];
            return
        }
        this.matcher = [".//*"];
        while (h && g != h && (/\S/).test(h)) {
            g = h;
            for (var f = 0; f < a; f++) {
                d = j[f].name;
                if (b = h.match(j[f].re)) {
                    this.matcher.push(Object.isFunction(c[d]) ? c[d](b) : new Template(c[d]).evaluate(b));
                    h = h.replace(b[0], "");
                    break
                }
            }
        }
        this.xpath = this.matcher.join("");
        Selector._cache[this.expression] = this.xpath
    },
    findElements: function(a) {
        a = a || document;
        var c = this.expression,
            b;
        switch (this.mode) {
            case "selectorsAPI":
                if (a !== document) {
                    var d = a.id,
                        f = $(a).identify();
                    f = f.replace(/([\.:])/g, "\\$1");
                    c = "#" + f + " " + c
                }
                b = $A(a.querySelectorAll(c)).map(Element.extend);
                a.id = d;
                return b;
            case "xpath":
                return document._getElementsByXPath(this.xpath, a);
            default:
                return this.matcher(a)
        }
    },
    match: function(k) {
        this.tokens = [];
        var q = this.expression,
            a = Selector.patterns,
            f = Selector.assertions;
        var b, d, g, o = a.length,
            c;
        while (q && b !== q && (/\S/).test(q)) {
            b = q;
            for (var j = 0; j < o; j++) {
                d = a[j].re;
                c = a[j].name;
                if (g = q.match(d)) {
                    if (f[c]) {
                        this.tokens.push([c, Object.clone(g)]);
                        q = q.replace(g[0], "")
                    } else {
                        return this.findElements(document).include(k)
                    }
                }
            }
        }
        var n = true,
            c, l;
        for (var j = 0, h; h = this.tokens[j]; j++) {
            c = h[0], l = h[1];
            if (!Selector.assertions[c](k, l)) {
                n = false;
                break
            }
        }
        return n
    },
    toString: function() {
        return this.expression
    },
    inspect: function() {
        return "#<Selector:" + this.expression.inspect() + ">"
    }
});
if (Prototype.BrowserFeatures.SelectorsAPI && document.compatMode === "BackCompat") {
    Selector.CASE_INSENSITIVE_CLASS_NAMES = (function() {
        var c = document.createElement("div"),
            a = document.createElement("span");
        c.id = "prototype_test_id";
        a.className = "Test";
        c.appendChild(a);
        var b = (c.querySelector("#prototype_test_id .test") !== null);
        c = a = null;
        return b
    })()
}
Object.extend(Selector, {
    _cache: {},
    xpath: {
        descendant: "//*",
        child: "/*",
        adjacent: "/following-sibling::*[1]",
        laterSibling: "/following-sibling::*",
        tagName: function(a) {
            if (a[1] == "*") {
                return ""
            }
            return "[local-name()='" + a[1].toLowerCase() + "' or local-name()='" + a[1].toUpperCase() + "']"
        },
        className: "[contains(concat(' ', @class, ' '), ' #{1} ')]",
        id: "[@id='#{1}']",
        attrPresence: function(a) {
            a[1] = a[1].toLowerCase();
            return new Template("[@#{1}]").evaluate(a)
        },
        attr: function(a) {
            a[1] = a[1].toLowerCase();
            a[3] = a[5] || a[6];
            return new Template(Selector.xpath.operators[a[2]]).evaluate(a)
        },
        pseudo: function(a) {
            var b = Selector.xpath.pseudos[a[1]];
            if (!b) {
                return ""
            }
            if (Object.isFunction(b)) {
                return b(a)
            }
            return new Template(Selector.xpath.pseudos[a[1]]).evaluate(a)
        },
        operators: {
            "=": "[@#{1}='#{3}']",
            "!=": "[@#{1}!='#{3}']",
            "^=": "[starts-with(@#{1}, '#{3}')]",
            "$=": "[substring(@#{1}, (string-length(@#{1}) - string-length('#{3}') + 1))='#{3}']",
            "*=": "[contains(@#{1}, '#{3}')]",
            "~=": "[contains(concat(' ', @#{1}, ' '), ' #{3} ')]",
            "|=": "[contains(concat('-', @#{1}, '-'), '-#{3}-')]"
        },
        pseudos: {
            "first-child": "[not(preceding-sibling::*)]",
            "last-child": "[not(following-sibling::*)]",
            "only-child": "[not(preceding-sibling::* or following-sibling::*)]",
            empty: "[count(*) = 0 and (count(text()) = 0)]",
            checked: "[@checked]",
            disabled: "[(@disabled) and (@type!='hidden')]",
            enabled: "[not(@disabled) and (@type!='hidden')]",
            not: function(f) {
                var j = f[6],
                    c = Selector.patterns,
                    k = Selector.xpath,
                    a, l, h = c.length,
                    b;
                var d = [];
                while (j && a != j && (/\S/).test(j)) {
                    a = j;
                    for (var g = 0; g < h; g++) {
                        b = c[g].name;
                        if (f = j.match(c[g].re)) {
                            l = Object.isFunction(k[b]) ? k[b](f) : new Template(k[b]).evaluate(f);
                            d.push("(" + l.substring(1, l.length - 1) + ")");
                            j = j.replace(f[0], "");
                            break
                        }
                    }
                }
                return "[not(" + d.join(" and ") + ")]"
            },
            "nth-child": function(a) {
                return Selector.xpath.pseudos.nth("(count(./preceding-sibling::*) + 1) ", a)
            },
            "nth-last-child": function(a) {
                return Selector.xpath.pseudos.nth("(count(./following-sibling::*) + 1) ", a)
            },
            "nth-of-type": function(a) {
                return Selector.xpath.pseudos.nth("position() ", a)
            },
            "nth-last-of-type": function(a) {
                return Selector.xpath.pseudos.nth("(last() + 1 - position()) ", a)
            },
            "first-of-type": function(a) {
                a[6] = "1";
                return Selector.xpath.pseudos["nth-of-type"](a)
            },
            "last-of-type": function(a) {
                a[6] = "1";
                return Selector.xpath.pseudos["nth-last-of-type"](a)
            },
            "only-of-type": function(a) {
                var b = Selector.xpath.pseudos;
                return b["first-of-type"](a) + b["last-of-type"](a)
            },
            nth: function(g, e) {
                var h, j = e[6],
                    d;
                if (j == "even") {
                    j = "2n+0"
                }
                if (j == "odd") {
                    j = "2n+1"
                }
                if (h = j.match(/^(\d+)$/)) {
                    return "[" + g + "= " + h[1] + "]"
                }
                if (h = j.match(/^(-?\d*)?n(([+-])(\d+))?/)) {
                    if (h[1] == "-") {
                        h[1] = -1
                    }
                    var f = h[1] ? Number(h[1]) : 1;
                    var c = h[2] ? Number(h[2]) : 0;
                    d = "[((#{fragment} - #{b}) mod #{a} = 0) and ((#{fragment} - #{b}) div #{a} >= 0)]";
                    return new Template(d).evaluate({
                        fragment: g,
                        a: f,
                        b: c
                    })
                }
            }
        }
    },
    criteria: {
        tagName: 'n = h.tagName(n, r, "#{1}", c);      c = false;',
        className: 'n = h.className(n, r, "#{1}", c);    c = false;',
        id: 'n = h.id(n, r, "#{1}", c);           c = false;',
        attrPresence: 'n = h.attrPresence(n, r, "#{1}", c); c = false;',
        attr: function(a) {
            a[3] = (a[5] || a[6]);
            return new Template('n = h.attr(n, r, "#{1}", "#{3}", "#{2}", c); c = false;').evaluate(a)
        },
        pseudo: function(a) {
            if (a[6]) {
                a[6] = a[6].replace(/"/g, '\\"')
            }
            return new Template('n = h.pseudo(n, "#{1}", "#{6}", r, c); c = false;').evaluate(a)
        },
        descendant: 'c = "descendant";',
        child: 'c = "child";',
        adjacent: 'c = "adjacent";',
        laterSibling: 'c = "laterSibling";'
    },
    patterns: [{
        name: "laterSibling",
        re: /^\s*~\s*/
    }, {
        name: "child",
        re: /^\s*>\s*/
    }, {
        name: "adjacent",
        re: /^\s*\+\s*/
    }, {
        name: "descendant",
        re: /^\s/
    }, {
        name: "tagName",
        re: /^\s*(\*|[\w\-]+)(\b|$)?/
    }, {
        name: "id",
        re: /^#([\w\-\*]+)(\b|$)/
    }, {
        name: "className",
        re: /^\.([\w\-\*]+)(\b|$)/
    }, {
        name: "pseudo",
        re: /^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|(?=\s|[:+~>]))/
    }, {
        name: "attrPresence",
        re: /^\[((?:[\w-]+:)?[\w-]+)\]/
    }, {
        name: "attr",
        re: /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/
    }],
    assertions: {
        tagName: function(a, b) {
            return b[1].toUpperCase() == a.tagName.toUpperCase()
        },
        className: function(a, b) {
            return Element.hasClassName(a, b[1])
        },
        id: function(a, b) {
            return a.id === b[1]
        },
        attrPresence: function(a, b) {
            return Element.hasAttribute(a, b[1])
        },
        attr: function(b, c) {
            var a = Element.readAttribute(b, c[1]);
            return a && Selector.operators[c[2]](a, c[5] || c[6])
        }
    },
    handlers: {
        concat: function(d, c) {
            for (var e = 0, f; f = c[e]; e++) {
                d.push(f)
            }
            return d
        },
        mark: function(a) {
            var d = Prototype.emptyFunction;
            for (var b = 0, c; c = a[b]; b++) {
                c._countedByPrototype = d
            }
            return a
        },
        unmark: (function() {
            var a = (function() {
                var b = document.createElement("div"),
                    e = false,
                    d = "_countedByPrototype",
                    c = "x";
                b[d] = c;
                e = (b.getAttribute(d) === c);
                b = null;
                return e
            })();
            return a ? function(b) {
                for (var c = 0, d; d = b[c]; c++) {
                    d.removeAttribute("_countedByPrototype")
                }
                return b
            } : function(b) {
                for (var c = 0, d; d = b[c]; c++) {
                    d._countedByPrototype = void 0
                }
                return b
            }
        })(),
        index: function(a, d, g) {
            a._countedByPrototype = Prototype.emptyFunction;
            if (d) {
                for (var b = a.childNodes, e = b.length - 1, c = 1; e >= 0; e--) {
                    var f = b[e];
                    if (f.nodeType == 1 && (!g || f._countedByPrototype)) {
                        f.nodeIndex = c++
                    }
                }
            } else {
                for (var e = 0, c = 1, b = a.childNodes; f = b[e]; e++) {
                    if (f.nodeType == 1 && (!g || f._countedByPrototype)) {
                        f.nodeIndex = c++
                    }
                }
            }
        },
        unique: function(b) {
            if (b.length == 0) {
                return b
            }
            var d = [],
                e;
            for (var c = 0, a = b.length; c < a; c++) {
                if (typeof(e = b[c])._countedByPrototype == "undefined") {
                    e._countedByPrototype = Prototype.emptyFunction;
                    d.push(Element.extend(e))
                }
            }
            return Selector.handlers.unmark(d)
        },
        descendant: function(a) {
            var d = Selector.handlers;
            for (var c = 0, b = [], e; e = a[c]; c++) {
                d.concat(b, e.getElementsByTagName("*"))
            }
            return b
        },
        child: function(a) {
            var e = Selector.handlers;
            for (var d = 0, c = [], f; f = a[d]; d++) {
                for (var b = 0, g; g = f.childNodes[b]; b++) {
                    if (g.nodeType == 1 && g.tagName != "!") {
                        c.push(g)
                    }
                }
            }
            return c
        },
        adjacent: function(a) {
            for (var c = 0, b = [], e; e = a[c]; c++) {
                var d = this.nextElementSibling(e);
                if (d) {
                    b.push(d)
                }
            }
            return b
        },
        laterSibling: function(a) {
            var d = Selector.handlers;
            for (var c = 0, b = [], e; e = a[c]; c++) {
                d.concat(b, Element.nextSiblings(e))
            }
            return b
        },
        nextElementSibling: function(a) {
            while (a = a.nextSibling) {
                if (a.nodeType == 1) {
                    return a
                }
            }
            return null
        },
        previousElementSibling: function(a) {
            while (a = a.previousSibling) {
                if (a.nodeType == 1) {
                    return a
                }
            }
            return null
        },
        tagName: function(a, j, c, b) {
            var k = c.toUpperCase();
            var e = [],
                g = Selector.handlers;
            if (a) {
                if (b) {
                    if (b == "descendant") {
                        for (var f = 0, d; d = a[f]; f++) {
                            g.concat(e, d.getElementsByTagName(c))
                        }
                        return e
                    } else {
                        a = this[b](a)
                    }
                    if (c == "*") {
                        return a
                    }
                }
                for (var f = 0, d; d = a[f]; f++) {
                    if (d.tagName.toUpperCase() === k) {
                        e.push(d)
                    }
                }
                return e
            } else {
                return j.getElementsByTagName(c)
            }
        },
        id: function(a, l, b, c) {
            var k = $(b),
                g = Selector.handlers;
            if (l == document) {
                if (!k) {
                    return []
                }
                if (!a) {
                    return [k]
                }
            } else {
                if (!l.sourceIndex || l.sourceIndex < 1) {
                    var a = l.getElementsByTagName("*");
                    for (var e = 0, d; d = a[e]; e++) {
                        if (d.id === b) {
                            return [d]
                        }
                    }
                }
            }
            if (a) {
                if (c) {
                    if (c == "child") {
                        for (var f = 0, d; d = a[f]; f++) {
                            if (k.parentNode == d) {
                                return [k]
                            }
                        }
                    } else {
                        if (c == "descendant") {
                            for (var f = 0, d; d = a[f]; f++) {
                                if (Element.descendantOf(k, d)) {
                                    return [k]
                                }
                            }
                        } else {
                            if (c == "adjacent") {
                                for (var f = 0, d; d = a[f]; f++) {
                                    if (Selector.handlers.previousElementSibling(k) == d) {
                                        return [k]
                                    }
                                }
                            } else {
                                a = g[c](a)
                            }
                        }
                    }
                }
                for (var f = 0, d; d = a[f]; f++) {
                    if (d == k) {
                        return [k]
                    }
                }
                return []
            }
            return (k && Element.descendantOf(k, l)) ? [k] : []
        },
        className: function(b, a, c, d) {
            if (b && d) {
                b = this[d](b)
            }
            return Selector.handlers.byClassName(b, a, c)
        },
        byClassName: function(c, b, f) {
            if (!c) {
                c = Selector.handlers.descendant([b])
            }
            var h = " " + f + " ";
            for (var e = 0, d = [], g, a; g = c[e]; e++) {
                a = g.className;
                if (a.length == 0) {
                    continue
                }
                if (a == f || (" " + a + " ").include(h)) {
                    d.push(g)
                }
            }
            return d
        },
        attrPresence: function(c, b, a, g) {
            if (!c) {
                c = b.getElementsByTagName("*")
            }
            if (c && g) {
                c = this[g](c)
            }
            var e = [];
            for (var d = 0, f; f = c[d]; d++) {
                if (Element.hasAttribute(f, a)) {
                    e.push(f)
                }
            }
            return e
        },
        attr: function(a, j, h, k, c, b) {
            if (!a) {
                a = j.getElementsByTagName("*")
            }
            if (a && b) {
                a = this[b](a)
            }
            var l = Selector.operators[c],
                f = [];
            for (var e = 0, d; d = a[e]; e++) {
                var g = Element.readAttribute(d, h);
                if (g === null) {
                    continue
                }
                if (l(g, k)) {
                    f.push(d)
                }
            }
            return f
        },
        pseudo: function(b, c, e, a, d) {
            if (b && d) {
                b = this[d](b)
            }
            if (!b) {
                b = a.getElementsByTagName("*")
            }
            return Selector.pseudos[c](b, e, a)
        }
    },
    pseudos: {
        "first-child": function(b, f, a) {
            for (var d = 0, c = [], e; e = b[d]; d++) {
                if (Selector.handlers.previousElementSibling(e)) {
                    continue
                }
                c.push(e)
            }
            return c
        },
        "last-child": function(b, f, a) {
            for (var d = 0, c = [], e; e = b[d]; d++) {
                if (Selector.handlers.nextElementSibling(e)) {
                    continue
                }
                c.push(e)
            }
            return c
        },
        "only-child": function(b, g, a) {
            var e = Selector.handlers;
            for (var d = 0, c = [], f; f = b[d]; d++) {
                if (!e.previousElementSibling(f) && !e.nextElementSibling(f)) {
                    c.push(f)
                }
            }
            return c
        },
        "nth-child": function(b, c, a) {
            return Selector.pseudos.nth(b, c, a)
        },
        "nth-last-child": function(b, c, a) {
            return Selector.pseudos.nth(b, c, a, true)
        },
        "nth-of-type": function(b, c, a) {
            return Selector.pseudos.nth(b, c, a, false, true)
        },
        "nth-last-of-type": function(b, c, a) {
            return Selector.pseudos.nth(b, c, a, true, true)
        },
        "first-of-type": function(b, c, a) {
            return Selector.pseudos.nth(b, "1", a, false, true)
        },
        "last-of-type": function(b, c, a) {
            return Selector.pseudos.nth(b, "1", a, true, true)
        },
        "only-of-type": function(b, d, a) {
            var c = Selector.pseudos;
            return c["last-of-type"](c["first-of-type"](b, d, a), d, a)
        },
        getIndices: function(d, c, e) {
            if (d == 0) {
                return c > 0 ? [c] : []
            }
            return $R(1, e).inject([], function(a, b) {
                if (0 == (b - c) % d && (b - c) / d >= 0) {
                    a.push(b)
                }
                return a
            })
        },
        nth: function(c, s, u, r, e) {
            if (c.length == 0) {
                return []
            }
            if (s == "even") {
                s = "2n+0"
            }
            if (s == "odd") {
                s = "2n+1"
            }
            var q = Selector.handlers,
                p = [],
                d = [],
                g;
            q.mark(c);
            for (var o = 0, f; f = c[o]; o++) {
                if (!f.parentNode._countedByPrototype) {
                    q.index(f.parentNode, r, e);
                    d.push(f.parentNode)
                }
            }
            if (s.match(/^\d+$/)) {
                s = Number(s);
                for (var o = 0, f; f = c[o]; o++) {
                    if (f.nodeIndex == s) {
                        p.push(f)
                    }
                }
            } else {
                if (g = s.match(/^(-?\d*)?n(([+-])(\d+))?/)) {
                    if (g[1] == "-") {
                        g[1] = -1
                    }
                    var v = g[1] ? Number(g[1]) : 1;
                    var t = g[2] ? Number(g[2]) : 0;
                    var w = Selector.pseudos.getIndices(v, t, c.length);
                    for (var o = 0, f, k = w.length; f = c[o]; o++) {
                        for (var n = 0; n < k; n++) {
                            if (f.nodeIndex == w[n]) {
                                p.push(f)
                            }
                        }
                    }
                }
            }
            q.unmark(c);
            q.unmark(d);
            return p
        },
        empty: function(b, f, a) {
            for (var d = 0, c = [], e; e = b[d]; d++) {
                if (e.tagName == "!" || e.firstChild) {
                    continue
                }
                c.push(e)
            }
            return c
        },
        not: function(a, d, k) {
            var g = Selector.handlers,
                l, c;
            var j = new Selector(d).findElements(k);
            g.mark(j);
            for (var f = 0, e = [], b; b = a[f]; f++) {
                if (!b._countedByPrototype) {
                    e.push(b)
                }
            }
            g.unmark(j);
            return e
        },
        enabled: function(b, f, a) {
            for (var d = 0, c = [], e; e = b[d]; d++) {
                if (!e.disabled && (!e.type || e.type !== "hidden")) {
                    c.push(e)
                }
            }
            return c
        },
        disabled: function(b, f, a) {
            for (var d = 0, c = [], e; e = b[d]; d++) {
                if (e.disabled) {
                    c.push(e)
                }
            }
            return c
        },
        checked: function(b, f, a) {
            for (var d = 0, c = [], e; e = b[d]; d++) {
                if (e.checked) {
                    c.push(e)
                }
            }
            return c
        }
    },
    operators: {
        "=": function(b, a) {
            return b == a
        },
        "!=": function(b, a) {
            return b != a
        },
        "^=": function(b, a) {
            return b == a || b && b.startsWith(a)
        },
        "$=": function(b, a) {
            return b == a || b && b.endsWith(a)
        },
        "*=": function(b, a) {
            return b == a || b && b.include(a)
        },
        "~=": function(b, a) {
            return (" " + b + " ").include(" " + a + " ")
        },
        "|=": function(b, a) {
            return ("-" + (b || "").toUpperCase() + "-").include("-" + (a || "").toUpperCase() + "-")
        }
    },
    split: function(b) {
        var a = [];
        b.scan(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/, function(c) {
            a.push(c[1].strip())
        });
        return a
    },
    matchElements: function(f, g) {
        var e = $$(g),
            d = Selector.handlers;
        d.mark(e);
        for (var c = 0, b = [], a; a = f[c]; c++) {
            if (a._countedByPrototype) {
                b.push(a)
            }
        }
        d.unmark(e);
        return b
    },
    findElement: function(b, c, a) {
        if (Object.isNumber(c)) {
            a = c;
            c = false
        }
        return Selector.matchElements(b, c || "*")[a || 0]
    },
    findChildElements: function(e, g) {
        g = Selector.split(g.join(","));
        var d = [],
            f = Selector.handlers;
        for (var c = 0, b = g.length, a; c < b; c++) {
            a = new Selector(g[c].strip());
            f.concat(d, a.findElements(e))
        }
        return (b > 1) ? f.unique(d) : d
    }
});
if (Prototype.Browser.IE) {
    Object.extend(Selector.handlers, {
        concat: function(d, c) {
            for (var e = 0, f; f = c[e]; e++) {
                if (f.tagName !== "!") {
                    d.push(f)
                }
            }
            return d
        }
    })
}

function $$() {
    return Selector.findChildElements(document, $A(arguments))
}
var Form = {
    reset: function(a) {
        a = $(a);
        a.reset();
        return a
    },
    serializeElements: function(g, b) {
        if (typeof b != "object") {
            b = {
                hash: !!b
            }
        } else {
            if (Object.isUndefined(b.hash)) {
                b.hash = true
            }
        }
        var c, f, a = false,
            e = b.submit;
        var d = g.inject({}, function(h, j) {
            if (!j.disabled && j.name) {
                c = j.name;
                f = $(j).getValue();
                if (f != null && j.type != "file" && (j.type != "submit" || (!a && e !== false && (!e || c == e) && (a = true)))) {
                    if (c in h) {
                        if (!Object.isArray(h[c])) {
                            h[c] = [h[c]]
                        }
                        h[c].push(f)
                    } else {
                        h[c] = f
                    }
                }
            }
            return h
        });
        return b.hash ? d : Object.toQueryString(d)
    }
};
Form.Methods = {
    serialize: function(b, a) {
        return Form.serializeElements(Form.getElements(b), a)
    },
    getElements: function(e) {
        var f = $(e).getElementsByTagName("*"),
            d, a = [],
            c = Form.Element.Serializers;
        for (var b = 0; d = f[b]; b++) {
            a.push(d)
        }
        return a.inject([], function(g, h) {
            if (c[h.tagName.toLowerCase()]) {
                g.push(Element.extend(h))
            }
            return g
        })
    },
    getInputs: function(g, c, d) {
        g = $(g);
        var a = g.getElementsByTagName("input");
        if (!c && !d) {
            return $A(a).map(Element.extend)
        }
        for (var e = 0, h = [], f = a.length; e < f; e++) {
            var b = a[e];
            if ((c && b.type != c) || (d && b.name != d)) {
                continue
            }
            h.push(Element.extend(b))
        }
        return h
    },
    disable: function(a) {
        a = $(a);
        Form.getElements(a).invoke("disable");
        return a
    },
    enable: function(a) {
        a = $(a);
        Form.getElements(a).invoke("enable");
        return a
    },
    findFirstElement: function(b) {
        var c = $(b).getElements().findAll(function(d) {
            return "hidden" != d.type && !d.disabled
        });
        var a = c.findAll(function(d) {
            return d.hasAttribute("tabIndex") && d.tabIndex >= 0
        }).sortBy(function(d) {
            return d.tabIndex
        }).first();
        return a ? a : c.find(function(d) {
            return /^(?:input|select|textarea)$/i.test(d.tagName)
        })
    },
    focusFirstElement: function(a) {
        a = $(a);
        a.findFirstElement().activate();
        return a
    },
    request: function(b, a) {
        b = $(b), a = Object.clone(a || {});
        var d = a.parameters,
            c = b.readAttribute("action") || "";
        if (c.blank()) {
            c = window.location.href
        }
        a.parameters = b.serialize(true);
        if (d) {
            if (Object.isString(d)) {
                d = d.toQueryParams()
            }
            Object.extend(a.parameters, d)
        }
        if (b.hasAttribute("method") && !a.method) {
            a.method = b.method
        }
        return new Ajax.Request(c, a)
    }
};
Form.Element = {
    focus: function(a) {
        $(a).focus();
        return a
    },
    select: function(a) {
        $(a).select();
        return a
    }
};
Form.Element.Methods = {
    serialize: function(a) {
        a = $(a);
        if (!a.disabled && a.name) {
            var b = a.getValue();
            if (b != undefined) {
                var c = {};
                c[a.name] = b;
                return Object.toQueryString(c)
            }
        }
        return ""
    },
    getValue: function(a) {
        a = $(a);
        var b = a.tagName.toLowerCase();
        return Form.Element.Serializers[b](a)
    },
    setValue: function(a, b) {
        a = $(a);
        var c = a.tagName.toLowerCase();
        Form.Element.Serializers[c](a, b);
        return a
    },
    clear: function(a) {
        $(a).value = "";
        return a
    },
    present: function(a) {
        return $(a).value != ""
    },
    activate: function(a) {
        a = $(a);
        try {
            a.focus();
            if (a.select && (a.tagName.toLowerCase() != "input" || !(/^(?:button|reset|submit)$/i.test(a.type)))) {
                a.select()
            }
        } catch (b) {}
        return a
    },
    disable: function(a) {
        a = $(a);
        a.disabled = true;
        return a
    },
    enable: function(a) {
        a = $(a);
        a.disabled = false;
        return a
    }
};
var Field = Form.Element;
var $F = Form.Element.Methods.getValue;
Form.Element.Serializers = {
    input: function(a, b) {
        switch (a.type.toLowerCase()) {
            case "checkbox":
            case "radio":
                return Form.Element.Serializers.inputSelector(a, b);
            default:
                return Form.Element.Serializers.textarea(a, b)
        }
    },
    inputSelector: function(a, b) {
        if (Object.isUndefined(b)) {
            return a.checked ? a.value : null
        } else {
            a.checked = !!b
        }
    },
    textarea: function(a, b) {
        if (Object.isUndefined(b)) {
            return a.value
        } else {
            a.value = b
        }
    },
    select: function(c, f) {
        if (Object.isUndefined(f)) {
            return this[c.type == "select-one" ? "selectOne" : "selectMany"](c)
        } else {
            var b, d, g = !Object.isArray(f);
            for (var a = 0, e = c.length; a < e; a++) {
                b = c.options[a];
                d = this.optionValue(b);
                if (g) {
                    if (d == f) {
                        b.selected = true;
                        return
                    }
                } else {
                    b.selected = f.include(d)
                }
            }
        }
    },
    selectOne: function(b) {
        var a = b.selectedIndex;
        return a >= 0 ? this.optionValue(b.options[a]) : null
    },
    selectMany: function(d) {
        var a, e = d.length;
        if (!e) {
            return null
        }
        for (var c = 0, a = []; c < e; c++) {
            var b = d.options[c];
            if (b.selected) {
                a.push(this.optionValue(b))
            }
        }
        return a
    },
    optionValue: function(a) {
        return Element.extend(a).hasAttribute("value") ? a.value : a.text
    }
};
Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
    initialize: function($super, a, b, c) {
        $super(c, b);
        this.element = $(a);
        this.lastValue = this.getValue()
    },
    execute: function() {
        var a = this.getValue();
        if (Object.isString(this.lastValue) && Object.isString(a) ? this.lastValue != a : String(this.lastValue) != String(a)) {
            this.callback(this.element, a);
            this.lastValue = a
        }
    }
});
Form.Element.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function() {
        return Form.Element.getValue(this.element)
    }
});
Form.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function() {
        return Form.serialize(this.element)
    }
});
Abstract.EventObserver = Class.create({
    initialize: function(a, b) {
        this.element = $(a);
        this.callback = b;
        this.lastValue = this.getValue();
        if (this.element.tagName.toLowerCase() == "form") {
            this.registerFormCallbacks()
        } else {
            this.registerCallback(this.element)
        }
    },
    onElementEvent: function() {
        var a = this.getValue();
        if (this.lastValue != a) {
            this.callback(this.element, a);
            this.lastValue = a
        }
    },
    registerFormCallbacks: function() {
        Form.getElements(this.element).each(this.registerCallback, this)
    },
    registerCallback: function(a) {
        if (a.type) {
            switch (a.type.toLowerCase()) {
                case "checkbox":
                case "radio":
                    Event.observe(a, "click", this.onElementEvent.bind(this));
                    break;
                default:
                    Event.observe(a, "change", this.onElementEvent.bind(this));
                    break
            }
        }
    }
});
Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function() {
        return Form.Element.getValue(this.element)
    }
});
Form.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function() {
        return Form.serialize(this.element)
    }
});
(function() {
    var w = {
        KEY_BACKSPACE: 8,
        KEY_TAB: 9,
        KEY_RETURN: 13,
        KEY_ESC: 27,
        KEY_LEFT: 37,
        KEY_UP: 38,
        KEY_RIGHT: 39,
        KEY_DOWN: 40,
        KEY_DELETE: 46,
        KEY_HOME: 36,
        KEY_END: 35,
        KEY_PAGEUP: 33,
        KEY_PAGEDOWN: 34,
        KEY_INSERT: 45,
        cache: {}
    };
    var e = document.documentElement;
    var x = "onmouseenter" in e && "onmouseleave" in e;
    var p;
    if (Prototype.Browser.IE) {
        var h = {
            0: 1,
            1: 4,
            2: 2
        };
        p = function(z, y) {
            return z.button === h[y]
        }
    } else {
        if (Prototype.Browser.WebKit) {
            p = function(z, y) {
                switch (y) {
                    case 0:
                        return z.which == 1 && !z.metaKey;
                    case 1:
                        return z.which == 1 && z.metaKey;
                    default:
                        return false
                }
            }
        } else {
            p = function(z, y) {
                return z.which ? (z.which === y + 1) : (z.button === y)
            }
        }
    }

    function s(y) {
        return p(y, 0)
    }

    function r(y) {
        return p(y, 1)
    }

    function l(y) {
        return p(y, 2)
    }

    function c(A) {
        A = w.extend(A);
        var z = A.target,
            y = A.type,
            B = A.currentTarget;
        if (B && B.tagName) {
            if (y === "load" || y === "error" || (y === "click" && B.tagName.toLowerCase() === "input" && B.type === "radio")) {
                z = B
            }
        }
        if (z.nodeType == Node.TEXT_NODE) {
            z = z.parentNode
        }
        return Element.extend(z)
    }

    function n(z, B) {
        var y = w.element(z);
        if (!B) {
            return y
        }
        var A = [y].concat(y.ancestors());
        return Selector.findElement(A, B, 0)
    }

    function q(y) {
        return {
            x: b(y),
            y: a(y)
        }
    }

    function b(A) {
        var z = document.documentElement,
            y = document.body || {
                scrollLeft: 0
            };
        return A.pageX || (A.clientX + (z.scrollLeft || y.scrollLeft) - (z.clientLeft || 0))
    }

    function a(A) {
        var z = document.documentElement,
            y = document.body || {
                scrollTop: 0
            };
        return A.pageY || (A.clientY + (z.scrollTop || y.scrollTop) - (z.clientTop || 0))
    }

    function o(y) {
        w.extend(y);
        y.preventDefault();
        y.stopPropagation();
        y.stopped = true
    }
    w.Methods = {
        isLeftClick: s,
        isMiddleClick: r,
        isRightClick: l,
        element: c,
        findElement: n,
        pointer: q,
        pointerX: b,
        pointerY: a,
        stop: o
    };
    var u = Object.keys(w.Methods).inject({}, function(y, z) {
        y[z] = w.Methods[z].methodize();
        return y
    });
    if (Prototype.Browser.IE) {
        function g(z) {
            var y;
            switch (z.type) {
                case "mouseover":
                    y = z.fromElement;
                    break;
                case "mouseout":
                    y = z.toElement;
                    break;
                default:
                    return null
            }
            return Element.extend(y)
        }
        Object.extend(u, {
            stopPropagation: function() {
                this.cancelBubble = true
            },
            preventDefault: function() {
                this.returnValue = false
            },
            inspect: function() {
                return "[object Event]"
            }
        });
        w.extend = function(z, y) {
            if (!z) {
                return false
            }
            if (z._extendedByPrototype) {
                return z
            }
            z._extendedByPrototype = Prototype.emptyFunction;
            var A = w.pointer(z);
            Object.extend(z, {
                target: z.srcElement || y,
                relatedTarget: g(z),
                pageX: A.x,
                pageY: A.y
            });
            return Object.extend(z, u)
        }
    } else {
        w.prototype = window.Event.prototype || document.createEvent("HTMLEvents").__proto__;
        Object.extend(w.prototype, u);
        w.extend = Prototype.K
    }

    function m(C, B, D) {
        var A = Element.retrieve(C, "prototype_event_registry");
        if (Object.isUndefined(A)) {
            d.push(C);
            A = Element.retrieve(C, "prototype_event_registry", $H())
        }
        var y = A.get(B);
        if (Object.isUndefined(y)) {
            y = [];
            A.set(B, y)
        }
        if (y.pluck("handler").include(D)) {
            return false
        }
        var z;
        if (B.include(":")) {
            z = function(E) {
                if (Object.isUndefined(E.eventName)) {
                    return false
                }
                if (E.eventName !== B) {
                    return false
                }
                w.extend(E, C);
                D.call(C, E)
            }
        } else {
            if (!x && (B === "mouseenter" || B === "mouseleave")) {
                if (B === "mouseenter" || B === "mouseleave") {
                    z = function(F) {
                        w.extend(F, C);
                        var E = F.relatedTarget;
                        while (E && E !== C) {
                            try {
                                E = E.parentNode
                            } catch (G) {
                                E = C
                            }
                        }
                        if (E === C) {
                            return
                        }
                        D.call(C, F)
                    }
                }
            } else {
                z = function(E) {
                    w.extend(E, C);
                    D.call(C, E)
                }
            }
        }
        z.handler = D;
        y.push(z);
        return z
    }

    function f() {
        for (var y = 0, z = d.length; y < z; y++) {
            w.stopObserving(d[y]);
            d[y] = null
        }
    }
    var d = [];
    if (Prototype.Browser.IE) {
        window.attachEvent("onunload", f)
    }
    if (Prototype.Browser.WebKit) {
        window.addEventListener("unload", Prototype.emptyFunction, false)
    }
    var k = Prototype.K;
    if (!x) {
        k = function(z) {
            var y = {
                mouseenter: "mouseover",
                mouseleave: "mouseout"
            };
            return z in y ? y[z] : z
        }
    }

    function t(B, A, C) {
        B = $(B);
        var z = m(B, A, C);
        if (!z) {
            return B
        }
        if (A.include(":")) {
            if (B.addEventListener) {
                B.addEventListener("dataavailable", z, false)
            } else {
                B.attachEvent("ondataavailable", z);
                B.attachEvent("onfilterchange", z)
            }
        } else {
            var y = k(A);
            if (B.addEventListener) {
                B.addEventListener(y, z, false)
            } else {
                B.attachEvent("on" + y, z)
            }
        }
        return B
    }

    function j(D, B, E) {
        D = $(D);
        var A = Element.retrieve(D, "prototype_event_registry");
        if (Object.isUndefined(A)) {
            return D
        }
        if (B && !E) {
            var C = A.get(B);
            if (Object.isUndefined(C)) {
                return D
            }
            C.each(function(F) {
                Element.stopObserving(D, B, F.handler)
            });
            return D
        } else {
            if (!B) {
                A.each(function(H) {
                    var F = H.key,
                        G = H.value;
                    G.each(function(I) {
                        Element.stopObserving(D, F, I.handler)
                    })
                });
                return D
            }
        }
        var C = A.get(B);
        if (!C) {
            return
        }
        var z = C.find(function(F) {
            return F.handler === E
        });
        if (!z) {
            return D
        }
        var y = k(B);
        if (B.include(":")) {
            if (D.removeEventListener) {
                D.removeEventListener("dataavailable", z, false)
            } else {
                D.detachEvent("ondataavailable", z);
                D.detachEvent("onfilterchange", z)
            }
        } else {
            if (D.removeEventListener) {
                D.removeEventListener(y, z, false)
            } else {
                D.detachEvent("on" + y, z)
            }
        }
        A.set(B, C.without(z));
        return D
    }

    function v(B, A, z, y) {
        B = $(B);
        if (Object.isUndefined(y)) {
            y = true
        }
        if (B == document && document.createEvent && !B.dispatchEvent) {
            B = document.documentElement
        }
        var C;
        if (document.createEvent) {
            C = document.createEvent("HTMLEvents");
            C.initEvent("dataavailable", true, true)
        } else {
            C = document.createEventObject();
            C.eventType = y ? "ondataavailable" : "onfilterchange"
        }
        C.eventName = A;
        C.memo = z || {};
        if (document.createEvent) {
            B.dispatchEvent(C)
        } else {
            B.fireEvent(C.eventType, C)
        }
        return w.extend(C)
    }
    Object.extend(w, w.Methods);
    Object.extend(w, {
        fire: v,
        observe: t,
        stopObserving: j
    });
    Element.addMethods({
        fire: v,
        observe: t,
        stopObserving: j
    });
    Object.extend(document, {
        fire: v.methodize(),
        observe: t.methodize(),
        stopObserving: j.methodize(),
        loaded: false
    });
    if (window.Event) {
        Object.extend(window.Event, w)
    } else {
        window.Event = w
    }
})();
(function() {
    var d;

    function a() {
        if (document.loaded) {
            return
        }
        if (d) {
            window.clearTimeout(d)
        }
        document.loaded = true;
        document.fire("dom:loaded")
    }

    function c() {
        if (document.readyState === "complete") {
            document.stopObserving("readystatechange", c);
            a()
        }
    }

    function b() {
        try {
            document.documentElement.doScroll("left")
        } catch (f) {
            d = b.defer();
            return
        }
        a()
    }
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", a, false)
    } else {
        document.observe("readystatechange", c);
        if (window == top) {
            d = b.defer()
        }
    }
    Event.observe(window, "load", a)
})();
Element.addMethods();
Hash.toQueryString = Object.toQueryString;
var Toggle = {
    display: Element.toggle
};
Element.Methods.childOf = Element.Methods.descendantOf;
var Insertion = {
    Before: function(a, b) {
        return Element.insert(a, {
            before: b
        })
    },
    Top: function(a, b) {
        return Element.insert(a, {
            top: b
        })
    },
    Bottom: function(a, b) {
        return Element.insert(a, {
            bottom: b
        })
    },
    After: function(a, b) {
        return Element.insert(a, {
            after: b
        })
    }
};
var $continue = new Error('"throw $continue" is deprecated, use "return" instead');
var Position = {
    includeScrollOffsets: false,
    prepare: function() {
        this.deltaX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
        this.deltaY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    },
    within: function(b, a, c) {
        if (this.includeScrollOffsets) {
            return this.withinIncludingScrolloffsets(b, a, c)
        }
        this.xcomp = a;
        this.ycomp = c;
        this.offset = Element.cumulativeOffset(b);
        return (c >= this.offset[1] && c < this.offset[1] + b.offsetHeight && a >= this.offset[0] && a < this.offset[0] + b.offsetWidth)
    },
    withinIncludingScrolloffsets: function(b, a, d) {
        var c = Element.cumulativeScrollOffset(b);
        this.xcomp = a + c[0] - this.deltaX;
        this.ycomp = d + c[1] - this.deltaY;
        this.offset = Element.cumulativeOffset(b);
        return (this.ycomp >= this.offset[1] && this.ycomp < this.offset[1] + b.offsetHeight && this.xcomp >= this.offset[0] && this.xcomp < this.offset[0] + b.offsetWidth)
    },
    overlap: function(b, a) {
        if (!b) {
            return 0
        }
        if (b == "vertical") {
            return ((this.offset[1] + a.offsetHeight) - this.ycomp) / a.offsetHeight
        }
        if (b == "horizontal") {
            return ((this.offset[0] + a.offsetWidth) - this.xcomp) / a.offsetWidth
        }
    },
    cumulativeOffset: Element.Methods.cumulativeOffset,
    positionedOffset: Element.Methods.positionedOffset,
    absolutize: function(a) {
        Position.prepare();
        return Element.absolutize(a)
    },
    relativize: function(a) {
        Position.prepare();
        return Element.relativize(a)
    },
    realOffset: Element.Methods.cumulativeScrollOffset,
    offsetParent: Element.Methods.getOffsetParent,
    page: Element.Methods.viewportOffset,
    clone: function(b, c, a) {
        a = a || {};
        return Element.clonePosition(c, b, a)
    }
};
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function(b) {
        function a(c) {
            return c.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + c + " ')]"
        }
        b.getElementsByClassName = Prototype.BrowserFeatures.XPath ? function(c, e) {
            e = e.toString().strip();
            var d = /\s/.test(e) ? $w(e).map(a).join("") : a(e);
            return d ? document._getElementsByXPath(".//*" + d, c) : []
        } : function(e, f) {
            f = f.toString().strip();
            var g = [],
                h = (/\s/.test(f) ? $w(f) : null);
            if (!h && !f) {
                return g
            }
            var c = $(e).getElementsByTagName("*");
            f = " " + f + " ";
            for (var d = 0, k, j; k = c[d]; d++) {
                if (k.className && (j = " " + k.className + " ") && (j.include(f) || (h && h.all(function(l) {
                        return !l.toString().blank() && j.include(" " + l + " ")
                    })))) {
                    g.push(Element.extend(k))
                }
            }
            return g
        };
        return function(d, c) {
            return $(c || document.body).getElementsByClassName(d)
        }
    }(Element.Methods)
}
Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
    initialize: function(a) {
        this.element = $(a)
    },
    _each: function(a) {
        this.element.className.split(/\s+/).select(function(b) {
            return b.length > 0
        })._each(a)
    },
    set: function(a) {
        this.element.className = a
    },
    add: function(a) {
        if (this.include(a)) {
            return
        }
        this.set($A(this).concat(a).join(" "))
    },
    remove: function(a) {
        if (!this.include(a)) {
            return
        }
        this.set($A(this).without(a).join(" "))
    },
    toString: function() {
        return $A(this).join(" ")
    }
};
Object.extend(Element.ClassNames.prototype, Enumerable);
if (!Control) {
    var Control = {}
}
Control.Slider = Class.create({
    initialize: function(d, a, b) {
        var c = this;
        if (Object.isArray(d)) {
            this.handles = d.collect(function(f) {
                return $(f)
            })
        } else {
            this.handles = [$(d)]
        }
        this.track = $(a);
        this.options = b || {};
        this.axis = this.options.axis || "horizontal";
        this.increment = this.options.increment || 1;
        this.step = parseInt(this.options.step || "1");
        this.range = this.options.range || $R(0, 1);
        this.value = 0;
        this.values = this.handles.map(function() {
            return 0
        });
        this.spans = this.options.spans ? this.options.spans.map(function(e) {
            return $(e)
        }) : false;
        this.options.startSpan = $(this.options.startSpan || null);
        this.options.endSpan = $(this.options.endSpan || null);
        this.restricted = this.options.restricted || false;
        this.maximum = this.options.maximum || this.range.end;
        this.minimum = this.options.minimum || this.range.start;
        this.alignX = parseInt(this.options.alignX || "0");
        this.alignY = parseInt(this.options.alignY || "0");
        this.trackLength = this.maximumOffset() - this.minimumOffset();
        this.handleLength = this.isVertical() ? (this.handles[0].offsetHeight != 0 ? this.handles[0].offsetHeight : this.handles[0].style.height.replace(/px$/, "")) : (this.handles[0].offsetWidth != 0 ? this.handles[0].offsetWidth : this.handles[0].style.width.replace(/px$/, ""));
        this.active = false;
        this.dragging = false;
        this.disabled = false;
        if (this.options.disabled) {
            this.setDisabled()
        }
        this.allowedValues = this.options.values ? this.options.values.sortBy(Prototype.K) : false;
        if (this.allowedValues) {
            this.minimum = this.allowedValues.min();
            this.maximum = this.allowedValues.max()
        }
        this.eventMouseDown = this.startDrag.bindAsEventListener(this);
        this.eventMouseUp = this.endDrag.bindAsEventListener(this);
        this.eventMouseMove = this.update.bindAsEventListener(this);
        this.handles.each(function(f, e) {
            e = c.handles.length - 1 - e;
            c.setValue(parseFloat((Object.isArray(c.options.sliderValue) ? c.options.sliderValue[e] : c.options.sliderValue) || c.range.start), e);
            f.makePositioned().observe("mousedown", c.eventMouseDown)
        });
        this.track.observe("mousedown", this.eventMouseDown);
        document.observe("mouseup", this.eventMouseUp);
        document.observe("mousemove", this.eventMouseMove);
        this.initialized = true
    },
    dispose: function() {
        var a = this;
        Event.stopObserving(this.track, "mousedown", this.eventMouseDown);
        Event.stopObserving(document, "mouseup", this.eventMouseUp);
        Event.stopObserving(document, "mousemove", this.eventMouseMove);
        this.handles.each(function(b) {
            Event.stopObserving(b, "mousedown", a.eventMouseDown)
        })
    },
    setDisabled: function() {
        this.disabled = true
    },
    setEnabled: function() {
        this.disabled = false
    },
    getNearestValue: function(a) {
        if (this.allowedValues) {
            if (a >= this.allowedValues.max()) {
                return (this.allowedValues.max())
            }
            if (a <= this.allowedValues.min()) {
                return (this.allowedValues.min())
            }
            var c = Math.abs(this.allowedValues[0] - a);
            var b = this.allowedValues[0];
            this.allowedValues.each(function(d) {
                var e = Math.abs(d - a);
                if (e <= c) {
                    b = d;
                    c = e
                }
            });
            return b
        }
        if (a > this.range.end) {
            return this.range.end
        }
        if (a < this.range.start) {
            return this.range.start
        }
        return a
    },
    setValue: function(b, a) {
        if (!this.active) {
            this.activeHandleIdx = a || 0;
            this.activeHandle = this.handles[this.activeHandleIdx];
            this.updateStyles()
        }
        a = a || this.activeHandleIdx || 0;
        if (this.initialized && this.restricted) {
            if ((a > 0) && (b < this.values[a - 1])) {
                b = this.values[a - 1]
            }
            if ((a < (this.handles.length - 1)) && (b > this.values[a + 1])) {
                b = this.values[a + 1]
            }
        }
        b = this.getNearestValue(b);
        this.values[a] = b;
        this.value = this.values[0];
        this.handles[a].style[this.isVertical() ? "top" : "left"] = this.translateToPx(b);
        this.drawSpans();
        if (!this.dragging || !this.event) {
            this.updateFinished()
        }
    },
    setValueBy: function(b, a) {
        this.setValue(this.values[a || this.activeHandleIdx || 0] + b, a || this.activeHandleIdx || 0)
    },
    translateToPx: function(a) {
        return Math.round(((this.trackLength - this.handleLength) / (this.range.end - this.range.start)) * (a - this.range.start)) + "px"
    },
    translateToValue: function(a) {
        return ((a / (this.trackLength - this.handleLength) * (this.range.end - this.range.start)) + this.range.start)
    },
    getRange: function(b) {
        var a = this.values.sortBy(Prototype.K);
        b = b || 0;
        return $R(a[b], a[b + 1])
    },
    minimumOffset: function() {
        return (this.isVertical() ? this.alignY : this.alignX)
    },
    maximumOffset: function() {
        return (this.isVertical() ? (this.track.offsetHeight != 0 ? this.track.offsetHeight : this.track.style.height.replace(/px$/, "")) - this.alignY : (this.track.offsetWidth != 0 ? this.track.offsetWidth : this.track.style.width.replace(/px$/, "")) - this.alignX)
    },
    isVertical: function() {
        return (this.axis == "vertical")
    },
    drawSpans: function() {
        var a = this;
        if (this.spans) {
            $R(0, this.spans.length - 1).each(function(b) {
                a.setSpan(a.spans[b], a.getRange(b))
            })
        }
        if (this.options.startSpan) {
            this.setSpan(this.options.startSpan, $R(0, this.values.length > 1 ? this.getRange(0).min() : this.value))
        }
        if (this.options.endSpan) {
            this.setSpan(this.options.endSpan, $R(this.values.length > 1 ? this.getRange(this.spans.length - 1).max() : this.value, this.maximum))
        }
    },
    setSpan: function(b, a) {
        if (this.isVertical()) {
            b.style.top = this.translateToPx(a.start);
            b.style.height = this.translateToPx(a.end - a.start + this.range.start)
        } else {
            b.style.left = this.translateToPx(a.start);
            b.style.width = this.translateToPx(a.end - a.start + this.range.start)
        }
    },
    updateStyles: function() {
        this.handles.each(function(a) {
            Element.removeClassName(a, "selected")
        });
        Element.addClassName(this.activeHandle, "selected")
    },
    startDrag: function(c) {
        if (Event.isLeftClick(c)) {
            if (!this.disabled) {
                this.active = true;
                var d = Event.element(c);
                var e = [Event.pointerX(c), Event.pointerY(c)];
                var a = d;
                if (a == this.track) {
                    var b = this.track.cumulativeOffset();
                    this.event = c;
                    this.setValue(this.translateToValue((this.isVertical() ? e[1] - b[1] : e[0] - b[0]) - (this.handleLength / 2)));
                    var b = this.activeHandle.cumulativeOffset();
                    this.offsetX = (e[0] - b[0]);
                    this.offsetY = (e[1] - b[1])
                } else {
                    while ((this.handles.indexOf(d) == -1) && d.parentNode) {
                        d = d.parentNode
                    }
                    if (this.handles.indexOf(d) != -1) {
                        this.activeHandle = d;
                        this.activeHandleIdx = this.handles.indexOf(this.activeHandle);
                        this.updateStyles();
                        var b = this.activeHandle.cumulativeOffset();
                        this.offsetX = (e[0] - b[0]);
                        this.offsetY = (e[1] - b[1])
                    }
                }
            }
            Event.stop(c)
        }
    },
    update: function(a) {
        if (this.active) {
            if (!this.dragging) {
                this.dragging = true
            }
            this.draw(a);
            if (Prototype.Browser.WebKit) {
                window.scrollBy(0, 0)
            }
            Event.stop(a)
        }
    },
    draw: function(b) {
        var c = [Event.pointerX(b), Event.pointerY(b)];
        var a = this.track.cumulativeOffset();
        c[0] -= this.offsetX + a[0];
        c[1] -= this.offsetY + a[1];
        this.event = b;
        this.setValue(this.translateToValue(this.isVertical() ? c[1] : c[0]));
        if (this.initialized && this.options.onSlide) {
            this.options.onSlide(this.values.length > 1 ? this.values : this.value, this)
        }
    },
    endDrag: function(a) {
        if (this.active && this.dragging) {
            this.finishDrag(a, true);
            Event.stop(a)
        }
        this.active = false;
        this.dragging = false
    },
    finishDrag: function(a, b) {
        this.active = false;
        this.dragging = false;
        this.updateFinished()
    },
    updateFinished: function() {
        if (this.initialized && this.options.onChange) {
            this.options.onChange(this.values.length > 1 ? this.values : this.value, this)
        }
        this.event = null
    }
});

function jpgMovie() {
    this.name = "";
    this.player = null;
    this.interval = 100;
    this.timer = null;
    this.cFramesUntilPlayable = -1;
    this.cFrames = 0;
    this.iFrame = 0;
    this.frames = new Array();
    this.targets = new Array();
    this.loaded = new Array();
    this.cLoaded = 0;
    this.pcntLoaded = 0;
    this.incrementer = 1;
    this.defaultTarget = "http://www.entre-cabanes.net";
    this.urlImageBase = "";
    this.urlLoadedFrom = ""
}
jpgMovie.prototype.name;
jpgMovie.prototype.player;
jpgMovie.prototype.interval;
jpgMovie.prototype.timer;
jpgMovie.prototype.cFrames;
jpgMovie.prototype.cFramesUntilPlayable;
jpgMovie.prototype.iFrame;
jpgMovie.prototype.frames;
jpgMovie.prototype.targets;
jpgMovie.prototype.loaded;
jpgMovie.prototype.cLoaded;
jpgMovie.prototype.pcntLoaded;
jpgMovie.prototype.incrementer;
jpgMovie.prototype.defaultTarget;
jpgMovie.prototype.urlImageBase;
jpgMovie.prototype.urlLoadedFrom;
jpgMovie.prototype.setPlayer = function(a) {
    this.player = a;
    this.name = a.name + ".movie"
};
jpgMovie.prototype.setInterval = function(a) {
    this.interval = a
};
jpgMovie.prototype.setDefaultTarget = function(a) {
    this.defaultTarget = a
};
jpgMovie.prototype.setImageUrlBase = function(a) {
    this.urlImageBase = a
};
jpgMovie.prototype.setFramesUntilPlayable = function(a) {
    this.cFramesUntilPlayable = a
};
jpgMovie.prototype.getInterval = function() {
    return this.interval
};
jpgMovie.prototype.getFrameCount = function() {
    return this.cFrames
};
jpgMovie.prototype.getFrameNumber = function() {
    return this.iFrame
};
jpgMovie.prototype.getFrameSrc = function(a) {
    return this.frames[a].src
};
jpgMovie.prototype.addFrameWithTarget = function(urlImage, urlTarget) {
    var i = this.cFrames;
    this.loaded[i] = 0;
    this.frames[i] = new Image();
    this.targets[i] = urlTarget;
    var cant_use_keyword_this = this;
    var strMakeSureReal_i = "this.frames[i].onload = function() { cant_use_keyword_this._frameLoaded( cant_use_keyword_this, " + i + " ); };";
    eval(strMakeSureReal_i);
    this.cFrames++;
    if (this.cFramesUntilPlayable > this.cFrames) {
        this.incrementer = 100 / this.cFramesUntilPlayable
    } else {
        this.incrementer = 100 / this.cFrames
    }
    if (urlImage.indexOf("http://") == 0) {
        this.frames[i].src = urlImage
    } else {
        if (urlImage.indexOf("https://") == 0) {
            this.frames[i].src = urlImage
        } else {
            this.frames[i].src = this.urlImageBase + urlImage
        }
    }
    return i
};
jpgMovie.prototype.addFrame = function(a) {
    return this.addFrameWithTarget(a, this.defaultTarget)
};
jpgMovie.prototype._frameLoaded = function(b, a) {
    b.loaded[a] = 1;
    b.cLoaded++;
    b.pcntLoaded += b.incrementer;
    if (b.pcntLoaded > 100) {
        b.pcntLoaded = b.cLoaded * b.incrementer
    }
    if (b.cLoaded >= b.cFrames) {
        b.pcntLoaded = 100
    }
    b.player.bufferedStatusCB(parseInt(b.pcntLoaded));
    if (b.cFramesUntilPlayable > 0) {
        if (b.cLoaded >= b.cFramesUntilPlayable) {
            b.player.movieLoadedCB()
        }
    } else {
        if (b.pcntLoaded >= 100) {
            b.player.movieLoadedCB()
        }
    }
};
jpgMovie.prototype.playRange = function(b, a) {
    this.stopTimer();
    this.iFrame = b - 1;
    this.frameLooper(this, b, a + 1);
    return false
};
jpgMovie.prototype.start = function() {
    this.stopTimer();
    this.iFrame = (-1);
    this.frameLooper(this, 0, this.cFrames);
    return false
};
jpgMovie.prototype.play = function() {
    this.stopTimer();
    if (this.iFrame >= (this.cFrames - 1)) {
        this.iFrame = (-1)
    }
    this.frameLooper(this, 0, this.cFrames);
    return false
};
jpgMovie.prototype.pause = function() {
    this.stopTimer();
    return false
};
jpgMovie.prototype.stopTimer = function() {
    if (this.timer != null) {
        clearTimeout(this.timer)
    }
};
jpgMovie.prototype.frameLooper = function(c, d, a) {
    c.iFrame++;
    if (c.iFrame < a) {
        c._showFrame();
        var b = function() {
            c.frameLooper(c, d, a)
        };
        c.timer = setTimeout(b, c.interval)
    } else {
        c.iFrame--;
        c.player.playFinishedCB()
    }
};
jpgMovie.prototype._showFrame = function() {
    if (this.loaded[this.iFrame] == 1) {
        if (this.player) {
            this.player.showFrame(this.frames[this.iFrame].src, this.targets[this.iFrame], this.iFrame)
        }
    }
};
jpgMovie.prototype.backFrame = function() {
    this.iFrame--;
    if (this.iFrame < 0) {
        this.iFrame = this.cFrames - 1
    }
    this._showFrame()
};
jpgMovie.prototype.forwardFrame = function() {
    this.iFrame++;
    if (this.iFrame >= this.cFrames) {
        this.iFrame = 0
    }
    this._showFrame()
};
jpgMovie.prototype.setFrame = function(a) {
    this.iFrame = a;
    if (this.iFrame >= this.cFrames) {
        this.iFrame = this.cFrames - 1
    }
    if (this.iFrame < 0) {
        this.iFrame = 0
    }
    this._showFrame()
};
jpgMovie.prototype.loadXml = function(c) {
    var d = true;
    var b = this.getXmlVal(c, "version", "unspecified");
    if (b == "1.1.3") {
        this.player.img = this.getXmlVal(c, "for_player_img", "");
        this.player.setInterval(this.getXmlVal(c, "interval", this.interval));
        this.player.setAutoPlay(this.getXmlVal(c, "auto_play", 0));
        this.player.setLooping(this.getXmlVal(c, "looping", 0));
        this.player.setTargetEnabled(this.getXmlVal(c, "target_enabled", 0));
        this.interval = this.getXmlVal(c, "interval", this.interval);
        this.defaultTarget = this.getXmlVal(c, "default_target", this.defaultTarget);
        this.cFrames = this.getXmlVal(c, "cFrames", 0);
        this.cFramesUntilPlayable = this.getXmlVal(c, "cFramesUntilPlayable", -1);
        this.player.draw();
        var e = this.cFrames;
        this.cFrames = 0;
        this.iFrames = 0;
        this.cLoaded = 0;
        for (i = 0; i < e; i++) {
            this.targets[i] = this.getXmlVal(c, "target_" + i, "")
        }
        for (i = 0; i < e; i++) {
            var a = this.getXmlVal(c, "frame_" + i, "");
            this.addFrameWithTarget(a, this.targets[i])
        }
    } else {
        d = false;
        alert("Cannot load a version-" + b + "-movie into this version 1.1.3 movie object")
    }
    return d
};
jpgMovie.prototype.getXmlVal = function(c, b, a) {
    var d = c.getElementsByTagName(b);
    if (d != null && d[0] != null) {
        return d[0].childNodes[0].nodeValue
    } else {
        return a
    }
};
jpgMovie.prototype.loadFromUrl = function(b) {
    var e;
    var a = navigator.appName;
    if (a == "Microsoft Internet Explorer") {
        e = new ActiveXObject("Microsoft.XMLHTTP")
    } else {
        e = new XMLHttpRequest()
    }
    var d = b;
    e.open("GET", d, true);
    var c = this;
    e.onreadystatechange = function() {
        if (e.readyState == 4) {
            if (e.status == 200) {
                var g = e.responseXML;
                var f = c.loadXml(g);
                if (f) {
                    this.urlLoadedFrom = b
                }
            } else {
                alert("error " + e.status + " retrieving movie from " + b)
            }
        }
    };
    e.send(null)
};
jpgMovie.prototype.toXml = function() {
    var a = "";
    a += "<JPGMOVIE>\n";
    a += "  <version>1.1.3</version>\n";
    a += "  <interval>" + this.interval + "</interval>\n";
    a += "  <cFrames>" + this.cFrames + "</cFrames>\n";
    a += "  <cFramesUntilPlayable>" + this.cFramesUntilPlayable + "</cFramesUntilPlayable>\n";
    a += "  <default_target>" + this.defaultTarget + "</default_target>\n";
    a += "  <frames>\n";
    for (var b = 0; b < this.cFrames; b++) {
        a += "  <frame>";
        a += this.frames[b].src;
        a += "</frame>\n"
    }
    a += "  </frames>\n";
    a += "  <targets>\n";
    for (var b = 0; b < this.cFrames; b++) {
        if (this.targets[b].length > 0) {
            a += "  <target>";
            a += this.targets[b];
            a += "</target>\n"
        }
    }
    a += "  </targets>\n";
    a += "</JPGMOVIE>\n";
    return a
};

function jpgMoviePlayer(c, b, a) {
    this.setDivName(c);
    this.setImageWidth(b);
    this.setImageHeight(a);
    this.interval = 175;
    this.aSpeeds = new Array();
    this.aSpeeds[1] = 700;
    this.aSpeeds[2] = 350;
    this.aSpeeds[3] = 175;
    this.aSpeeds[4] = 88;
    this.aSpeeds[5] = 44;
    this.bTargetEnabled = 0;
    this.defaultTarget = "http://www.entre-cabanes.net";
    this.bLoaded = false;
    this.bAutoPlay = false;
    this.bLooping = false;
    this.movie = null;
    this.divMovieScreen = null;
    this.divBuffering = null;
    this.divPlayButton = null;
    this.frameSlider = null;
    this.urlImageBase = ""
}
jpgMoviePlayer.prototype.divName;
jpgMoviePlayer.prototype.name;
jpgMoviePlayer.prototype.img;
jpgMoviePlayer.prototype.width;
jpgMoviePlayer.prototype.height;
jpgMoviePlayer.prototype.playerWidth;
jpgMoviePlayer.prototype.playerHeight;
jpgMoviePlayer.prototype.bTargetEnabled;
jpgMoviePlayer.prototype.defaultTarget;
jpgMoviePlayer.prototype.interval;
jpgMoviePlayer.prototype.bLoaded;
jpgMoviePlayer.prototype.bAutoPlay;
jpgMoviePlayer.prototype.bLooping;
jpgMoviePlayer.prototype.movie;
jpgMoviePlayer.prototype.divMovieScreen;
jpgMoviePlayer.prototype.divBuffering;
jpgMoviePlayer.prototype.divPlayButton;
jpgMoviePlayer.prototype.frameSlider;
jpgMoviePlayer.prototype.urlImageBase;
jpgMoviePlayer.prototype.aSpeeds;
jpgMoviePlayer.prototype.setDivName = function(a) {
    this.divName = a;
    this.name = "jm_" + a + ".player"
};
jpgMoviePlayer.prototype.setInitialImage = function(a) {
    if (a.indexOf("http://") == 0) {
        this.img = a
    } else {
        if (a.indexOf("https://") == 0) {
            this.img = a
        } else {
            this.img = this.urlImageBase + a
        }
    }
};
jpgMoviePlayer.prototype.setImageWidth = function(a) {
    this.width = a
};
jpgMoviePlayer.prototype.setImageHeight = function(a) {
    this.height = a
};
jpgMoviePlayer.prototype.setPlayerWidth = function(a) {
    this.playerWidth = a
};
jpgMoviePlayer.prototype.setPlayerHeight = function(a) {
    this.playerHeight = a
};
jpgMoviePlayer.prototype.setTargetEnabledOn = function() {
    this.bTargetEnabled = true
};
jpgMoviePlayer.prototype.setTargetEnabledOff = function() {
    this.bTargetEnabled = false
};
jpgMoviePlayer.prototype.setTargetEnabled = function(a) {
    if (a > 0) {
        this.setTargetEnabledOn()
    } else {
        this.setTargetEnabledOff()
    }
};
jpgMoviePlayer.prototype.setAutoPlayOn = function() {
    this.bAutoPlay = true
};
jpgMoviePlayer.prototype.setAutoPlayOff = function() {
    this.bAutoPlay = false
};
jpgMoviePlayer.prototype.setAutoPlay = function(a) {
    if (a > 0) {
        this.setAutoPlayOn()
    } else {
        this.setAutoPlayOff()
    }
};
jpgMoviePlayer.prototype.setLoopingOn = function() {
    this.bLooping = true
};
jpgMoviePlayer.prototype.setLoopingOff = function() {
    this.bLooping = false
};
jpgMoviePlayer.prototype.setLooping = function(a) {
    if (a > 0) {
        this.setLoopingOn()
    } else {
        this.setLoopingOff()
    }
};
jpgMoviePlayer.prototype.setTarget = function(a) {
    this.defaultTarget = a;
    if (this.movie != null) {
        this.movie.setDefaultTarget(Target)
    }
};
jpgMoviePlayer.prototype.setImageUrlBase = function(a) {
    this.urlImageBase = a;
    if (this.movie != null) {
        this.movie.setImageUrlBase(a)
    }
};
jpgMoviePlayer.prototype.setFramesUntilPlayable = function(a) {
    this.cFramesUntilPlayable = a;
    if (this.movie != null) {
        this.movie.setFramesUntilPlayable(a)
    }
};
jpgMoviePlayer.prototype.setInterval = function(a) {
    this.interval = a;
    this.aSpeeds[1] = this.interval * 4;
    this.aSpeeds[2] = this.interval * 2;
    this.aSpeeds[3] = this.interval;
    this.aSpeeds[4] = Math.ceil(this.interval / 2);
    this.aSpeeds[5] = Math.ceil(this.interval / 4);
    if (this.movie != null) {
        this.movie.setInterval(this.interval)
    }
};
jpgMoviePlayer.prototype.useSpeed = function(b) {
    this.interval = this.aSpeeds[b];
    if (this.speed_adjusters != null) {
        if (this.speed_adjusters[b] != null) {
            var a = document.getElementById(this.divName + "_speed_adjuster");
            if (a != null) {
                a.src = this.speed_adjusters[b].src
            }
        }
    }
    if (this.movie != null) {
        this.movie.setInterval(this.interval)
    }
};
jpgMoviePlayer.prototype.getInterval = function() {
    if (this.movie != null) {
        return this.movie.getInterval()
    } else {
        return this.interval
    }
};
jpgMoviePlayer.prototype.styleZeroExtraSpace = function() {
    return "margin: 0px; border: 0px solid white; padding: 0px;"
};
jpgMoviePlayer.prototype.draw = function() {
    this.preDrawInit();
    var a = "";
    a += "<TABLE BORDER=0 CELLSPACING=0 CELLPADDING=2>\n";
    a += "<TR>\n";
    a += "<TD ALIGN=center>\n";
    a += '<img src="' + this.img + '" width="' + this.width + '" height="' + this.height + '" ID="' + this.divName + '_screen">';
    a += "</TD>\n";
    a += "<TR>\n";
    a += '<DIV ID="' + this.divName + '_play_button"></DIV>\n';
    a += "</TD>\n";
    a += "</TR>\n";
    a += "</TABLE>\n";
    var b = document.getElementById(this.divName);
    if (b) {
        b.innerHTML = a
    } else {
        alert("jpgMoviePlayer.draw: no such div :" + this.divName + ":")
    }
};
jpgMoviePlayer.prototype.addFrame = function(a) {
    if (this.movie == null) {
        this._createMovie(a, "")
    }
    this.movie.addFrame(a)
};
jpgMoviePlayer.prototype.addFrameWithTarget = function(a, b) {
    if (this.movie == null) {
        this._createMovie(a, b)
    }
    this.movie.addFrameWithTarget(a, b)
};
jpgMoviePlayer.prototype._createMovie = function(a, b) {
    this.movie = new jpgMovie();
    this.movie.setInterval(this.interval);
    if (b == "") {
        this.movie.setDefaultTarget(this.defaultTarget)
    }
    this.movie.setFramesUntilPlayable(this.cFramesUntilPlayable);
    this.movie.setImageUrlBase(this.urlImageBase);
    this.movie.setPlayer(this)
};
jpgMoviePlayer.prototype.loadFromUrl = function(a) {
    this.movie = new jpgMovie();
    this.movie.setPlayer(this);
    this.movie.loadFromUrl(a);
    return false
};
jpgMoviePlayer.prototype.loadFromUrlOnDemand = function(a, b) {
    this.setInitialImage(a);
    this.setTarget('#" onClick="jm_' + this.divName + ".loadFromUrl('" + b + "'); return false;");
    this.setTargetEnabledOn();
    this.draw();
    this.showLoadOnDemandButton(b);
    this.setTarget("http://www.entre-cabanes.net");
    this.setTargetEnabledOff()
};
jpgMoviePlayer.prototype.preDrawInit = function() {
    if (this.divPlayButton != null) {
        this.divPlayButton = null
    }
    if (this.divBuffering != null) {
        this.divBuffering = null
    }
};
jpgMoviePlayer.prototype.showFrame = function(c, b, a) {
    if (this.movieScreen == null) {
        this.movieScreen = document.getElementById(this.divName + "_screen")
    }
    if (this.frameTarget == null) {
        this.frameTarget = document.getElementById(this.divName + "_target")
    }
    if (this.movieScreen != null) {
        this.movieScreen.src = c
    }
    if (this.frameTarget != null) {
        this.frameTarget.href = b
    }
    if (this.frameSlider != null) {
        this.frameSlider.setValue(a)
    }
};
jpgMoviePlayer.prototype.bufferedStatusCB = function(a) {
    if (this.divBuffering == null) {
        this.divBuffering = document.getElementById(this.divName + "_buffering")
    }
    if (this.divBuffering != null) {
        this.divBuffering.innerHTML = "Buffering: " + a + " %"
    }
};
jpgMoviePlayer.prototype.movieLoadedCB = function() {
    this.bLoaded = true;
    this.clearBufferingStatus();
    this.showPlayButton();
    if (this.bAutoPlay) {
        this.play()
    }
};
jpgMoviePlayer.prototype.playFinishedCB = function() {
    if (this.bLooping) {
        this.play()
    } else {
        this.showPlayButton()
    }
};
jpgMoviePlayer.prototype.playRange = function(b, a) {
    this.movie.playRange(b, a);
    this.showPauseButton();
    return false
};
jpgMoviePlayer.prototype.play = function() {
    this.movie.play();
    this.showPauseButton();
    return false
};
jpgMoviePlayer.prototype.pause = function() {
    this.movie.pause();
    this.showPlayButton();
    return false
};
jpgMoviePlayer.prototype.setFrame = function(a) {
    this.movie.setFrame(a);
    return false
};
jpgMoviePlayer.prototype.backFrame = function() {
    this.movie.backFrame();
    return false
};
jpgMoviePlayer.prototype.forwardFrame = function() {
    this.movie.forwardFrame();
    return false
};
jpgMoviePlayer.prototype.getFrameNumber = function() {
    return this.movie.getFrameNumber()
};
jpgMoviePlayer.prototype.clearBufferingStatus = function() {
    if (this.divBuffering == null) {
        this.divBuffering = document.getElementById(this.divName + "_buffering")
    }
    if (this.divBuffering != null) {
        this.divBuffering.innerHTML = "";
        this.divBuffering.style.display = "none"
    }
};
jpgMoviePlayer.prototype.showPauseButton = function() {
    if (this.divPlayButton == null) {
        this.divPlayButton = document.getElementById(this.divName + "_play_button")
    }
    if (this.divPlayButton != null) {
        if (this.pause_button != null) {
            this.divPlayButton.innerHTML = '<A HREF="#" onClick="jm_' + this.divName + '.pause(); return false;"><IMG SRC="' + this.pause_button.src + '" BORDER=0></A>'
        } else {
            this.divPlayButton.innerHTML = '<A HREF="#" onClick="jm_' + this.divName + '.pause(); return false;">PAUSE</A>'
        }
    }
};
jpgMoviePlayer.prototype.showPlayButton = function() {
    if (this.divPlayButton == null) {
        this.divPlayButton = document.getElementById(this.divName + "_play_button")
    }
    if (this.divPlayButton != null) {
        var b = "";
        if (this.back_button != null) {
            b += '<A HREF="#" onClick="jm_' + this.divName + '.backFrame(); return false;"><IMG SRC="' + this.back_button.src + '" BORDER=0></A>'
        }
        if (this.play_button != null) {
            b += '<A HREF="#" onClick="jm_' + this.divName + '.play(); return false;"><IMG SRC="' + this.play_button.src + '" BORDER=0 HSPACE=10></A>'
        } else {
            b += '<A HREF="#" onClick="jm_' + this.divName + '.play(); return false;">PLAY</A>'
        }
        if (this.forward_button != null) {
            b += '<A HREF="#" onClick="jm_' + this.divName + '.forwardFrame(); return false;"><IMG SRC="' + this.forward_button.src + '" BORDER=0></A>'
        }
        this.divPlayButton.innerHTML = b
    }
    var a = document.getElementById(this.divName + "_speeds");
    if (a != null) {
        a.style.display = "block"
    }
};
jpgMoviePlayer.prototype.showLoadOnDemandButton = function(b) {
    var a = document.getElementById(this.divName + "_screen");
    if (a != null) {
        var d = a.offsetParent;
        if (d != null) {
            var c = d.innerHTML;
            var f = a.offsetTop ;
            var e = a.offsetLeft ;
            c += '<DIV STYLE="position:absolute; top:' + e + "px; left:" + e + 'px;"><A HREF="#" onClick="jm_' + this.divName + ".loadFromUrl('" + b + '\'); return false;"><IMG SRC="http://www.entre-cabanes.net/js_images/playondemand.png" WIDTH=' + this.width + ' HEIGHT=' + this.height + '  BORDER=0></A></DIV>';
            d.innerHTML = c
        }
    }
  //  if (this.divPlayButton == null) {
   //     this.divPlayButton = document.getElementById(this.divName + "_play_button")
   // }

    if (this.divPlayButton != null) {
        var c = "";
        if (this.play_button != null) {
            c += '<A HREF="#" onClick="jm_' + this.divName + ".loadFromUrl('" + b + '\'); return false;"><IMG SRC="' + this.play_button.src + '" BORDER=0 HSPACE=10></A>'
        } else {
            c += '<A HREF="#" onClick="jm_' + this.divName + ".loadFromUrl('" + b + "'); return false;\">Click to Load/Play</A>"
        }
        this.divPlayButton.innerHTML = c
    }
};
jpgMoviePlayer.prototype.getControlHtml_RegularSpeedAdjuster = function(a) {
    var b = "";
    b += '  <IMG ID="' + this.divName + '_speed_adjuster" SRC="' + a + '" WIDTH=140 HEIGHT=19 BORDER=0 usemap="#' + this.divName + '_speed_adjuster_map">';
    b += '  <MAP NAME="' + this.divName + '_speed_adjuster_map">';
    b += '  <AREA shape=circle coords="61,10,7"  style="outline:none" href="#" onClick="jm_' + this.divName + '.useSpeed(1); return false;">';
    b += '  <AREA shape=circle coords="79,10,7" style="outline:none" href="#" onClick="jm_' + this.divName + '.useSpeed(2); return false;">';
    b += '  <AREA shape=circle coords="96,10,7" style="outline:none" href="#" onClick="jm_' + this.divName + '.useSpeed(3); return false;">';
    b += '  <AREA shape=circle coords="114,10,7" style="outline:none" href="#" onClick="jm_' + this.divName + '.useSpeed(4); return false;">';
    b += '  <AREA shape=circle coords="131,10,7" style="outline:none" href="#" onClick="jm_' + this.divName + '.useSpeed(5); return false;">';
    b += "  </MAP>";
    return b
};
jpgMoviePlayer.prototype.toXml = function() {
    var a = "";
    a += "<JPGMOVIEPLAYER>\n";
    a += "  <version>1.1.3</version>\n";
    a += "  <img>" + this.img + "</img>\n";
    a += "  <target_enabled>" + this.bTargetEnabled + "</target_enabled>\n";
    a += "  <auto_play>" + this.bAutoPlay + "</auto_play>\n";
    a += "  <looping>" + this.bLooping + "</looping>\n";
    a += "  <width>" + this.width + "</width>\n";
    a += "  <height>" + this.height + "</height>\n";
    a += "  <player_width>" + this.playerWidth + "</player_width>\n";
    a += "  <player_height>" + this.playerHeight + "</player_height>\n";
    a += "</JPGMOVIEPLAYER>\n";
    return a
};

function jpgMovieSliderPlayer(c, b, a) {
    this.setDivName(c);
    this.setImageWidth(b);
    this.setImageHeight(a);
    this.speedSliderIntervals = null
}
jpgMovieSliderPlayer.prototype = new jpgMoviePlayer();
jpgMovieSliderPlayer.prototype.speedSliderIntervals;
jpgMovieSliderPlayer.prototype.setIntervalsForSpeedSlider = function(a) {
    this.speedSliderIntervals = a.slice(0)
};
jpgMovieSliderPlayer.prototype._initialiseSpeedSliderIntervals = function() {
    if (this.speedSliderIntervals == null) {
        this.speedSliderIntervals = new Array();
        this.speedSliderIntervals[0] = this.interval * 4;
        this.speedSliderIntervals[1] = this.interval * 2;
        this.speedSliderIntervals[2] = this.interval;
        this.speedSliderIntervals[3] = Math.ceil(this.interval / 2);
        this.speedSliderIntervals[4] = Math.ceil(this.interval / 4)
    }
};
jpgMovieSliderPlayer.prototype._locateBestSpeedSliderStartingPosition = function() {
    var b = 0;
    var c = 0;
    var a = this.speedSliderIntervals.length;
    var d = false;
    if (a > 0) {
        for (c = 0; c < a; c++) {
            if (this.interval == this.speedSliderIntervals[c]) {
                d = true;
                b = c
            }
        }
        if (!d) {
            for (c = 0; c < a; c++) {
                if (this.interval > this.speedSliderIntervals[c]) {
                    d = true;
                    b = c
                }
            }
        }
        if (!d) {
            b = Math.floor(this.speedSliderIntervals.length / 2)
        }
    }
    return b
};
jpgMovieSliderPlayer.prototype.equipSlider = function() {
    var a = $(this.divName + "_frame_slider");
    var e = $(this.divName + "_speed_slider");
    var d = this;
    var b = 1;
    if (a != null) {
        if (this.movie != null) {
            b = this.movie.cFrames - 1
        } else {
            alert("Trying to equip the FRAME SLIDER before the movie has been loaded\n will result in a slider without the full range of frames")
        }
        this.frameSlider = new Control.Slider(a.down(".handle"), a, {
            range: $R(0, b),
            sliderValue: 0,
            onSlide: function(f) {
                d.setFrame(parseInt(f))
            }
        })
    }
    if (e != null) {
        this._initialiseSpeedSliderIntervals();
        b = this.speedSliderIntervals.length - 1;
        var c = this._locateBestSpeedSliderStartingPosition();
        this.speedSlider = new Control.Slider(e.down(".handle"), e, {
            range: $R(0, b),
            sliderValue: c,
            onSlide: function(f) {
                d.setInterval(d.getIntervalFromSpeedSlider(d, parseInt(f)))
            }
        })
    }
};
jpgMovieSliderPlayer.prototype.getIntervalFromSpeedSlider = function(b, a) {
    return b.speedSliderIntervals[a]
};
jpgMovieSliderPlayer.prototype.showPauseButton = function() {
    if (this.divPlayButton == null) {
        this.divPlayButton = document.getElementById(this.divName + "_play_button")
    }
    if (this.divPlayButton != null) {
        if (this.pause_button != null) {
            this.divPlayButton.innerHTML = '<A HREF="#" onClick="jm_' + this.divName + '.pause(); return false;"><IMG SRC="' + this.pause_button.src + '" BORDER=0></A>'
        } else {
            this.divPlayButton.innerHTML = '<A HREF="#" onClick="jm_' + this.divName + '.pause(); return false;">PAUSE</A>'
        }
    }
    var a = document.getElementById(this.divName + "_frame_slider_handle");
    if (a != null) {
        a.style.display = "block"
    }
};
jpgMovieSliderPlayer.prototype.showPlayButton = function() {
    if (this.divPlayButton == null) {
        this.divPlayButton = document.getElementById(this.divName + "_play_button")
    }
    if (this.divPlayButton != null) {
        var b = "";
        if (this.back_button != null) {
            b += '<A HREF="#" onClick="jm_' + this.divName + '.backFrame(); return false;"><IMG SRC="' + this.back_button.src + '" BORDER=0></A>'
        }
        if (this.play_button != null) {
            b += '<A HREF="#" onClick="jm_' + this.divName + '.play(); return false;"><IMG SRC="' + this.play_button.src + '" BORDER=0 HSPACE=10></A>'
        } else {
            b += '<A HREF="#" onClick="jm_' + this.divName + '.play(); return false;">PLAY</A>'
        }
        if (this.forward_button != null) {
            b += '<A HREF="#" onClick="jm_' + this.divName + '.forwardFrame(); return false;"><IMG SRC="' + this.forward_button.src + '" BORDER=0></A>'
        }
        this.divPlayButton.innerHTML = b
    }
    var a = document.getElementById(this.divName + "_speeds");
    if (a != null) {
        a.style.display = "block"
    }
    var c = document.getElementById(this.divName + "_frame_slider");
    if (c != null) {
        c.style.display = "block"
    }
    var d = document.getElementById(this.divName + "_speed_slider");
    if (d != null) {
        d.style.display = "block"
    }
    var f = document.getElementById(this.divName + "_frame_slider_handle");
    if (f != null) {
        f.style.display = "block"
    }
    var e = document.getElementById(this.divName + "_speed_slider_handle");
    if (e != null) {
        e.style.display = "block"
    }
};
jpgMovieSliderPlayer.prototype.movieLoadedCB = function() {
    this.bLoaded = true;
    this.clearBufferingStatus();
    this.showPlayButton();
    this.equipSlider();
    if (this.bAutoPlay) {
        this.play()
    }
};

function jpgMovieFramelessSliderPlayer(c, b, a) {
    this.setDivName(c);
    this.setImageWidth(b);
    this.setImageHeight(a);
    this.setPlayerWidth(b);
    this.setPlayerHeight(a + 59 + 16)
}
jpgMovieFramelessSliderPlayer.prototype = new jpgMovieSliderPlayer();
jpgMovieFramelessSliderPlayer.prototype.draw = function() {
    this.preDrawInit();
    this.play_button = new Image();
    this.play_button.src = "http://www.entre-cabanes.net/js_images/play.png";
    this.pause_button = new Image();
    this.pause_button.src = "http://www.entre-cabanes.net/js_images/pause.png";
    this.back_button = new Image();
    this.back_button.src = "http://www.entre-cabanes.net/js_images/back.png";
    this.forward_button = new Image();
    this.forward_button.src = "http://www.entre-cabanes.net/js_images/forward.png";
    this.speed_adjusters = new Array();
    this.speed_adjusters[1] = new Image();
    this.speed_adjusters[1].src = "http://www.entre-cabanes.net/js_images/speed_adjuster_1.png";
    this.speed_adjusters[2] = new Image();
    this.speed_adjusters[2].src = "http://www.entre-cabanes.net/js_images/speed_adjuster_2.png";
    this.speed_adjusters[3] = new Image();
    this.speed_adjusters[3].src = "http://www.entre-cabanes.net/js_images/speed_adjuster_3.png";
    this.speed_adjusters[4] = new Image();
    this.speed_adjusters[4].src = "http://www.entre-cabanes.net/js_images/speed_adjuster_4.png";
    this.speed_adjusters[5] = new Image();
    this.speed_adjusters[5].src = "http://www.entre-cabanes.net/js_images/speed_adjuster_5.png";
    var a = "";
   // a += '<DIV STYLE="width:' + this.playerWidth + "px; height:" + this.playerHeight + 'px; background-color:#FFFFFF; text-align:center">';
   // a += '<A HREF="http://www.JpgMovie.com"><IMG SRC="http://www.JpgMovie.com/images/player/frameless/tabbed_title.jpg" WIDTH=100 HEIGHT=16 BORDER=0></A>';
    //a += '<DIV STYLE="border:2px solid #000000; min-width:' + ((this.width)/2) + "px; height:" + this.height +'px;background-color:#000000;">\n'; //créer le div avec les commandes
   // a += '<DIV STYLE="background-color:transparent; width:' + this.playerWidth + "px; height:" + (this.playerHeight - 16) + 'px; margin:0 0; padding:0; text-align:left;">\n';
    //a += '<DIV STYLE="border:2px solid #000000; margin:0px 0px 0px 0px; position:relative; padding-bottom:40px; max-width:' + this.width + 'px;  background-color:transparent;">\n'; //fait disparaitre l'image de play de départ
    if (this.bTargetEnabled) {
        a += '<DIV STYLE="border:0px solid #000000; margin:0px 0px 0px 0px; position:relative;height:0px; max-width:' + this.width + 'px;  background-color:#686886;">\n';
        a += '<A ID="' + this.divName + '_target" HREF="' + this.defaultTarget + '"><img src="' + this.img + '" ID="' + this.divName + '_screen" BORDER=0></A>\n'
    } else {
        a += '<DIV STYLE="border:0px solid #000000; margin:0px 0px 0px 0px; position:relative; padding-bottom:20px; max-width:' + this.width + 'px;  background-color:#686886;">\n';
        a += '<img src="' + this.img + '" ID="' + this.divName + '_screen" BORDER=0>\n'
   }
    a += '<DIV ID="' + this.divName + '_play_button" STYLE="margin:3px 0px 3px 0px; padding:0; position:relative; background-color:transparent; text-align:center;"></DIV>';
   // var b = parseInt(((this.playerWidth - 109 - 136) / 2));
    a += '<DIV ID="' + this.divName + '_buffering" STYLE="text-align:center;"></DIV>';
   // a += '<DIV STYLE="width:170px; margin:0px 0px 0px 0px; float:left;">';
   // a += '  <DIV ID="' + this.divName + '_frame_slider" STYLE="margin:6px 0px 0px 5px; width:170px; height:11px; background-image: url(http://www.entre-cabanes.net/js_images/slider-bg.png); no-repeat; text-align: left; display: none;"><DIV ID="' + this.divName + '_frame_slider_handle" class="handle" STYLE=" width:16px; height:16px; background-color:transparent; cursor:move; display:none;"><IMG SRC="http://www.entre-cabanes.net/js_images/slider.png" WIDTH=16 HEIGHT=16 BORDER=0 ></DIV></DIV>';
   //a += "</DIV>\n";
    a += '<DIV STYLE="width:140px; height:19px; margin:0 auto;">';
    a += '  <DIV ID="' + this.divName + '_speeds" STYLE="margin:5px 0px 5px 0px; background-color:transparent; display: none;">';
    a += this.getControlHtml_RegularSpeedAdjuster(this.speed_adjusters[3].src);
    a += "  </DIV>\n";
    a += "</DIV>\n";
    a += "</DIV>\n";
    a += "</DIV>\n";
    a += "</DIV>\n";
    a += "</DIV>\n";
    var c = document.getElementById(this.divName);
    if (c) {
        c.innerHTML = a
    } else {
        alert("jpgMoviePlayer.draw: no such div :" + this.divName + ":")
    }
};

function jpgMovieFactory(pName, pClass, pImageWidth, pImageHeight, pPlayerWidth, pPlayerHeight) {
    var str = "jm_" + pName + " = new " + pClass + "( '" + pName + "', " + pImageWidth + ", " + pImageHeight + ", " + pPlayerWidth + ", " + pPlayerHeight + "  );";
    eval(str);
    str = "var ret = jm_" + pName;
    eval(str);
    return ret
};