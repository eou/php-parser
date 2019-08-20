/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-parser/graphs/contributors
 * @url http://glayzzle.com
 */
"use strict";

const Position = require("../ast/position");

module.exports = {
  read_expr: function(expr) {
    const result = this.node();
    if (!expr) {
      expr = this.read_expr_item();
    }
    // binary operations
    if (this.token === "|") {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 1, prev[2] - 1);
      op.sign = "|";
      return result("bin", op, expr, this.read_expr());
    }
    if (this.token === "&") {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 1, prev[2] - 1);
      op.sign = "&";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === "^") {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 1, prev[2] - 1);
      op.sign = "^";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === ".") {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 1, prev[2] - 1);
      op.sign = ".";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === "+") {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 1, prev[2] - 1);
      op.sign = "+";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === "-") {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 1, prev[2] - 1);
      op.sign = "-";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === "*") {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 1, prev[2] - 1);
      op.sign = "*";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === "/") {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 1, prev[2] - 1);
      op.sign = "/";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === "%") {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 1, prev[2] - 1);
      op.sign = "%";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === this.tok.T_POW) {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
      op.sign = "**";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === this.tok.T_SL) {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
      op.sign = "<<";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === this.tok.T_SR) {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
      op.sign = ">>";
      return result("bin", op, expr, this.read_expr());
    }
      
    // more binary operations (formerly bool)
    if (this.token === this.tok.T_BOOLEAN_OR) {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
      op.sign = "||";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === this.tok.T_LOGICAL_OR) {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
      op.sign = "or";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === this.tok.T_BOOLEAN_AND) {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
      op.sign = "&&";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === this.tok.T_LOGICAL_AND) {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 3, prev[2] - 3);
      op.sign = "and";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === this.tok.T_LOGICAL_XOR) {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 3, prev[2] - 3);
      op.sign = "xor";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === this.tok.T_IS_IDENTICAL) {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 3, prev[2] - 3);
      op.sign = "===";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === this.tok.T_IS_NOT_IDENTICAL) {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 3, prev[2] - 3);
      op.sign = "!==";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === this.tok.T_IS_EQUAL) {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
      op.sign = "==";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === this.tok.T_IS_NOT_EQUAL) {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
      op.sign = "!=";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === "<") {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 1, prev[2] - 1);
      op.sign = "<";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === ">") {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 1, prev[2] - 1);
      op.sign = ">";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === this.tok.T_IS_SMALLER_OR_EQUAL) {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
      op.sign = "<=";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === this.tok.T_IS_GREATER_OR_EQUAL) {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
      op.sign = ">=";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === this.tok.T_SPACESHIP) {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 3, prev[2] - 3);
      op.sign = "<=>";
      return result("bin", op, expr, this.read_expr());
    }
      
    if (this.token === this.tok.T_INSTANCEOF) {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 10, prev[2] - 10);
      op.sign = "instanceof";
      expr = result("bin", op, expr, this.next().read_class_name_reference());
      if (
        this.token !== ";" &&
        this.token !== this.tok.T_INLINE_HTML &&
        this.token !== this.EOF
      ) {
        expr = this.read_expr(expr);
      }
    }

    // extra operations :
    // $username = $_GET['user'] ?? 'nobody';
    if (this.token === this.tok.T_COALESCE) {
      let op = {}, prev = this.next().prev;
      op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
      op.sign = "??";
      return result("bin", op, expr, this.read_expr());
    }
      
    // extra operations :
    // $username = $_GET['user'] ? true : false;
    if (this.token === "?") {
      let trueArg = null, questionmarkLoc, colonmarkLoc;
      if (this.next().token !== ":") {
        questionmarkLoc = new Position(this.prev[0], this.prev[1], this.prev[2]);
        trueArg = this.read_expr();
      }
      this.expect(":") && this.next();
      colonmarkLoc = new Position(this.prev[0], this.prev[1], this.prev[2]);
      let retif_node = result("retif", expr, trueArg, this.read_expr());
      retif_node.loc.questionmarkLoc = questionmarkLoc;
      retif_node.loc.colonmarkLoc = colonmarkLoc;
      return retif_node;
    } else {
      // see #193
      result.destroy(expr);
    }
    return expr;
  },

  /**
   * Reads a cast expression
   */
  read_expr_cast: function(type) {
    return this.node("cast")(type, this.text(), this.next().read_expr());
  },

  /**
   * ```ebnf
   * Reads an expression
   *  expr ::= @todo
   * ```
   */
  read_expr_item: function() {
    let result, expr;
    if (this.token === "@") 
      return this.node("silent")(this.next().read_expr());
    if (this.token === "+")
      return this.node("unary")("+", this.next().read_expr());
    if (this.token === "-")
      return this.node("unary")("-", this.next().read_expr());
    if (this.token === "!")
      return this.node("unary")("!", this.next().read_expr());
    if (this.token === "~")
      return this.node("unary")("~", this.next().read_expr());

    if (this.token === "(") {
      expr = this.next().read_expr();
      expr.parenthesizedExpression = true;
      this.expect(")") && this.next();
      return this.handleDereferencable(expr);
    }

    if (this.token === "`") {
      // https://github.com/php/php-src/blob/master/Zend/zend_language_parser.y#L1048
      return this.read_encapsed_string("`");
    }

    if (this.token === this.tok.T_LIST) {
      let assign = null;
      const isInner = this.innerList;
      result = this.node("list");
      if (!isInner) {
        assign = this.node("assign");
      }
      if (this.next().expect("(")) {
        this.next();
      }

      if (!this.innerList) this.innerList = true;

      // reads inner items
      const assignList = this.read_array_pair_list(false);
      if (this.expect(")")) {
        this.next();
      }

      // check if contains at least one assignment statement
      let hasItem = false;
      for (let i = 0; i < assignList.length; i++) {
        if (assignList[i] !== null && assignList[i].kind !== "noop") {
          hasItem = true;
          break;
        }
      }
      if (!hasItem) {
        this.raiseError(
          "Fatal Error :  Cannot use empty list on line " +
            this.lexer.yylloc.first_line
        );
      }

      // handles the node resolution
      if (!isInner) {
        this.innerList = false;
        if (this.expect("=")) {
          return assign(
            result(assignList, false),
            this.next().read_expr(),
            "="
          );
        } else {
          // error fallback : list($a, $b);
          return result(assignList, false);
        }
      } else {
        return result(assignList, false);
      }
    }

    if (this.token === this.tok.T_CLONE)
      return this.node("clone")(this.next().read_expr());

    switch (this.token) {
      case this.tok.T_INC:
        return this.node("pre")("+", this.next().read_variable(false, false));

      case this.tok.T_DEC:
        return this.node("pre")("-", this.next().read_variable(false, false));

      case this.tok.T_NEW:
        return this.read_new_expr();

      case this.tok.T_ISSET: {
        result = this.node("isset");
        if (this.next().expect("(")) {
          this.next();
        }
        const variables = this.read_list(this.read_expr, ",");
        if (this.expect(")")) {
          this.next();
        }
        return result(variables);
      }
      case this.tok.T_EMPTY: {
        result = this.node("empty");
        if (this.next().expect("(")) {
          this.next();
        }
        const expression = this.read_expr();
        if (this.expect(")")) {
          this.next();
        }
        return result(expression);
      }
      case this.tok.T_INCLUDE:
        return this.node("include")(false, false, this.next().read_expr());

      case this.tok.T_INCLUDE_ONCE:
        return this.node("include")(true, false, this.next().read_expr());

      case this.tok.T_REQUIRE:
        return this.node("include")(false, true, this.next().read_expr());

      case this.tok.T_REQUIRE_ONCE:
        return this.node("include")(true, true, this.next().read_expr());

      case this.tok.T_EVAL:
        result = this.node("eval");
        if (this.next().expect("(")) {
          this.next();
        }
        expr = this.read_expr();
        if (this.expect(")")) {
          this.next();
        }
        return result(expr);

      case this.tok.T_INT_CAST:
        return this.read_expr_cast("int");

      case this.tok.T_DOUBLE_CAST:
        return this.read_expr_cast("float");

      case this.tok.T_STRING_CAST:
        return this.read_expr_cast(
          this.text().indexOf("binary") !== -1 ? "binary" : "string"
        );

      case this.tok.T_ARRAY_CAST:
        return this.read_expr_cast("array");

      case this.tok.T_OBJECT_CAST:
        return this.read_expr_cast("object");

      case this.tok.T_BOOL_CAST:
        return this.read_expr_cast("bool");

      case this.tok.T_UNSET_CAST:
        return this.read_expr_cast("unset");

      case this.tok.T_EXIT: {
        const useDie = this.lexer.yytext.toLowerCase() === "die";
        result = this.node("exit");
        let status = null;
        if (this.next().token === "(") {
          if (this.next().token !== ")") {
            status = this.read_expr();
            if (this.expect(")")) {
              this.next();
            }
          } else {
            this.next();
          }
        }
        return result(status, useDie);
      }

      case this.tok.T_PRINT:
        return this.node("print")(this.next().read_expr());

      // T_YIELD (expr (T_DOUBLE_ARROW expr)?)?
      case this.tok.T_YIELD: {
        let value = null;
        let key = null;
        result = this.node("yield");
        if (this.next().is("EXPR")) {
          // reads the yield return value
          value = this.read_expr();
          if (this.token === this.tok.T_DOUBLE_ARROW) {
            // reads the yield returned key
            key = value;
            value = this.next().read_expr();
          }
        }
        return result(value, key);
      }

      // T_YIELD_FROM expr
      case this.tok.T_YIELD_FROM:
        result = this.node("yieldfrom");
        expr = this.next().read_expr();
        return result(expr);

      case this.tok.T_FUNCTION:
        return this.read_function(true);

      case this.tok.T_STATIC: {
        const backup = [this.token, this.lexer.getState()];
        if (this.next().token === this.tok.T_FUNCTION) {
          // handles static function
          return this.read_function(true, [0, 1, 0]);
        } else {
          // rollback
          this.lexer.tokens.push(backup);
          this.next();
        }
      }
    }

    // SCALAR | VARIABLE
    // Four scalar types: boolean, integer, float (floating-point number, aka double), string
    if (this.is("VARIABLE")) {
      result = this.node();
<<<<<<< HEAD
      expr = this.read_variable(false, false, false);   // read the variable in the left of expression
=======
      expr = this.read_variable(false, false);

>>>>>>> d95c471c9bdd58a0495e7a9c20b7d07e8f6ac8f7
      // https://github.com/php/php-src/blob/master/Zend/zend_language_parser.y#L877
      // should accept only a variable
      const isConst =
        expr.kind === "identifier" ||
        (expr.kind === "staticlookup" && expr.offset.kind === "identifier");

      // VARIABLES SPECIFIC OPERATIONS
      let op = {}, prev = null;   // prev is the end location of operator
      switch (this.token) {
        case "=": {
          if (isConst) this.error("VARIABLE");
          prev = this.next().prev;
          op.startLoc = new Position(prev[0], prev[1] - 1, prev[2] - 1);
          let right;
<<<<<<< HEAD
          if (this.token == "&") {
=======
          if (this.next().token == "&") {
            right = this.node("byref");
>>>>>>> d95c471c9bdd58a0495e7a9c20b7d07e8f6ac8f7
            if (this.next().token === this.tok.T_NEW) {
              if (this.php7) {
                this.error();
              }
              right = right(this.read_new_expr());
            } else {
              right = right(this.read_variable(false, false));
            }
          } else {
            right = this.read_expr();
          }
          // create assign ast node
          op.sign = "=";
          return result("assign", expr, right, op);
        }

        // operations :
        case this.tok.T_PLUS_EQUAL: {
          if (isConst) this.error("VARIABLE");
          prev = this.next().prev;
          op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
          op.sign = "+=";
          return result("assign", expr, this.read_expr(), op);
        }

        case this.tok.T_MINUS_EQUAL: {
          if (isConst) this.error("VARIABLE");
          prev = this.next().prev;
          op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
          op.sign = "-=";
          return result("assign", expr, this.read_expr(), op);
        }

        case this.tok.T_MUL_EQUAL: {
          if (isConst) this.error("VARIABLE");
          prev = this.next().prev;
          op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
          op.sign = "*=";
          return result("assign", expr, this.read_expr(), op);
        }

        case this.tok.T_POW_EQUAL: {
          if (isConst) this.error("VARIABLE");
          prev = this.next().prev;
          op.startLoc = new Position(prev[0], prev[1] - 3, prev[2] - 3);
          op.sign = "**=";
          return result("assign", expr, this.read_expr(), op);
        }

        case this.tok.T_DIV_EQUAL: {
          if (isConst) this.error("VARIABLE");
          prev = this.next().prev;
          op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
          op.sign = "/=";
          return result("assign", expr, this.read_expr(), op);
        }

        case this.tok.T_CONCAT_EQUAL: {
          if (isConst) this.error("VARIABLE");
          prev = this.next().prev;
          op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
          op.sign = ".=";
          return result("assign", expr, this.read_expr(), op);
        } 

        case this.tok.T_MOD_EQUAL: {
          if (isConst) this.error("VARIABLE");
          prev = this.next().prev;
          op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
          op.sign = "%=";
          return result("assign", expr, this.read_expr(), op);
        }
          
        case this.tok.T_AND_EQUAL: {
          if (isConst) this.error("VARIABLE");
          prev = this.next().prev;
          op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
          op.sign = "&=";
          return result("assign", expr, this.read_expr(), op);
        }

        case this.tok.T_OR_EQUAL: {
          if (isConst) this.error("VARIABLE");
          prev = this.next().prev;
          op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
          op.sign = "|=";
          return result("assign", expr, this.read_expr(), op);
        }

        case this.tok.T_XOR_EQUAL: {
          if (isConst) this.error("VARIABLE");
          prev = this.next().prev;
          op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
          op.sign = "^=";
          return result("assign", expr, this.read_expr(), op);
        }

        case this.tok.T_SL_EQUAL: {
          if (isConst) this.error("VARIABLE");
          prev = this.next().prev;
          op.startLoc = new Position(prev[0], prev[1] - 3, prev[2] - 3);
          op.sign = "<<=";
          return result("assign", expr, this.read_expr(), op);
        }
          
        case this.tok.T_SR_EQUAL: {
          if (isConst) this.error("VARIABLE");
          prev = this.next().prev;
          op.startLoc = new Position(prev[0], prev[1] - 3, prev[2] - 3);
          op.sign = ">>=";
          return result("assign", expr, this.read_expr(), op);
        }
        
        // $a++;
        case this.tok.T_INC: {
          if (isConst) this.error("VARIABLE");
          prev = this.next().prev;
          op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
          op.sign = "+";
          return result("post", op, expr);
        }
          
        // $a--;
        case this.tok.T_DEC: {
          if (isConst) this.error("VARIABLE");
          prev = this.next().prev;
          op.startLoc = new Position(prev[0], prev[1] - 2, prev[2] - 2);
          op.sign = "-";
          return result("post", "-", expr);
        }
          
        default:
          // see #193
          result.destroy(expr);
      }
    } else if (this.is("SCALAR")) {
      result = this.node();
      expr = this.read_scalar();
      if (expr.kind === "array" && expr.shortForm && this.token === "=") {
        // list assign
        const list = this.node("list")(expr.items, true);
        if (expr.loc) list.loc = expr.loc;
        const right = this.next().read_expr();
        return result("assign", list, right, "=");
      } else {
        // see #189 - swap docs on nodes
        result.destroy(expr);
      }
      // classic array
      return this.handleDereferencable(expr);
    } else {
      this.error("EXPR");
      this.next();
    }

    // returns variable | scalar
    return expr;
  },
  /**
   * ```ebnf
   *    new_expr ::= T_NEW (namespace_name function_argument_list) | (T_CLASS ... class declaration)
   * ```
   * https://github.com/php/php-src/blob/master/Zend/zend_language_parser.y#L850
   */
  read_new_expr: function() {
    const result = this.node("new");
    this.expect(this.tok.T_NEW) && this.next();
    let args = [];
    if (this.token === this.tok.T_CLASS) {
      const what = this.node("class");
      // Annonymous class declaration
      let propExtends = null,
        propImplements = null,
        body = null;
      if (this.next().token === "(") {
        args = this.read_function_argument_list();
      }
      if (this.token == this.tok.T_EXTENDS) {
        propExtends = this.next().read_namespace_name();
      }
      if (this.token == this.tok.T_IMPLEMENTS) {
        propImplements = this.next().read_name_list();
      }
      if (this.expect("{")) {
        body = this.next().read_class_body();
      }
      return result(
        what(null, propExtends, propImplements, body, [0, 0, 0]),
        args
      );
    }
    // Already existing class
    const name = this.read_new_class_name();
    if (this.token === "(") {
      args = this.read_function_argument_list();
    }
    return result(name, args);
  },
  /**
   * Reads a class name
   * ```ebnf
   * read_new_class_name ::= namespace_name | variable
   * ```
   */
  read_new_class_name: function() {
    if (
      this.token === this.tok.T_NS_SEPARATOR ||
      this.token === this.tok.T_STRING ||
      this.token === this.tok.T_NAMESPACE
    ) {
      let result = this.read_namespace_name(true);
      if (this.token === this.tok.T_DOUBLE_COLON) {
        result = this.read_static_getter(result);
      }
      return result;
    } else if (this.is("VARIABLE")) {
      return this.read_variable(true, false);
    } else {
      this.expect([this.tok.T_STRING, "VARIABLE"]);
    }
  },

  handleDereferencable: function(expr) {
    while (this.token !== this.EOF) {
      if (
        this.token === this.tok.T_OBJECT_OPERATOR ||
        this.token === this.tok.T_DOUBLE_COLON
      ) {
        expr = this.recursive_variable_chain_scan(expr, false, false, true);
      } else if (this.token === this.tok.T_CURLY_OPEN || this.token === "[") {
        expr = this.read_dereferencable(expr);
      } else if (this.token === "(") {
        // https://github.com/php/php-src/blob/master/Zend/zend_language_parser.y#L1118
        expr = this.node("call")(expr, this.read_function_argument_list());
      } else {
        return expr;
      }
    }
    return expr;
  }
};
