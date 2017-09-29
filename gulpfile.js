/**
 * gulp => gulp主程序
 * sass => sass编译
 * concat => 多个文件合并为一个
 * minifyCss => 压缩CSS
 * uglify => 压缩js
 * rev => 加md5版本号
 * revCollector => 路径替换
 * del => 清空文件
 * gulpSequence => 顺序执行
 * watch => 自动监听
 * browserSync => 自动刷新
 * */

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  minifyCss = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  htmlmin = require('gulp-htmlmin'),
  rev = require('gulp-rev'),
  revCollector = require('gulp-rev-collector'),
  del = require('del'),
  gulpSequence = require('gulp-sequence'),
  watch = require('gulp-watch'),
  browserSync = require('browser-sync');

//自动刷新
gulp.task('browser-sync', () => {
  browserSync({
    files: "**",
    server: {
      baseDir: "./src"
    }
  });
});

//编译输入sass
gulp.task('sass', () => { 
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/css'));
});

//任务
gulp.task('browserSync', ["browser-sync"]);

gulp.task('_html', () => {
  // var options = {
  //   collapseWhitespace: true,
  //   collapseBooleanAttributes: true,
  //   removeComments: true,
  //   removeEmptyAttributes: true,
  //   removeScriptTypeAttributes: true,
  //   removeStyleLinkTypeAttributes: true,
  //   minifyJS: true,
  //   minifyCSS: true
  // };
  gulp.src('./src/*.html')
    // .pipe(htmlmin(options))
    //输出文件本地
    .pipe(gulp.dest('dist'))
});

//压缩 css
gulp.task('_css', () => {
  return gulp.src('./src/css/**/*.css')
    //压缩
    .pipe(minifyCss())
    //文件名加MD5后缀
    .pipe(rev())
    //输出文件本地
    .pipe(gulp.dest('dist/css'))
    //生成一个rev-manifest.json
    .pipe(rev.manifest())
    //将 rev-manifest.json 保存到 rev 目录内
    .pipe(gulp.dest('./src/rev/css'));

});

//压缩 js
gulp.task('_js', () => {
  return gulp.src('./src/js/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('dist/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./src/rev/js'));

});

//替换md5
gulp.task('_temphtml', () => {
  //读取 rev-manifest.json 文件以及需要进行名替换的文件
  gulp.src(['./src/rev/**/*.json', 'dist/**/*.html'])
    //执行文件替换
    .pipe(revCollector())
    //替换后的文件输出的目录
    .pipe(gulp.dest('dist'));
});

//打包
gulp.task('build', gulpSequence('clean', '_html', '_css', '_js', '_temphtml'));

//删除文件
gulp.task('clean', function() {
  return del.sync('dist');
})

//自动监听执行
gulp.task('serve', ['browserSync', 'sass'], () => {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
});
