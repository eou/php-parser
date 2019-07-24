/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/eou/php-parser
 */
"use strict";

/**
 * Unparse a numeric value
 * kind: "number"
 * loc: Location {}
 * {String} value
 */
module.exports = {
  unparse_number: function(node) {
    if (node.kind !== "number") {
      throw new Error("Wrong node kind: " + node.kind + ", should be number");
    }

    this.code += node.value;

    this.row = node.loc.end.line - 1;
    this.col = node.loc.end.column;
  }
};
