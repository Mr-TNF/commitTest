module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,   //要求箭头函数的参数使用圆括号
    // allow async-await
    'generator-star-spacing': 0,  //强制generator * 函数周围有括号
    // allow space-before-function-paren
    'space-before-function-paren': 0, //要求或禁止函数圆括号之前有一个空格
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0 //禁止使用debugger
  }
}