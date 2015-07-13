using IBatisNet.DataMapper;
using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.DAL
{

    public class BaseDao<TEngity, TQueryForm, TUpdateForm> where TEngity : BaseEntity
    {

        private ISqlMapper mapper = null;

        private string tableName = null;

        public BaseDao(ISqlMapper mapper = null)
        {
            if (mapper == null)
            {
                this.mapper = Mapper.Instance();
            }
            else
            {
                this.mapper = mapper;
            }
            tableName = typeof(TEngity).Name;
        }

        public string Add(TEngity entity)
        {
            if (string.IsNullOrEmpty(entity.ID))
            {
                entity.ID = Guid.NewGuid().ToString().Replace("-", "");
            }
            mapper.Insert("Add" + tableName, entity);
            return entity.ID;
        }

        public List<TEngity> Query(TQueryForm form)
        {
            return mapper.QueryForList<TEngity>("Query" + tableName, form).ToList();
        }

        public bool Delete(TQueryForm form)
        {
            mapper.Delete("Delete" + tableName, form);
            return true;
        }

        public bool Update(TUpdateForm entity)
        {
            mapper.Update("Update" + tableName, entity);
            return true;
        }
    }
}
