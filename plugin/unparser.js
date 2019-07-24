/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/eou/php-parser
 */
"use strict";

/**
 * The PHP Unparser class that constructs PHP source code from the the AST tree
 *
 * @class
 * @property {AST} ast - the AST which converted from PHP source code
 * @property {Position} start - the start location of the program
 * @property {Position} end - the end location of the program
 * @property {Array} children - children of the ast root which are expressions of the php code
 * @property {Integer} row - output cursor to show current row, start from 0
 * @property {Integer} col - output cursor to show current column, start from 0
 * @property {Boolean} short_open_tag - whether the short_open_tag has already been added into code or not
 * @property {String} code - php code string converted from ast which is the output of unparser
 */
class unparser {
  constructor(ast) {
    this.ast = ast;
    this.start = this.ast.loc.start;
    this.end = this.ast.loc.end;
    this.children = this.ast.children;
    this.row = 0;
    this.col = 0;
    this.short_open_tag = false;
    this.code = "";
  }
  // helper function - print the AST with customized depths
  showAST(depth = null) {
    var util = require("util");
    console.log(util.inspect(this.ast, { depth: depth }));
  }
}

/**
 * main entry point of unparser
 */
unparser.prototype.unparse = function() {
  // adding <?php start tag
  if (this.children[0].kind !== "inline") {
    this.code += "<?php";
    this.col += 5;
    this.short_open_tag = true;
  }

  this.children.forEach(node => {
    this.unparseNode(node);
  });

  // adding ?> end tag
  this.updateBlanks(this.end.line - 1, this.end.column - 2);
  this.code += "?>"  // maybe `substr` is uneffective
  return this.code;
};

/**
 * unparse each node of AST
 */
unparser.prototype.unparseNode = function(node) {
  this.updateBlanks(node.loc.start.line - 1, node.loc.start.column);
  switch (node.kind) {
    case "array": {

    }

    case "assign": {
      // left expression   operator   right expression
      this.unparseNode(node.left);
      // unparse operator
      this.updateBlanks(node.operator.startLoc.line - 1, node.operator.startLoc.column);
      this.code += node.operator.sign;
      this.col += node.operator.sign.length;
      this.unparseNode(node.right);
      break;
    }

    case "expressionstatement": {
      // expressionstatement include many different expressions such as assign, eval and etc.
      // more AST node dependency info can be found in ./image.svg
      this.unparseNode(node.expression);
      // ASSUME all expressionstatement will end up with ;
      this.updateBlanks(node.loc.end.line - 1, node.loc.end.column - 1);
      this.code += ";";
      break;
    }

    case "inline": {
      this.unparse_inline(node);
      // maybe blanks before the <?php
      if (!this.short_open_tag) {
        this.code += "<?php";
        this.short_open_tag = true;
        this.col = node.loc.end.column + 5;
      }
      break;
    }

    case "number": {
      this.unparse_number(node);
      break;
    }

    case "offsetlookup": {
      // Lookup on an offset in an array
      break;
    }

    case "string": {
      this.unparse_string(node);
      break;
    }

    case "variable": {
      this.unparse_variable(node);
      break;
    }

    default: {
      break;
    }
  }
}

/**
 * add white blanks before unparse one AST node
 */
unparser.prototype.updateBlanks = function(row, col) {
   while (this.row < row) {
     this.newline();
     this.col = 0;
     this.row++;
   }
   while (this.col < col) {
     this.whitespace();
     this.col++;
   }
}

/**
 * add new white space into code
 */
unparser.prototype.whitespace = function() {
  this.code += " ";
};

/**
 * add newline into code
 */
unparser.prototype.newline = function() {
  this.code += "\n";
};

// extends the unparser with submodules
[
  require("./unparser/inline.js"),
  require("./unparser/number.js"),
  require("./unparser/string.js"),
  require("./unparser/variable.js")
].forEach(function(ext) {
  for (const k in ext) {
    if (unparser.prototype.hasOwnProperty(k)) {
      throw new Error("Unparser: Function " + k + " is already defined - collision");
    }
    unparser.prototype[k] = ext[k];
  }
});

module.exports = unparser;
