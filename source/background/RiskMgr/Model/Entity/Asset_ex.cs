using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    public partial class Asset
    {
        /// <summary>
        /// 公权人
        /// </summary>
        public List<Joint> Joint { get; set; }
    }
}
