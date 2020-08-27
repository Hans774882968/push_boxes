# push_boxes
h5推箱子小游戏

1-实现了游戏选关、返回、重置界面、计算步数、人物有对应方向的动画、播放和停止bgm、推箱子时有音效、静音功能。

2-应用了ES6的module，普通本机访问会报跨域的错。下面是解决方法：

1-Windows10系统启用IIS服务管理器的方法：按照这个严格执行即可。

https://jingyan.baidu.com/article/1876c85237330f890b137617.html

访问http://localhost/没有拒绝请求则成功！

2-接下来按照这个blog所说，添加网站

https://blog.csdn.net/qq_42813252/article/details/87634821?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-8.edu_weight&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-8.edu_weight

最后访问：http://localhost:8081/即可正常开发


3-TODO：css样式很粗糙，待改进；代码耦合度高，重构代码；keyframes可以用js统一生成。
