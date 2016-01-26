using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Library;
using SOAFramework.Service.SDK.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using RiskMgr.Api;
using RiskMgr.BLL;
using DreamWorkflow.Engine.Model;
using DreamWorkflow.Engine;
using RiskMgr.DAL;

namespace RiskMgr.WinformTest
{
    public partial class Index : System.Windows.Forms.Form
    {
        public Index()
        {
            InitializeComponent();
        }

        private string token;
        private User user = null;

        private void button1_Click(object sender, EventArgs e)
        {
            //string dt = "{\"dt\":\"2010-01-01\"}";
            //string dt1 = "{\"2010-01-01\"}";
            //jsonTest t = JsonHelper.Deserialize<jsonTest>(dt);
            //var t1 = JsonHelper.Deserialize<DateTime?>(dt1);
            Workflow wf = new Workflow();
            RoleBLL rolebll = new RoleBLL();
            //AssetBLL assetbll = new AssetBLL();

            //var list = rolebll.GetUserSubUserIDs("13");
            //var roles = assetbll.Query(new AssetQueryForm
            //{
            //    Creators = list,
            //});
            //LogonRequest request = new LogonRequest();
            //request.form = new LogonServiceForm
            //{
            //    username = "admin",
            //    password = "123456",
            //};
            //var response = SDKFactory.Client.Execute(request);
            //token = response.form.token;
            //MessageBox.Show(response.ResponseBody);
            LogonBLL bll = new LogonBLL();
            var result = bll.Logon("admin", "123456");
            token = result.token;
        }

        private void button2_Click(object sender, EventArgs e)
        {
            GetMenuRequest req = new GetMenuRequest();
            req.token = token;
            var res = SDKFactory.Client.Execute(req);

            MessageBox.Show(res.ResponseBody);
        }

        private void button3_Click(object sender, EventArgs e)
        {
            ChangePasswordRequest request = new ChangePasswordRequest();
            request.token = token;
            request.form = new Form.ChangePasswordUpdateForm
            {
                UserID = "1",
                NewPassword = "admin",
            };
            var res = SDKFactory.Client.Execute(request);
            MessageBox.Show(res.ResponseBody);
        }

        private void button4_Click(object sender, EventArgs e)
        {
            AddUserRequest req = new AddUserRequest();
            req.token = token;
            req.form = new Form.AddUserServiceForm
            {
                ID = Guid.NewGuid().ToString().Replace("-", ""),
                Enabled = 1,
                Name = "manualtest",
                Password = "manualtest",
                CnName = "中文测试",
            };
            user = new User
            {
                ID = req.form.ID,
            };
            var res = SDKFactory.Client.Execute(req);
            MessageBox.Show(res.ResponseBody);
        }

        private void button5_Click(object sender, EventArgs e)
        {
            QueryDataDictionaryRequest request = new QueryDataDictionaryRequest();
            request.form = new QueryDataDictionaryByGroupNamesServiceForm
            {
                NameList = new List<string>
                {
                "性别", "证件类型"
                }
            };
            var response = SDKFactory.Client.Execute(request);
            MessageBox.Show(response.ResponseBody);
        }

        private void button6_Click(object sender, EventArgs e)
        {
            Workflow wf = new Workflow();
            UserBLL bll = new UserBLL();
            var users = bll.Query(new FullUserQueryForm { });
        }

        private void button7_Click(object sender, EventArgs e)
        {
            UpdateUserRequest request = new UpdateUserRequest();
            request.token = token;
            request.form = new Form.UpdateUserServiceForm
            {
                ID = user.ID,
                CnName = "测试",
                Remark = "hello world",
            };
            var response = SDKFactory.Client.Execute(request);
            MessageBox.Show(response.ResponseBody);
        }

        private void button8_Click(object sender, EventArgs e)
        {
            DeleteUserRequest request = new DeleteUserRequest();
            request.token = token;
            request.userid = user.ID;
            var response = SDKFactory.Client.Execute(request);
            MessageBox.Show(response.ResponseBody);
        }

