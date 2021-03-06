using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class Customer_ProjectQueryForm : BaseQueryForm
    {
        public List<String> IDs { get; set;}
        public string CustomerID { get; set; }
        
        public List<String> CustomerIDs { get; set;}
        public string ProjectID { get; set; }
        
        public List<String> ProjectIDs { get; set;}
        public Int32? Type { get; set; }
        
    }
}
