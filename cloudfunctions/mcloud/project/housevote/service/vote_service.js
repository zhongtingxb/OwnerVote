/**
 * Notes: 投票模块业务逻辑
 * Ver : CCMiniCloud Framework 3.2.11 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-07-05 05:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const VoteModel = require('../model/vote_model.js');
const VoteJoinModel = require('../model/vote_join_model.js');

class VoteService extends BaseProjectService {

	// 获取当前投票状态
	getVoteStatusDesc(vote) {
		let timestamp = this._timestamp;

		if (vote.VOTE_STATUS == 0)
			return '已停用';
		else if (vote.VOTE_START > timestamp)
			return '未开始';
		else if (vote.VOTE_END <= timestamp)
			return '已截止';
		else
			return '进行中';
	}

	fmtVoteItem(vote) {
		let total = vote.VOTE_CNT;

		let colors = ['red', 'green', 'orange', 'darkgreen', 'yellow', 'olive', 'blue', 'grey', 'purple', 'mauve', 'cyan', 'brown', 'pink', 'black', 'red', 'green', 'orange', 'darkgreen', 'yellow', 'olive', 'blue', 'grey', 'purple', 'mauve', 'cyan', 'brown', 'pink', 'black'];
		for (let k = 0; k < vote.VOTE_ITEM.length; k++) {
			if (total == 0)
				vote.VOTE_ITEM[k].per = 0;
			else {
				let per = vote.VOTE_ITEM[k].cnt * 100 / total;
				vote.VOTE_ITEM[k].per = per.toFixed(1);
				vote.VOTE_ITEM[k].color = colors[k];
			}
		}
		return vote;
	}


	/** 浏览信息 */
	async viewVote(userId, id) {

		let fields = '*';

		let where = {
			_id: id,
			VOTE_STATUS: VoteModel.STATUS.COMM
		}
		let vote = await VoteModel.getOne(where, fields);
		if (!vote) return null;

		VoteModel.inc(id, 'VOTE_VIEW_CNT', 1);

		// 判断是否有投票 
		let whereMy = {
			VOTE_JOIN_VOTE_ID: id,
			VOTE_JOIN_USER_ID: userId
		}
		vote.myVoteId = await VoteJoinModel.count(whereMy);

		return vote;
	}


	/** 取得分页列表 */
	async getVoteList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'VOTE_ORDER': 'asc',
			'VOTE_ADD_TIME': 'desc'
		};
		let fields = 'VOTE_STOP,VOTE_CNT,VOTE_VIEW_CNT,VOTE_TITLE,VOTE_START,VOTE_END,VOTE_ORDER,VOTE_STATUS,VOTE_CATE_NAME,VOTE_OBJ';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		where.and.VOTE_STATUS = VoteModel.STATUS.COMM; // 状态  


		if (util.isDefined(search) && search) {
			where.or = [{
				VOTE_TITLE: ['like', search]
			},];
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'run': {
					where.and.VOTE_END = ['>=', this._timestamp];
					where.and.VOTE_START = ['<=', this._timestamp];
					break;
				}
				case 'over': {
					where.and.VOTE_END = ['<', this._timestamp];
					break;
				}
				case 'nobegin': {
					where.and.VOTE_START = ['>', this._timestamp];
					where.and.VOTE_END = ['>', this._timestamp];
					break;
				}
				case 'cateId': {
					if (sortVal) where.and.VOTE_CATE_ID = String(sortVal);
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


	//################## 投票 
	async statVoteItem(voteId) {


	}

	// 投票 
	async doVote(userId, voteId, selected = []) {


	}


	/** 取消我的投票 只有成功可以取消 */
	async cancelMyVote(userId, voteId) {


	}


	/** 我的投票列表 */
	async getMyVoteList(userId, {
		search, // 搜索条件 
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序  
		page,
		size,
		isTotal = true,
		oldTotal = 0
	}) {
		orderBy = orderBy || {
			'VOTE_JOIN_ADD_TIME': 'desc'
		};
		let fields = 'VOTE_JOIN_VOTE_ID,VOTE_JOIN_ADD_TIME,VOTE_JOIN_ITEM_LABEL,vote.VOTE_TITLE';
		let where = {
			VOTE_JOIN_USER_ID: userId
		};

		if (util.isDefined(search) && search) {
			where.VOTE_JOIN_VOTE_TITLE = {
				$regex: '.*' + search,
				$options: 'i'
			};
		}
		else if (sortType) {
			// 搜索菜单
			switch (sortType) {
				case 'timedesc': { //按时间倒序
					orderBy = {
						'VOTE_JOIN_ADD_TIME': 'desc'
					};
					break;
				}
				case 'timeasc': { //按时间正序
					orderBy = {
						'VOTE_JOIN_ADD_TIME': 'asc'
					};
					break;
				}
			}
		}
		let joinParams = {
			from: VoteModel.CL,
			localField: 'VOTE_JOIN_VOTE_ID',
			foreignField: '_id',
			as: 'vote',
		};

		return await VoteJoinModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);

	}

}

module.exports = VoteService;