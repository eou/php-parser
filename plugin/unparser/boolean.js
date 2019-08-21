/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/tharzen/php-parser
 */
"use strict";

/**
 * Unparse a boolean value (true/false)
 * kind: "boolean"
 * loc: Location {}
 */
module.exports = {
  unparseBoolean: function(node) {
    if (node.kind !== "boolean") {
      throw new Error("Wrong node kind: " + node.kind + ", should be boolean");
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