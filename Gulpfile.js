// File: Gulpfile.js
'use strict';
var gulp = require('gulp'),
jshint = require('gulp-jshint'),
stylish = require('jshint-stylish'),
templateCache = require('gulp-angular-templatecache'),
gulpif = require('gulp-if'),
//minifyCss = require('gulp-minify-css'),
cleanCSS = require('gulp-clean-css'),
useref = require('gulp-useref'),
uglify = require('gulp-uglify'),
flatten = require('gulp-flatten'),
htmlmin = require('gulp-htmlmin'),
concat = require('gulp-concat');


// Busca errores en el JS y nos los muestra en el terminal
gulp.task('jshint', function() {
	return gulp.src('./client/src/app/**/*.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
});


gulp.task('templates', function() {
	gulp.src('./client/src/app/**/*.html')
		.pipe(templateCache({
		root: 'app/',
		module: 'templates',
		standalone: true
		})
	)
	.pipe(gulp.dest('./client/dist/app'));
});


gulp.task('compress', function() {
	gulp.src('./client/src/index.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify({mangle: false, compress: true})))
		.pipe(gulpif('*.css', cleanCSS()))
		.pipe(gulp.dest('./client/dist'));
});


gulp.task('copy', function() {
	gulp.src('./client/src/assets/libs/fontawesome/fonts/**')
		.pipe(gulp.dest('./client/dist/assets/libs/fontawesome/fonts'));
	gulp.src('./client/src/assets/libs/bootstrap/dist/fonts/**')
		.pipe(gulp.dest('./client/dist/assets/libs/bootstrap/dist/fonts'));
	gulp.src('./client/src/assets/fonts/**')
		.pipe(gulp.dest('./client/dist/fonts'));
	
	gulp.src(['./client/src/assets/img/**'])
		.pipe(gulp.dest('./client/dist/assets/img'));
	gulp.src(['./client/src/assets/js/**'])
		.pipe(gulp.dest('./client/dist/assets/js'));

	//Esto no aplica porque genera un archivo concatenado de 20 mb
	//gulp.src(['./client/src/assets/libs/**/*.min.js','./client/src/assets/libs/uievents/event.js','./client/src/assets/libs/angular-i18n/angular-locale_es-mx.js','./client/src/assets/libs/angular-ui-date/src/date.js','./client/src/assets/libs/jquery-ui/**'])
	//	.pipe(sourcemaps.init())
	//	.pipe(concat('librerias.js'))
	//	.pipe(sourcemaps.write())
	//	.pipe(gulp.dest('./client/dist/assets/libs'));
	//gulp.src(['./client/src/assets/libs/**/*.min.css','./client/src/assets/libs/**/*.css'])
	//	.pipe(concat('librerias.css'))
	//	.pipe(gulp.dest('./client/dist/assets/libs'));

	gulp.src(['./client/src/assets/libs/**/*.png'])
		.pipe(gulp.dest('./client/dist/assets/libs'));
	gulp.src(['./client/src/assets/libs/**/*.js'])
		.pipe(gulp.dest('./client/dist/assets/libs'));
	gulp.src(['./client/src/assets/libs/**/*.min.js'])
		.pipe(gulp.dest('./client/dist/assets/libs'));
	gulp.src(['./client/src/assets/libs/**/*.min.js.map'])
		.pipe(gulp.dest('./client/dist/assets/libs'));
	gulp.src(['./client/src/assets/libs/**/*.css'])
		.pipe(gulp.dest('./client/dist/assets/libs'));
	gulp.src(['./client/src/assets/libs/**/*.min.css'])
		.pipe(gulp.dest('./client/dist/assets/libs'));

	gulp.src(['./client/src/assets/libs/angular-i18n/angular-locale_es-mx.js'])
		.pipe(gulp.dest('./client/dist/assets/libs/angular-i18n'));
	gulp.src(['./client/src/assets/libs/angular-ui-date/src/date.js'])
		.pipe(gulp.dest('./client/dist/assets/libs/angular-ui-date/src'));
	gulp.src(['./client/src/assets/libs/uievents/event.js'])
		.pipe(gulp.dest('./client/dist/assets/libs/uievents'));
	gulp.src(['./client/src/assets/libs/jquery-ui/**'])
		.pipe(gulp.dest('./client/dist/assets/libs/jquery-ui'));
});


gulp.task('minify-index', function() {
	gulp.src('./client/dist/index.html')
		.pipe(htmlmin({removeComments:true, removeCommentsFromCDATA: true, preserveLineBreaks:true, collapseWhitespace: true, removeTagWhitespace:false}))
		.pipe(gulp.dest('./client/dist'));
});

gulp.task('build', ['templates', 'compress', 'copy']);