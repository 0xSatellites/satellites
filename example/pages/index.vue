<template>
  <v-content>
    <section class="l-visual">
      <div class="l-visual__bg">
        <img src="~/assets/img/top_visual/bg_pc.png" alt="" class="u-obj--pc" /><img
          src="~/assets/img/top_visual/bg_sp.png"
          alt=""
          class="u-obj--sp"
        />
      </div>

      <div class="l-visual__txts">
        <h1 class="l-visual__txts__title u-obj--pc">Brand New!!</h1>
        <h1 class="l-visual__txts__title u-obj--sp pl-4">Brand<br />New!!</h1>
        <h2 class="l-visual__txts__tagline pa-1">
          Digital Asset's Trade Matching Service<br /><span class="bazaaar">Bazaaar.io</span>
        </h2>
      </div>
      <div class="l-visual__img"><img src="~/assets/img/top_visual/illust.png" alt="" /></div>

      <div class="l-about">
        <ul>
          <li>
            <h2 class="l-about__title">On 0x Protocol</h2>
            <p class="l-about__txt">
              Order uses decentralization protocol that the exchange layer for the crypto economy.
            </p>
          </li>
          <li>
            <h2 class="l-about__title">White List</h2>
            <p class="l-about__txt">We deal only with digital assets which are not interpreted as crypto currency.</p>
          </li>
          <li>
            <h2 class="l-about__title">Specialized Interface</h2>
            <p class="l-about__txt">Interface is specialized for each digital assets for the better userbility.</p>
          </li>
        </ul>
      </div>
    </section>
    <section class="c-index">
      <h2 class="c-index__title">Handling Assets</h2>
      <v-container grid-list-md align-center justify-space-between>
        <v-layout row wrap justify-center>
          <v-flex xs6 sm4>
            <a href="https://www.cryptokitties.co/" target="_blank">
              <v-card class="ma-1">
                <v-img :src="require('~/assets/img/asset/CryptoKitties.png')" aspect-ratio="1.2"></v-img>
              </v-card>
            </a>
          </v-flex>
          <v-flex xs6 sm4>
            <a href="https://www.crypt-oink.io/" target="_blank">
              <v-card class="ma-1">
                <v-img :src="require('~/assets/img/asset/Crypt_Oink.png')" aspect-ratio="1.2"></v-img>
              </v-card>
            </a>
          </v-flex>
          <v-flex xs6 sm4>
            <a href="https://www.mycryptoheroes.net/" target="_blank">
              <v-card class="ma-1">
                <v-img :src="require('~/assets/img/asset/mch_logo.png')" aspect-ratio="1.2" contain></v-img>
              </v-card>
            </a>
          </v-flex>
          <v-flex xs6 sm4>
            <a href="https://ens.domains/" target="_blank">
              <v-card class="ma-1">
                <v-img :src="require('~/assets/img/asset/ens.png')" aspect-ratio="1.2" contain></v-img>
              </v-card>
            </a>
          </v-flex>
          <v-flex xs6 sm4>
            <a href="https://www.cryptovoxels.com/" target="_blank">
              <v-card class="ma-1">
                <v-img :src="require('~/assets/img/asset/CryptovoxelsParcel.jpg')" aspect-ratio="1.2" contain></v-img>
              </v-card>
            </a>
          </v-flex>
          <v-flex xs6 sm4>
            <a href="http://maltinerecords.cs8.biz/b1.html" target="_blank">
              <v-card class="ma-1">
                <v-img :src="require('~/assets/img/asset/mrm.png')" aspect-ratio="1.2" contain></v-img>
              </v-card>
            </a>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Index extends Vue {}
</script>

<style lang="scss" scoped>
h1,
h2,
h3,
h4,
h5,
h6,
p {
  margin: 0;
}
ul,
ol {
  margin-top: 0;
  margin-bottom: 0;
}

em {
  font-style: normal;
  color: #d70000;
}

img {
  vertical-align: top;
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
}

/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */

/* Document
   ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

/* Sections
   ========================================================================== */

/**
 * Remove the margin in all browsers.
 */

body {
  margin: 0;
}

/**
 * Correct the font size and margin on `h1` elements within `section` and
 * `article` contexts in Chrome, Firefox, and Safari.
 */

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

/* Grouping content
   ========================================================================== */

/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */

