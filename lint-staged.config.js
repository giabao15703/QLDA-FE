const { merge } = require('./node_modules/cyberskill/dist/configs/index.cjs').default;
const config = require('./node_modules/cyberskill/dist/configs/lint-staged/lint-staged.base.cjs').default;

module.exports = merge('lint-staged', config);
