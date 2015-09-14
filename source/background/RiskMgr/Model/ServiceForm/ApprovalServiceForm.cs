using DreamWorkflow.Engine.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    public class ApprovalServiceForm
    {
        /// <summary>
        /// 流程ID
        /// </summary>
        public string WorkflowID { get; set; }

        /// <summary>
        /// 节点ID
        /// </summary>
        public string ActivityID { get; set; }

        /// <summary>
        /// 审批结果
        /// </summary>
        public Approval Approval { get; set; }
    }
}
