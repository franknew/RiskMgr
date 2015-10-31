using RiskMgr.BLL;
using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Service.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Api
{
    [ServiceLayer(Module = "RiskMgr.AssetApi")]
    [AuthFilter]
    public class AssetApi
    {
        private AssetBLL bll = new AssetBLL();

        /// <summary>
        /// 新增房产
        /// </summary>
        /// <param name="asset"></param>
        /// <returns></returns>
        public string Add(Asset form)
        {
            UserBLL userbll = new UserBLL();
            string userid = userbll.GetCurrentUser().User.ID;
            form.Creator = form.LastUpdator = userid;
            return bll.Add(form);
        }

        /// <summary>
        /// 更新房产
        /// </summary>
        /// <param name="asset"></param>
        /// <returns></returns>
        public bool Update(Asset form)
        {
            UserBLL userbll = new UserBLL();
            string userid = userbll.GetCurrentUser().User.ID;
            form.LastUpdator = userid;
            AssetUpdateForm updateform = new AssetUpdateForm
            {
                Entity = form,
                AssetQueryForm = new AssetQueryForm { ID = form.ID },
            };
            return bll.Update(updateform);
        }

        /// <summary>
        /// 删除房产
        /// </summary>
        /// <param name="assetid"></param>
        /// <returns></returns>
        public bool Delete(Asset form)
        {
            AssetQueryForm deleteform = new AssetQueryForm
            {
                ID = form.ID,
            };
            return bll.Delete(deleteform);
        }

        [QueryAction]
        [DataAuthorityFilter]
        public PagingEntity<Asset> Query(AssetQueryForm form)
        {
            List<string> useridList = Common.GetDataAuthorityUserIDList();
            form.Creators = useridList;
            var list = bll.Query(form);
            PagingEntity<Asset> assets = new PagingEntity<Asset>
            {
                Record = list,
                PageCount = form.PageCount,
                RecordCount = form.RecordCount,
            };
            return assets;
        }
    }
}