        private void button10_Click(object sender, EventArgs e)
        {
            Workflow wf = new Workflow();
            string userid = "9";
            //ProjectBLL bll = new ProjectBLL();
            //bll.Add(new Project
            //{
            //    Creator = "9",
            //    Name = "test",
            //}, new List<Asset>(), new List<Customer_Project>(), new List<Customer>(), new List<Guarantor>(), "9"

            //);
            //处理流程
            ProjectBLL bll = new ProjectBLL();
            bll.Add(new Project
            {
                ID = "111",
            }, new List<Asset>
            {
                new Asset
                {
                    Code = "test",
                    Address = "test",
                    Joint = new List<Customer> { }
                }
            }, new List<Customer>
            {
                new Customer
                {
                    Name = "test3",

                }
            }, new List<Customer>
            {
                new Customer
                {
                    Name = "test4",
                }
            }, null, null, "1");

            //WorkflowDefinitionModel wfdm = WorkflowDefinitionModel.LoadByName("额度申请");
            //var workflow = wfdm.StartNew(userid, "", new WorkflowAuthority());
            ////如果流程当前处理人等于申请人，就直接审批通过，进入下一个流程
            //var task = workflow.CurrentActivity.Tasks.Find(t => t.UserID == userid);
            //if (task != null)
            //{
            //    workflow.ProcessActivity(new Approval
            //    {
            //        Creator = userid,
            //        LastUpdator = userid,
            //        Remark = "test",
            //        Status = (int)ApprovalStatus.Agree,
            //        ActivityID = workflow.CurrentActivity.Value.ID,
            //        WorkflowID = workflow.Value.ID,
            //    }, userid, new WorkflowAuthority());
            //}
        }

        private void button11_Click(object sender, EventArgs e)
        {
            string jsonstring = "hello world";
            string result = HttpHelper.Post("http://localhost/Service.Host/JsonHost.svc/Execute/RiskMgr.Api.ProjectApi/Add", Encoding.UTF8.GetBytes(jsonstring));
            MessageBox.Show(result);
        }

        private void button12_Click(object sender, EventArgs e)
        {
            //QueryMyApplyRequest request = new QueryMyApplyRequest();
            //request.token = token;
            //var response = SDKFactory.Client.Execute(request);
            //MessageBox.Show(response.ResponseBody);
            Workflow workflow = new Workflow();
            RoleBLL rolebll = new RoleBLL();
            ProjectBLL projectbll = new ProjectBLL();
            var list = rolebll.GetUserSubUserIDs("14");
            var data = projectbll.QueryMyApply(new QueryMyApplyServiceForm { CurrentIndex = 2, PageSize = 10, Creators = list });
        }

        private void button13_Click(object sender, EventArgs e)
        {
            TaskBLL bll = new TaskBLL();
            string userid = "10";
            var response = bll.Query(new QueryMyTaskServiceForm { UserID = userid, Status = (int)TaskProcessStatus.Started });
        }

        private void button14_Click(object sender, EventArgs e)
        {
            WorkflowBLL bll = new WorkflowBLL();
            bll.Approval("62d03c59b62148248a49806c158e8f9b", "7", new Approval
            {
                Status = 1,
                Remark = "test",
            });
        }

        private void button15_Click(object sender, EventArgs e)
        {
            ProjectBLL bll = new ProjectBLL();
            var a = bll.QueryDetail(textBox1.Text, "", "14");
        }

        private void button16_Click(object sender, EventArgs e)
        {
            Workflow workflow = new Workflow();
            RoleBLL rolebll = new RoleBLL();
            CustomerBLL customerbll = new CustomerBLL();
            List<string> ids = rolebll.GetUserSubUserIDs("13");
            CustomerQueryForm form = new CustomerQueryForm();
            form.Creators = ids;
            var list = customerbll.Query(form);
            PagingEntity<Customer> paggingList = new PagingEntity<Customer>();
            paggingList.Record = list;
            paggingList.PageCount = form.PageCount;
            paggingList.RecordCount = form.RecordCount;
        }

