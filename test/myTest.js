var fs = require("fs");
var util = require("util");
var engine = require("../src/index");
var unparser = require("../plugin/unparser");

var parser = new engine({
  // options
  parser: {
    locations: true
  },
  ast: {
    withPositions: true
  }
});

// Retrieve the AST from the specified source
// var eval = parser.parseEval('echo "My first PHP script!";');

var phpFile = fs.readFileSync(__dirname + "/myTest.php");

var ast = parser.parseCode(phpFile);
// console.log(parser["_tokens"]);
// console.log(util.inspect(parser, { depth: null }));
// console.log(util.inspect(ast, { depth: null }));

var unparser = new unparser(ast);
var code = unparser.unparse();
console.log(code);
fs.writeFile(__dirname + "/myTest.json", unparser.showAST(), (err) => { if(err) {} else {} });
// fs.writeFile(__dirname + "/myTestTokens.json", util.inspect(parser._tokens, { depth: null }), (err) => { if(err) {} else {} });
// unparser.showAST();
