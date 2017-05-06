/**
 * Created by CC on 2017/5/6 0006.
 */
//引入gulp及各种组件;

var gulp = require('gulp'), //gulp插件

    uglify = require('gulp-uglify'), //js代码压缩

    minifyCSS = require('gulp-minify-css'),  //css代码压缩

    sass = require('gulp-sass'),  //sass代码压缩

    imagemin = require('gulp-imagemin'),  //图片压缩

    imageminJpegRecompress = require('imagemin-jpeg-recompress'),  //jpg图片压缩

    imageminOptipng = require('imagemin-optipng'),  //png图片压缩


//设置各种输入输出文件夹的位置;主要为html、css、js、image四类为主

var srcScript = './src/js/*.js',

    distScript = './dist/js',

    srcCss = './src/css/*.css',

    distCSS = './dist/css',

    srcSass = './src/css/*.scss',

    distSass = './dist/css',

    srcImage = './src/img/*.*',

    distImage = './dist/img',

    srcHtml = './src/*.html',

    distHtml = './dist';


//处理JS文件:压缩,然后换个名输出;

//命令行使用gulp script启用此任务;

gulp.task('script', function() {

    gulp.src(srcScript)

        .pipe(uglify())

        .pipe(gulp.dest(distScript));

});


//处理CSS文件:压缩,然后换个名输出;

//命令行使用gulp css启用此任务;

gulp.task('css', function() {

    gulp.src(srcCss)

        .pipe(minifyCSS())

        .pipe(gulp.dest(distCSS));

});


//SASS文件输出CSS,天生自带压缩特效;

//命令行使用gulp sass启用此任务;

gulp.task('sass', function() {

    gulp.src(srcSass)

        .pipe(sass({

            outputStyle: 'compressed'

        }))

        .pipe(gulp.dest(distSass));

});


//图片压缩任务,支持JPEG、PNG及GIF文件;

//命令行使用gulp jpgmin启用此任务;

gulp.task('imgmin', function() {

    var jpgmin = imageminJpegRecompress({

            accurate: true,//高精度模式

            quality: "high",//图像质量:low, medium, high and veryhigh;

            method: "smallfry",//网格优化:mpe, ssim, ms-ssim and smallfry;

            min: 70,//最低质量

            loops: 0,//循环尝试次数, 默认为6;

            progressive: false,//基线优化

            subsample: "default"//子采样:default, disable;

        }),

        pngmin = imageminOptipng({

            optimizationLevel: 4

        });

    gulp.src(srcImage)

        .pipe(imagemin({

            use: [jpgmin, pngmin]

        }))

        .pipe(gulp.dest(distImage));

});


//把所有html页面扔进dist文件夹(不作处理);

//命令行使用gulp html启用此任务;

gulp.task('html', function() {

    gulp.src(srcHtml)

        .pipe(gulp.dest(distHtml));

});


//监控改动并自动刷新任务;

//命令行使用gulp auto启动;

gulp.task('auto', function() {

    gulp.watch(srcScript, ['script']);

    gulp.watch(srcCss, ['css']);

    gulp.watch(srcSass, ['sass']);

    gulp.watch(srcImage, ['imgmin']);

    gulp.watch(srcHtml, ['html']);

});


//gulp默认任务(集体走一遍,然后开监控);

gulp.task('default', ['script', 'css', 'sass', 'imgmin', 'html', 'auto']);