        private void button17_Click(object sender, EventArgs e)
        {
            Workflow workflow = new Workflow();
            ProjectBLL bll = new ProjectBLL();
            bll.UpdateTracking(new UpdateTrackingServiceForm
            {
                LastUpdator = "7",
                ChangeOwnerRemark = "",
                MortgageRemark = "",
                NewAssetDate = new DateTime(2016, 1, 4),
                LogoutAssetTime = new DateTime(2016, 1, 4),
                ChangeOwnerProfileTime = new DateTime(2016, 1, 5),
                ChangeOwnerProfileCode = "9C-416001002",
                ID = textBox1.Text,
            }, "30590d6bcda743f9a4490e73b9d92fb3", "7");
        }

        private void button18_Click(object sender, EventArgs e)
        {
            Workflow workflow = new Workflow();
            ProjectBLL bll = new ProjectBLL();
            bll.UpdateFinance("a074c5e65c96481db5af54dfd4f75f86", new Project
                {
                    RefundAccount = "1",
                    RefundBankName = "11",
                    RefundDate = DateTime.Now,
                    RefundMoney = 1,
                    RefundName = "111",
                    PaymentName = "2",
                    PaymentAccount = "22",
                    PaymentBankName = "222",
                    PaymentDate = DateTime.Now,
                    PaymentMoney = 2,
                    DeductMoneyAccount = "3",
                    DeductMoneyBankName = "33",
                    DeductMoneyDate = DateTime.Now,
                    DeductMoneyMoney = 3,
                    DeductMoneyName = "333",
                    ID = textBox1.Text,
                }, "14");
        }

        private void button19_Click(object sender, EventArgs e)
        {
            WorkflowAuthority wf = new WorkflowAuthority();

            var au = new ActivityAuth
            {
                Type = "role",
                Value = "7,14",
            };
            var list = wf.GetUserIDList(new List<ActivityAuth>
            {
                au
            });

            LeaderInRoleWorkflowAuthorityHandler handler = new LeaderInRoleWorkflowAuthorityHandler();
            list = handler.Handle(au);
        }

        private void button20_Click(object sender, EventArgs e)
        {
            Workflow workflow = new Workflow();
            ProjectBLL bll = new ProjectBLL();
            bll.FinanceConfirm("3ed1b947f1d9401fa1b799a802d9d00a", "14", null, null, null, null, null, null, null);
        }

        private void button21_Click(object sender, EventArgs e)
        {
            Workflow wf = new Workflow();
            //RoleBLL bll = new RoleBLL();
            //bll.AddRole(new AddRoleServiceForm
            //{
            //    Name = "testrole",
            //    ParentID = "2",
            //    CanManageEmployeeAndAuth = true,
            //    CanApply = true,
            //    CanManageAsset = true,
            //});
            //var roles = bll.Query(new RoleQueryForm { Name = "testrole" });
            RoleBLL rolebll = new RoleBLL();
            var roles = rolebll.Query(new RoleQueryForm { Name = "admin" }).ToList<Role>();
            Role_Module_ActionDao dao = new Role_Module_ActionDao();
            string actionID = "2";
            string moduleID = "1";
            Role_Module_ActionQueryForm query = new Role_Module_ActionQueryForm
            {
                ActionID = actionID,
                ModuleID = moduleID
            };
            var role_module_action = dao.Query(query);
            bool hasRight = false;
            foreach (var item in role_module_action)
            {
                if (roles != null && roles.Exists(t => t.ID == item.RoleID))
                {
                    hasRight = true;
                    break;
                }
            }
        }

        private void button22_Click(object sender, EventArgs e)
        {
            Workflow wf = new Workflow();
            RoleBLL bll = new RoleBLL();
            bll.UpdateRole(new AddRoleServiceForm
            {
                ID = "be7c181f2e194a57bc66abcf1cd1e374",
                CanApply = true,
                CanApproval = false,
                CanManageAsset = false,
                CanManageCustomer = false,
                CanManageEmployeeAndAuth = false,
            });
            var roles = bll.Query(new RoleQueryForm { ID = "be7c181f2e194a57bc66abcf1cd1e374" });
        }

        private void button23_Click(object sender, EventArgs e)
        {
            WorkflowModel model = WorkflowModel.Load("1c74c3e0ce2d4c5f983fab3dc6063223");
            var task = model.GetUserProcessingTask("7");

        }
    }

    public class jsonTest
    {
        public DateTime? dt { get; set; }
    }
}
