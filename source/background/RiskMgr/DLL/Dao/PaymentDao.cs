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
    public partial class PaymentDao : BaseDao<Payment, PaymentQueryForm, PaymentUpdateForm>
    {
        public PaymentDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public PaymentDao()
            : base(null)
        {
        }
        
    }
}