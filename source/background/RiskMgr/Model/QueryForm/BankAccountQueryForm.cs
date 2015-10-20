using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class BankAccountQueryForm : SimpleQueryForm
    {
        public Int32? BankType { get; set; }
        
        public string BankName { get; set; }
        
        public string BankAccountCode { get; set; }
        
        public string LastUpdater { get; set; }
        
    }
}
