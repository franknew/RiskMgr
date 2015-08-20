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
    public partial class Customer_AssetDao : BaseDao<Customer_Asset, Customer_AssetQueryForm, Customer_AssetUpdateForm>
    {
        public Customer_AssetDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public Customer_AssetDao()
            : base(null)
        {
        }
        
    }
}