/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/tharzen/php-parser
 */
"use strict";

/**
 * Unparse a short if statement that returns a value
 * kind: "retif"
 * loc: Location {}
 * {Expression} test
 * {Expression} trueExpr
 * {Expression} falseExpr
 */
module.exports = {
  unparseRetif: function(node) {
    if (node.kind !== "retif") {
      throw new Error("Wrong node kind: " + node.kind + ", should be retif");
    }

    this.unparseNode(node.test);
    this.updateBlanks(node.loc.questionmarkLoc.line - 1, node.loc.questionmarkLoc.column - 1);
    this.code += "?";
    this.col += 1;
    this.unparseNode(node.trueExpr);
    this.updateBlanks(node.loc.colonmarkLoc.line - 1, node.loc.colonmarkLoc.column - 1);
    this.code += ":";
    this.col += 1;
    this.unparseNode(node.falseExpr);

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
