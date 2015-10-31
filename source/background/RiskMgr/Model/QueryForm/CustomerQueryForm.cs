using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class CustomerQueryForm : SimpleQueryForm
    {
        public List<String> IDs { get; set;}
        public List<String> Creators { get; set;}
        public UInt64? Gender { get; set; }
        
        public Int32? Marrage { get; set; }
        
        public Int32? CardType { get; set; }
        
        public string IdentityCode { get; set; }
        
        public string Phone { get; set; }
        
        public string OrignalName { get; set; }
        
        public string OrignalIdentityCode { get; set; }
        
        public Int32? BankType { get; set; }
        
        public string BankCode { get; set; }
        
        public string Address { get; set; }
        
        public string WorkUnit { get; set; }
        
        public string Remark { get; set; }
        
        public UInt64? Enabled { get; set; }
        
        public UInt64? IsDeleted { get; set; }
        
    }
}
