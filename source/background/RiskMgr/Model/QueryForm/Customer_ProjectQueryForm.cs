using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class Customer_ProjectQueryForm : BaseQueryForm
    {
        public string CustomerID { get; set; }
        
        public string ProjectID { get; set; }
        
        public Int32? Type { get; set; }
        
    }
}
