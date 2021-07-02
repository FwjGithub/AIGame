# **石头剪刀布游戏**



## **项目说明**



### 前端部分：

用`vite+vue3+elementPlus`完成

利用`HTML5`新特性，调用用户摄像头

通过`canvas`和`video`完成拍照、把图片转换成`base64`格式等功能

然后把得到的`base64`格式的图片通过`aixios`发送请求

最后得到后端返回的结果，得到该图片对应的手势

然后判断石头剪刀布游戏的输赢



### 后端部分：

用`node.js+express`完成前端请求的转发

主要通过调用的**百度AI的sdk**的手势识别接口，返回给前端该图片对应的手势结果





