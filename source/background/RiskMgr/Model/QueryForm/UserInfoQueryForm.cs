using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class UserInfoQueryForm : BaseQueryForm
    {
        public string QQ { get; set; }
        
        public string Mobile { get; set; }
        
        public string WX { get; set; }
        
        public string Address { get; set; }
        
        public string Identity { get; set; }
        
        public string CnName { get; set; }
        
        public string Remark { get; set; }
        
    }
}
