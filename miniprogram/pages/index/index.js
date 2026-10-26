const launchInfo = require('../../data/launch-info');
const { splitRemaining } = require('../../utils/countdown');

// 官宣定档日 2026-10-23 00:00 (UTC+8)，用于计算等待进度
const ANNOUNCE_TS = 1792684800000;

Page({
  data: {
    statusBarHeight: 20,
    info: launchInfo,
    remain: splitRemaining(launchInfo.launchTimestamp - Date.now()),
    progress: 0
  },

  timer: null,

  onLoad() {
    const { statusBarHeight } = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    this.setData({ statusBarHeight });
    wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] });
  },

  onShow() {
    this.startTimer();
  },

  onHide() {
    this.stopTimer();
  },

  onUnload() {
    this.stopTimer();
  },


  startTimer() {
    this.stopTimer();
    this.tick();
    this.timer = setInterval(() => this.tick(), 1000);
  },

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  tick() {
    const now = Date.now();
    const target = this.data.info.launchTimestamp;
    const remain = splitRemaining(target - now);
    const progress = Math.min(100, Math.max(0, ((now - ANNOUNCE_TS) / (target - ANNOUNCE_TS)) * 100));
    this.setData({ remain, progress: progress.toFixed(1) });
    if (remain.done) this.stopTimer();
  },

  copyCode(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.code,
      success: () => wx.showToast({ title: '兑换码已复制', icon: 'success' })
    });
  },

  addToCalendar() {
    const { info } = this.data;
    wx.addPhoneCalendar({
      title: `《${info.game.name}》全平台公测`,
      startTime: Math.floor(info.launchTimestamp / 1000),
      alarm: true,
      alarmOffset: 3600, // 提前 1 小时提醒
      description: info.launchTimeNote,
      success: () => wx.showToast({ title: '已添加到日历', icon: 'success' }),
      fail: (err) => {
        if (!/cancel/.test(err.errMsg)) wx.showToast({ title: '添加失败，请检查日历权限', icon: 'none' });
      }
    });
  },

  onShareAppMessage() {
    const { remain, info } = this.data;
    return {
      title: remain.done
        ? `《${info.game.name}》已公测，星临者快来！`
        : `距《${info.game.name}》公测还有 ${remain.days} 天，一起去普罗米利亚！`,
      path: '/pages/index/index'
    };
  },

  onShareTimeline() {
    return { title: `《${this.data.info.game.name}》11.26 全平台公测倒计时` };
  }
});
