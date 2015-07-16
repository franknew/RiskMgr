using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class WorkflowDefinition : SimpleEntity
    {
        public UInt64? Enabled { get; set; }
        
        public string Remark { get; set; }
        
    }
}