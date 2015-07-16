using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Form
{
    public class MenuQueryForm : BaseQueryForm
    {
        public string Page { get; set; }
        
        public string ParentID { get; set; }
        
        public UInt64? Enabled { get; set; }
        
        public string Remark { get; set; }
        
        public DateTime? LastUpdateTime_Start { get; set; }
        
        public DateTime? LastUpdateTime_End { get; set; }
        
        public string LastUpdator { get; set; }
        
    }
}
