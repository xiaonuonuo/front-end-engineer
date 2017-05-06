<div class="post">
        <div class="article">
            <h1 class="title">前端静态资源版本更新与缓存之——gulp自动化添加版本号</h1>
    
            <!-- 作者区域 -->
            <div class="author">
                <a class="avatar" href="/u/66ecd6fa1472">
                    <img src="//upload.jianshu.io/users/upload_avatars/3485388/9240497eda67.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/144/h/144"
                         alt="144">
                </a>
                <div class="info">
                    <span class="tag">作者</span>
                    <span class="name"><a href="/u/66ecd6fa1472">win_wlq</a></span>
                    <!-- 关注用户按钮 -->
                    <a class="btn btn-success follow"><i class="iconfont ic-follow"></i><span>关注</span></a>
                    <!-- 文章数据信息 -->
                    <div class="meta">
                        <!-- 如果文章更新时间大于发布时间，那么使用 tooltip 显示更新时间 -->
                        <span class="publish-time" data-toggle="tooltip" data-placement="bottom" title=""
                              data-original-title="最后编辑于 2016.11.08 16:09">2016.11.07 11:35*</span>
                        <span class="wordage">字数 805</span>
                        <span class="views-count">阅读 1188</span><span class="comments-count">评论 1</span><span
                            class="likes-count">喜欢 2</span></div>
                </div>
                <!-- 如果是当前作者，加入编辑按钮 -->
            </div>
            <!-- -->
    
            <!-- 文章内容 -->
            <div class="show-content">
                <p>公司项目每次发布后，偶尔会有缓存问题，然后看了下gulp，发现gulp还能给js，css自动化添加版本号，可解决缓存的问题，所以自动化实现静态资源的版本更新才是正道。通过网上的资料试过了两种办法：</p>
                <h6>1.生成一个新的dist目录，里面包含了要发布的html,js,css等文件 。</h6>
                <h6>2.在原来的HTML文件上进行js ,css版本的替换，不需要生成新的目录文件。</h6>
                <p>通过两种方法的实践过程对比，决定使用第二种办法，所以这里介绍一下第二种方式的实现过程：</p>
                <blockquote>
                    <h4>一.</h4>
                    <h6>1. 修改js和css文件</h6>
                    <h6>2. 通过对js,css文件内容进行hash运算，生成一个文件的唯一hash字符串(如果文件修改则hash号会发生变化)</h6>
                    <h6>3. 替换原html中的js,css文件名，生成一个带版本号的文件名</h6>
                    <pre class="hljs xml"><code class="xml">原结构下html文件代码：
    <span class="hljs-tag">&lt;<span class="hljs-name">link</span> <span class="hljs-attr">rel</span>=<span
            class="hljs-string">"stylesheet"</span> <span class="hljs-attr">href</span>=<span class="hljs-string">"../css/style.css"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">script</span> <span class="hljs-attr">src</span>=<span
            class="hljs-string">"../js/index.js"</span>&gt;</span><span class="undefined"></span><span class="hljs-tag">&lt;/<span
                                class="hljs-name">script</span>&gt;</span></code></pre>
                    <h6>要达到的效果：在原结构下html文件代码</h6>
                    <pre class="hljs javascript"><code class="javascript">&lt;link rel=<span class="hljs-string">"stylesheet"</span> href=<span
                            class="hljs-string">"../css/style.css?v=0d83247610"</span>&gt;
    <span class="xml"><span class="hljs-tag">&lt;<span class="hljs-name">script</span> <span
            class="hljs-attr">src</span>=<span class="hljs-string">"../js/index.js?v=61c1ef9f34"</span>&gt;</span><span
            class="undefined"></span><span class="hljs-tag">&lt;/<span
            class="hljs-name">script</span>&gt;</span></span><span class="xml"><span class="hljs-tag">&lt;/<span
                                class="hljs-name">br</span>&gt;</span></span></code></pre>
                    <h4>二.</h4>
                    <h6>1.作为项目的开发依赖（devDependencies）安装gulp和gulp插件：</h6>
                    <pre class="hljs q"><code class="q">npm install --<span class="hljs-built_in">save</span>-<span
                            class="hljs-built_in">dev</span> gulp
    npm install --<span class="hljs-built_in">save</span>-<span class="hljs-built_in">dev</span> gulp-rev
    npm install --<span class="hljs-built_in">save</span>-<span class="hljs-built_in">dev</span> gulp-rev-collector
    npm install --<span class="hljs-built_in">save</span>-<span class="hljs-built_in">dev</span> run-sequence</code></pre>
                    <h6>2.编写gulpfile.js</h6>
                    <pre class="hljs javascript"><code class="javascript"><span class="hljs-comment">//引入gulp和gulp插件</span>
      <span class="hljs-keyword">var</span> gulp = <span class="hljs-built_in">require</span>(<span class="hljs-string">'gulp'</span>),  
      runSequence = <span class="hljs-built_in">require</span>(<span class="hljs-string">'run-sequence'</span>),   
      rev = <span class="hljs-built_in">require</span>(<span class="hljs-string">'gulp-rev'</span>),    
      revCollector = <span class="hljs-built_in">require</span>(<span class="hljs-string">'gulp-rev-collector'</span>);
    
    <span class="hljs-comment">//定义css、js文件路径，是本地css,js文件的路径，可自行配置</span>
      <span class="hljs-keyword">var</span> cssUrl = <span class="hljs-string">'css/*.css'</span>,   
      jsUrl = <span class="hljs-string">'js/*.js'</span>;
    
    <span class="hljs-comment">//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射</span>
      gulp.task(<span class="hljs-string">'revCss'</span>, <span class="hljs-function"><span
                                class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{   
      <span class="hljs-keyword">return</span> gulp.src(cssUrl)        
     .pipe(rev())        
     .pipe(rev.manifest())        
     .pipe(gulp.dest(<span class="hljs-string">'rev/css'</span>));
     });
    
    <span class="hljs-comment">//js生成文件hash编码并生成 rev-manifest.json文件名对照映射</span>
      gulp.task(<span class="hljs-string">'revJs'</span>, <span class="hljs-function"><span
                                class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{    
      <span class="hljs-keyword">return</span> gulp.src(jsUrl)        
     .pipe(rev())        
     .pipe(rev.manifest())        
     .pipe(gulp.dest(<span class="hljs-string">'rev/js'</span>));
     });
    
     <span class="hljs-comment">//Html更换css、js文件版本</span>
       gulp.task(<span class="hljs-string">'revHtml'</span>, <span class="hljs-function"><span
                                class="hljs-keyword">function</span> (<span class="hljs-params"></span>) </span>{    
       <span class="hljs-keyword">return</span> gulp.src([<span class="hljs-string">'rev/**/*.json'</span>, <span
                                class="hljs-string">'WEB-INF/views/*.html'</span>])  <span class="hljs-comment">/*WEB-INF/views是本地html文件的路径，可自行配置*/</span>        
      .pipe(revCollector())        
      .pipe(gulp.dest(<span class="hljs-string">'WEB-INF/views'</span>));  <span class="hljs-comment">/*Html更换css、js文件版本,WEB-INF/views也是和本地html文件的路径一致*/</span>
     });
    
    <span class="hljs-comment">//开发构建</span>
      gulp.task(<span class="hljs-string">'dev'</span>, <span class="hljs-function"><span
                                class="hljs-keyword">function</span> (<span class="hljs-params">done</span>) </span>{   
      condition = <span class="hljs-literal">false</span>;   
      runSequence(       
      [<span class="hljs-string">'revCss'</span>],       
      [<span class="hljs-string">'revJs'</span>],        
      [<span class="hljs-string">'revHtml'</span>],        
      done);});
      gulp.task(<span class="hljs-string">'default'</span>, [<span class="hljs-string">'dev'</span>]);</code></pre>
                    <h6>三.更改gulp-rev和gulp-rev-collector(重要)</h6>
                    <pre class="hljs processing"><code class="processing">  <span class="hljs-number">1.</span>打开node_modules\gulp-rev\index.js
        第<span class="hljs-number">144</span>行 manifest[originalFile] = revisionedFile;
        更新为: manifest[originalFile] = originalFile + <span class="hljs-string">'?v='</span> + file.revHash;
      <span class="hljs-number">2.</span>打开nodemodules\gulp-rev\nodemodules\rev-path\index.js
        <span class="hljs-number">10</span>行 <span class="hljs-keyword">return</span> filename + <span class="hljs-string">'-'</span> + hash + ext;
        更新为: <span class="hljs-keyword">return</span> filename + ext;
      <span class="hljs-number">3.</span>打开node_modules\gulp-rev-collector\index.js
        <span class="hljs-number">31</span>行<span class="hljs-keyword">if</span> ( !_.isString(json[<span
                                class="hljs-built_in">key</span>]) || path.basename(json[<span
                                class="hljs-built_in">key</span>]).replace(<span class="hljs-keyword">new</span> RegExp( opts.revSuffix ), <span
                                class="hljs-string">''</span> ) !== path.basename(<span class="hljs-built_in">key</span>) ) {
        更新为: <span class="hljs-keyword">if</span> ( !_.isString(json[<span class="hljs-built_in">key</span>]) || path.basename(json[<span
                                class="hljs-built_in">key</span>]).<span class="hljs-built_in">split</span>(<span
                                class="hljs-string">'?'</span>)[<span class="hljs-number">0</span>] !== path.basename(<span
                                class="hljs-built_in">key</span>) ) {&lt;/br&gt;</code></pre>
                    <h6>四.执行gulp命令，得到的结果如下</h6>
                    <pre class="hljs xml"><code class="xml"> <span class="hljs-tag">&lt;<span class="hljs-name">link</span> <span
                            class="hljs-attr">rel</span>=<span class="hljs-string">"stylesheet"</span> <span
                            class="hljs-attr">href</span>=<span class="hljs-string">"../css/style.css?v=0d83247610"</span>&gt;</span>
     <span class="hljs-tag">&lt;<span class="hljs-name">script</span> <span class="hljs-attr">src</span>=<span
             class="hljs-string">"../js/index.js?v=61c1ef9f34"</span>&gt;</span><span class="undefined"></span><span
                                class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span></code></pre>
                    <h6>五.更改gulp-rev和gulp-rev-collector的原理</h6>
                    <pre class="hljs javascript"><code class="javascript"> 当你完成第二步gulpfile.js的编写，然后执行gulp后，你会发现效果如下:
     <span class="hljs-comment">//rev目录下生成了manifest.json对应文件</span>
       { <span class="hljs-string">"style.css"</span>: <span class="hljs-string">"style-0d83247610.css"</span>}
        &lt;link rel=<span class="hljs-string">"stylesheet"</span> href=<span class="hljs-string">"../css/style-0d83247610.css"</span>&gt;
        <span class="xml"><span class="hljs-tag">&lt;<span class="hljs-name">script</span> <span
                class="hljs-attr">src</span>=<span class="hljs-string">"../js/index-61c1ef9f34.js"</span>&gt;</span><span
                class="undefined"></span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span></span>
     这明显没有达到我们想要的效果，所以要按照第三步的要求更改代码！</code></pre>
                </blockquote>
    
            </div>
            <!--  -->
        </div>
    
    
    
    
     
     
    </div>