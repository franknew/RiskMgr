using DreamWorkflow.Engine.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    public class FinaceApprovalServiceForm
    {

        public string WorkflowID { get; set; }

        public string ActivityID { get; set; }

        public string TaskID { get; set; }

        /// <summary>
        /// 项目财务信息
        /// </summary>
        public Project Project { get; set; }
    }
}
