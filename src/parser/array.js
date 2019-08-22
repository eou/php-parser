/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-parser/graphs/contributors
 * @url http://glayzzle.com
 */
"use strict";

const ArrayExpr = "array";
const ArrayEntry = "entry";

module.exports = {
  /**
   * Parse an array
   * ```ebnf
   * array ::= T_ARRAY '(' array_pair_list ')' |
   *   '[' array_pair_list ']'
   * ```
   */
  read_array: function() {
    let expect = null;
    let shortForm = false;
    const result = this.node(ArrayExpr);
    if (this.token === this.tok.T_ARRAY) {
      this.next().expect("(");
      expect = ")";
    } else {
      shortForm = true;
      expect = "]";
    }
    let items = [];
    this.next();
    // for the left parenthesis postion
    var Position = require("../ast/position.js");
    let left_parenthesis = new Position();
    left_parenthesis.line = this.prev[0];
    left_parenthesis.column = this.prev[1];
    left_parenthesis.offset = this.prev[2];

    if (this.token !== expect) {
      items = this.read_array_pair_list(shortForm);
    }
    this.expect(expect);
    this.next();
    let array_node = result(shortForm, items);
    array_node.loc.first = new Position();
    array_node.loc.first = left_parenthesis;
    return array_node;
  },
  /**
   * Reads an array of items
   * ```ebnf
   * array_pair_list ::= array_pair (',' array_pair?)*
   * ```
   */
  read_array_pair_list: function(shortForm) {
    const self = this;
    return this.read_list(
      function() {
        return self.read_array_pair(shortForm);
      },
      ",",
      true
    );
  },
  /**
   * Reads an entry
   * array_pair:
   *  expr T_DOUBLE_ARROW expr
   *  | expr
   *  | expr T_DOUBLE_ARROW '&' variable
   *  | '&' variable
   *  | expr T_DOUBLE_ARROW T_LIST '(' array_pair_list ')'
   *  | T_LIST '(' array_pair_list ')'
   */
  read_array_pair: function(shortForm) {
    if (
      this.token === "," ||
      (!shortForm && this.token === ")") ||
      (shortForm && this.token === "]")
    ) {
      return this.node("noop")();
    }

    var Position = require("../ast/position.js");
    // restore the location of seperator, such as ',' ']'
    let seperator = { loc: new Position(), sign: null };

    if (this.token === "&") {
      let refVar_node =  this.node("byref")(this.next().read_variable(true, false));
      seperator.sign = this.token;
      seperator.loc.line = this.lexer.yylloc.last_line;
      seperator.loc.column = this.lexer.yylloc.last_column;
      seperator.loc.offset = this.lexer.offset;
      refVar_node.seperator = seperator;
      return refVar_node;
    } else {
      const entry = this.node(ArrayEntry);
      const expr = this.read_expr();
      if (this.token === this.tok.T_DOUBLE_ARROW) {
        let arrowLoc = new Position();
        arrowLoc.line = this.lexer.yylloc.last_line;
        arrowLoc.column = this.lexer.yylloc.last_column;
        if (this.next().token === "&") {
          let entry_node = entry(expr, this.node("byref")(this.next().read_variable(true, false)));
          entry_node.arrowLoc = new Position();
          entry_node.arrowLoc = arrowLoc;
          seperator.sign = this.token;
          seperator.loc.line = this.lexer.yylloc.last_line;
          seperator.loc.column = this.lexer.yylloc.last_column;
          seperator.loc.offset = this.lexer.offset;
          entry_node.seperator = seperator;
          return entry_node;
        } else {
          let entry_node = entry(expr, this.read_expr());
          entry_node.arrowLoc = new Position();
          entry_node.arrowLoc = arrowLoc;
          seperator.sign = this.token;
          seperator.loc.line = this.lexer.yylloc.last_line;
          seperator.loc.column = this.lexer.yylloc.last_column;
          seperator.loc.offset = this.lexer.offset;
          entry_node.seperator = seperator;
          return entry_node;
        }
      } else {
        entry.destroy();
      }
      
      seperator.sign = this.token;
      seperator.loc.line = this.lexer.yylloc.last_line;
      seperator.loc.column = this.lexer.yylloc.last_column;
      seperator.loc.offset = this.lexer.offset;
      expr.seperator = seperator;
      return expr;
    }
  }
};
