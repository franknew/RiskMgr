using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DreamWorkflow.Engine;
using DreamWorkflow.Engine.Form;
using SOAFramework.Service.Core;
using DreamWorkflow.Engine.Model;
using DreamWorkflow.Engine.DAL;
using RiskMgr.Form;
using RiskMgr.BLL;

namespace RiskMgr.Api
{
    [ServiceLayer(Module = "RiskMgr.DataDictionaryApi")]
    [InitDBFilter]
    public class DataDictionaryApi
    {
        DataDictionaryBLL bll = new DataDictionaryBLL();
        /// <summary>
        /// 根据组名列表查询
        /// </summary>
        /// <param name="nameList"></param>
        public List<DataDictionaryResultForm> QueryByGroupNameList(QueryDataDictionaryByGroupNamesServiceForm form)
        {
            return bll.QueryByGroupName(form.NameList);
        }

        /// <summary>
        /// 查询所有数据字典
        /// </summary>
        /// <returns></returns>
        public List<DataDictionaryResultForm> QueryAll()
        {
            return bll.QueryAll();
        }

        /// <summary>
        /// 新增数组字典组
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        public string AddGroup(DataDictionaryGroup form)
        {
            if (form == null)
            {
                return null;
            }
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            form.Creator = user.User.ID;
            return bll.AddGroup(form);
        }

        /// <summary>
        /// 新增数据字典项
        /// </summary>
        /// <param name="form"></param>
        /// <returns>如果有新增的项，则会自动加上ID，以便前端绑定ID</returns>
        public List<DataDictionary> AddItems(List<DataDictionary> form)
        {
            if (form == null)
            {
                return null;
            }
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            foreach (var dic in form)
            {
                dic.Creator = user.User.ID;
            }
            return bll.AddItems(form);
        }

        /// <summary>
        /// 更新数据字典
        /// </summary>
        /// <param name="form"></param>
        /// <returns>如果有新增的项，则会自动加上ID，以便前端绑定ID</returns>
        public List<DataDictionary> Update(DataDictionaryResultForm form)
        {
            if (form == null || form.Group == null)
            {
                return null;
            }

            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            form.Group.LastUpdator = user.User.ID;
            return bll.Update(form.Group, form.Items);
        }

        /// <summary>
        /// 删除数据字典组和项的所有信息
        /// </summary>
        /// <param name="form">组ID</param>
        /// <returns></returns>
        public bool Delete(string form)
        {
            return bll.Delete(form);
        }

        /// <summary>
        /// 删除数据字典项
        /// </summary>
        /// <param name="form">项ID</param>
        /// <returns></returns>
        public bool DeleteItem(string form)
        {
            return bll.DeleteItem(form);
        }
    }
}
