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
    public partial class LinkDao : SimpleDao<Link, LinkQueryForm, LinkUpdateForm>
    {
        public LinkDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public LinkDao()
            : base(null)
        {
        }
        
        public DateTime QueryMaxLastUpdateTime()
        {
            return Mapper.QueryForObject<DateTime>("QueryLinkLastUpdateTime", null);
        }
    }
}