/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/eou/php-parser
 */
"use strict";

/**
 * Unparse inline html output (treated as echo output)
 * kind: "inline"
 * loc: Location {}
 * {string} raw
 * {Node|string|number|boolean|null} value
 */
module.exports = {
  unparse_inline: function(node) {
    if (node.kind !== "inline") {
      throw new Error("Wrong node kind: " + node.kind + ", should be inline");
    }

    this.code += node.raw;

    this.row = node.loc.end.line - 1;
    this.col = node.loc.end.column;
  }
};
