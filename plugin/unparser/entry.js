/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/tharzen/php-parser
 */
"use strict";

/**
 * Unparse an array entry - see [Array](#array)
 * kind: "entry"
 * loc: Location {}
 * {Node|null} key The entry key/offset
 * {Node} value The entry value
 * {Postion} arrowLoc
 */
module.exports = {
  unparseEntry: function(node) {
    if (node.kind !== "entry") {
      throw new Error("Wrong node kind: " + node.kind + ", should be entry");
    }

    this.unparseNode(node.key);
    this.updateBlanks(node.arrowLoc.line - 1, node.arrowLoc.column - 2);
    this.code += "=>";
    this.col += 2;
    this.unparseNode(node.value);

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
