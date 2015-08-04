using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class Customer_ProjectUpdateForm : BaseUpdateForm<Customer_Project>
    {
        public Customer_ProjectQueryForm Customer_ProjectQueryForm { get; set; }
    }
}