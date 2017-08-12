/**
 * Created by CC on 2017/5/6 0006.
 */

//引入插件
let gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    webserver = require('gulp-webserver'),// 本地服务器
    imagemin = require('gulp-imagemin'),  //图片压缩
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),  //jpg图片压缩
    imageminOptipng = require('imagemin-optipng'),  //png图片压缩
    notify = require('gulp-notify');


//设置各种输入输出文件夹的位置;主要为html、css、js、image四类为主

let srcScript = './src/js/*.js',
    // distScript = './dist/js',
    distCss = './dist/css',
    distMinCSS = './dist/css',
    srcSass = './src/sass/*.scss',
    // distSass = './dist/css',
    srcImage = './src/images/*.*',
    distImage = './dist/imagemini';


//css task
gulp.task('style',function(){
    gulp.src(srcSass)//入口文件
        .pipe(sass({outputStyle:'expanded'}))//执行sass方法,嵌套输出方式 neste,展开输出方式 expanded,紧凑输出方式 compact,压缩输出方式 compressed
        .pipe(autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],//兼容性代码
            cascade: true //是否美化属性值 默认:true
        }))
        .pipe(gulp.dest(distCss))//出口文件
        .pipe(rename({suffix:'.min'}))//为css加中间名字.min
        .pipe(minifycss())//压缩css
        .pipe(gulp.dest(distMinCSS))//输出压缩后的css
        .pipe(notify({ message: 'Styles task complete' }));
});


//图片压缩任务,支持JPEG、PNG及GIF文件;
//命令行使用gulp jpgmin启用此任务;
gulp.task('imgmin', function() {
    let jpgmin = imageminJpegRecompress({
            accurate: true,//高精度模式
            quality: "medium",//图像质量:low, medium, high and veryhigh;
            method: "smallfry",//网格优化:mpe, ssim, ms-ssim and smallfry;
            min: 70,//最低质量
            loops: 0,//循环尝试次数, 默认为6;
            progressive: false,//基线优化
            subsample: "default"//子采样:default, disable;
        }),
        pngmin = imageminOptipng({
            optimizationLevel: 4  //类型：Number  默认：3  取值范围：0-7（优化等级）
        });

    gulp.src(srcImage)
        .pipe(imagemin({
            use: [jpgmin, pngmin]
        }))
        .pipe(gulp.dest(distImage));
});

// webserver
gulp.task('webserver',function(){
    gulp.src('./')//服务器目录（./代表根目录）
        .pipe(webserver({// 运行gulp-webserver
            livereload:true,// 启用LiveReload
            open:false// 服务器启动时自动打开网页
        }));
});

//js task
// gulp.task('script',function(){
//     gulp.src('src/js/*.js')
//     .pipe()
// })



//监控改动并自动刷新任务;
gulp.task('watch',function(){
    //gulp.watch('*.html',['html']);// 监听根目录下所有.html文件
    gulp.watch('src/sass/*.scss',['style']);//watch sass文件
    gulp.watch('src/images/*.*',['imgmin']);//watch img文件
});



// //gulp默认任务(集体走一遍,然后开监控);
gulp.task('default',['style','imgmin','webserver','watch']);//未知作用
