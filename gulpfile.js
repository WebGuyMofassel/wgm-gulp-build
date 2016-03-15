/**
*
* Gulpfile.js file 
* Required plugins stored into variables
* All task are configured one by one
*
**/

var gulp 			= require('gulp'),
	sass 			= require('gulp-sass'),
	sourcemaps 		= require('gulp-sourcemaps'),
	autoprefixer 	= require('gulp-autoprefixer'),
	browserSync 	= require('browser-sync'),
	reload 			= browserSync.reload,
	concat 			= require('gulp-concat'),
	uglify 			= require('gulp-uglify'),
	rename 			= require('gulp-rename'),
	del 			= require('del');


/**
*
* Log Errors
*
**/

function errorlog(err){
	console.error(err.message);
	this.emit('end');
}

/**
*
* HTML Tasks
*
**/

gulp.task('html', function(){
	gulp.src('app/**/*.html')
	.pipe(reload({stream:true}));
});


/**
*
* Styles Tasks
*
**/

gulp.task('styles', function() {
	gulp.src('app/scss/style.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({outputStyle: 'compressed'}))
	.on('error', errorlog)
	.pipe(autoprefixer({
		browsers: ['last 3 versions'],
		cascade: false
	}))	
	.pipe(sourcemaps.write('../maps'))
	.pipe(gulp.dest('app/css'))
	.pipe(reload({stream:true}));
});

/*
*
* Scripts Tasks
* jsConcatFiles => list of javascript files (in order) to concatenate
*
**/

var filesToBeConcatenate = {
	jsConcatFiles: [
	'./app/js/main.js'
	]
};

gulp.task('scripts', function() {
	return gulp.src(filesToBeConcatenate.jsConcatFiles)
	.pipe(sourcemaps.init())
	.pipe(concat('temp.js'))
	.pipe(uglify())
	.on('error', errorlog)
	.pipe(rename('app.min.js'))		
	.pipe(sourcemaps.write('../maps'))
	.pipe(gulp.dest('./app/js/'))

	.pipe(reload({stream:true}));
});


/**
*
* Browser-Sync Tasks
*
**/

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: "./app/"
		}
	});
});


/**
*
* Watch Tasks
*
**/

gulp.task ('watch', function(){
	gulp.watch('app/**/*.html', ['html']);
	gulp.watch('app/scss/**/*.scss', ['styles']);
	gulp.watch('app/js/**/*.js', ['scripts']);

});

/**
*
* Default Tasks for gulp
*
**/

gulp.task('default', ['scripts', 'styles', 'html', 'browser-sync', 'watch']);


/**
*
* Deployable Build Tasks
* Required taskes
* gulp build
* bulp build:serve
*
* buildFilesFoldersRemove => list of files to remove when running final build
*
**/

var filesToBeRemoved = {
	buildFilesFoldersRemove:[
	'build/scss/', 
	'build/js/!(*.min.js)',
	'build/bower.json',
	'build/bower_components/',
	'build/maps/'
	]
};

// Clean out all files and folders from build folder
gulp.task('build:cleanfolder', function (cb) {
	del([
		'build/**'
		], cb);
});

// Task to create build directory of all files
gulp.task('build:copy', ['build:cleanfolder'], function(){
	return gulp.src('app/**/*/')
	.pipe(gulp.dest('build/'));
});

// Task to removed unwanted build files
// List all files and directories here that you don't want included
gulp.task('build:remove', ['build:copy'], function (cb) {
	del(filesToBeRemoved.buildFilesFoldersRemove, cb);
});

gulp.task('build', ['build:copy', 'build:remove']);

/**
*
* Task to run build server for testing final app
*
**/
gulp.task('build:server', function() {
	browserSync({
		server: {
			baseDir: "./build/"
		}
	});
});