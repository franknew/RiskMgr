using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DreamWorkflow.Engine;
using DreamWorkflow.Engine.Form;
using SOAFramework.Service.Core;
using DreamWorkflow.Engine.Model;
using DreamWorkflow.Engine.DAL;

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
            var datadiclist = TableCacheHelper.GetDataFromCache<DataDictionary>(typeof(DataDictionaryDao));
            var datadicgrouplist = TableCacheHelper.GetDataFromCache<DataDictionaryGroup>(typeof(DataDictionaryGroupDao));
            List<DataDictionaryResultForm> list = new List<DataDictionaryResultForm>();
            foreach (var name in nameList)
            {
                var group = datadicgrouplist.Find(t => t.Name == name);
                if (group ==null)
                {
                    continue;
                }
                var datadic = datadiclist.FindAll(t => t.DataDictionaryGroupID == group.ID);
                DataDictionaryResultForm form = new DataDictionaryResultForm
                {
                    Group = group,
                    Items = datadic,
                };
                list.Add(form);
            }
            return list;
        }
    }
}
