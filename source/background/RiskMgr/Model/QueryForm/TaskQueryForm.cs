using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Form
{
    public class TaskQueryForm : BaseQueryForm
    {
        public string AcitivityID { get; set; }
        
        public string Remark { get; set; }
        
        public Int32? Status { get; set; }
        
        public DateTime? ReadTime_Start { get; set; }
        
        public DateTime? ReadTime_End { get; set; }
        
        public DateTime? ProcessTime_Start { get; set; }
        
        public DateTime? ProcessTime_End { get; set; }
        
        public DateTime? LastUpdateTime_Start { get; set; }
        
        public DateTime? LastUpdateTime_End { get; set; }
        
        public string LastUpdator { get; set; }
        
    }
}
