using DreamWorkflow.Engine.Model;
using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Form
{
    public class InitApprovalResultForm : AddProjectServiceForm
    {
        /// <summary>
        /// 业务模块对表单的操作状态。1：可查询 2：可编辑 3：可审批
        /// </summary>
        public bool ChargeCanEdit { get; set; }

        /// <summary>
        /// 财务模块对表单的操作状态。1：可查询 2：可编辑 3：可审批
        /// </summary>
        public bool FollowupCanEdit { get; set; }

        public ActionStatus Action { get; set; }

        public string WorkflowID { get; set; }

        public string TaskID { get; set; }

        /// <summary>
        /// 历史审批数据
        /// </summary>
        public List<ApprovalInfo> Approvals { get; set; }

        /// <summary>
        /// 当前流程，不是当前正在处于处理状态的流程
        /// </summary>
        public Activity CurrentActivity { get; set; }

        /// <summary>
        /// 当前处理状态流程的处理人
        /// </summary>
        public string Operator { get; set; }

        /// <summary>
        /// 是否显示收费信息
        /// </summary>
        public bool DisplayCharge { get; set; }

        /// <summary>
        /// 是否显示跟踪信息
        /// </summary>
        public bool DisplayTracking { get; set; }
    }
}
