/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/tharzen/php-parser
 */
"use strict";

/**
 * Unparse a break statement
 * kind: "break"
 * loc: Location {}
 */
module.exports = {
  unparseBreak: function(node) {
    if (node.kind !== "break") {
      throw new Error("Wrong node kind: " + node.kind + ", should be break");
    }

    this.code += "break";
    if (node.level !== null) {
        this.unparseNode(node.level);
    }
    this.updateBlanks(node.loc.end.line - 1, node.loc.end.column - 1);
    this.code += ";";
    this.col += 1;

    this.row = node.loc.end.line - 1;
    this.col = node.loc.end.column;
  }
};
