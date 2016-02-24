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
    public partial class ReturnBackConfirmDao : BaseDao<ReturnBackConfirm, ReturnBackConfirmQueryForm, ReturnBackConfirmUpdateForm>
    {
        public ReturnBackConfirmDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public ReturnBackConfirmDao()
            : base(null)
        {
        }
        
    }
}