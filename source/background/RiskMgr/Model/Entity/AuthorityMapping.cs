using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Serialization;

namespace RiskMgr.Model
{
    [XmlRoot]
    public class AuthorityMapping
    {
        [XmlElement]
        public List<AuthorityMappingNode> AuthNode { get; set; }
    }
}
