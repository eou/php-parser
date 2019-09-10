/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-parser/graphs/contributors
 * @url http://glayzzle.com
 */
"use strict";

module.exports = {
  /**
   * ```ebnf
   * start ::= (namespace | top_statement)*
   * ```
   */
  read_start: function() {
    if (this.token == this.tok.T_NAMESPACE) {
      return this.read_namespace();   // /parser/namespace.js
    } else if (this.token == this.tok.T_OPEN_TAG) {
      const result = this.node("phpopentag");
      this.expect(this.tok.T_OPEN_TAG) && this.next();
      const body = this.read_top_statements();
      this.expect([this.tok.T_CLOSE_TAG, this.EOF]);
      if (this.token === this.EOF) {
        this.next();
        return result(body, false, null, null, null);
      }
      this.next();
      return result(body, true, null, null, null);
    } else {
      return this.read_top_statement();   // /parser/statement.js
    }
  }
};
