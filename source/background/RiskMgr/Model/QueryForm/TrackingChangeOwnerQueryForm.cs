using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class TrackingChangeOwnerQueryForm : SimpleQueryForm
    {
        public string ProjectID { get; set; }
        
        public string LastUpdater { get; set; }
        
        public string ChangeOwnerCode { get; set; }
        
        public DateTime? ChangeOwnerTime_Start { get; set; }
        
        public DateTime? ChangeOwnerTime_End { get; set; }
        
        public string NewAssetCode { get; set; }
        
        public string ChangeOwnerRemark { get; set; }
        
    }
}
