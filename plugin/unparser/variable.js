/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/tharzen/php-parser
 */
"use strict";

/**
 * Unparse any expression node. Since the left-hand side of an assignment may
 * be any expression in general, an expression can also be a pattern.
 * kind: "variable"
 * loc: Location {}
 * {String|Node} name The variable name (can be a complex expression when the name is resolved dynamically)
 * {boolean} byref Indicate if the variable reference is used, ex `&$foo`
 * {boolean} curly Indicate if the name is defined between curlies, ex `${foo}`
 */
module.exports = {
  unparseVariable: function(node) {
    if (node.kind !== "variable") {
      throw new Error("Wrong node kind: " + node.kind + ", should be variable");
    }
    
    if (node.byref && node.curly) {
      this.code += "&${" + node.name + "}";
    } else if (node.curly) {
      this.code += "${" + node.name + "}";
    } else if (node.byref) {
      this.code += "&$" + node.name;
    } else {
      this.code += "$" + node.name;
    }



    if (node.loc.last) {
      // this node is followed by the end of statement ';'
      this.row = node.loc.last.line - 1;
      this.col = node.loc.last.column;
    } else {
      this.row = node.loc.end.line - 1;
      this.col = node.loc.end.column;
    }
  }
};
