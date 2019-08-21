/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/tharzen/php-parser
 */
"use strict";

/**
 * Unparse an array structure
 * kind: "array"
 * loc: Location {}
 * {Entry|Expr|Variable} items
 * {boolean} shortForm
 */
module.exports = {
  unparseArray: function(node) {
    if (node.kind !== "array") {
      throw new Error("Wrong node kind: " + node.kind + ", should be array");
    }

    if (node.shortForm) {
      // []
      this.code += "[";
      this.col += 1;

      if (node.items) {
        node.items.forEach(item => {
          this.unparseNode(item);
        });
      }
      if (node.loc.last) {
        // no ;
        this.updateBlanks(node.loc.last.line - 1, node.loc.last.column - 1);
        this.code += "]";
        this.row = node.loc.last.line - 1;
        this.col = node.loc.last.column;
      } else {
        this.updateBlanks(node.loc.end.line - 1, node.loc.end.column - 1);
        this.code += "]";
        this.row = node.loc.end.line - 1;
        this.col = node.loc.end.column;
      }
    } else {
      // array ()
      this.code += "array";
      this.updateBlanks(node.loc.first.line - 1, node.loc.first.column - 5);
      this.code += "(";
      this.col += 1;
      
      if (node.items) {
        node.items.forEach(item => {
          this.unparseNode(item);
        });
      }

      if (node.loc.last) {
        // no ;
        this.updateBlanks(node.loc.last.line - 1, node.loc.last.column - 1);
        this.code += ")";
        this.row = node.loc.last.line - 1;
        this.col = node.loc.last.column;
      } else {
        this.updateBlanks(node.loc.end.line - 1, node.loc.end.column - 1);
        this.code += ")";
        this.row = node.loc.end.line - 1;
        this.col = node.loc.end.column;
      }
    }
    

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
