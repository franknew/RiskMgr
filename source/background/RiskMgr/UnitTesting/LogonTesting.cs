using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RiskMgr.Model;
using RiskMgr.DAL;
using RiskMgr.Form;
using RiskMgr.BLL;
using SOAFramework.Library.Cache;

namespace UnitTesting
{
    [TestClass]
    public class LogonTesting
    {
        private User initU = null;
        UserDao dao = new UserDao();
        private ICache cache = CacheFactory.Create(CacheType.DefaultMemoryCache);
        private string token = null;

        [TestInitialize]
        public void Init()
        {
            initU = new User
            {
                ID = Guid.NewGuid().ToString().Replace("-",""),
                Name = "unittestuser",
                Password = "unittestuser",
                CreateTime = DateTime.Now,
                Enabled = 1,
                
            };
            dao.Add(initU);
        }

        [TestCleanup]
        public void CleanUp()
        {
            dao.Delete(new UserQueryForm { ID = initU.ID });
        }


        [TestMethod]
        public void LogonTest()
        {
            LogonBLL bll = new LogonBLL();
            token = bll.Logon(initU.Name, initU.Password);
            Assert.IsNotNull(token);
        }

        [TestMethod]
        public void LogoutTest()
        {
            LogonBLL bll = new LogonBLL();
            token = bll.Logon(initU.Name, initU.Password);
            bll.Logout(token);
            Assert.IsNull(cache.GetItem(token));
        }
    }
}
