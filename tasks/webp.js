/*
 * grunt-webp
 * http://github.com/somerandomdude/grunt-webp
 * http://somerandomdude.com
 *
 * Copyright (c) 2013 P.J. Onori
 * MIT license.
 */


/*
 -h / -help  ............ short help
  -H / -longhelp  ........ long help
  -q <float> ............. quality factor (0:small..100:big)
  -alpha_q <int> ......... Transparency-compression quality (0..100).
  -preset <string> ....... Preset setting, one of:
                            default, photo, picture,
                            drawing, icon, text
     -preset must come first, as it overwrites other parameters.
  -m <int> ............... compression method (0=fast, 6=slowest)
  -segments <int> ........ number of segments to use (1..4)
  -size <int> ............ Target size (in bytes)
  -psnr <float> .......... Target PSNR (in dB. typically: 42)

  -s <int> <int> ......... Input size (width x height) for YUV
  -sns <int> ............. Spatial Noise Shaping (0:off, 100:max)
  -f <int> ............... filter strength (0=off..100)
  -sharpness <int> ....... filter sharpness (0:most .. 7:least sharp)
  -strong ................ use strong filter instead of simple (default).
  -nostrong .............. use simple filter instead of strong.
  -partition_limit <int> . limit quality to fit the 512k limit on
                           the first partition (0=no degradation ... 100=full)
  -pass <int> ............ analysis pass number (1..10)
  -crop <x> <y> <w> <h> .. crop picture with the given rectangle
  -resize <w> <h> ........ resize picture (after any cropping)
  -mt .................... use multi-threading if available
  -low_memory ............ reduce memory usage (slower encoding)
  -map <int> ............. print map of extra info.
  -print_psnr ............ prints averaged PSNR distortion.
  -print_ssim ............ prints averaged SSIM distortion.
  -print_lsim ............ prints local-similarity distortion.
  -d <file.pgm> .......... dump the compressed output (PGM file).
  -alpha_method <int> .... Transparency-compression method (0..1)
  -alpha_filter <string> . predictive filtering for alpha plane.
                           One of: none, fast (default) or best.
  -alpha_cleanup ......... Clean RGB values in transparent area.
  -noalpha ............... discard any transparency information.
  -lossless .............. Encode image losslessly.
  -hint <string> ......... Specify image characteristics hint.
                           One of: photo, picture or graph

  -metadata <string> ..... comma separated list of metadata to
                           copy from the input to the output if present.
                           Valid values: all, none (default), exif, icc, xmp

  -short ................. condense printed message
  -quiet ................. don't print anything.
  -version ............... print version number and exit.
  -noasm ................. disable all assembly optimizations.
  -v ..................... verbose, e.g. print encoding/decoding times
  -progress .............. report encoding progress

Experimental Options:
  -jpeg_like ............. Roughly match expected JPEG size.
  -af .................... auto-adjust filter strength.
  -pre <int> ............. pre-processing filter
*/


'use strict';

