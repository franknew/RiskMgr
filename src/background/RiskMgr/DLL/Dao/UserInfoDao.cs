using RiskMgr.Form;
using RiskMgr.Model;
using IBatisNet.DataMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.DAL
{
    public class UserInfoDao : BaseDao<UserInfo, UserInfoQueryForm, UserInfoUpdateForm>
    {
        public UserInfoDao(ISqlMapper mapper = null)
            : base(mapper)
        {

        }
    }
}