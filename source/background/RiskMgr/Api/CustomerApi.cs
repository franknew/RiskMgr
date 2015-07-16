using SOAFramework.Service.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Api
{
    [ServiceLayer(Module="RiskMgr.CustomerApi")]
    [AuthFilter]
    public class CustomerApi
    {
        public int Add()
        {
            return -1;
        }

        public int Update()
        {
            return -1;
        }

        public bool Delete(int id)
        {
            return false;
        }
    }
}
