using RiskMgr.DAL;
using RiskMgr.Form;
using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.BLL
{
    public class AssetBLL
    {
        public string Add(Asset asset)
        {
            AssetDao dao = new AssetDao();
            return dao.Add(asset);
        }

        public bool Update(AssetUpdateForm form)
        {
            AssetDao dao = new AssetDao();
            return dao.Update(form);
        }

        public List<Asset> Query(AssetQueryForm form)
        {
            AssetDao dao = new AssetDao();
            return dao.Query(form);
        }

        public bool Delete(AssetQueryForm form)
        {
            AssetDao dao = new AssetDao();
            return dao.Delete(form);
        }
    }
}
