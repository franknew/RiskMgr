using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Model
{
    public class Approval : SimpleEntity
    {
        public string ActivityID { get; set; }
        
        public Int32? Status { get; set; }
        
        public string Remark { get; set; }
        
        public string WorkflowID { get; set; }
        
        public Int32? Type { get; set; }
        
    }
}