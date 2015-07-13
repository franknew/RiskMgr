using RiskMgr.Form;
using RiskMgr.Model;
using IBatisNet.DataMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.DAL
{
    public class MenuDao : BaseDao<Menu, MenuQueryForm, MenuUpdateForm>
    {
        public MenuDao(ISqlMapper mapper = null)
            : base(mapper)
        {

        }
    }
}