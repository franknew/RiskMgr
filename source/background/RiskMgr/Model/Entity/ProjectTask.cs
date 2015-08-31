using DreamWorkflow.Engine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    public class ProjectTask : Project
    {
        /// <summary>
        /// 流程处理状态
        /// </summary>
        public WorkflowProcessStatus ProcessStatus { get; set; }
    }
}
