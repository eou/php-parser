# php-unparser

This is a PHP AST unparser written by JavaScript based on [glayzzle/php-parser](https://github.com/glayzzle/php-parser).

It aims to restore PHP code that uses the **original code style format** from AST.

---

### Usage
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

## Development
The unparsing files of PHP expressions and statements are in `./plugin/unparser`.

The unparser locates white spaces in PHP codes using locations records in AST. For compeletely restore PHP source code, we have to modify some source codes in [glayzzle/php-parser](https://github.com/glayzzle/php-parser), mostly location information.

We need to get all white spaces before each token to determine the exact position of each token.

But currently the `php-parser` does not provide an API which can tell us the exact white spaces before each token. And the API which helps is the `lexer.yylloc`.

From `parser.js/next()`:
```javascript
parser.prototype.next = function() {
  // prepare the back command
  if (this.token !== ";" || this.lexer.yytext === ";") {
    // ignore '?>' from automated resolution
    // https://github.com/glayzzle/php-parser/issues/168
    this.prev = [
      this.lexer.yylloc.last_line,  
      this.lexer.yylloc.last_column,
      this.lexer.offset
    ];
  }

  // you can get every token's exact position here
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

The `this.prev` array provides each token's row, column and offset. We need to correspond these tokens to each part of final AST output, especially for operators. The operators' locations are not recorded in the final AST.

And from `this.prev` we can see that current token's location can be extracted from `lexer`:
```javascript
[
  this.lexer.yylloc.last_line,  
  this.lexer.yylloc.last_column,
  this.lexer.offset
];
```

### Add operator location in AST

Need to modify source codes of `php-parser` to show position of each operator.

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