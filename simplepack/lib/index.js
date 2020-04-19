const Compiler = require('./compiler');
const options = require('../simplepack.config')
// 执行入口
new Compiler(options).run();