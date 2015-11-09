using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class TrackingChangeOwnerQueryForm : SimpleQueryForm
    {
        public List<String> IDs { get; set;}
        public string ProjectID { get; set; }
        
        public List<String> ProjectIDs { get; set;}
        public List<String> Creators { get; set;}
        public string ChangeOwnerProfileCode { get; set; }
        
        public DateTime? ChangeOwnerProfileTime_Start { get; set; }
        
        public DateTime? ChangeOwnerProfileTime_End { get; set; }
        
        public string NewAssetCode { get; set; }
        
        public string ChangeOwnerRemark { get; set; }
        
        public DateTime? NewAssetDate_Start { get; set; }
        
        public DateTime? NewAssetDate_End { get; set; }
        
    }
}
