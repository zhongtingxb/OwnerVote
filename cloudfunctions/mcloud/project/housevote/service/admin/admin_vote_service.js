/**
 * Notes: 投票后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-07-05 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const VoteService = require('../vote_service.js');
const AdminHomeService = require('../admin/admin_home_service.js');
const util = require('../../../../framework/utils/util.js');
const VoteModel = require('../../model/vote_model.js');
const cloudUtil = require('../../../../framework/cloud/cloud_util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const VoteJoinModel = require('../../model/vote_join_model.js');
const UserModel = require('../../model/user_model.js');

class AdminVoteService extends BaseProjectAdminService {

	/** 推荐首页SETUP */
	async vouchVoteSetup(id, vouch) {
		if (vouch == 0) {
			let adminHomeService = new AdminHomeService();
			await adminHomeService.delHomeVouch(id);
		}
		else if (vouch == 1) {
			let vote = await VoteModel.getOne(id);
			if (!vote) return;

			if (vote.VOTE_VOUCH != 1) return;

			let adminHomeService = new AdminHomeService();
			await adminHomeService.updateHomeVouch({
				type: 'vote',
				ext: vote.VOTE_CATE_NAME,
				title: vote.VOTE_TITLE,
				id,
				desc: '截止时间：' + timeUtil.timestamp2Time(vote.VOTE_END, 'Y-M-D h:m'),
				pic: vote.VOTE_OBJ.cover,
				cateId: vote.VOTE_CATE_ID
			});

		}
	}

	/**取得分页列表 */
	async getAdminVoteList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'VOTE_ORDER': 'asc',
			'VOTE_ADD_TIME': 'desc'
		};
		let fields = 'VOTE_TITLE,VOTE_CATE_ID,VOTE_CATE_NAME,VOTE_EDIT_TIME,VOTE_ADD_TIME,VOTE_ORDER,VOTE_STATUS,VOTE_VOUCH,VOTE_CNT,VOTE_USER_CNT,VOTE_ITEM,VOTE_START,VOTE_END,VOTE_CANCEL_SET,VOTE_QR,VOTE_OBJ';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [{
				VOTE_TITLE: ['like', search]
			},];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId': {
					where.and.VOTE_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.VOTE_STATUS = Number(sortVal);
					break
				}
				case 'vouch': {
					where.and.VOTE_VOUCH = 1;
					break;
				}
				case 'top': {
					where.and.VOTE_ORDER = 0;
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'VOTE_ADD_TIME');
					break;
				}
			}
		}

		return await VoteModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}


	async getAdminVoteJoinList({
		voteId,
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'VOTE_JOIN_ADD_TIME': 'desc'
		};
		let fields = 'VOTE_JOIN_USER_ID,VOTE_JOIN_ITEM_LABEL,VOTE_JOIN_ADD_TIME,VOTE_JOIN_VOTE_TITLE,VOTE_JOIN_CNT,user.USER_MOBILE,user.USER_NAME';

		let where = {};
		where.and = {
			VOTE_JOIN_VOTE_ID: voteId,
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [
				{ 'user.USER_MOBILE': ['like', search] },
				{ 'user.USER_NAME': ['like', search] },
			];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'VOTE_ADD_TIME');
					break;
				}
			}
		}

		let joinParams = {
			from: UserModel.CL,
			localField: 'VOTE_JOIN_USER_ID',
			foreignField: 'USER_MINI_OPENID',
			as: 'user',
		};

		return await VoteJoinModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	/**置顶与排序设定 */
	async sortVote(id, sort) {
		sort = Number(sort);
		let data = {};
		data.VOTE_ORDER = sort;
		await VoteModel.edit(id, data);
	}

	/**首页设定 */
	async vouchVote(id, vouch) {
		this.AppError('[业主决策]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**添加 */
	async insertVote({

	}) {

		this.AppError('[业主决策]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	//#############################   
	/** 取消某项目的投票记录 */
	async clearVoteAll(voteId) {
		this.AppError('[业主决策]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}


	/**删除数据 */
	async delVote(id) {
		this.AppError('[业主决策]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**获取信息 */
	async getVoteDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}

		let vote = await VoteModel.getOne(where, fields);
		if (!vote) return null;

		return vote;
	}

	// 更新forms信息
	async updateVoteForms({
		id,
		hasImageForms
	}) {
		this.AppError('[业主决策]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	/**更新数据 */
	async editVote({

	}) {

		this.AppError('[业主决策]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**修改状态 */
	async statusVote(id, status) {
		this.AppError('[业主决策]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	//#############################   
	/** 取消某项目的投票记录 */
	async cancelVoteAll(voteId) {
		this.AppError('[业主决策]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

}

module.exports = AdminVoteService;