/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/eou/php-parser
 */
"use strict";

/**
 * Unparse a string (simple ou double quoted)
 * kind: "string"
 * loc: Location {}
 * {boolean} unicode
 * {boolean} isDoubleQuote
 */
module.exports = {
  unparse_string: function(node) {
    if (node.kind !== "string") {
      throw new Error("Wrong node kind: " + node.kind + ", should be string");
    }

    this.code += node.raw;

    this.row = node.loc.end.line - 1;
    this.col = node.loc.end.column;
  }
};
