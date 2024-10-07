const AdminBiz = require('../../../../../../comm/biz/admin_biz.js'); 
const pageHelper = require('../../../../../../helper/page_helper.js'); 

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
 
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		if (!pageHelper.getOptions(this, options)) return;

		//设置搜索菜单
		this._getSearchMenu();

		this.setData({
			_params: {
				voteId: this.data.id
			}
		})

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () { },

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () { },

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () { },

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},


	_getSearchMenu: function () { 
		this.setData({
			search: '',
			sortItems: [],
			sortMenus: {},
			isLoad: true
		})
	}

})