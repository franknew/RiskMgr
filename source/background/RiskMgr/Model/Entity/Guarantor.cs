using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    public class Guarantor : Customer
    {
        public List<Asset> Assets { get; set; }
    }
}
