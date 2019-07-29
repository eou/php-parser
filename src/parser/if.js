/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-parser/graphs/contributors
 * @url http://glayzzle.com
 */
"use strict";

var Position = require('../ast/position.js');

module.exports = {
  /**
   * Reads an IF statement
   *
   * ```ebnf
   *  if ::= T_IF '(' expr ')' ':' ...
   * ```
   */
  read_if: function() {
    const result = this.node("if");
    let body = null;
    let alternate = null;
    let shortForm = false;
    let test = null;
    test = this.next().read_if_expr();

    let colonLoc = new Position(); // if() :
    let endifLoc = new Position();
    if (this.token === ":") {
      shortForm = true;
      this.next();
      colonLoc.line = this.prev[0];
      colonLoc.column = this.prev[1] - 1;
      colonLoc.offset = this.prev[2];
      body = this.node("block");
      const items = [];
      while (this.token !== this.EOF && this.token !== this.tok.T_ENDIF) {
        if (this.token === this.tok.T_ELSEIF) {
          alternate = this.read_elseif_short();
          break;
        } else if (this.token === this.tok.T_ELSE) {
          alternate = this.read_else_short();
          break;
        }
        items.push(this.read_inner_statement());
      }
      body = body(null, items);
      this.expect(this.tok.T_ENDIF) && this.next();
      endifLoc.line = this.prev[0];
      endifLoc.column = this.prev[1] - 5;
      endifLoc.offset = this.prev[2];
      this.expectEndOfStatement();
      body.curly = false;
    } else {
      body = this.read_statement();
      if (this.token === this.tok.T_ELSEIF) {
        alternate = this.read_if();
      } else if (this.token === this.tok.T_ELSE) {
        alternate = this.next().read_statement();
      }
    }
    // colonloc is in if node
    let ifNode = result(test, body, alternate, shortForm);
    ifNode.loc.colonLoc = colonLoc;
    if (shortForm) {
      ifNode.loc.endifLoc = endifLoc;
    }
    return ifNode;
  },
  /**
   * reads an if expression : '(' expr ')'
   */
  read_if_expr: function() {
    this.expect("(") && this.next();
    var leftParLoc = new Position();
    leftParLoc.line = this.prev[0];
    leftParLoc.column = this.prev[1] - 1;
    leftParLoc.offset = this.prev[2];
    const result = this.read_expr();
    this.expect(")") && this.next();
    var rightParLoc = new Position();
    rightParLoc.line = this.prev[0];
    rightParLoc.column = this.prev[1] - 1;
    rightParLoc.offset = this.prev[2];

    result.loc.leftParLoc = leftParLoc;
    result.loc.rightParLoc = rightParLoc;
    return result;
  },
  /**
   * reads an elseif (expr): statements
   */
  read_elseif_short: function() {
    const result = this.node("if");
    let alternate = null;
    let test = null;
    let body = null;
    const items = [];
    test = this.next().read_if_expr();
    if (this.expect(":")) this.next();
    let colonLoc = new Position();
    colonLoc.line = this.prev[0];
    colonLoc.column = this.prev[1] - 1;
    colonLoc.offset = this.prev[2];
    body = this.node("block");
    while (this.token != this.EOF && this.token !== this.tok.T_ENDIF) {
      if (this.token === this.tok.T_ELSEIF) {
        alternate = this.read_elseif_short();
        break;
      } else if (this.token === this.tok.T_ELSE) {
        alternate = this.read_else_short();
        break;
      }
      items.push(this.read_inner_statement());
    }
    body = body(null, items);
    body.curly = false;
    // colonloc is in if node
    let elseIfShortNode = result(test, body, alternate, true);
    elseIfShortNode.loc.colonLoc = colonLoc;
    return elseIfShortNode;
  },
  /**
   * reads an else (expr): statements
   */
  read_else_short: function() {
    let body = this.node("block");
    if (this.next().expect(":")) this.next();
    let colonLoc = new Position();
    colonLoc.line = this.prev[0];
    colonLoc.column = this.prev[1] - 1;
    colonLoc.offset = this.prev[2];
    const items = [];
    while (this.token != this.EOF && this.token !== this.tok.T_ENDIF) {
      items.push(this.read_inner_statement());
    }
    // colonloc is in block node
    body = body(null, items);
    body.loc.colonLoc = colonLoc;
    body.curly = false;
    return body;
  }
};
