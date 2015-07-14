using RiskMgr.Form;
using RiskMgr.Model;
using IBatisNet.DataMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.DAL
{
    public class LinkDao : BaseDao<Link, LinkQueryForm, LinkUpdateForm>
    {
        public LinkDao(ISqlMapper mapper = null)
            : base(mapper)
        {

        }
    }
}