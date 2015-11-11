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
        public string Add(Asset form)
        {
            AssetDao dao = new AssetDao();
            return dao.Add(form);
        }

        public bool Update(AssetUpdateForm form)
        {
            AssetDao dao = new AssetDao();
            return dao.Update(form);
        }

        public List<Asset> Query(AssetQueryForm form)
        {
            AssetDao dao = new AssetDao();
            form.IsDeleted = 0;
            return dao.Query(form);
        }

        public bool Delete(AssetQueryForm form)
        {
            AssetDao dao = new AssetDao();
            return dao.Delete(form);
        }

        public Asset Save(Asset asset)
        {
            AssetDao dao = new AssetDao();
            Asset a = dao.Query(new AssetQueryForm
            {
                Code = asset.Code,
            }).FirstOrDefault();
            if (a != null)
            {
                dao.Update(new AssetUpdateForm
                {
                    Entity = new Asset
                    {
                        Usage = asset.Usage,
                        Address = asset.Address,
                        Area = asset.Area,
                        RegPrice = asset.RegPrice,
                        LastUpdator = asset.LastUpdator,
                    },
                    AssetQueryForm = new AssetQueryForm { ID = a.ID, Enabled = 1 },
                });
            }
            else
            {
                asset.Enabled = 1;
                asset.IsDeleted = 0;
                dao.Add(asset);
                a = asset;
            }
            return a;
        }
    }
}
