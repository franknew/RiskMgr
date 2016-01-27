using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Serialization;

namespace RiskMgr.Model
{
    public class AuthorityItem
    {
        [XmlAttribute]
        public string ActionID { get; set; }

        [XmlAttribute]
        public string ModuleID { get; set; }
    }
}
