grunt-webp
==========

Convert your images to [WebP](https://developers.google.com/speed/webp/) format.

## Getting Started

To install this plugin, open up the terminal, `cd` to your project's root directory and run the following command:

```shell
npm install grunt-webp --save-dev
```

This plugin depends on WebP's `cwebp` encoder. You'll need to install the [WebP Package](https://developers.google.com/speed/webp/download)
In your `Gruntfile.js` file add the following line:

```js
grunt.loadNpmTasks('grunt-webp');
```

This plugin requires Grunt `~0.4.0`
