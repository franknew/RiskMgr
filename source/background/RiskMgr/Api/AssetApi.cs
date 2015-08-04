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
            return bll.Add(form);
        }

        /// <summary>
        /// 更新房产
        /// </summary>
        /// <param name="asset"></param>
        /// <returns></returns>
        public bool Update(Asset form)
        {
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
