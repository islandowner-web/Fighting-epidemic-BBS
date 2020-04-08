# 抗疫社区BBS微信小程序（云开发）
## 项目说明  
项目名：基于微信小程序的抗疫综合服务社区  

相关技术：微信小程序，云开发，云函数，云数据库，云储存，Node.js，Mongodb 

功能说明：改项目本质是一个论坛，供用户发表疫情相关消息帖子，可对帖子进行回复，收藏，并且在个人中心内看见历史发帖和收藏对帖子。物资摇号方面模拟当今热门的口罩摇号，摇中后凭授权码进行购买，摇号中奖率1/3，摇号商品需要自行在数据库中添加。  

背景与说明：由于疫情原因学校禁止外出实习，改为线上实习，与指导老师商议后定题为抗疫综合服务社区，项目开发时间仓促难免有所不足，代码内注释详细，如有错误请及时指正。


## 使用说明
1. 下载后打开项目，注意使用自己的AppID

2. 修改 `app.js` 中的 `globalData` 字段修改（openid和云开发环境获取方法位于下文）
  ```
  this.globalData = {
     openid: '你的openid',
     evn: '你的云开发环境'
   }
  ```

3. 在云开发控制台页面，选择数据库，创建 `collect`,`history`,`replay`,`topic`,`lothistory`五个集合, 不需要增加任何内容
   ![空集合的创建](/pic/empty.png)

4. 重复上步创建集合，创建 `lots` 这个集合, 添加摇号物资的信息，点击添加记录，增加三个字段`checknum`,`images`,`name`,并且需要手动填写openid.（不需要使用物资摇号功能的请直接忽略这步）
    | 字段        | 数据类型    |  说明  |  示例  |
    | --------   | -----:   | :----: | :----: |
    | _id        | string      |   编号(自动生成)    |       |
    | _openid        | string      |    必须手动填写   |       |
    | name        | string      |   物品名    |   KN95口罩    |
    | images        | string      |   图片路径    |   云数据库中图片的file id或者文件夹内路径    |
    | checknum        | num      |   摇号配额    |   5    |
  ![lots集合的创建](/pic/lots.png)

5. 编译运行

附1：openid的获取方法  
方法1: 新建云开发项目，用需要获取openid的微信账号登录微信开发者工具，直接编译运行，首页即可获取openid。  
方法2: [微信开放社区---借助小程序云开发获取小程序用户openid](https://developers.weixin.qq.com/community/develop/doc/000e085b1786d0c0f677f5c9851004)  

附2：云开发环境的获取方法   
进入云开发控制台，点击“设置”，下方即出现环境名称

## 效果展示（模拟器机型选择iPhone xs max）

- 帖子相关（首页，帖子详情，发帖，回帖）  
<img src="/pic/home.png" height='500'> <img src="/pic/detail.png" height='500'>  <img src="/pic/input.png" height='500'>  <img src="/pic/replay.png" height='500'> 
- 物资摇号（摇号界面、摇号成功、失败、配额用尽）  
<img src="/pic/lotspage.png" height='500'> <img src="/pic/lotsuccess.png" height='500'>  <img src="/pic/lotfail.png" height='500'>  <img src="/pic/lotempty.png" height='500'> 
- 个人中心（收藏列表、发布历史、摇号历史） 
<img src="/pic/collect.png" height='500'> <img src="/pic/inputhistory.png" height='500'>  <img src="/pic/lothistory.png" height='500'> 

## 更多信息
- 有问题可扫码加我微信，能帮就帮能答就答  
<img src="/pic/wx.jpeg" height='500'>