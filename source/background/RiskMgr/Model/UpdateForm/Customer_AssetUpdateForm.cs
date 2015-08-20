using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class Customer_AssetUpdateForm : BaseUpdateForm<Customer_Asset>
    {
        public Customer_AssetQueryForm Customer_AssetQueryForm { get; set; }
    }
}