/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/eou/php-parser
 */
"use strict";

/**
 * Unparse a break statement
 * kind: "break"
 * loc: Location {}
 * {Boolean} curly: {true|false} For if(): shortForm
 */
module.exports = {
  unparseBlock: function(node) {
    if (node.kind !== "block") {
      throw new Error("Wrong node kind: " + node.kind + ", should be block");
    }

    if (node.loc.colonLoc) {
      // for shortForm else statement
      this.updateBlanks(node.loc.colonLoc.line - 1, node.loc.colonLoc.column);
      this.code += ":";
      this.col += 1;
      node.children.forEach(child => {
        this.unparseNode(child);
      });
    } else if (node.curly) {
      // for shortForm if statement
      node.children.forEach(child => {
        this.unparseNode(child);
      });
    } else {
      this.code += "{";
      this.col += 1;
      node.children.forEach(child => {
        this.unparseNode(child);
      });
      this.updateBlanks(node.loc.end.line - 1, node.loc.end.column - 1);
      this.code += "}";
      this.col += 1;
    }

    if (node.curly === undefined && node.loc.endTokenLoc === undefined) {
      this.row = node.loc.end.line - 1;
      this.col = node.loc.end.column;
    }
  }
};
