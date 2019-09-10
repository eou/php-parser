/**
 * Copyright (C) 2018 Glayzzle (BSD3 License)
 * @authors https://github.com/tharzen/php-parser
 */
"use strict";

const Block = require("./block");
const KIND = "phpopentag";

/**
 * The php open tag node
 * @constructor Phpopentag
 * @extends {Block}
 * @property {Error[]} errors
 * @property {Doc[]?} comments
 * @property {String[]?} tokens
 */
module.exports = Block.extends(KIND, function Phpopentag(
  children,
  closed,
  errors,
  comments,
  tokens,
  docs,
  location
) {
  Block.apply(this, [KIND, children, docs, location]);
  this.closed = closed;
  this.errors = errors;
  if (comments) {
    this.comments = comments;
  }
  if (tokens) {
    this.tokens = tokens;
  }
});
