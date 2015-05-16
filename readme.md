# node-website-color-extractor

## Description
This library takes screenshots of websites and extracts all of their colors or most frequently occurring colors in rgb object format. Another library like [TinyColor](https://github.com/bgrins/TinyColor) can be used to convert to other formats.

## API
#### extractColors.all(```opt```, ```cb```)

Extract the color of every pixel from screenshots of websites

* object `opt` - An options object
  * array{array{string | array{string} | object}} `pages` - An array of arrays of [pageres.src](https://github.com/sindresorhus/pageres#pageressrcurl-sizes-options) arguments
  * object `pageresOpt` - (Optional) [pageres options](https://github.com/sindresorhus/pageres#pageresoptions)
  * string `dest` - (Optional) A directory in which to save screenshots of the websites from which colors are extracted. Screenshots will not be saved if this property is omitted.
  * number `quality` - (Optional) A number between 0 and 100 which determines the JPEG encoding quality if `dest` is provided and a [format](https://github.com/sindresorhus/pageres#format) of "jpg" was provided in `pageresOpt` or `pages`. Defaults to 90.
* function(null|object `err`, array{array{object{number}}} `colors`) `cb` - A function to be executed after the colors are extracted

__Example__

```
extractColors.all(
    {
        pages: [['google.com', ['650x650']]],
        pageresOpt: {format: 'jpg'},
        dest: path.join(__dirname, 'images'),
        quality: 100
    },
    function(err, colors) {
        if (err){ throw err; }

        console.log(colors[0].length);
    }
);
```

#### extractColors.unique(```opt```, ```cb```)

Extract the unique colors from screenshots of websites

* object `opt` - An options object
  * array{array{string | array{string} | object}} `pages` - An array of arrays of [pageres.src](https://github.com/sindresorhus/pageres#pageressrcurl-sizes-options) arguments
  * object `pageresOpt` - (Optional) [pageres options](https://github.com/sindresorhus/pageres#pageresoptions)
  * string `dest` - (Optional) A directory in which to save screenshots of the websites from which colors are extracted. Screenshots will not be saved if this property is omitted.
  * number `quality` - (Optional) A number between 0 and 100 which determines the JPEG encoding quality if `dest` is provided and a [format](https://github.com/sindresorhus/pageres#format) of "jpg" was provided in `pageresOpt` or `pages`. Defaults to 90.
* function(null|object `err`, array{array{object{number}}} `colors`) `cb` - A function to be executed after the colors are extracted

__Example__

```
extractColors.unique(
    {
        pages: [[
            'gamespot.com',
            ['1367x768'],
            {hide: ['.kubrick-content', '.media-figure']}
        ]],
        pageresOpt: {
            delay: 2,
            userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36'
        },
        dest: path.join(__dirname, 'images')
    },
    function(err, colors) {
        if (err) { throw err; }

        console.log(colors[0].length);
    }
);
```

#### extractColors.frequent(```opt```, ```cb```)

Extract the most frequently occurring colors from screenshots of websites

* object `opt` - An options object
  * number `amount` - The amount of colors to extract
  * array{array{string | array{string} | object}} `pages` - An array of arrays of [pageres.src](https://github.com/sindresorhus/pageres#pageressrcurl-sizes-options) arguments
  * object `pageresOpt` - (Optional) [pageres options](https://github.com/sindresorhus/pageres#pageresoptions)
  * string `dest` - (Optional) A directory in which to save screenshots of the websites from which colors are extracted. Screenshots will not be saved if this property is omitted.
  * number `quality` - (Optional) A number between 0 and 100 which determines the JPEG encoding quality if `dest` is provided and a [format](https://github.com/sindresorhus/pageres#format) of "jpg" was provided in `pageresOpt` or `pages`. Defaults to 90.
* function(null|object `err`, array{array{object{number}}} `colors`) `cb` - A function to be executed after the colors are extracted. `colors[n]` are ordered by frequency.

__Example__

```
extractColors.frequent(
    {
        amount: 10,
        pages: [
            ['stackexchange.com', ['1920x1080'], {crop: true}],
            ['stackoverflow.com', ['1920x1080'], {crop: true}],
        ]
    },
    function(err, colors) {
        if (err) { throw err; }

        console.log(colors[0]);
        console.log(colors[1]);
    }
);
```

#### Note

All methods return `extractColors` for chaining.

## Installation
#### Npm
```
npm install website-color-extractor
```