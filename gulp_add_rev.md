#前端静态资源版本更新与缓存之——```gulp```自动化添加版本号

公司项目每次发布后，偶尔会有缓存问题，然后看了下```gulp```，发现```gulp```还能给```js css```自动化添加版本号，可解决缓存的问题，所以自动化实现静态资源的版本更新才是正道。通过网上的资料试过了两种办法：

1.生成一个新的```dist```目录，里面包含了要发布的```html,js,css```等文件 。

2.在原来的```HTML```文件上进行js ,```css```版本的替换，不需要生成新的目录文件。

通过两种方法的实践过程对比，决定使用第二种办法，所以这里介绍一下第二种方式的实现过程：

一.

1. 修改```js```和```css```文件

2. 通过对```js```,```css```文件内容进行```hash```运算，生成一个文件的唯一```hash```字符串(如果文件修改则```hash```号会发生变化)

3. 替换原```html```中的```js```,```css```文件名，生成一个带版本号的文件名

原结构下html文件代码：
```html
<link rel="stylesheet" href="../css/style.css">
<script src="../js/index.js"></script>
```

要达到的效果：在原结构下html文件代码
```html
<link rel="stylesheet" href="../css/style.css?v=0d83247610">
<script src="../js/index.js?v=61c1ef9f34"></script>
```

二.

1.作为项目的开发依赖（devDependencies）安装gulp和gulp插件：

```html
npm install --save-dev gulp
npm install --save-dev gulp-rev
npm install --save-dev gulp-rev-collector
npm install --save-dev run-sequence
```

2.编写gulpfile.js

  ```html
//引入gulp和gulp插件
var gulp = require('gulp'),  
  runSequence = require('run-sequence'),   
  rev = require('gulp-rev'),    
  revCollector = require('gulp-rev-collector');

//定义css、js文件路径，是本地css,js文件的路径，可自行配置
var cssUrl = 'css/*.css',   
  jsUrl = 'js/*.js';

//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
  gulp.task('revCss', function(){   
  return gulp.src(cssUrl)        
 .pipe(rev())        
 .pipe(rev.manifest())        
 .pipe(gulp.dest('rev/css'));
 });

//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
  gulp.task('revJs', function(){    
  return gulp.src(jsUrl)        
 .pipe(rev())        
 .pipe(rev.manifest())        
 .pipe(gulp.dest('rev/js'));
 });

 //Html更换css、js文件版本
   gulp.task('revHtml', function () {    
   return gulp.src(['rev/**/*.json', 'WEB-INF/views/*.html'])  /*WEB-INF/views是本地html文件的路径，可自行配置*/        
  .pipe(revCollector())        
  .pipe(gulp.dest('WEB-INF/views'));  /*Html更换css、js文件版本,WEB-INF/views也是和本地html文件的路径一致*/
 });

//开发构建
  gulp.task('dev', function (done) {   
  condition = false;   
  runSequence(       
  ['revCss'],       
  ['revJs'],        
  ['revHtml'],        
  done);});
  gulp.task('default', ['dev']);
```  
三.更改gulp-rev和gulp-rev-collector(重要)

  1.打开node_modules\gulp-rev\index.js

    第144行 manifest[originalFile] = revisionedFile;
    
    更新为: manifest[originalFile] = originalFile + '?v=' + file.revHash;


  2.打开nodemodules\gulp-rev\nodemodules\rev-path\index.js

    10行 return filename + '-' + hash + ext;
    
    更新为: return filename + ext;
 
    
  3.打开node_modules\gulp-rev-collector\index.js

    31行if ( !_.isString(json[key]) || path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' ) !== path.basename(key) ) {
    
    更新为: if ( !_.isString(json[key]) || path.basename(json[key]).split('?')[0] !== path.basename(key) ) {
  
四.执行```gulp```命令，得到的结果如下
```
 <link rel="stylesheet" href="../css/style.css?v=0d83247610">
 <script src="../js/index.js?v=61c1ef9f34"></script>
 ```
五.更改```gulp-rev```和```gulp-rev-collector```的原理

 当你完成第二步```gulpfile.js```的编写，然后执行```gulp```后，你会发现效果如下:
 ```
 //rev目录下生成了manifest.json对应文件
   { "style.css": "style-0d83247610.css"}
    <link rel="stylesheet" href="../css/style-0d83247610.css">
    <script src="../js/index-61c1ef9f34.js"></script>
 ```
 这明显没有达到我们想要的效果，所以要按照第三步的要求更改代码！
