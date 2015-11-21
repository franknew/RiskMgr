using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Form
{
    public class UpdateTrackingServiceForm : Project
    {
        /// <summary>
        /// 过户信息
        /// </summary>
        public List<TrackingChangeOwner> TransferInfo { get; set; }

        /// <summary>
        /// 借贷信息
        /// </summary>
        public List<TrackingMortgage> Mortgage { get; set; }

        public string WorkflowID { get; set; }

        public string ActivityID { get; set; }

        public string TaskID { get; set; }
    }
}
