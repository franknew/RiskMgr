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
            LogonRequest request = new LogonRequest();
            request.form = new LogonServiceForm
            {
                UserName = "admin",
                Password = "admin",
            };
            var response = SDKFactory.Client.Execute(request);
            token = response.form.token;
            MessageBox.Show(response.ResponseBody);
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
            QueryUserRequest request = new QueryUserRequest();
            request.token = token;
            request.form = new Form.FullUserQueryForm
            {
                ID = "1",
            };
            var response = SDKFactory.Client.Execute(request);
            MessageBox.Show(response.ResponseBody);
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
            AddProjectRequest request = new AddProjectRequest();
            request.form = new AddProjectServiceForm
            {
                Project = new Project
                {
                    AgentName = "agent",
                    AgentContact = "agentcontact",
                    AssetRansomer = "frank",
                    Creator = "frank",
                    DealMoney = 10,
                    EarnestMoney = 20,
                    GuaranteeMoney = 30,
                    GuaranteeMonth = 1,
                    Name = "test",
                    Source = 1,
                    Stagnationer = "frank",
                    SupervisionMoney = 40,
                    SupervisionBank = "bank",
                    TrusteeshipAccount = "aaaa",
                    SupplyCardCopy = 1,
                    LoanMoney = 50,

                },
                Buyers = new List<Customer>
                {
                    new Customer
                    {
                        Gender = 1,
                        Name = "addprojecttest",
                        OrignalIdentityCode = "111",
                        OrignalName = "old name",
                        BankCode = "22222",
                        BankType = 1,
                        CardType = 1,
                        Enabled = 1,
                        IdentityCode = "123123",
                    },
                    new Customer
                    {
                        ID = "420ef3acca3243af846137e30961e5ce",
                        BankCode = "hello world",
                    },
                },
            };
            request.token = token;
            var response = SDKFactory.Client.Execute(request);
            MessageBox.Show(response.ResponseBody);
        }

        private void button11_Click(object sender, EventArgs e)
        {
            string jsonstring = "hello world";
            string result = HttpHelper.Post("http://localhost/Service.Host/JsonHost.svc/Execute/RiskMgr.Api.ProjectApi/Add", Encoding.UTF8.GetBytes(jsonstring));
            MessageBox.Show(result);
        }

        private void button12_Click(object sender, EventArgs e)
        {
            QueryMyApplyRequest request = new QueryMyApplyRequest();
            request.token = token;
            var response = SDKFactory.Client.Execute(request);
            MessageBox.Show(response.ResponseBody);
        }

        private void button13_Click(object sender, EventArgs e)
        {
            QueryMyProcessingRequest request = new QueryMyProcessingRequest();
            request.token = token;
            var response = SDKFactory.Client.Execute(request);
            MessageBox.Show(response.ResponseBody);
        }

        private void button14_Click(object sender, EventArgs e)
        {
            ApprovalRequest request = new ApprovalRequest();
            request.form = new ApprovalServiceForm
            {
                ActivityID = "cf90846148874e59a9caaf13cbf136be",
                TaskID = "",
            };
        }
    }
}
