using IBatisNet.DataMapper;
using SOAFramework.Service.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.BLL
{
    public class Common
    {
        public static ISqlMapper GetMapperFromSession()
        {
            ISqlMapper mapper = null;
            if (ServiceSession.Current != null && ServiceSession.Current.Context.Parameters.ContainsKey("_Mapper"))
            {
                mapper = ServiceSession.Current.Context.Parameters["_Mapper"] as ISqlMapper;
            }
            else
            {
                mapper = Mapper.Instance();
            }
            return mapper;
        }
    }
}
