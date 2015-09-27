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
        public ActionStatus BusinessStatus { get; set; }

        /// <summary>
        /// 财务模块对表单的操作状态。1：可查询 2：可编辑 3：可审批
        /// </summary>
        public ActionStatus FinaceStatus { get; set; }

        public string WorkflowID { get; set; }

        public string ActivityID { get; set; }

        public string TaskID { get; set; }
    }
}
