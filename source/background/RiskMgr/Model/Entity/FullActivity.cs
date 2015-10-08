using DreamWorkflow.Engine.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    public class FullActivity : Activity
    {
        /// <summary>
        /// 当前流程处理人
        /// </summary>
        public string Processor { get; set; }
    }
}
