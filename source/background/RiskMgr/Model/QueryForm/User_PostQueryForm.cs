using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class User_PostQueryForm : BaseQueryForm
    {
        public string UserID { get; set; }
        
        public string PostID { get; set; }
        
    }
}
