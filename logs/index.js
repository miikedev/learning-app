var colors = require('colors')
function f1(str) {
    return str.toUpperCase()
}
const logger = require('tracer').colorConsole({
    format: [
      '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})', //default format
      {
        error:
          '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}' // error format
      }
    ],
    dateformat: 'HH:MM:ss dd-mm-yyyy',
    preprocess: function(data) {
      data.title = data.title.toUpperCase()
    },
    filters: [
        colors.underline,
        colors.green, //default filter
        //the last item can be custom filter. here is "warn" and "error" filter
        {
          warn: colors.yellow,
          error: [ colors.pink]
        }
      ]
})

module.exports = logger
