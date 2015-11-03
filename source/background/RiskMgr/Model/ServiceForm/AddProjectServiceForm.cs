using DreamWorkflow.Engine.Model;
using RiskMgr.Model;
using SOAFramework.Library.DAL;
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
        public List<Customer> Buyers { get; set; }

        /// <summary>
        /// 卖家ID
        /// </summary>
        public List<Customer> Sellers { get; set; }

        /// <summary>
        /// 房产ID
        /// </summary>
        public List<Asset> Assets { get; set; }

        /// <summary>
        /// 公权人
        /// </summary>
        public List<Guarantor> Guarantor { get; set; }

        /// <summary>
        /// 调查报告
        /// </summary>
        public string Report { get; set; }
    }
}
