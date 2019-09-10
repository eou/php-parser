# php-unparser

This is a PHP AST unparser written by JavaScript based on [glayzzle/php-parser](https://github.com/glayzzle/php-parser).

It aims to restore PHP code that uses the **original code style format** from AST. We do it by restoring the white spaces between every token.

---

## Usage

```javascript
var engine = require("../src/index");
var unparser = require("../plugin/unparser");

var parser = new engine({
  parser: { locations: true },
  ast: { withPositions: true }
});
var ast = parser.parseCode("<?php $a = 1; ?>");
var unparser = new unparser(ast);
var php = unparser.unparse();
```

## Get tokens' locations

The unparsing files of PHP expressions and statements are in `./plugin/unparser`.

The unparser locates white spaces in PHP codes using locations records in AST. For compeletely restore PHP source code, we have to modify some source codes in [glayzzle/php-parser](https://github.com/glayzzle/php-parser), mostly token's position information.

We need to get all white spaces before or after tokens to determine the exact position of them.

But currently the `php-parser` does not provide an API which can tell us the exact white spaces before each token. And the `lexer.yylloc` can help with it indirectly.

From `parser.js/next()`:
```javascript
parser.prototype.next = function() {
  // prepare the back command
  if (this.token !== ";" || this.lexer.yytext === ";") {
    this.prev = [
      this.lexer.yylloc.last_line,  
      this.lexer.yylloc.last_column,
      this.lexer.offset
    ];
  }

  // you can get every token's exact position
  console.log(this.prev);
  // you can get every token's content
  console.log(this.text());

  // eating the token
  this.lex();

  // showing the debug
  if (this.debug) {
    this.showlog();
  }

  // handling comments
  if (this.extractDoc) {
    while (
      this.token === this.tok.T_COMMENT ||
      this.token === this.tok.T_DOC_COMMENT
    ) {
      // APPEND COMMENTS
      if (this.token === this.tok.T_COMMENT) {
        this._docs.push(this.read_comment());
      } else {
        this._docs.push(this.read_doc_comment());
      }
    }
  }

  return this;
};
```

We can extract current token's position from `lexer`:
```javascript
[
  this.lexer.yylloc.last_line,  
  this.lexer.yylloc.last_column,
  this.lexer.offset
];
```

And The `this.prev` array also provides tokens' row, column and offset. 

We need to recognize these tokens with each part of final AST output, especially for operators since the operators' positions are not recorded in the final AST.

## Position in AST

The position in AST is encapsulated with the `Position` object in `src/ast/position.js`:
```javascript
/**
 * Each Position object consists of a line number (1-indexed) and a column number (0-indexed):
 * @constructor Position
 * @property {Number} line
 * @property {Number} column
 * @property {Number} offset
 */
const Position = function(line, column, offset) {
  this.line = line;
  this.column = column;
  this.offset = offset;
};
```

## Add operator location in AST

Need to modify source codes of `php-parser` to show position of each operator.

Most of them are in `src/parser/expr.js`. The way of extracting their positions is looking for the part which parses them and use the `lexer.yylloc` or `this.prev` to find out their positions.

For example:
```javascript
witch (this.token) {
  case "=": {
    if (isConst) this.error("VARIABLE");
    // get the `=` position and go to next token
    prev = this.next().prev;    
    // encapsulate the position into `Position`
    op.startLoc = new Position(prev[0], prev[1] - 1, prev[2] - 1);
    let right;
    if (this.token == "&") {
      right = this.node("byref");
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
    // wrap the position into assign AST node
    return result("assign", expr, right, op);
  }
  // ...
}
```

We can also save the "white spaces" before or after each token for our own good. The way of calculating the white spaces is to simply minus columns or rows of two adjacent token.

And if there is a new line before some tokens, we can store the `\n` before the white spaces. (The `wsbefore` and `wsafter` stores a string actually.)

Besides these operators' locations, we should also extract some other tokens' locations which does not exist in the current AST, such as `;` in the end of all expressions, `:` in `switch`, `()` in some typical expressions, `[]` in arrays and etc. They all can be found in the `src/parser`.


## Comments

The PHP comments are stored in `leadingComments` and `trailingComments` of the final AST node. 

They are just strings. And their locations have already restored.

## Structure

The unparser is in `plugin/unparser.js`:
```javascript
class unparser {
  constructor(ast) {
    this.ast = ast;
    this.start = this.ast.loc.start;
    this.end = this.ast.loc.end;
    this.children = this.ast.children;
    this.row = 0;   // row pointer
    this.col = 0;   // column pointer
    this.short_open_tag = false;
    this.code = "";
  }
}
```

It consumes the children of `program` AST node one by one and unparse them into a PHP string.

The main idea is string splice based on the tokens' position.

The node unparser is `unparser.prototype.unparseNode`. It will unparse different nodes based on different node kind.

## Development

`assign`:

1. `=`
2. `+=`
3. `-=`
4. `*=`
5. `**=`
6. `/=`
7. `.=`
8. `%=`
9. `&=` 
10. `|=`
11. `^=`
12. `<<=`
13. `>>=`

`post`:

15. `++`
16. `--`

`bin`:

16. `|`
17. `&`
18. `^`
19. `.`
20. `+`
21. `-`
22. `*`
23. `/`
24. `%`
25. `**`
26. `<<`
27. `>>`
28. `||`
29. `or`
30. `&&`
31. `and`
32. `xor`
33. `===`
34. `!==`
35. `==`
36. `!=`
37. `<`
38. `>`
39. `<=`
40. `>=`
41. `<=>`
42. `instanceof`
43. `??`

`retif`:

44. `? :`

## Contribute
😶[Harry](https://github.com/eou)
