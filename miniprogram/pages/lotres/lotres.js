// pages/lotres/lotres.js
var that
const app = getApp()
const db = wx.cloud.database();

var d = new Date()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topics: {},
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
    /////////////////////////////////////////////////////////////////////////
    let youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    console.log("标准时间:" + youWant)
    /////////////////////////////////////////////////////////////////////////
  },

  /**
   * 获取列表数据
   * 
   */
  getData: function () {
    const db = wx.cloud.database();

    db.collection('lothistory')
      .orderBy('data', 'desc')
      .get({
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组
          console.log("摇号历史数据：" + res.data)
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