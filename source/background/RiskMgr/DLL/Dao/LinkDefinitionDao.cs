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
    public partial class LinkDefinitionDao : SimpleDao<LinkDefinition, LinkDefinitionQueryForm, LinkDefinitionUpdateForm>
    {
        public LinkDefinitionDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public LinkDefinitionDao()
            : base(null)
        {
        }
        
        public DateTime QueryMaxLastUpdateTime()
        {
            return Mapper.QueryForObject<DateTime>("QueryLinkDefinitionLastUpdateTime", null);
        }
    }
}