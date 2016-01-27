using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Serialization;

namespace RiskMgr.Model
{
    public class AuthorityNodeForCheck
    {
        /// <summary>
        /// 唯一标识
        /// </summary>
        [XmlAttribute]
        public string ID { get; set; }

        /// <summary>
        /// 显示用的名称
        /// </summary>
        [XmlAttribute]
        public string Name { get; set; }

        /// <summary>
        /// 是否选中，true为有权限，false为无权限
        /// </summary>
        [XmlIgnore]
        public bool Checked { get; set; }
    }
}
