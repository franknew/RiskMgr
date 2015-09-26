using DreamWorkflow.Engine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    [Serializable]
    public class ProjectTask : Project
    {
        /// <summary>
        /// 流程处理状态,1：刚启动，2：处理中，3：已处理
        /// </summary>
        public WorkflowProcessStatus ProcessStatus { get; set; }

        public string Processor { get; set; }

        public string AcitvityID { get; set; }
    }
}
