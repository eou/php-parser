/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/eou/php-parser
 */
"use strict";

/**
 * Unparse a if statement
 * kind: "if"
 * loc: Location {}
 * {Expression} test
 * {Block} body
 * {Block|If|null} alternate
 * {boolean} shortForm
 */
module.exports = {
  unparseIf: function(node) {
    if (node.kind !== "if") {
      throw new Error("Wrong node kind: " + node.kind + ", should be if");
    }

    // unparse if condition statement
    this.code += "if";
    this.col += 2;
    this.updateBlanks(node.test.loc.leftParLoc.line - 1, node.test.loc.leftParLoc.column);
    this.code += "(";
    this.col += 1;
    this.unparseNode(node.test); // e.g. "bin"
    this.updateBlanks(node.test.loc.rightParLoc.line - 1, node.test.loc.rightParLoc.column);
    this.code += ")";
    this.col += 1;

    if (node.shortForm) {
      /**
       * if():
       * elseif():
       * else:
       * endif;
       */
      this.updateBlanks(node.loc.colonLoc.line - 1, node.loc.colonLoc.column - 1);
      this.code += ":";
      this.col += 1;
      this.unparseNode(node.body);

      let _node = node.alternate;
      this.updateBlanks(_node.loc.start.line - 1, _node.loc.start.column);
      _node.loc.start.col += 4;
      this.code += "else";
      this.col += 4;
      this.unparseNode(_node);

      if (node.loc.endifLoc !== undefined) {
        this.updateBlanks(node.loc.endifLoc.line - 1, node.loc.endifLoc.column);
        this.code += "endif";
        this.col += 5;
        this.updateBlanks(node.loc.end.line - 1, node.loc.end.column - 1);
        this.code += ";";
        this.col += 1;
      }
    } else {
      /**
       * if() {}
       * else if() {}
       * elseif() {}
       * else {}
       */
    }

    this.row = node.loc.end.line - 1;
    this.col = node.loc.end.column;
  }
};
