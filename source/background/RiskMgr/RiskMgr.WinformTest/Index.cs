using RiskMgr.Form;
using RiskMgr.Model;
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
            request.form = new Form.LogonServiceForm
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
    }
}
