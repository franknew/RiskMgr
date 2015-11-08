using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    public class FullProject : Project
    {

        /// <summary>
        /// 保后追踪，过户信息
        /// </summary>
        public List<TrackingChangeOwner> TransferInfo { get; set; }

        /// <summary>
        /// 保后追踪，贷款信息
        /// </summary>
        public List<TrackingMortgage> Mortgage { get; set; }
    }
}
