/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/tharzen/php-parser
 */
"use strict";

/**
 * Unparse a foreach iterator
 * kind: "foreach"
 * loc: Location {}
 * {Expression} source
 * {Expression|null} key
 * {Expression} value
 * {Statement} body
 * {boolean} shortForm
 * http://php.net/manual/en/control-structures.foreach.php
 */
module.exports = {
  unparseForeach: function(node) {
    if (node.kind !== "foreach") {
      throw new Error("Wrong node kind: " + node.kind + ", should be foreach");
    }

    this.code += "foreach";
    this.col += 7;
    this.updateBlanks(node.loc.leftParLoc.line - 1, node.loc.leftParLoc.column);
    this.code += "(";
    this.col += 1;

    this.unparseNode(node.source);
    this.updateBlanks(node.loc.asLoc.line - 1, node.loc.asLoc.column);
    this.code += "as";
    this.col += 2;

    this.unparseNode(node.key);
    this.updateBlanks(node.loc.arrowLoc.line - 1, node.loc.arrowLoc.column);
    this.code += "=>";
    this.col += 2;

    this.unparseNode(node.value);
    this.updateBlanks(
      node.loc.rightParLoc.line - 1,
      node.loc.rightParLoc.column
    );
    this.code += ")";
    this.col += 1;

    let _node = node.body;
    if (node.shortForm) {
      this.unparseNode(_node);
      this.updateBlanks(
        _node.loc.endTokenLoc.line - 1,
        _node.loc.endTokenLoc.column - 6
      ); // end location
      this.code += "endforeach";
      this.updateBlanks(node.loc.end.line - 1, node.loc.end.column - 1);
      this.code += ";";
    } else {
      this.unparseNode(_node);
    }
  }
};
