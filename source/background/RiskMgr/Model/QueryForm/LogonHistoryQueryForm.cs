using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Form
{
    public class LogonHistoryQueryForm : BaseQueryForm
    {
        public string UserID { get; set; }
        
        public string Token { get; set; }
        
        public DateTime? LogonTime_Start { get; set; }
        
        public DateTime? LogonTime_End { get; set; }
        
        public string IP { get; set; }
        
    }
}
