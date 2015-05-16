var _ = require('lodash'),
    path = require('path'),
    async = require('async'),
    imageJS = require('imagejs'),
    Pageres = require('pageres');

var extractColors = module.exports = {
    all: function(opt, cb) {
        if (!_.isFunction(cb)) {
            throw new TypeError('cb must be a function');
        }
        if (!_.isObject(opt)) {
            cb(new TypeError('opt must be an object'));
            return extractColors;
        }
        if (!_.isArray(opt.pages)) {
            cb(new TypeError('opt.pages must be an array'));
            return extractColors;
        }

        var colors = [],
            pageres = new Pageres(opt.pageresOpt);

        _.each(opt.pages, function(page) {
            pageres.src.apply(pageres, page);
        });

        pageres.run(function(err, imgStreams) {
            if (err) {
                cb(err);
                return;
            }

            async.each(imgStreams, function(imgStream, done) {
                var pageColors = [],
                    filename = imgStream.filename,
                    image = new imageJS.Bitmap();

                image.read(imgStream, filename.substr(filename.length - 3, filename.length - 1) === 'png' ? 2 : 1)
                    .then(function() {
                        _.times(image.width, function(x) {
                            _.times(image.height, function(y) {
                                pageColors.push(image.getPixel(x, y));
                            });
                        });

                        colors.push(pageColors);

                        if (_.isString(opt.dest)) {
                            image.writeFile(path.join(opt.dest, imgStream.filename), {quality: opt.quality})
                                .then(function() {
                                    done();
                                }).error(done);
                        }
                        else {
                            done();
                        }
                    }).error(done);
            }, function(err) {
                cb(err, colors);
            });
        });

        return extractColors;
    },
    unique: function(opt, cb) {
        if (!_.isFunction(cb)) {
            throw new TypeError('cb must be a function');
        }

        extractColors.all(opt, function(err, colors) {
            cb(err, _.unique(colors));
        });

        return extractColors;
    },
    frequent: function(opt, cb) {
        if (!_.isFunction(cb)) {
            throw new TypeError('cb must be a function');
        }
        if (!_.isObject(opt)) {
            cb(new TypeError('opt must be an object'));
            return extractColors;
        }
        if (!_.isNumber(opt.amount)) {
            cb(new TypeError('opt.amount must be a number'));
            return extractColors;
        }

        var freqColors = [];

        extractColors.all(opt, function(err, pageColors) {
            _.each(pageColors, function(colors) {
                if (err) {
                    cb(err);
                    return;
                }

                var pageFreqColors = [],
                    freqDist = _.chain(colors)
                        .countBy(function(color) { return JSON.stringify(color); })
                        .reduce(function(arr, freq, color) {
                            var obj = {};

                            obj[color] = freq;

                            arr.push(obj);

                            return arr;
                        }, [])
                        .sortBy(function(obj) { return -obj[_.keys(obj)[0]]; })
                        .value();

                _.times(opt.amount, function(i) {
                    pageFreqColors.push(JSON.parse(_.keys(freqDist[i])[0]));
                });

                freqColors.push(pageFreqColors);
            });

            cb(err, freqColors);
        });

        return extractColors;
    }
};