module.exports = function(grunt) {
  var path = require('path');
  var async = require('async');
  grunt.registerMultiTask('webp', 'WebP image format converter.', function() {
    /**
     * Retrieves defined options.
     */
    var options = this.options();
    grunt.verbose.writeflags(options, 'Options');

    var done = this.async();

    var cwebp = 'cwebp';
    if (options.binpath) {
      cwebp = options.binpath;
    }

    // Iterate over all src-dest file pairs.
    async.eachSeries(this.files, function(f, next) {
      
      /**
       * Create folder for the dest file
       */
      f.dest = f.dest.replace(path.extname(f.dest), '.webp');
      grunt.file.mkdir(path.dirname(f.dest));

      var args = [];
      /**
       * Preset setting, one of:
                    default, photo, picture,
                    drawing, icon, text
       */
      if (options.preset) {
        args.push('-preset');
        args.push(options.preset);
      }

      /**
       * Transparency-compression quality (0..100)
       */
      if (options.alphaQuality) {
        args.push('-alpha_q');
        args.push(options.alphaQuality);
      }

      /**
       * compression method (0=fast, 6=slowest)
       */
      if (options.compressionMethod) {
        args.push('-m');
        args.push(options.compressionMethod);
      }

      /**
       * number of segments to use (1..4)
       */
      if (options.segments) {
        args.push('-segments');
        args.push(options.segments);
      }

      /**
       * Target PSNR (in dB. typically: 42)
       */
      if (options.psnr) {
        args.push('-psnr');
        args.push(options.psnr);
      }

      /**
       * Input size (width x height) for YUV
       */
      if (options.dimensions) {
        //TODO: Mention that dimensions are formatted as an array
        args.push('-s');
        args.push(options.dimensions[0]);
        args.push(options.dimensions[1]);
      }

      /**
       * Spatial Noise Shaping (0:off, 100:max)
       */
      if (options.spatialNoiseShaping) {
        args.push('-sns');
        args.push(options.spatialNoiseShaping);
      }

      /**
       * filter strength (0=off..100)
       */
      if (options.filterStrength) {
        args.push('-f');
        args.push(options.filterStrength);
      }

      /**
       * filter sharpness (0:most .. 7:least sharp)
       */
      if (options.filterSharpness) {
        args.push('-sharpness');
        args.push(options.filterSharpness);
      }

      /**
       * use strong filter instead of simple (default).
       */
      if (options.simpleFilter) {
        args.push('-nostrong');
      }

      /**
       * limit quality to fit the 512k limit on
                           the first partition (0=no degradation ... 100=full)
       */
       if (options.partitionLimit) {
        args.push('-partition_limit');
        args.push(options.partitionLimit);
      }

      /**
       * analysis pass number (1..10)
       */
       if (options.analysisPass) {
        args.push('-pass');
        args.push(options.analysisPass);
      }

      /**
       * crop picture with the given rectangle
       */
       if (options.crop) {
        args.push('-crop');
        args.push(options.crop[0]);
        args.push(options.crop[1]);
        args.push(options.crop[2]);
        args.push(options.crop[3]);
      }

      /**
       * resize picture (after any cropping)
       */
       if (options.resizeCrop) {
        args.push('-resize');
        args.push(options.resizeCrop[0]);
        args.push(options.resizeCrop[1]);
      }

      /**
       * use multi-threading if available
       */
       if (options.multiThreading) {
        args.push('-mt');
      }

      /**
       * reduce memory usage (slower encoding)
       */
       if (options.lowMemory) {
        args.push('-low_memory');
      }

      /**
       * Transparency-compression method
       */
       if (options.alphaMethod) {
        args.push('-alpha_method');
        args.push(options.alphaMethod);
      }

      /**
       * predictive filtering for alpha plane.
                           One of: none, fast (default) or best.
       */
       if (options.alphaFilter) {
        args.push('-alpha_filter');
        args.push(options.alphaFilter);
      }

      /**
       * Clean RGB values in transparent area.
       */
       if (options.alphaCleanup) {
        args.push('-alpha_cleanup');
      }

      /**
       * discard any transparency information.
       */
       if (options.noAlpha) {
        args.push('-noalpha');
      }

      /**
       * Encode image losslessly.
       */
       if (options.lossless) {
        args.push('-lossless');
      }

       /**
       * quality factor (0:small..100:big)
       */
      if (options.quality) {
        args.push('-q');
        args.push(options.quality);
      }

      /**
       * Outputs the rules that have been matched.
       */
      if (options.verbose) {
        args.push('-v');
      }

      args.push(f.src);
      args.push('-o');
      args.push(f.dest);

      /**
       * Outputs the file that is being analysed.
       */
      grunt.log.writeln(cwebp + ' ' + args.join(' ') );

      var child = grunt.util.spawn({
        cmd: cwebp,
        args: args
      }, function(error, result, code) {
        grunt.log.writeln(code+''+result);
        if (code !== 0) {
          return grunt.warn(String(code));
        }

        next(error);
      });

      /**
       * displays the output and error streams via the parent process.
       */
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
    }.bind(this), this.async());

  });
};
