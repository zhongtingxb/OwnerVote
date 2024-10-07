module.exports = { //housevote
	PROJECT_COLOR: '#0156C0',
	NAV_COLOR: '#ffffff',
	NAV_BG: '#0156C0',

	// setup
	SETUP_CONTENT_ITEMS: [
		{ title: '关于我们', key: 'SETUP_CONTENT_ABOUT' } 
	],

	// 用户
	USER_REG_CHECK: false,
	USER_FIELDS: [
		{ mark: 'sex', title: '性别', type: 'select', selectOptions: ['男', '女'], must: true },
		{ mark: 'name', title: '房主姓名', type: 'text', must: true },
		{ mark: 'card', title: '身份证号', type: 'idcard', must: true }, 
		{ mark: 'house', title: '楼栋房号', type: 'text', must: true },
		{ mark: 'housenum', title: '房产证编号', type: 'text', must: true } 
	],

	NEWS_NAME: '通告通知',
	NEWS_CATE: [
		{ id: 1, title: '通告通知', style: 'leftbig1' }, 
	],
	NEWS_FIELDS: [],
 

	VOTE_NAME: '投票',
	VOTE_CATE: [
		{ id: 1, title: '投票' },
	],
	VOTE_FIELDS: [
		{ mark: 'cover', title: '封面图片', type: 'image', min: 1, max: 1, must: true },
		{ mark: 'desc', title: '投票须知', type: 'content', must: true },
	], 
	 
}