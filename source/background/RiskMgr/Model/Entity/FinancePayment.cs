using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    public class FinancePayment : Payment
    {
        public string Name { get; set; }

        public string Account { get; set; }

        public string BankName { get; set; }
    }
}
