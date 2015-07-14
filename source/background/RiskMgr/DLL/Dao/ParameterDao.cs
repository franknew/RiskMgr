using RiskMgr.Form;
using RiskMgr.Model;
using IBatisNet.DataMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.DAL
{
    public class ParameterDao : BaseDao<Parameter, ParameterQueryForm, ParameterUpdateForm>
    {
        public ParameterDao(ISqlMapper mapper = null)
            : base(mapper)
        {

        }
    }
}