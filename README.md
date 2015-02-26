## Install

> **WARNING**
> 
> [`firework_client`]() needs to be available in your $PATH before you attempt
> to use this plugin!!!

```shell
npm install karma-firework-reporter
```

The following environment variables are utilized by [`firework_client`]() so you should probably export them before running Karma.

```shell
ENV.FIREWORK_URL
ENV.FIREWORK_REPORTER_DB # optional
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

    // You can override ENV.FIREWORK_REPORTER_DB here. Also, you can have 
    // multiple outputs; URL and DB.
    fireworkDatabase: "/path/to/firework/db.sqlite",

    // The testing framework you're using. If you specify one, the reporter 
    // will be able to gather more useful data out of spec failures.
    // 
    // Possible values: "mocha", "qunit", null.
    framework: null
  }
}
```

