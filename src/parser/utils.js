/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-parser/graphs/contributors
 * @url http://glayzzle.com
 */
"use strict";

var Position = require('../ast/position.js');

module.exports = {
  /**
   * Reads a short form of tokens
   * @param {Number} token - The ending token
   * @return {Block}
   */
  read_short_form: function(token) {
    let body = this.node("block");
    let items = [];
    let colonLoc = new Position();
    if (this.expect(":")) {
      this.next();
      colonLoc.line = this.prev[0];
      colonLoc.column = this.prev[1] - 1; // end column
      colonLoc.offset = this.prev[2];
    }
    while (this.token != this.EOF && this.token !== token) {
      items.push(this.read_inner_statement());
    }
    let endTokenLoc = new Position();
    if (this.expect(token)) {
      this.next();
      endTokenLoc.line = this.prev[0];
      endTokenLoc.column = this.prev[1];  // end column
      endTokenLoc.offset = this.prev[2];
    }
    this.expectEndOfStatement();
    body = body(null, items);
    body.loc.colonLoc = colonLoc;
    body.loc.endTokenLoc = endTokenLoc;
    return body;
  },

  /**
   * Helper : reads a list of tokens / sample : T_STRING ',' T_STRING ...
   * ```ebnf
   * list ::= separator? ( item separator )* item
   * ```
   */
  read_list: function(item, separator, preserveFirstSeparator) {
    const result = [];

    if (this.token == separator) {
      if (preserveFirstSeparator) result.push(null);
      this.next();
    }

    if (typeof item === "function") {
      do {
        result.push(item.apply(this, []));
        if (this.token != separator) {
          break;
        }
      } while (this.next().token != this.EOF);
    } else {
      if (this.expect(item)) {
        result.push(this.text());
      } else {
        return [];
      }
      while (this.next().token != this.EOF) {
        if (this.token != separator) break;
        // trim current separator & check item
        if (this.next().token != item) break;
        result.push(this.text());
      }
    }
    return result;
  },

  /**
   * Reads a list of names separated by a comma
   *
   * ```ebnf
   * name_list ::= namespace (',' namespace)*
   * ```
   *
   * Sample code :
   * ```php
   * <?php class foo extends bar, baz { }
   * ```
   *
   * @see https://github.com/php/php-src/blob/master/Zend/zend_language_parser.y#L726
   * @return {Reference[]}
   */
  read_name_list: function() {
    return this.read_list(this.read_namespace_name, ",", false);
  },

  /**
   * Reads a list of variables declarations
   *
   * ```ebnf
   * variable_declaration ::= T_VARIABLE ('=' expr)?*
   * variable_declarations ::= variable_declaration (',' variable_declaration)*
   * ```
   *
   * Sample code :
   * ```php
   * <?php static $a = 'hello', $b = 'world';
   * ```
   * @return {StaticVariable[]} Returns an array composed by a list of variables, or
   * assign values
   */
  read_variable_declarations: function() {
    return this.read_list(function() {
      const node = this.node("staticvariable");
      let variable = this.node("variable");
      // plain variable name
      if (this.expect(this.tok.T_VARIABLE)) {
        const name = this.text().substring(1);
        this.next();
        variable = variable(name, false, false);
      } else {
        variable = variable("#ERR", false, false);
      }
      if (this.token === "=") {
        return node(variable, this.next().read_expr());
      } else {
        return variable;
      }
    }, ",");
  }
};
