using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Serialization;

namespace RiskMgr.Model
{
    public class AuthorityMappingNode : AuthorityNodeForCheck
    {
        [XmlElement]
        public List<AuthorityItem> Item { get; set; }
    }
}
