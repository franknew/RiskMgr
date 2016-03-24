using IBatisNet.DataMapper;
using SOAFramework.Library;
using SOAFramework.Service.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using RiskMgr.BLL;

namespace RiskMgr.Api
{
    [Filter(GlobalUse = true, Index = 0)]
    public class InitDBFilter : BaseFilter
    {
        public override bool OnActionExecuting(ActionContext context)
        {
            try
            {
                ISqlMapper mapper = Mapper.Instance();
                if (!mapper.IsSessionStarted) mapper.BeginTransaction();
                context.Parameters[Common.MapperKey] = mapper;
                return base.OnActionExecuting(context);
            }
            catch (Exception ex)
            {
                MonitorCache.GetInstance().PushMessage(new CacheMessage { Message = "在OnActionExecuting中报错--Message:" + ex.Message }, SOAFramework.Library.CacheEnum.FormMonitor);
                throw ex;
            }
        }

        public override bool OnActionExecuted(ActionContext context)
        {
            try
            {
                if (!context.Parameters.ContainsKey(Common.MapperKey))
                {
                    return base.OnActionExecuted(context);
                }
                ISqlMapper mapper = context.Parameters[Common.MapperKey] as ISqlMapper;
                try
                {
                    if (mapper.IsSessionStarted) mapper.CommitTransaction();
                }
                catch (NullReferenceException ex)
                {
                }
                return base.OnActionExecuted(context);
            }
            catch (Exception ex)
            {
                MonitorCache.GetInstance().PushMessage(new CacheMessage { Message = "在OnExceptionOccurs中报错--Message:" + ex.Message }, SOAFramework.Library.CacheEnum.FormMonitor);
                throw ex;
            }
        }

        public override void OnExceptionOccurs(ActionContext context)
        {
            try
            {
                if (!context.Parameters.ContainsKey(Common.MapperKey))
                {
                    base.OnExceptionOccurs(context);
                    return;
                }
                ISqlMapper mapper = context.Parameters[Common.MapperKey] as ISqlMapper;
                try
                {
                    if (mapper.IsSessionStarted) mapper.RollBackTransaction();
                }
                catch (NullReferenceException ex)
                {
                }
                base.OnExceptionOccurs(context);
            }
            catch (Exception ex)
            {
                MonitorCache.GetInstance().PushMessage(new CacheMessage { Message = "在OnExceptionOccurs中报错--Message:" + ex.Message }, SOAFramework.Library.CacheEnum.FormMonitor);
            }
        }
    }
}
