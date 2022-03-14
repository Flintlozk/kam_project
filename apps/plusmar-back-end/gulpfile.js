const { src, dest, series, task, watch } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const strip = require('gulp-strip-comments');
const autoprefixer = require('gulp-autoprefixer');
const fileDestination = '../../dist/apps/plusmar-back-end/assets/static';
const fileStyleDestination = '../../dist/apps/plusmar-back-end/assets/css';
const watchFor = ['./src/assets/static/step2/main.ts', './src/assets/static/step2/payment.ts', './src/assets/static/step2/logistic.ts'];
const watchPaypalCheckout = ['./src/assets/static/checkout/checkout-paypal.ts'];
const watch2C2PCheckout = ['./src/assets/static/checkout/checkout-2c2p.ts'];
const watchOmiseCheckout = ['./src/assets/static/checkout/checkout-omise.ts'];
const contactLeadFormPath = ['./src/assets/static/lead-forms/contactleadform.ts'];
const selectProduct = ['./src/assets/static/select/select-product.ts'];

function defaultTs() {
  return src(['./src/assets/static/javascript.ts'])
    .pipe(
      babel({
        presets: ['@babel/preset-typescript'],
      }),
    )
    .pipe(uglify())
    .pipe(strip())
    .pipe(dest(fileDestination));
}
function pdpa() {
  return src(['./src/assets/static/pdpa.ts'])
    .pipe(
      babel({
        presets: ['@babel/preset-typescript'],
      }),
    )
    .pipe(uglify())
    .pipe(strip())
    .pipe(dest(fileDestination));
}

function autoCompleteTs() {
  return src(['./src/assets/static/autocomplete.ts'])
    .pipe(
      babel({
        presets: ['@babel/preset-typescript'],
      }),
    )
    .pipe(uglify())
    .pipe(strip())
    .pipe(dest(fileDestination));
}

function pipelineStep2Ts() {
  return src(watchFor)
    .pipe(
      babel({
        presets: ['@babel/preset-typescript'],
      }),
    )
    .pipe(uglify())
    .pipe(strip())
    .pipe(concat('step2js.js'))
    .pipe(dest(fileDestination));
}
function pipelineStep3CheckoutPaypalTs() {
  return src(watchPaypalCheckout)
    .pipe(
      babel({
        presets: ['@babel/preset-typescript'],
      }),
    )
    .pipe(uglify())
    .pipe(strip())
    .pipe(concat('step3paypal.js'))
    .pipe(dest(fileDestination));
}
function pipelineStep3Checkout2C2PTs() {
  return src(watch2C2PCheckout)
    .pipe(
      babel({
        presets: ['@babel/preset-typescript'],
      }),
    )
    .pipe(uglify())
    .pipe(strip())
    .pipe(concat('step32c2p.js'))
    .pipe(dest(fileDestination));
}
function pipelineStep3CheckoutOmiseTs() {
  return src(watchOmiseCheckout)
    .pipe(
      babel({
        presets: ['@babel/preset-typescript'],
      }),
    )
    .pipe(uglify())
    .pipe(strip())
    .pipe(concat('step3omise.js'))
    .pipe(dest(fileDestination));
}
function pipelineStep2PaypalTs() {
  return src(['./src/assets/static/step2/paypal.ts'])
    .pipe(
      babel({
        presets: ['@babel/preset-typescript'],
      }),
    )
    .pipe(uglify())
    .pipe(strip())
    .pipe(concat('step2paypal.js'))
    .pipe(dest(fileDestination));
}

function pipelineStep2OmiseTs() {
  return src(['./src/assets/static/step2/omise.ts'])
    .pipe(
      babel({
        presets: ['@babel/preset-typescript'],
      }),
    )
    .pipe(uglify())
    .pipe(strip())
    .pipe(concat('step2omise.js'))
    .pipe(dest(fileDestination));
}

function contactLeadFormToTs() {
  return src(contactLeadFormPath)
    .pipe(
      babel({
        presets: ['@babel/preset-typescript'],
      }),
    )
    .pipe(uglify())
    .pipe(strip())
    .pipe(dest(fileDestination));
}
function selectProductToTs() {
  return src(selectProduct)
    .pipe(
      babel({
        presets: ['@babel/preset-typescript'],
      }),
    )
    .pipe(uglify())
    .pipe(strip())
    .pipe(concat('selectproduct.js'))
    .pipe(dest(fileDestination));
}
function defaultCss() {
  return src(['./src/assets/css/style-step2.css', './src/assets/css/style-address.css'])
    .pipe(
      autoprefixer({
        cascade: false,
      }),
    )
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(dest(fileStyleDestination));
}
task('watch', () => {
  return watch(
    [...watchFor, ...contactLeadFormPath],
    series(
      defaultTs,
      pdpa,
      autoCompleteTs,
      defaultCss,
      pipelineStep2Ts,
      pipelineStep3CheckoutPaypalTs,
      pipelineStep3Checkout2C2PTs,
      pipelineStep3CheckoutOmiseTs,
      pipelineStep2PaypalTs,
      pipelineStep2OmiseTs,
      contactLeadFormToTs,
      selectProductToTs,
    ),
  );
});
exports.default = series(
  defaultTs,
  pdpa,
  autoCompleteTs,
  defaultCss,
  pipelineStep2Ts,
  pipelineStep3CheckoutPaypalTs,
  pipelineStep3Checkout2C2PTs,
  pipelineStep3CheckoutOmiseTs,
  pipelineStep2PaypalTs,
  pipelineStep2OmiseTs,
  contactLeadFormToTs,
  selectProductToTs,
);
