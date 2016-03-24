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
        public const string DataAuthorityKey = "_dataauthorityuseridlist";
        public const string MapperKey = "_Mapper";
        public const string AuthorityMappingFile = "AuthorityMapping.xml";
        public const string WeiXinDepartmentID = "20";

        public static ISqlMapper GetMapperFromSession()
        {
            ISqlMapper mapper = null;
            if (ServiceSession.Current != null && ServiceSession.Current.Context.Parameters.ContainsKey(MapperKey))
            {
                mapper = ServiceSession.Current.Context.Parameters[MapperKey] as ISqlMapper;
            }
            else
            {
                mapper = Mapper.Instance();
            }
            return mapper;
        }

        public static List<string> GetDataAuthorityUserIDList()
        {
            List<string> list = null;
            if (ServiceSession.Current != null && ServiceSession.Current.Context.Parameters.ContainsKey(DataAuthorityKey))
            {
                list = ServiceSession.Current.Context.Parameters[DataAuthorityKey] as List<string>;
            }
            return list;
        }
    }
}
