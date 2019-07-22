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
class unparser {
    constructor(ast) {
        this.ast = ast;
    }
    unparse() {
        
    }
}


module.exports = unparser;