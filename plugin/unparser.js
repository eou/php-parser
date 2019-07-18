/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/eou/php-parser
 */
"use strict";

/**
 * The PHP Unparser class that constructs PHP source code from the the AST tree
 *
 * @class
 * @property {AST} ast - the AST which converted from PHP source code
 */
const unparser = function(ast) {
    this.ast = ast;
}

unparser.prototype.unparse = function() {
    
}

module.exports = unparser;