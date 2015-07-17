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
    public partial class ParameterDao : BaseDao<Parameter, ParameterQueryForm, ParameterUpdateForm>
    {
        public ParameterDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public ParameterDao()
            : base(null)
        {
        }
        
    }
}