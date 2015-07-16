using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class Task : SimpleEntity
    {
        public string AcitivityID { get; set; }
        
        public string Remark { get; set; }
        
        public Int32? Status { get; set; }
        
        public DateTime? ReadTime { get; set; }
        
        public DateTime? ProcessTime { get; set; }
        
    }
}