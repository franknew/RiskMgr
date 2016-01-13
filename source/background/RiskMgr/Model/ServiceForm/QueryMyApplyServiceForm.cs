using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using RiskMgr.Model;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class QueryMyApplyServiceForm : SimpleQueryForm
    {

        /// <summary>
        /// 房产证号
        /// </summary>
        public string IdentityCode { get; set; }

        /// <summary>
        /// 流程状态
        /// 1：流程中
        /// 3：已结单
        /// 4：已终审（经理审批）
        /// 5：审批不通过
        /// </summary>
        public int? Status { get; set; }

        /// <summary>
        /// 单据号
        /// </summary>
        public string BusinessCode { get; set; }

        /// <summary>
        /// 业务员姓名
        /// </summary>
        public string CreatorName { get; set; }

        /// <summary>
        /// 用户ID
        /// </summary>
        public string UserID { get; set; }

        public List<string> Creators { get; set; }

        public int? WorkflowStatus { get; set; }

        public bool ManagerAppvoal { get; set; }

        public bool Disagree { get; set; }
    }
}
