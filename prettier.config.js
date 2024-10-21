const { merge } = require('./node_modules/cyberskill/dist/configs/index.cjs').default;
const config = require('./node_modules/cyberskill/dist/configs/prettier/prettier.base.cjs').default;

module.exports = merge('prettier', config);
