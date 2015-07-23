using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DreamWorkflow.Engine;
using DreamWorkflow.Engine.Form;
using SOAFramework.Service.Core;

namespace RiskMgr.Api
{
    [ServiceLayer(Module = "RiskMgr.DataDictionaryApi")]
    public class DataDictionaryApi
    {
        /// <summary>
        /// 根据组名列表查询
        /// </summary>
        /// <param name="nameList"></param>
        public List<DataDictionaryResultForm> QueryByGroupNameList(List<string> nameList)
        {
            DataDictionaryBLL bll = new DataDictionaryBLL();
            return bll.QueryByGroupName(nameList);
        }
    }
}
