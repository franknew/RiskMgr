using IBatisNet.DataMapper;
using RiskMgr.Form;
using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.DAL
{
    public class FullUserDao
    {
        private ISqlMapper mapper = null;

        public FullUserDao(ISqlMapper mapper)
        {
            this.mapper = mapper;
        }

        public FullUserDao()
        {
            mapper = Mapper.Instance();
        }

        public List<FullUser> Query(FullUserQueryForm form)
        {
            return mapper.QueryForList<FullUser>("QueryFullUser", form).ToList();
        }
    }
}
