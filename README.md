# html-stitch

> Grunt plugin to solve the problem of light-weight html file templating engine for Yeoman.

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install html-stitch --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('html-stitch');
```

## The "stitch" task

### Overview
In your project's Gruntfile, add a section named `stitch` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  stitch: {
    options: {
      // Task-specific options go here.
    },
    files: {
      // dest is the directory to store the generated html files
      // [...] is the src file path, 
      dest:[test/*.stitch]
    },
  },
})
```

### Options

#### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. 'Stitch' task will scan all *.stitch src files. _*.stitch files will be considered as a template file, which will not be converted to html file. *.stitch files without a prefix '_'/underscore will be converted to html file and put into the destination directory. _*.stitch files can be nested within each other. Please don't make it a deadlock because of reference between each other.

```js
grunt.initConfig({
  stitch: {
    options: {},
    files: {
      'dest_directory': ['test/*.stitch'],
    },
  },
})
```

#### stitch syntax
{{ include _file1.stitch }}

{{ inherit _file2.stitch }}

{{ include _old.stitch:_new.stitch }}

File without and '_' prefix will be converted to html file.

Example

```index.stitch
<html>
	<head>
	</head>
	<body>
		{{ include _body.stitch }}

		{{ include _footer.stitch }}
	</body>
</html>
```

You can inherit an basic template file and replace some of it's template.
```
{{ inherit _basic.stitch }}

{{ include _laugh.stitch:_cry.stitch }}
```


## Comment
I'd like to add more functions into it.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
2015-04-02 Add {{ include }} tag.

2015-04-03 Add {{ inherit }} tag, {{ include old:new }} replace-function tag.


## License
Copyright (c) 2015 spike yang. Licensed under the MIT license.
