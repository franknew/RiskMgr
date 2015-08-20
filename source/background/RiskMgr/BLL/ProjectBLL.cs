using IBatisNet.DataMapper;
using RiskMgr.DAL;
using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Service.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.BLL
{
    public class ProjectBLL
    {
        public string Add(Project project, List<Asset_Project> assets, List<Customer_Project> customers, List<Customer> updatecustomers,
            List<Customer_Asset> customerasset)
        {
            ISqlMapper mapper = null;
            if (ServiceSession.Current.Context.Parameters.ContainsKey("Mapper"))
            {
                mapper = ServiceSession.Current.Context.Parameters["Mapper"] as ISqlMapper;
            }
            else
            {
                mapper = Mapper.Instance();
            }
            ProjectDao projectdao = new ProjectDao(mapper);
            Asset_ProjectDao apdao = new Asset_ProjectDao(mapper);
            Customer_ProjectDao cpdao = new Customer_ProjectDao(mapper);
            CustomerDao customerdao = new CustomerDao(mapper);
            Customer_AssetDao cadao = new Customer_AssetDao(mapper);
            try
            {
                string projectid = null;
                mapper.BeginTransaction();
                projectdao.Add(project);
                if (assets != null)
                {
                    foreach (var asset in assets)
                    {
                        asset.ProjectID = project.ID;
                        apdao.Add(asset);
                    }
                }
                if (customers != null)
                {
                    foreach (var customer in customers)
                    {
                        customer.ProjectID = project.ID;
                        cpdao.Add(customer);
                    }
                }
                if (updatecustomers != null)
                {
                    foreach (var customer in updatecustomers)
                    {
                        var c = customerdao.Query(new CustomerQueryForm { ID = customer.ID }).FirstOrDefault();
                        if (c == null)
                        {
                            if (customerdao.CheckIdentityCode(new CustomerQueryForm { IdentityCode = customer.IdentityCode }))
                            {
                                customerdao.Update(new CustomerUpdateForm
                                {
                                    Entity = new Customer
                                    {
                                        Phone = customer.Phone,
                                        Gender = customer.Gender,
                                        Marrage = customer.Marrage,
                                        Address = customer.Address,
                                        OrignalName = customer.OrignalName,
                                        OrignalIdentityCode = customer.OrignalIdentityCode,
                                        BankType = customer.BankType,
                                        BankCode = customer.BankCode,
                                        WorkUnit = customer.WorkUnit,
                                    },
                                    CustomerQueryForm = new CustomerQueryForm { IdentityCode = customer.IdentityCode },
                                });
                            }
                            else
                            {
                                customerdao.Add(customer);
                            }
                        }
                        else
                        {
                            customerdao.Update(new CustomerUpdateForm
                            {
                                Entity = new Customer
                                {
                                    Phone = customer.Phone,
                                    Gender = customer.Gender,
                                    Marrage = customer.Marrage,
                                    Address = customer.Address,
                                    OrignalName = customer.OrignalName,
                                    OrignalIdentityCode = customer.OrignalIdentityCode,
                                    BankType = customer.BankType,
                                    BankCode = customer.BankCode,
                                    WorkUnit = customer.WorkUnit,
                                },
                                CustomerQueryForm = new CustomerQueryForm { ID = customer.ID },
                            });
                        }
                    }
                }
                if (customerasset != null)
                {
                    foreach (var ca in customerasset)
                    {
                        var exists = cadao.Query(new Customer_AssetQueryForm { AssetID = ca.AssetID, CustomerID = ca.CustomerID }).FirstOrDefault();
                        if (exists == null)
                        {
                            cadao.Add(ca);
                        }
                    }
                }
                mapper.CommitTransaction();
                projectid = project.ID;
                return projectid;
            }
            catch
            {
                mapper.RollBackTransaction();
                throw;
            }
        }

        public List<Project> Query(QueryProjectServiceForm form)
        {
            ISqlMapper mapper = null;
            if (ServiceSession.Current.Context.Parameters.ContainsKey("Mapper"))
            {
                mapper = ServiceSession.Current.Context.Parameters["Mapper"] as ISqlMapper;
            }
            else
            {
                mapper = Mapper.Instance();
            }
            ProjectDao dao = new ProjectDao(mapper);
            return dao.QueryProjectByRelationship(form);
        }
    }
}
