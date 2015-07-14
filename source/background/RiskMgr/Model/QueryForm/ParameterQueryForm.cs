using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Form
{
    public class ParameterQueryForm : BaseQueryForm
    {
        public string ContextID { get; set; }
        
        public string Key { get; set; }
        
        public string Value { get; set; }
        
    }
}
