
"use strict";


//  Load Node- Modules / Plugins
const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const beeper = require('beeper');


// Error Handler
function onError(err) {
    beeper();
    console.log('Name:', err.name);
    console.log('Reason:', err.reason);
    console.log('File:', err.file);
    console.log('Line:', err.line);
    console.log('Column:', err.column);
}

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./src"
        },
        port: 3000
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}



// Bootstrap Sass file : bootstrap.scss -> bootstrap.css
function bootstrap_sass () {
        return gulp
        .src('node_modules/bootstrap/scss/bootstrap.scss')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
        .pipe(browsersync.stream())
};

// custom Sass file : style.scss -> style.css
 function custom_sass () {
         return gulp
        .src('src/scss/*.scss')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())        
        .pipe(gulp.dest('src/css'))
        .pipe(browsersync.stream());       
        
};

// Copy the 3 javascript files into their folders
function move_js () {
        return gulp
        .src(['node_modules/bootstrap/dist/js/bootstrap.min.js',
            'node_modules/tether/dist/js/tether.min.js',
            'node_modules/jquery/dist/jquery.min.js'
        ])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(gulp.dest('src/js'))
        .pipe(browsersync.stream());

};



// Watch Task
function watchTask () {
        gulp.watch('node_modules/bootstrap/scss/bootstrap.scss', gulp.series(bootstrap_sass, browserSyncReload));
        gulp.watch("./src/scss/*.scss", gulp.series(custom_sass, browserSyncReload));
        // gulp.watch("./src/*.html", browserSyncReload)
        gulp.watch("src/*.html").on('change', browsersync.reload)
    
 };



// Execute build tasks to initiate project
const build = gulp.series(bootstrap_sass, custom_sass, move_js);

// Continuously check for updates 
const watch = gulp.parallel(browserSync, watchTask);

exports.build = build; // gulp build -> terminal command
exports.default = watch; // gulp -> terminal command