(function() {

  var exports = typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : {};

  var templates = {},
      rAmp = /&/g,
      rLt = /</g,
      rGt = />/g,
      rApos = /\'/g,
      rQuot = /\"/g,
      escabable = /[&<>\"\']/,
      modifiers = {};

  /**
     * Safely fetches the requested value from a deep hash.
     * Usable to bypass nullchecks.
     * e.g.:
     * JSONutils.get({a: { b: { c: "foo" }}, "a.b.c"); ---> "foo"
     * JSONutils.get({a: { b: { c: "foo" }}, "a.b.c.d.e"); ---> undefined
     * @param obj
     * @param key
     */
  function get(obj, key) {
    var path = key.split("."),
        item = obj;
    for(var i=0, l=path.length; i<l; i++) {
      item = item[path[i]];
      if(!item)
        return item;
    }
    return item;
  }

  function isFunction(value) {
    return (value && value.constructor) == Function;
  }

  exports.TinyTemplate = {

    getBuiltTemplates: function() {
      return templates;
    },

    registerModifier: function(key, mod) {
      modifiers[key] = mod
    },

    /** 
     * build("my-template", '<div>{foo}</div>') -> []
     * build('<div>{foo}</div>') -> []
     */
    build: function(id, template) {
      if(!template) {
        template = id;
      }
      if(templates[id]) {
        return templates[id];
      } else {
        var r = template.split('{'), 
            compiledTemplate = [];
        for(var i=0; i<r.length; i++) {
          compiledTemplate = compiledTemplate.concat(r[i].split("}"));
        }
        templates[id] = compiledTemplate;
        return compiledTemplate;
      }
    },

    /**
     * render('my-template', {foo: "bar"})
     * render('my-template', [{foo: "bar"}, {foo: "baz"}])
     * render('<div>{foo}</div>', {foo: "bar"})
     * render($('#my-template'), {foo: "bar"})
     */
    render: function (template, values) {
      if(values && values.constructor == Array) {
        var result = "";
        for(var i=0, l=values.length; i<l; i++) {
          result += this.render(template, values[i]);
        }
        return result;
      } 

      else {
        var t = template.constructor == exports.$ ? template.html() : isFunction(template) ? template(values) : template + "",
            builtTemplate = this.build(t),
            result = [];

        for(var i=0; i<builtTemplate.length; i++) {
          var key = builtTemplate[i], value = "";
          if(i%2==0) {
            result.push(key);
          }else {

            var mod = modifiers[key.split(".")[0]];

            if(mod) {
              var scope = {
                i: i,
                builtTemplate: builtTemplate,
                result: result
              };
              value = mod(key, values, scope);
              i = scope.i;
            }

            //if value is empty, don't render the next block
            else if(key[0] == "?") {
              value = get(values, builtTemplate[i].slice(1));
              value = isFunction(value) ? value() : value;
              if(StringUtils.empty(value)) {
                while(builtTemplate[i] != "/") {
                  i++;
                }
              }
              value = ""
            }

            //if value is empty, render the next block
            else if(key[0] == "!") {
              value = get(values, builtTemplate[i].slice(1));
              value = isFunction(value) ? value() : value;
              if(!StringUtils.empty(value)) {
                while(builtTemplate[i] != "/") {
                  i++;
                }
              }
              value = ""
            }

            else if(key[0] == "/") {
              value = "";
            }

            else if(key[0] == "&") {
              value = get(values, key.slice(1));
            } 

            else {
              value = get(values, key);
            }

            if(isFunction(value)) {
              value = value()
            }

            if(value === null || value === undefined) {
              value = ""
            }

            if(builtTemplate[i][0] != "&") {
              value = escabable.test(value) ?
                value
                  .replace(rAmp, '&amp;')
                  .replace(rLt, '&lt;')
                  .replace(rGt, '&gt;')
                  .replace(rApos, '&#39;')
                  .replace(rQuot, '&quot;') :
                value;              
            }

            result.push(value);
          }
        }
        return result.join("");
      }

    }

  }
  
}());
