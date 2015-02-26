## Install

```
npm install
```

## Assumes the existence of

```
ENV.FIREWORK_URL
ENV.JOB_NAME
ENV.BUILD_NUMBER
ENV.BUILD_URL
ENV.GERRIT_PROJECT
ENV.GERRIT_CHANGE_NUMBER
ENV.GERRIT_PATCHSET_NUMBER
ENV.GERRIT_CHANGE_URL
```

And finally, enable and configure it in your `karma.conf`:

```javascript
// karma.conf.js

{
  fireworkReporter: {
    // If not specified here, ENV.FIREWORK_URL must be specified.
    fireworkUrl: "http://firework.myapp.com",

    // The testing framework you're using. If you specify one, the reporter 
    // will be able to gather more useful data out of spec failures.
    // 
    // Possible values: "mocha", "qunit", null.
    framework: null
  }
}