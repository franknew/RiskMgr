using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class RoleQueryForm : SimpleQueryForm
    {
        public List<String> IDs { get; set;}
        public List<String> Creators { get; set;}
        public string Remark { get; set; }
        
        public string ParentID { get; set; }
        
        public List<String> ParentIDs { get; set;}
        public Int32? DataAccessType { get; set; }
        
        public UInt64? IsDeleted { get; set; }
        
    }
}
