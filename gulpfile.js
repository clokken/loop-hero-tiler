const gulp = require('gulp');
const rimraf = require('rimraf');
const spritesmith = require('gulp.spritesmith');

function clean(cb) {
    rimraf('public/dist/', cb);
}

function build(cb) {
    var spriteData = gulp.src('resources/spritesheet/*.png').pipe(spritesmith({
        imgName: 'spritesheet.png',
        cssName: 'spritesheet.json',
        cssTemplate: function (data) {
            const spriteObj = {
                spritesheet: data['spritesheet'],
                sprites: {},
            };

            data.sprites.forEach(function (sprite) {
                var name = sprite.name;
                spriteObj['sprites'][name] = sprite;
                delete sprite['name'];
                delete sprite['px'];
                delete sprite['source_image'];
                delete sprite['image'];
                delete sprite['escaped_image'];
                delete sprite['total_width'];
                delete sprite['total_height'];
                delete sprite['offset_x'];
                delete sprite['offset_y'];
            });

            return JSON.stringify(spriteObj, ' ', 2);
        }
    }));
    return spriteData.pipe(gulp.dest('public/dist/'));
}

exports.build = build;
exports.default = gulp.series(clean, build);
