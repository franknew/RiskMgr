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
        LogonHistoryDao historydao = new LogonHistoryDao();
        private ICache cache = CacheFactory.Create(CacheType.DefaultMemoryCache);
        private string token = null;

        [TestInitialize]
        public void Init()
        {
            string id = Guid.NewGuid().ToString().Replace("-", "");
            dao.Delete(new UserQueryForm { ID = id });
            initU = new User
            {
                ID = id,
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
            historydao.Delete(new LogonHistoryQueryForm { UserID = initU.ID });
        }


        [TestMethod]
        public void LogonTest()
        {
            LogonBLL bll = new LogonBLL();
            var result = bll.Logon(initU.Name, initU.Password);
            var history = historydao.Query(new LogonHistoryQueryForm { UserID = initU.ID });
            Assert.IsNotNull(result.token);
            Assert.IsTrue(history.Count > 0);
            Assert.IsTrue(result.Menu.Count == 4);
            try
            {
                bll.Logon(initU.Name, "wrongpassword");
            }
            catch (Exception ex)
            {
                Assert.AreEqual("用户名或者密码错误！请输入正确的用户名和密码！", ex.Message);
            }
        }

        [TestMethod]
        public void LogoutTest()
        {
            LogonBLL bll = new LogonBLL();
            var result = bll.Logon(initU.Name, initU.Password);
            bll.Logout();
            Assert.IsNull(cache.GetItem(token));
        }
    }
}
