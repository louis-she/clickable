# Clickable

在页面上拖动鼠标来创建可点击（或其他交互动作）的区域

## Develop

```
npm install --save
npm start
```

访问 127.0.0.1:8081

## How it works

浏览器插件的一些概念：

* `content_script` 用于注入到页面的上下文中，可以操作页面的节点，监听事件等，这里src目录下的所有文件会被打包到`dist/main.js`，这个文件就会做为该插件的`content_script`（见`manifest.json`配置）。
* `popup.html/popup.js` 插件图标被点击后的弹框“页面”。

当用户点击「选择热区」后，`popup.js`会向`content_script`发送消息，`content_script`会在当前页面开启「开发」模式，即监听用户的mouse*事件开始画框。

## Extending

首先，需要确定可以在哪些元素里面画框，每一个这样的区域是一个`Container`；在每个`Container`中画的框是一个区域`Area`，在`Area`上可以创建一个插件`Plugin`，插件决定了区域的行为，如果需要添加一个新的行为，比如点了区域之后alert一个字符串，只需要实现一个`AlertPlugin`就可以了。

一个插件需要继承自基类`Plugin`，并且实现五个接口：

1. 类方法 `name` 返回Plugin的中文名称
2. 类方法 `attributes` 定义Plugin的表单字段
3. 构造方法 `constructor` 构造方法的参数用于接收表单字段的值
4. 实例方法 `clicked` Area被点击后的行为
5. 实例方法 `exportClickedCode` 返回这个Plugin被导出时应该导出的代码
