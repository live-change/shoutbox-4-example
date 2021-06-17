const {  devices } = require('playwright');

exports.config = {
  tests: './*.test.js',
  output: './output',
  helpers: {
    VideoHelper: {
      require: 'codeceptjs-video-helper'
    },
    "AssertWrapper" : {
       "require": "codeceptjs-assert"
    },
    Playwright: {
      browser: 'chromium',
      url: 'http://localhost:8001',
      show: true,
      emulate: {
        ...devices['Pixel 2'],
        recordVideo: process.env.RECORD_TESTS ? {
          dir: "./output"
        } : undefined,
      }
    }
    // WebDriver: {
    //   url: 'http://localhost:8001',
    //   smartWait: 5000,
    //   browser: "chrome",
    //   restart: false,
    //   windowSize: "maximize",hi
    //   timeouts: {
    //     "script": 60000,
    //     "page load": 10000
    //   }
    // }
  },
  include: {
    I: './steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'e2e',
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    },
    wdio: {
        enabled: true,
        services: ['selenium-standalone']
        // additional config for service can be passed here
    }
  }
}