/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/eou/php-parser
 */
"use strict";

/**
 * Unparse a for iterator
 * kind: "for"
 * loc: Location {}
 * {Expression[]} init
 * {Expression[]} test
 * {Expression[]} increment
 * {Statement} body
 * {boolean} shortForm  for(): ... endFor;
 * http://php.net/manual/en/control-structures.for.php
 */
module.exports = {
  unparseFor: function(node) {
    if (node.kind !== "for") {
      throw new Error("Wrong node kind: " + node.kind + ", should be for");
    }

    // for ( ; ; )
    this.code += "for";
    this.updateBlanks(node.loc.leftParLoc.line - 1, node.loc.leftParLoc.column);
    this.code += "(";
    this.col += 1;

    node.init.forEach(child => {
      this.unparseNode(child);
    });
    this.updateBlanks(
      node.loc.fstSemiColLoc.line - 1,
      node.loc.fstSemiColLoc.column
    );
    this.code += ";";
    this.col += 1;

    node.test.forEach(child => {
      this.unparseNode(child);
    });
    this.updateBlanks(
      node.loc.sndSemiColLoc.line - 1,
      node.loc.sndSemiColLoc.column
    );
    this.code += ";";
    this.col += 1;

    node.increment.forEach(child => {
      this.unparseNode(child);
    });
    this.updateBlanks(
      node.loc.rightParLoc.line - 1,
      node.loc.rightParLoc.column
    );
    this.code += ")";
    this.col += 1;

    let _node = node.body;
    if (node.shortForm) {
      this.unparseNode(_node);
      this.updateBlanks(_node.loc.endTokenLoc.line - 1, _node.loc.endTokenLoc.column - 6);  // end location
      this.code += "endfor";
      this.updateBlanks(node.loc.end.line - 1, node.loc.end.column - 1);
      this.code += ";";
    } else {
      this.unparseNode(_node);
    }
  }
};
