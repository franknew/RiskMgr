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
    public partial class CreditReceiverInfoDao : BaseDao<CreditReceiverInfo, CreditReceiverInfoQueryForm, CreditReceiverInfoUpdateForm>
    {
        public CreditReceiverInfoDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public CreditReceiverInfoDao()
            : base(null)
        {
        }
        
    }
}