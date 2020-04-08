var that
const app = getApp()
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalCount: 0,
    topics: {},
    chooseid: 0,
    finalres: false,
    rnum: 1,
    currentimg: '',
    name: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    wx.cloud.init({
      env: app.globalData.evn
    })
  },

  onShow: function () {
    that.getData();
    console.log('lot页面获取数据成功')
  },

  /**
   * 获取列表数据
   * 
   */
  getData: function () {
    const db = wx.cloud.database();

    db.collection('lots')
      .orderBy('name', 'desc')
      .get({
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组
          console.log("数据：" + res.data)
          that.data.topics = res.data;
          that.setData({
            topics: that.data.topics,
          })
          wx.hideNavigationBarLoading(); //隐藏加载
          wx.stopPullDownRefresh();

        },
        fail: function (event) {
          wx.hideNavigationBarLoading(); //隐藏加载
          wx.stopPullDownRefresh();
        }
      })

  },
  /**
   * item 点击
   */
  // onItemClick: function (event) {
  //   var id = event.currentTarget.dataset.topicid;
  //   var openid = event.currentTarget.dataset.openid;
  //   console.log(id);
  //   console.log(openid);
  //   wx.navigateTo({
  //     url: "../homeDetail/homeDetail?id=" + id + "&openid=" + openid
  //   })
  // },

  /**
   * 摇号点击
   */
  onLotBtnClick: function (event) {
    console.log(event);
    let id = event.currentTarget.dataset.topicid;
    console.log(id);
    let currentimg = event.currentTarget.dataset.currentimg;
    console.log(currentimg);
    that.data.currentimg = currentimg;
    let nowchecknum = event.currentTarget.dataset.nowchecknum;
    console.log('~~' + nowchecknum)
    let name = event.currentTarget.dataset.name;
    console.log('~~' + name)
    that.data.name = name;



    // 设置点击的id
    that.data.chooseid = id;
    console.log('chooseid:' + that.data.chooseid);

    // 摇号随机数
    let rnum = Math.floor(Math.random() * 3000 + 2000);
    that.data.rnum = rnum;
    console.log('rnum:' + rnum)


    if (rnum > 4000) {
      wx.showToast({
        title: '恭喜！摇号成功',
        image: '../../images/loticon/laugh.png',
        duration: 2000
      })
      that.data.finalres = true
    } else {
      wx.showToast({
        title: '没有摇到哦～',
        image: '../../images/loticon/cry.png',
        duration: 2000
      })
    }

    // 记录摇号结果
    that.saveLotDataToServer()

    // 配额减少
    if (nowchecknum > 0) {
      console.log('传出id:' + id)
      that.saveSubChecknum(id)
    }
    
    that.onShow()
    console.log('onshow success')
  },

  // 记录摇号结果
  saveLotDataToServer: function (event) {
    db.collection('lothistory').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        chooseid: that.data.chooseid,
        date: new Date(),
        rnum: that.data.rnum,
        finalres: that.data.finalres,
        image: that.data.currentimg,
        name: that.data.name
      },
      success: function (res) {
        // 保存到发布历史
        // that.saveToHistoryServer();
        // 清空数据
        that.data.chooseid = 0;
        that.data.finalres = false;
        that.data.rnum = 1;
        that.data.currentimg = '';
        that.data.name = '';

        // that.setData({
        //   textContent: '',
        //   images: [],
        // })

        that.showTipAndSwitchTab();

      },
    })
  },

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // 配额减少
  saveSubChecknum: function (id) {
    let nowid = id;
    console.log('收到减少配额id:' + nowid)
    const _ = db.command;
    db.collection('lots').doc(nowid).update({
      // data 传入需要局部更新的数据
      data: {
        checknum: _.inc(-1)
      },
      success: function (res) {
        console.log('111')
        console.log(res.data)
        that.getData()
      }
    })
      
  },
  /////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var temp = [];
    // 获取后面十条
    if (this.data.topics.length < this.data.totalCount) {
      const db = wx.cloud.database();
      db.collection('topic').get({
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组
          if (res.data.length > 0) {
            for (var i = 0; i < res.data.length; i++) {
              var tempTopic = res.data[i];
              console.log(tempTopic);
              temp.push(tempTopic);
            }

            var totalTopic = {};
            totalTopic = that.data.topics.concat(temp);

            console.log(totalTopic);
            that.setData({
              topics: totalTopic,
            })
          } else {
            wx.showToast({
              title: '没有更多数据了',
            })
          }
        },
      })
    } else {
      wx.showToast({
        title: '没有更多数据了',
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})