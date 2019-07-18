# Development Notes

- `lexer.js` tokenizes the string for helping the parser to build the AST from its grammar.
- `parser.js` builds the AST tree from the lexer.
- `ast.js` provides the visualization of the AST structure (You can see the AST as a DOM document). 

---

`/index.d.ts` defines all API type of `php-parser`. (The "d.ts" file is used to provide typescript type information about an API that's written in JavaScript. )

`src/index.js` is the entrance of the `php-parser`.
```javascript
var engine = require("../src/index");
var parser = new engine({
  // options
  parser: {},
  ast: {},
  lexter: {},
});

var phpFile = fs.readFileSync(__dirname + "/myTest.php");
console.log(parser.parseCode(phpFile));
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
The `read_start()` defines in `src/parser/main.js`. It returns every current top statement.

---

