using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class MenuQueryForm : SimpleQueryForm
    {
        public List<String> IDs { get; set;}
        public List<String> Creators { get; set;}
        public string Page { get; set; }
        
        public string ParentID { get; set; }
        
        public List<String> ParentIDs { get; set;}
        public UInt64? Enabled { get; set; }
        
        public string Remark { get; set; }
        
        public string ImagePath { get; set; }
        
        public UInt64? IsDeleted { get; set; }
        
    }
}
