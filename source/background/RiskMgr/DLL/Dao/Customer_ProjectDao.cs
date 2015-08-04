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
    public partial class Customer_ProjectDao : BaseDao<Customer_Project, Customer_ProjectQueryForm, Customer_ProjectUpdateForm>
    {
        public Customer_ProjectDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public Customer_ProjectDao()
            : base(null)
        {
        }
        
    }
}