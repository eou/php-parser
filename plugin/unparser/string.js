/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/tharzen/php-parser
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
  unparseString: function(node) {
    if (node.kind !== "string") {
      throw new Error("Wrong node kind: " + node.kind + ", should be string");
    }

    this.code += node.raw;

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
