/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/tharzen/php-parser
 */
"use strict";

/**
 * Unparse Binary operations
 * kind: "bin"
 * loc: Location {}
 * {Postion, String} type
 * {Expression} left
 * {Expression} right
 */
module.exports = {
  unparseBin: function(node) {
    if (node.kind !== "bin") {
      throw new Error("Wrong node kind: " + node.kind + ", should be bin");
    }

    this.unparseNode(node.left);
    this.updateBlanks(node.type.startLoc.line - 1, node.type.startLoc.column);
    this.code += node.type.sign;
    this.col += node.type.sign.length;
    this.unparseNode(node.right);

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
