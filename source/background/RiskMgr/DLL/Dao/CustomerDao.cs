using RiskMgr.Form;
using RiskMgr.Model;
using IBatisNet.DataMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.DAL
{
    public partial class CustomerDao : SimpleDao<Customer, CustomerQueryForm, CustomerUpdateForm>
    {
        public CustomerDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public CustomerDao()
            : base(null)
        {
        }
        
        public DateTime QueryMaxLastUpdateTime()
        {
            return Mapper.QueryForObject<DateTime>("QueryCustomerLastUpdateTime", null);
        }
    }
}