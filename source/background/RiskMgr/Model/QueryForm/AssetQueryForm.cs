using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class AssetQueryForm : SimpleQueryForm
    {
        public List<String> IDs { get; set;}
        public List<String> Creators { get; set;}
        public string Remark { get; set; }
        
        public Int32? Type { get; set; }
        
        public Int32? Usage { get; set; }
        
        public string Position { get; set; }
        
        public string Address { get; set; }
        
        public string Code { get; set; }
        
        public DateTime? Area_Start { get; set; }
        
        public DateTime? Area_End { get; set; }
        
        public DateTime? RegPrice_Start { get; set; }
        
        public DateTime? RegPrice_End { get; set; }
        
        public Int32? IssueType { get; set; }
        
        public UInt64? IsTraded { get; set; }
        
        public UInt64? Enabled { get; set; }
        
        public DateTime? ChangeOwnerPrice_Start { get; set; }
        
        public DateTime? ChangeOwnerPrice_End { get; set; }
        
        public UInt64? IsDeleted { get; set; }
        
        public string AssetRightCode { get; set; }
        
    }
}
