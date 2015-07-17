using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RiskMgr.DAL;
using RiskMgr.Model;
using RiskMgr.Form;
using RiskMgr.BLL;

namespace UnitTesting
{
    /// <summary>
    /// UserTest 的摘要说明
    /// </summary>
    [TestClass]
    public class UserTest
    {
        private UserDao dao = new UserDao();
        private UserInfoDao infodao = new UserInfoDao();
        private UserBLL bll = new UserBLL();
        private string defaultID = "unittest1";
        public UserTest()
        {
            //
            //TODO:  在此处添加构造函数逻辑
            //
        }

        private TestContext testContextInstance;

        /// <summary>
        ///获取或设置测试上下文，该上下文提供
        ///有关当前测试运行及其功能的信息。
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        #region 附加测试特性
        //
        // 编写测试时，可以使用以下附加特性: 
        //
        // 在运行类中的第一个测试之前使用 ClassInitialize 运行代码
        // [ClassInitialize()]
        // public static void MyClassInitialize(TestContext testContext) { }
        //
        // 在类中的所有测试都已运行之后使用 ClassCleanup 运行代码
        // [ClassCleanup()]
        // public static void MyClassCleanup() { }
        //
        // 在运行每个测试之前，使用 TestInitialize 来运行代码
        // [TestInitialize()]
        // public void MyTestInitialize() { }
        //
        // 在每个测试运行完之后，使用 TestCleanup 来运行代码
        // [TestCleanup()]
        // public void MyTestCleanup() { }
        //
        #endregion
        [TestInitialize]
        public void Init()
        {
            dao.Delete(new UserQueryForm { ID = defaultID });
            infodao.Delete(new UserInfoQueryForm { ID = defaultID });
            bll.Add(new User
            {
                ID = defaultID,
                Enabled = 1,
                Name = defaultID,
                Password = defaultID,
            });
        }

        [TestCleanup]
        public void CleanUp()
        {
            dao.Delete(new UserQueryForm { ID = defaultID });
            infodao.Delete(new UserInfoQueryForm { ID = defaultID });
        }

        [TestMethod]
        public void TestAddUser()
        {
            string id = "unittest2";
            bll.Add(new User
            {
                ID = id,
                Enabled = 1,
                Name = id,
                Password = id,

            });
            var list = dao.Query(new UserQueryForm { ID = id });
            Assert.IsNotNull(list);
            Assert.IsTrue(list.Count > 0);
            Assert.AreEqual(id, list[0].Name);
            dao.Delete(new UserQueryForm { ID = id });
            infodao.Delete(new UserInfoQueryForm { ID = id });
        }

        [TestMethod]
        public void TestUpdateUser()
        {
            bll.Update(new UserEntireInfo
            {
                User = new User
                {
                    Enabled = 0,
                },
                UserInfo = new UserInfo
                {
                    QQ = "11111111",
                },
            });
            var users = dao.Query(new UserQueryForm { ID = defaultID });
            var userinfo = infodao.Query(new UserInfoQueryForm { ID = defaultID });
            Assert.IsNotNull(users);
            Assert.IsNotNull(userinfo);
            Assert.IsTrue(users.Count > 0);
            Assert.IsTrue(userinfo.Count > 0);
            Assert.AreEqual((ulong)0, users[0].Enabled);
            Assert.AreEqual("11111111", userinfo[0].QQ);
        }

        [TestMethod]
        public void TestUserChangePassword()
        {
            bll.ChangePassword(new ChangePasswordUpdateForm
            {
                UserID = defaultID,
                OldPassword = defaultID,
                NewPassword = "changed1",
            });
            var list = dao.Query(new UserQueryForm { ID = defaultID });
            Assert.AreEqual("changed1", list[0].Password);
        }

        
        [TestMethod]
        public void TestChangeSelfPassword()
        {
            string newPassword = "changed2";
            bll.ChangePassword(new ChangePasswordUpdateForm
            {
                UserID = defaultID,
                NewPassword = defaultID,
            });

            try
            {
                bll.ChangeSelfPassword(new ChangePasswordUpdateForm
                {
                    UserID = defaultID,
                    OldPassword = "wrong password",
                    NewPassword = newPassword,
                });
            }
            catch (Exception ex)
            {
                Assert.AreEqual("用户名或者旧密码错误！", ex.Message);
            }
            bll.ChangeSelfPassword(new ChangePasswordUpdateForm
            {
                UserID = defaultID,
                OldPassword = defaultID,
                NewPassword = newPassword,
            });
            var list = dao.Query(new UserQueryForm { ID = defaultID });
            Assert.AreEqual(newPassword, list[0].Password);
        }
    }
}
