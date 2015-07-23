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
        public string Add(Asset asset)
        {
            return bll.Add(asset);
        }

        /// <summary>
        /// 更新房产
        /// </summary>
        /// <param name="asset"></param>
        /// <returns></returns>
        public bool Update(Asset asset)
        {
            AssetUpdateForm form = new AssetUpdateForm
            {
                Entity = asset,
                AssetQueryForm = new AssetQueryForm { ID = asset.ID },
            };
            return bll.Update(form);
        }

        /// <summary>
        /// 删除房产
        /// </summary>
        /// <param name="assetid"></param>
        /// <returns></returns>
        public bool Delete(string assetid)
        {
            AssetQueryForm form = new AssetQueryForm
            {
                ID = assetid,
            };
            return bll.Delete(form);
        }

        public PagingEntity<Asset> Query(AssetQueryForm form)
        {
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