pre {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/* Text-level semantics
   ========================================================================== */

/**
 * Remove the gray background on active links in IE 10.
 */

a {
  background-color: transparent;
  text-decoration: none;
}

/**
 * 1. Remove the bottom border in Chrome 57-
 * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
 */

abbr[title] {
  border-bottom: none; /* 1 */
  text-decoration: underline; /* 2 */
  text-decoration: underline dotted; /* 2 */
}

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */

b,
strong {
  font-weight: bolder;
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */

code,
kbd,
samp {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/**
 * Add the correct font size in all browsers.
 */

small {
  font-size: 80%;
}

/**
 * Prevent `sub` and `sup` elements from affecting the line height in
 * all browsers.
 */

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/* Embedded content
   ========================================================================== */

/**
 * Remove the border on images inside links in IE 10.
 */

img {
  border-style: none;
}

/* Forms
   ========================================================================== */

/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */

button,
input {
  /* 1 */
  overflow: visible;
}

/**
 * Remove the inheritance of text transform in Edge, Firefox, and IE.
 * 1. Remove the inheritance of text transform in Firefox.
 */

button,
select {
  /* 1 */
  text-transform: none;
}

/**
 * Correct the inability to style clickable types in iOS and Safari.
 */

button,
[type='button'],
[type='reset'],
[type='submit'] {
  -webkit-appearance: button;
}

/**
 * Remove the inner border and padding in Firefox.
 */

button::-moz-focus-inner,
[type='button']::-moz-focus-inner,
[type='reset']::-moz-focus-inner,
[type='submit']::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

/**
 * Restore the focus styles unset by the previous rule.
 */

button:-moz-focusring,
[type='button']:-moz-focusring,
[type='reset']:-moz-focusring,
[type='submit']:-moz-focusring {
  outline: 1px dotted ButtonText;
}

/**
 * Correct the padding in Firefox.
 */

fieldset {
  padding: 0.35em 0.75em 0.625em;
}

/**
 * 1. Correct the text wrapping in Edge and IE.
 * 2. Correct the color inheritance from `fieldset` elements in IE.
 * 3. Remove the padding so developers are not caught out when they zero out
 *    `fieldset` elements in all browsers.
 */

legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}

/**
 * Add the correct vertical alignment in Chrome, Firefox, and Opera.
 */

progress {
  vertical-align: baseline;
}

/**
 * Remove the default vertical scrollbar in IE 10+.
 */

textarea {
  overflow: auto;
}

/**
 * 1. Add the correct box sizing in IE 10.
 * 2. Remove the padding in IE 10.
 */

[type='checkbox'],
[type='radio'] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

/**
 * Correct the cursor style of increment and decrement buttons in Chrome.
 */

[type='number']::-webkit-inner-spin-button,
[type='number']::-webkit-outer-spin-button {
  height: auto;
}

/**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */

[type='search'] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/**
 * Remove the inner padding in Chrome and Safari on macOS.
 */

[type='search']::-webkit-search-decoration {
  -webkit-appearance: none;
}

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 * 2. Change font properties to `inherit` in Safari.
 */

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/* Interactive
   ========================================================================== */

/*
 * Add the correct display in Edge, IE 10+, and Firefox.
 */

details {
  display: block;
}

/*
 * Add the correct display in all browsers.
 */

summary {
  display: list-item;
}

/* Misc
   ========================================================================== */

/**
 * Add the correct display in IE 10+.
 */

template {
  display: none;
}

/**
 * Add the correct display in IE 10.
 */

[hidden] {
  display: none;
}

//$fontMincho: 'Noto Serif JP', serif;//regular 400, medium 500, bold 700
$fontGothic: 'Noto Sans JP', sans-serif; //regular 400, bold 700

/* ------
四捨五入 round-decimal(0.333, 1) => 0.3
切り上げ ceil-decimal(0.333, 1)  => 0.4
切り捨て floor-decimal(0.333, 1) => 0.3
------ */

@function round-decimal($number, $digits: 0) {
  @return to-fixed($number, $digits, 'round');
}

@function ceil-decimal($number, $digits: 0) {
  @return to-fixed($number, $digits, 'ceil');
}

@function floor-decimal($number, $digits: 0) {
  @return to-fixed($number, $digits, 'floor');
}

@function to-fixed($number, $digits: 0, $round: 'round') {
  $n: 1;
  // $number must be a number
  @if type-of($number) != number {
    @warn '#{ $number } is not a number.';
    @return $number;
  }
  // $digits must be a unitless number
  @if type-of($digits) != number {
    @warn '#{ $digits } is not a number.';
    @return $number;
  } @else if not unitless($digits) {
    @warn '#{ $digits } has a unit.';
    @return $number;
  }
  @for $i from 1 through $digits {
    $n: $n * 10;
  }
  @if $round == 'round' {
    @return round($number * $n) / $n;
  } @else if $round == 'ceil' {
    @return ceil($number * $n) / $n;
  } @else if $round == 'floor' {
    @return floor($number * $n) / $n;
  } @else {
    @warn '#{ $round } is undefined keyword.';
    @return $number;
  }
}

@media screen and (min-width: 768px) {
  .l-visual {
    position: relative;
    width: 100%;
    height: 725px;
    min-width: 1000px;
    max-width: 2400px;
    margin: 0 auto;
    overflow-x: hidden;
    color: #fff;

    &__bg {
      position: absolute;
      left: calc(50% - 1200px);
      top: 0;
      img {
        width: (4800px / 2);
      }
    }

    &__txts {
      position: absolute;
      right: calc(50% + 14px);
      top: 132px;
      text-align: center;
      &__title {
        font-size: 60px;
        br {
          display: none;
        }
        margin-bottom: 50px;
      }
      &__tagline {
        margin-top: 10px;
        font-size: 25px;
        .bazaaar {
          line-height: 60px;
          font-size: 40px;
        }
      }
    }

    &__img {
      position: absolute;
      left: calc(50% + 35px);
      top: 46px;
      img {
        width: (838px / 2);
      }
    }
  }

  //
  .l-about {
    position: relative;
    width: 1000px;
    margin: 0 auto;
    padding: 435px 0 0 0;
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      li {
        width: 270px;
        margin: 0;
        padding: 0;
        &:nth-child(3n + 2),
        &:nth-child(3) {
          margin-left: 95px;
        }
      }
    }

    &__title {
      font-size: 20px;
      line-height: 1.7;
      font-weight: bold;
    }

    &__txt {
      font-size: 14px;
      line-height: 1.7;
      font-weight: normal;
    }
  }
  .u-d {
    &--none {
      display: none !important;
    }
  }

  // Align Support
  // --------------------------
  .u-align {
    &__c {
      text-align: center !important;
    }
    &__r {
      text-align: right !important;
    }
    &__l {
      text-align: left !important;
    }
  }

  .u-valign {
    &__m {
      vertical-align: middle !important;
    }
    &__t {
      vertical-align: top !important;
    }
    &__b {
      vertical-align: bottom !important;
    }
  }

  // Margin Padding Support
  // --------------------------
  @for $i from 0 through 20 {
    .u-mt#{$i * 5} {
      margin-top: 5px * $i !important;
    }
    .u-mr#{$i * 5} {
      margin-right: 5px * $i !important;
    }
    .u-mb#{$i * 5} {
      margin-bottom: 5px * $i !important;
    }
    .u-ml#{$i * 5} {
      margin-left: 5px * $i !important;
    }
    .u-pt#{$i * 5} {
      padding-top: 5px * $i !important;
    }
    .u-pr#{$i * 5} {
      padding-right: 5px * $i !important;
    }
    .u-pb#{$i * 5} {
      padding-bottom: 5px * $i !important;
    }
    .u-pl#{$i * 5} {
      padding-left: 5px * $i !important;
    }
  }

  // Font Size Support
  // --------------------------
  @for $i from 10 through 40 {
    .u-f#{$i},
    td.u-f#{$i},
    th.u-f#{$i},
    tr.u-f#{$i} td,
    tr.u-f#{$i} th {
      font-size: 1px * $i !important;
    }
  }

  .u-obj {
    &--pc {
    }
    &--sp {
      display: none !important;
    }
  }

  .u-wba {
    word-break: break-all;
  }

  .u-cf:after {
    content: ' ';
    display: block;
    clear: both;
  }

  .c-index {
    position: relative;
    width: 1000px;
    margin: (100px - 20) auto 0;

    &--recommend {
      margin-top: -54px;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 230px;
        margin: 0 0 0 26px;
        padding: 0;
        display: flex;
        &:nth-child(4n + 1) {
          margin-left: 0;
        }
        &:nth-child(n + 5) {
          margin-top: 30px;
        }
      }
    }

    &__title {
      margin-bottom: 30px;
      font-size: 24px;
      line-height: 1.7;
      text-align: center;
      color: #575656;
      font-weight: bold;
    }

    &__more {
      position: absolute;
      right: 0;
      top: 50px;
      a {
        &:link,
        &:visited {
          font-size: 14px;
          line-height: 1.1;
          color: #3498db;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        &:hover {
          opacity: 0.5;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  h1 {
    margin: 0;
  }
  h2 {
    margin: 0;
  }
  .l-visual {
    position: relative;
    width: 100%;
    color: #fff;

    &__bg {
      img {
        width: 100%;
      }
    }

    &__txts {
      position: absolute;
      left: 0;
      top: floor-decimal(45vw * 100 / 375, 2);
      width: 100%;
      &__title {
        font-size: floor-decimal(50vw * 100 / 375, 2);
        width: 55%;
      }
      &__tagline {
        // margin-top: floor-decimal(50vw * 100 / 375, 2);
        text-align: center;
        font-size: floor-decimal(18vw * 100 / 375, 2);
        .bazaaar {
          font-size: floor-decimal(36vw * 100 / 375, 2);
        }
      }
    }

    &__img {
      position: absolute;
      right: floor-decimal(15vw * 100 / 375, 2);
      top: floor-decimal(20vw * 100 / 375, 2);
      img {
        width: floor-decimal(190vw * 100 / 375, 2);
      }
    }
  }

  //
  .l-about {
    position: absolute;
    left: 0;
    top: floor-decimal(295vw * 100 / 375, 2);
    width: 100%;
    ul {
      list-style: none;
      width: floor-decimal(280vw * 100 / 375, 2);
      margin: 0 auto;
      padding: 0;
      display: flex;
      flex-direction: column;
      li {
        margin: 0;
        padding: 0;
        &:nth-child(n + 2) {
          margin-top: floor-decimal(20vw * 100 / 375, 2);
        }
      }
    }

    &__title {
      font-size: floor-decimal(20vw * 100 / 375, 2);
      line-height: 1.7;
      font-weight: bold;
    }

    &__txt {
      font-size: floor-decimal(14vw * 100 / 375, 2);
      line-height: 1.7;
      font-weight: normal;
    }
  }
  .u-d {
    &--none {
      display: none !important;
    }
  }

  // Align Support
  // --------------------------
  .u-align {
    &__c {
      text-align: center !important;
    }
    &__r {
      text-align: right !important;
    }
    &__l {
      text-align: left !important;
    }
  }

  .u-valign {
    &__m {
      vertical-align: middle !important;
    }
    &__t {
      vertical-align: top !important;
    }
    &__b {
      vertical-align: bottom !important;
    }
  }

  // Margin Padding Support
  // --------------------------
  @for $i from 0 through 20 {
    .u-mt#{$i * 5} {
      margin-top: 5px * $i !important;
    }
    .u-mr#{$i * 5} {
      margin-right: 5px * $i !important;
    }
    .u-mb#{$i * 5} {
      margin-bottom: 5px * $i !important;
    }
    .u-ml#{$i * 5} {
      margin-left: 5px * $i !important;
    }
    .u-pt#{$i * 5} {
      padding-top: 5px * $i !important;
    }
    .u-pr#{$i * 5} {
      padding-right: 5px * $i !important;
    }
    .u-pb#{$i * 5} {
      padding-bottom: 5px * $i !important;
    }
    .u-pl#{$i * 5} {
      padding-left: 5px * $i !important;
    }
  }

  // Font Size Support
  // --------------------------
  @for $i from 10 through 40 {
    .u-f#{$i},
    td.u-f#{$i},
    th.u-f#{$i},
    tr.u-f#{$i} td,
    tr.u-f#{$i} th {
      font-size: 1px * $i !important;
    }
  }

  .u-obj {
    &--pc {
      display: none !important;
    }
    &--sp {
    }
  }

  .u-wba {
    word-break: break-all;
  }

  .u-cf:after {
    content: ' ';
    display: block;
    clear: both;
  }

  .c-index {
    position: relative;
    width: floor-decimal(348vw * 100 / 375, 2);
    margin: floor-decimal(50vw * 100 / 375, 2) auto 0;

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      li {
        width: floor-decimal(169vw * 100 / 375, 2);
        margin: 0;
        padding: 0;
        display: flex;
        &:nth-child(2n) {
          margin-left: floor-decimal(10vw * 100 / 375, 2);
        }
        &:nth-child(n + 3) {
          margin-top: floor-decimal(20vw * 100 / 375, 2);
        }
      }
    }

    &__title {
      margin-bottom: floor-decimal(20vw * 100 / 375, 2);
      font-size: floor-decimal(20vw * 100 / 375, 2);
      line-height: 1.7;
      text-align: center;
      color: #575656;
      font-weight: bold;
    }

    &__more {
      position: absolute;
      right: floor-decimal(3vw * 100 / 375, 2);
      top: floor-decimal(35vw * 100 / 375, 2);
      text-align: right;
      a {
        &:link,
        &:visited {
          font-size: floor-decimal(12vw * 100 / 375, 2);
          line-height: 1.1;
          color: #3498db;
          text-decoration: none;
        }
      }
    }
  }
}
</style>
