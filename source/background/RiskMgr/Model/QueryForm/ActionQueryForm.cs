using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class ActionQueryForm : SimpleQueryForm
    {
        public List<String> IDs { get; set;}
        public List<String> Creators { get; set;}
        public string Remark { get; set; }
        
    }
}
