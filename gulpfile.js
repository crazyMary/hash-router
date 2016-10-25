var gulp = require('gulp');
var browserSync = require('browser-sync'); // 浏览器控制
var $ = require('gulp-load-plugins')(); // 通过package.json加载所有模块


// 开发监听
gulp.task('watch', function() {
  browserSync.init({
    server: {
      baseDir: "./example",
    }
  });

  gulp.watch(['./example/js/*.js', './example/*.html'])
    .on('change', browserSync.reload);
});


gulp.task('js', function() {
  return gulp.src(['./example/js/lib/template.js', './example/js/lib/router.js'])
    .pipe($.concat('spa.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('./dist'));
});


// 上线编译
gulp.task('build', ['js'], function() {
  console.log('done');
})