using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Model
{
    public class Parameter : SimpleEntity
    {
        public string ContextID { get; set; }
        
        public string Key { get; set; }
        
        public string Value { get; set; }
        
    }
}