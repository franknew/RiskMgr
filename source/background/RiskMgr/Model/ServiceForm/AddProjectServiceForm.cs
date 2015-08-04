using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Form
{
    public class AddProjectServiceForm
    {
        /// <summary>
        /// 项目信息
        /// </summary>
        public Project Project { get; set; }

        /// <summary>
        /// 买家ID
        /// </summary>
        public List<string> Buyers { get; set; }

        /// <summary>
        /// 卖家ID
        /// </summary>
        public List<string> Sellers { get; set; }

        /// <summary>
        /// 房产ID
        /// </summary>
        public List<string> Assets { get; set; }

        /// <summary>
        /// 买家第三方ID
        /// </summary>
        public List<string> Buyers_ThirdPart { get; set; }

        /// <summary>
        /// 卖家第三方ID
        /// </summary>
        public List<string> Sellers_ThirdPart { get; set; }
    }
}
