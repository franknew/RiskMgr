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
    public partial class BankAccountDao : SimpleDao<BankAccount, BankAccountQueryForm, BankAccountUpdateForm>
    {
        public BankAccountDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public BankAccountDao()
            : base(null)
        {
        }
        
        public DateTime? QueryMaxLastUpdateTime()
        {
            return Mapper.QueryForObject<DateTime?>("QueryBankAccountLastUpdateTime", null);
        }
    }
}