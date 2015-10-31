using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class PaymentQueryForm : BaseQueryForm
    {
        public List<String> IDs { get; set;}
        public string BankAccountID { get; set; }
        
        public List<String> BankAccountIDs { get; set;}
        public DateTime? Paid_Start { get; set; }
        
        public DateTime? Paid_End { get; set; }
        
        public DateTime? PayTime_Start { get; set; }
        
        public DateTime? PayTime_End { get; set; }
        
        public Int32? Type { get; set; }
        
    }
}
