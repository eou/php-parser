# Development Instruction

A general guidence for the work flow of this php-parser, especially for unparser.

## Structure

- `src/lexer.js` tokenizes the string for helping the parser to build the AST from its grammar.
- `src/parser.js` builds the AST tree from the lexer.
- `src/ast.js` provides the visualization of the AST structure (You can see the AST as a DOM document). 
  - `/src/ast/node.js` defines generic AST node type.

---

`/index.d.ts` defines all API type of `php-parser`. (The "d.ts" file is used to provide typescript type information about an API that's written in JavaScript. )

`/src/index.js` is the entrance of the `php-parser`.
```javascript
var engine = require("../src/index");
var parser = new engine({
  // options
  parser: {},
  ast: {},
  lexter: {},
});

// read php file
var phpFile = fs.readFileSync(__dirname + "/myTest.php");
// parse php
parser.parseCode(phpFile)
```

`parser.parseCode()` actually calls `parser.parse()` in `src/parser.js`.
```javascript
engine.parseCode = function(buffer, filename, options) {
  if (typeof filename === "object" && !options) {
    // retro-compatibility
    options = filename;
    filename = "unknown";
  }
  const self = new engine(options);
  return self.parseCode(buffer, filename);
};

engine.prototype.parseCode = function(buffer, filename) {
  this.lexer.mode_eval = false;
  this.lexer.all_tokens = false;
  buffer = getStringBuffer(buffer);
  return this.parser.parse(buffer, filename);
};
```

For `parser.parse()`:
```javascript
parser.prototype.parse = function(code, filename) {
  // ...
  let childs = [];
  this.next();
  while (this.token != this.EOF) {
    const node = this.read_start(); // parse each line of code 
    if (node !== null && node !== undefined) {
      if (Array.isArray(node)) {
        childs = childs.concat(node);
      } else {
        childs.push(node);
      }
    }
  }
  // ...
}
```
The `next()` consumes next token of source code.
The `read_start()` defines in `src/parser/main.js`. It returns every current top statement.

---

## Parsing Example

```php
<?php
  $a = 1;
?>
```

1. `var engine = require("../src/index");` 
2. `var parser = new engine({});`
3. `parser.parseCode(phpFile);`
4. `index.js`: `engine.prototype.parseCode = function(buffer, filename) {...return this.parser.parse(buffer, filename);};`
5. `parser.js`: `parser.prototype.parse = function(code, filename) {... this.next(); ... while(...) { const node = this.read_start();... }}`
6. `parser.js`: `parser.prototype.next = function() {}`
7. `parser/main.js`:
    ```javascript
    read_start: function() {
      if (this.token == this.tok.T_NAMESPACE) {
        return this.read_namespace();   // /parser/namespace.js
      } else {
        return this.read_top_statement();   // /parser/statement.js
      }
    }
    ```
8. `parser/statement.js`:
    ```javascript
    read_top_statement: function() {
      switch (this.token) {
        // ...
        default:
          return this.read_statement();   // normal statement
      }
    }
    ```
9. `parser/statement.js`:
    ```javascript
    read_statement: function() {
      switch (this.token) {
        // ...
        default: {
          // default fallback expr
          const statement = this.node("expressionstatement");
          const expr = this.read_expr();    // read expression
          this.expectEndOfStatement(expr);
          return statement(expr);
        }
      }
    },
    ```
10. `parser/expr.js`:
    ```javascript
    read_expr: function(expr) {
      const result = this.node();
      if (!expr) {
        expr = this.read_expr_item();
      }
      // ...
    }
    ```
11. `parser/expr.js`:
    ```javascript
    read_expr_item: function() {
      // ...
      if (this.is("VARIABLE")) {
        result = this.node();   // prepare ast node
        expr = this.read_variable(false, false, false);   // get the variable such as $a then move to next token
        const isConst =
          expr.kind === "identifier" ||
          (expr.kind === "staticlookup" && expr.offset.kind === "identifier");

        // VARIABLES SPECIFIC OPERATIONS
        switch (this.token) {
          case "=": {
            if (isConst) this.error("VARIABLE");
            let right;
            if (this.next().token == "&") {
              if (this.next().token === this.tok.T_NEW) {
                right = this.read_new_expr();
              } else {
                right = this.read_variable(false, false, true);
              }
            } else {
              right = this.read_expr();   // read the right part of expression
            }
            // create assign ast node
            return result("assign", expr, right, "=");
          }
        }

        // ...
      }
    }
    ```
12. Parse the `$a` and `1`, and then combine them into assign AST node.
